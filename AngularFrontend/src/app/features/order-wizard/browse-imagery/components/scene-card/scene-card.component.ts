import { Component, input, output } from '@angular/core';
import { StacItem } from '../../../../../core/models/stac.model';

@Component({
  selector: 'app-scene-card',
  standalone: true,
  template: `
    @let item = scene();
    @let selected = isSelected();
    <div class="rounded-lg border p-3 transition-all cursor-pointer"
         [class]="selected ? 'border-transparent ring-2 bg-card' : 'border-border bg-card hover:border-foreground/20'"
         [style.ring-color]="selected ? accentColor() : undefined"
         (click)="toggleSelection.emit(item)">
      <div class="mb-2 flex items-center justify-between">
        <span class="text-xs font-medium text-foreground truncate max-w-[70%]">{{ item.id }}</span>
        @if (selected) {
          <span class="text-xs font-medium text-white rounded-full px-2 py-0.5"
                [style.background-color]="accentColor()">Selected</span>
        }
      </div>
      <div class="space-y-1 text-xs text-muted-foreground">
        <p>Date: {{ getDate(item) }}</p>
        <p>Cloud: {{ getCloudCover(item) }}%</p>
        <p>Collection: {{ item.collection }}</p>
      </div>
    </div>
  `,
})
export class SceneCardComponent {
  scene = input.required<StacItem>();
  isSelected = input<boolean>(false);
  accentColor = input<string>('#3B82F6');
  toggleSelection = output<StacItem>();

  getDate(item: StacItem): string {
    const dt = item.properties['datetime'] as string;
    return dt ? new Date(dt).toLocaleDateString() : 'N/A';
  }

  getCloudCover(item: StacItem): string {
    const cc = item.properties['eo:cloud_cover'] as number;
    return cc != null ? cc.toFixed(1) : 'N/A';
  }
}
