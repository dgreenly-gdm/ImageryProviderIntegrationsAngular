import { Component, input, output, signal } from '@angular/core';
import { StacItem } from '../../../../../core/models/stac.model';
import { SceneCardComponent } from '../scene-card/scene-card.component';

@Component({
  selector: 'app-scene-grid',
  standalone: true,
  imports: [SceneCardComponent],
  template: `
    @if (scenes().length > 0) {
      <div class="mt-4">
        <div class="mb-3 flex items-center justify-between">
          <p class="text-sm text-muted-foreground">
            {{ scenes().length }} of {{ totalMatched() }} results
          </p>
          <div class="flex gap-2">
            <button class="rounded-md px-2 py-1 text-xs"
                    [class]="sortBy() === 'date' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'"
                    (click)="sortBy.set('date')">Newest</button>
            <button class="rounded-md px-2 py-1 text-xs"
                    [class]="sortBy() === 'cloud' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'"
                    (click)="sortBy.set('cloud')">Clearest</button>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          @for (scene of sortedScenes(); track scene.id) {
            <app-scene-card
              [scene]="scene"
              [isSelected]="selectedIds().includes(scene.id)"
              [accentColor]="accentColor()"
              (toggleSelection)="sceneToggled.emit($event)" />
          }
        </div>

        @if (scenes().length < totalMatched()) {
          <div class="mt-4 text-center">
            <button class="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
                    (click)="loadMore.emit()">
              Load More
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
  sceneToggled = output<StacItem>();
  loadMore = output<void>();

  sortBy = signal<'date' | 'cloud'>('date');

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
