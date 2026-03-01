import { Component, input, output, signal } from '@angular/core';
import { StacItem } from '../../../../../core/models/stac.model';
import { SceneCardComponent } from '../scene-card/scene-card.component';

@Component({
  selector: 'app-scene-grid',
  standalone: true,
  imports: [SceneCardComponent],
  template: `
    <!-- Loading skeleton -->
    @if (isLoading()) {
      <div class="mt-4">
        <div class="mb-3 flex items-center gap-2">
          <div class="h-4 w-24 animate-pulse rounded bg-secondary"></div>
        </div>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          @for (i of skeletonItems; track i) {
            <div class="overflow-hidden rounded-lg border border-border bg-card">
              <div class="aspect-square animate-pulse bg-secondary"></div>
              <div class="space-y-2 p-2.5">
                <div class="h-3 w-2/3 animate-pulse rounded bg-secondary"></div>
                <div class="h-3 w-1/2 animate-pulse rounded bg-secondary"></div>
              </div>
            </div>
          }
        </div>
      </div>
    }

    <!-- Error state -->
    @else if (searchError()) {
      <div class="mt-6 flex flex-col items-center justify-center rounded-lg border border-border bg-card p-8 text-center">
        <svg class="mb-3 h-10 w-10 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <p class="text-sm text-foreground">{{ searchError() }}</p>
        <button class="mt-3 rounded-lg border border-border bg-secondary px-4 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/80"
                (click)="retry.emit()">
          Retry Search
        </button>
      </div>
    }

    <!-- Empty state (searched but no results) -->
    @else if (hasSearched() && scenes().length === 0) {
      <div class="mt-6 flex flex-col items-center justify-center rounded-lg border border-border bg-card p-8 text-center">
        <svg class="mb-3 h-10 w-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
        </svg>
        <p class="text-sm text-foreground">No imagery found</p>
        <p class="mt-1 text-xs text-muted-foreground">Try expanding your date range or drawing a larger area.</p>
      </div>
    }

    <!-- Results -->
    @else if (scenes().length > 0) {
      <div class="mt-4">
        <!-- Header: count + sort controls -->
        <div class="mb-3 flex items-center justify-between">
          <p class="text-sm text-muted-foreground">
            Showing {{ scenes().length }} of {{ totalMatched() }} results
            @if (selectedCount() > 0) {
              <span class="ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white"
                    [style.background-color]="accentColor()">
                {{ selectedCount() }} selected
              </span>
            }
          </p>
          <div class="flex gap-1">
            <button class="rounded-md px-2.5 py-1 text-xs transition-colors"
                    [class]="sortBy() === 'date' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'"
                    (click)="sortBy.set('date')">Newest</button>
            <button class="rounded-md px-2.5 py-1 text-xs transition-colors"
                    [class]="sortBy() === 'cloud' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'"
                    (click)="sortBy.set('cloud')">Clearest</button>
          </div>
        </div>

        <!-- Image grid -->
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          @for (scene of sortedScenes(); track scene.id) {
            <app-scene-card
              [scene]="scene"
              [isSelected]="selectedIds().includes(scene.id)"
              [accentColor]="accentColor()"
              (toggleSelection)="sceneToggled.emit($event)" />
          }
        </div>

        <!-- Load more -->
        @if (scenes().length < totalMatched()) {
          <div class="mt-4 text-center">
            <button class="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
                    (click)="loadMore.emit()">
              Load More Results
            </button>
          </div>
        }
      </div>
    }
  `,
})
export class SceneGridComponent {
  scenes = input.required<StacItem[]>();
  totalMatched = input<number>(0);
  selectedIds = input<string[]>([]);
  accentColor = input<string>('#3B82F6');
  isLoading = input<boolean>(false);
  hasSearched = input<boolean>(false);
  searchError = input<string | null>(null);

  sceneToggled = output<StacItem>();
  loadMore = output<void>();
  retry = output<void>();

  sortBy = signal<'date' | 'cloud'>('date');
  skeletonItems = Array.from({ length: 8 }, (_, i) => i);

  selectedCount = (): number => {
    const ids = this.selectedIds();
    return this.scenes().filter(s => ids.includes(s.id)).length;
  };

  sortedScenes = (): StacItem[] => {
    const items = [...this.scenes()];
    if (this.sortBy() === 'date') {
      return items.sort((a, b) => {
        const da = (a.properties['datetime'] as string) ?? '';
        const db = (b.properties['datetime'] as string) ?? '';
        return db.localeCompare(da);
      });
    } else {
      return items.sort((a, b) => {
        const ca = (a.properties['eo:cloud_cover'] as number) ?? 100;
        const cb = (b.properties['eo:cloud_cover'] as number) ?? 100;
        return ca - cb;
      });
    }
  };
}
