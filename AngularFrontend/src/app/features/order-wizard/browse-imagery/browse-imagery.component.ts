import { Component, inject, signal, viewChild, effect } from '@angular/core';
import { Router } from '@angular/router';
import { OrderStoreService } from '../../../core/services/order-store.service';
import { CatalogApiService } from '../../../core/services/catalog-api.service';
import { StacItem, AreaOfInterest } from '../../../core/models/stac.model';
import { SearchControlsComponent, SearchFormValues } from './components/search-controls/search-controls.component';
import { ImageryMapComponent } from './components/imagery-map/imagery-map.component';
import { SceneGridComponent } from './components/scene-grid/scene-grid.component';

@Component({
  selector: 'app-browse-imagery',
  standalone: true,
  imports: [SearchControlsComponent, ImageryMapComponent, SceneGridComponent],
  template: `
    <div class="space-y-4">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Browse Imagery</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Draw an area on the map, then search for available satellite imagery.
        </p>
      </div>

      <!-- Map — full width, prominent -->
      <app-imagery-map #imageryMap
        [accentColor]="accentColor()"
        [stacResults]="store.stacResults()"
        [selectedSceneIds]="selectedSceneIds()"
        [hasAoi]="hasAoi()"
        (aoiChanged)="onAoiChanged($event)"
        (sceneClicked)="onSceneClicked($event)" />

      <!-- Search controls — compact horizontal bar -->
      <app-search-controls
        [hasAoi]="hasAoi()"
        [isLoading]="isSearching()"
        [accentColor]="accentColor()"
        [orderMode]="store.orderMode()"
        (search)="onSearch($event)" />

      <!-- Results area -->
      <app-scene-grid
        [scenes]="store.stacResults()"
        [totalMatched]="store.stacTotalMatched()"
        [selectedIds]="selectedSceneIds()"
        [accentColor]="accentColor()"
        [isLoading]="isSearching()"
        [hasSearched]="hasSearched()"
        [searchError]="searchError()"
        (sceneToggled)="onSceneClicked($event)"
        (loadMore)="onLoadMore()"
        (retry)="onRetry()" />

      <!-- Navigation -->
      <div class="flex items-center justify-between border-t border-border pt-4">
        <button class="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
                (click)="goBack()">Back</button>
        <button class="rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                [style.background-color]="accentColor()"
                [disabled]="store.selectedScenes().length === 0"
                (click)="goNext()">
          Continue ({{ store.selectedScenes().length }} selected)
        </button>
      </div>
    </div>
  `,
})
export class BrowseImageryComponent {
  store = inject(OrderStoreService);
  private catalogApi = inject(CatalogApiService);
  private router = inject(Router);
  private mapRef = viewChild<ImageryMapComponent>('imageryMap');

  /** Only search imagery collections that have thumbnails */
  private readonly IMAGERY_COLLECTIONS = [
    'sentinel-2-l2a',
    'sentinel-2-l1c',
    'sentinel-1-grd',
    'landsat-c2-l1-oli-tirs',
  ];

  isSearching = signal(false);
  hasSearched = signal(false);
  searchError = signal<string | null>(null);
  private lastSearchForm: SearchFormValues | null = null;

  accentColor = (): string => this.store.family()?.color ?? '#3B82F6';
  hasAoi = (): boolean => this.store.areaOfInterest() !== null;
  selectedSceneIds = (): string[] => this.store.selectedScenes().map(s => s.id);

  constructor() {
    effect(() => {
      const results = this.store.stacResults();
      const ids = this.selectedSceneIds();
      const map = this.mapRef();
      if (map) {
        map.updateFootprints(results, ids);
      }
    });
  }

  onAoiChanged(aoi: AreaOfInterest): void {
    this.store.setAreaOfInterest(aoi);
    this.store.setStacSearchParams({ bbox: aoi.bbox });
  }

  onSearch(form: SearchFormValues): void {
    this.lastSearchForm = form;
    const aoi = this.store.areaOfInterest();
    const bbox = aoi?.bbox ?? null;
    const datetime = form.startDate && form.endDate
      ? `${form.startDate}T00:00:00Z/${form.endDate}T23:59:59Z`
      : undefined;

    this.isSearching.set(true);
    this.searchError.set(null);

    this.catalogApi.searchCatalog({
      bbox: bbox ?? undefined,
      datetime,
      collections: this.IMAGERY_COLLECTIONS,
      limit: 20,
    }).subscribe({
      next: (response) => {
        this.store.setStacResults(response.features, response.numberMatched);
        this.isSearching.set(false);
        this.hasSearched.set(true);
      },
      error: (err) => {
        console.error('Search failed:', err);
        this.isSearching.set(false);
        this.hasSearched.set(true);
        this.searchError.set('Search failed. Make sure the backend is running.');
      },
    });
  }

  onRetry(): void {
    if (this.lastSearchForm) {
      this.onSearch(this.lastSearchForm);
    }
  }

  onSceneClicked(scene: StacItem): void {
    const existing = this.store.selectedScenes().find(s => s.id === scene.id);
    if (existing) {
      this.store.removeSelectedScene(scene.id);
    } else {
      this.store.addSelectedScene(scene);
    }
  }

  onLoadMore(): void {
    const currentResults = this.store.stacResults();
    const aoi = this.store.areaOfInterest();
    const params = this.store.stacSearchParams();

    const datetime = params.startDate && params.endDate
      ? `${params.startDate}T00:00:00Z/${params.endDate}T23:59:59Z`
      : undefined;

    this.catalogApi.searchCatalog({
      bbox: aoi?.bbox ?? undefined,
      datetime,
      collections: this.IMAGERY_COLLECTIONS,
      limit: 20,
      offset: currentResults.length,
    }).subscribe({
      next: (response) => {
        this.store.setStacResults(
          [...currentResults, ...response.features],
          response.numberMatched
        );
      },
      error: (err) => console.error('Load more failed:', err),
    });
  }

  goBack(): void {
    const family = this.store.family();
    if (family) this.router.navigate(['/order', family.id, 'products']);
  }

  goNext(): void {
    const family = this.store.family();
    if (family) this.router.navigate(['/order', family.id, 'configure']);
  }
}
