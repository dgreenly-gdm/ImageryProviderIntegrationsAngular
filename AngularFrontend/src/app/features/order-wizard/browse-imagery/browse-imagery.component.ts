import { Component, inject, OnInit, viewChild, effect } from '@angular/core';
import { Router } from '@angular/router';
import { OrderStoreService } from '../../../core/services/order-store.service';
import { CatalogApiService } from '../../../core/services/catalog-api.service';
import { StacItem, AreaOfInterest } from '../../../core/models/stac.model';
import { SearchControlsComponent, SearchFormValues } from './components/search-controls/search-controls.component';
import { ImageryMapComponent } from './components/imagery-map/imagery-map.component';
import { SceneGridComponent } from './components/scene-grid/scene-grid.component';
import { OrderSummaryComponent } from '../../../shared/components/order-summary/order-summary.component';

@Component({
  selector: 'app-browse-imagery',
  standalone: true,
  imports: [SearchControlsComponent, ImageryMapComponent, SceneGridComponent, OrderSummaryComponent],
  template: `
    <div class="flex gap-6">
      <div class="flex-1 space-y-4">
        <h1 class="text-2xl font-bold text-foreground">Browse Imagery</h1>
        <p class="text-sm text-muted-foreground">Draw an area of interest on the map, then search the STAC catalog.</p>

        <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div class="lg:col-span-1">
            <app-search-controls
              [availableCollections]="collections"
              [accentColor]="store.family()?.color ?? '#3B82F6'"
              (search)="onSearch($event)" />
          </div>
          <div class="lg:col-span-2">
            <app-imagery-map #imageryMap
              [accentColor]="store.family()?.color ?? '#3B82F6'"
              [stacResults]="store.stacResults()"
              [selectedSceneIds]="selectedSceneIds()"
              (aoiChanged)="onAoiChanged($event)"
              (sceneClicked)="onSceneClicked($event)" />
          </div>
        </div>

        <app-scene-grid
          [scenes]="store.stacResults()"
          [totalMatched]="store.stacTotalMatched()"
          [selectedIds]="selectedSceneIds()"
          [accentColor]="store.family()?.color ?? '#3B82F6'"
          (sceneToggled)="onSceneClicked($event)"
          (loadMore)="onLoadMore()" />

        <div class="flex gap-3">
          <button class="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
                  (click)="goBack()">Back</button>
          <button class="rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                  [style.background-color]="store.family()?.color ?? '#3B82F6'"
                  [disabled]="store.selectedScenes().length === 0"
                  (click)="goNext()">
            Continue ({{ store.selectedScenes().length }} selected)
          </button>
        </div>
      </div>

      <div class="hidden w-72 shrink-0 lg:block">
        <app-order-summary />
      </div>
    </div>
  `,
})
export class BrowseImageryComponent implements OnInit {
  store = inject(OrderStoreService);
  private catalogApi = inject(CatalogApiService);
  private router = inject(Router);
  private mapRef = viewChild<ImageryMapComponent>('imageryMap');

  collections: string[] = [];

  constructor() {
    // Update map footprints when results or selection changes
    effect(() => {
      const results = this.store.stacResults();
      const ids = this.selectedSceneIds();
      const map = this.mapRef();
      if (map) {
        map.updateFootprints(results, ids);
      }
    });
  }

  selectedSceneIds = (): string[] => {
    return this.store.selectedScenes().map(s => s.id);
  };

  ngOnInit(): void {
    this.catalogApi.getCollections().subscribe({
      next: (cols) => this.collections = cols,
      error: (err) => console.error('Failed to load collections:', err),
    });
  }

  onAoiChanged(aoi: AreaOfInterest): void {
    this.store.setAreaOfInterest(aoi);
    this.store.setStacSearchParams({ bbox: aoi.bbox });
  }

  onSearch(form: SearchFormValues): void {
    const aoi = this.store.areaOfInterest();
    const bbox = aoi?.bbox ?? null;
    const datetime = form.startDate && form.endDate
      ? `${form.startDate}T00:00:00Z/${form.endDate}T23:59:59Z`
      : undefined;

    this.catalogApi.searchCatalog({
      bbox: bbox ?? undefined,
      datetime,
      collections: form.collections.length > 0 ? form.collections : undefined,
      limit: 20,
    }).subscribe({
      next: (response) => {
        this.store.setStacResults(response.features, response.numberMatched);
      },
      error: (err) => console.error('Search failed:', err),
    });
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
      collections: params.collections.length > 0 ? params.collections : undefined,
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
