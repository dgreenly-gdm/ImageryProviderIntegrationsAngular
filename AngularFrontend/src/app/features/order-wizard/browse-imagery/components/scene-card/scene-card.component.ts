import { Component, input, output, signal } from '@angular/core';
import { StacItem } from '../../../../../core/models/stac.model';

@Component({
  selector: 'app-scene-card',
  standalone: true,
  template: `
    @let item = scene();
    @let selected = isSelected();
    <div class="group relative cursor-pointer overflow-hidden rounded-lg border transition-all"
         [class]="selected
           ? 'border-transparent ring-2 bg-card'
           : 'border-border bg-card hover:border-foreground/20'"
         [style.ring-color]="selected ? accentColor() : undefined"
         (click)="toggleSelection.emit(item)">

      <!-- Thumbnail image -->
      <div class="relative aspect-square overflow-hidden bg-background">
        @if (!imgError()) {
          <img [src]="getThumbnailUrl(item)"
               [alt]="item.id"
               class="h-full w-full object-cover"
               loading="lazy"
               (error)="imgError.set(true)" />
        } @else {
          <!-- Fallback placeholder -->
          <div class="flex h-full w-full items-center justify-center"
               [style.background-color]="accentColor() + '18'">
            <svg class="h-10 w-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
          </div>
        }

        <!-- Selected checkmark overlay -->
        @if (selected) {
          <div class="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-white"
               [style.background-color]="accentColor()">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        }
      </div>

      <!-- Metadata -->
      <div class="p-2.5">
        <div class="flex items-center justify-between gap-1">
          <span class="truncate rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-secondary-foreground">
            {{ formatCollection(item.collection) }}
          </span>
          <span class="flex items-center gap-0.5 text-[10px] text-muted-foreground whitespace-nowrap">
            <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
            </svg>
            {{ getCloudCover(item) }}%
          </span>
        </div>
        <p class="mt-1 text-xs text-foreground">{{ getDate(item) }}</p>
      </div>
    </div>
  `,
})
export class SceneCardComponent {
  scene = input.required<StacItem>();
  isSelected = input<boolean>(false);
  accentColor = input<string>('#3B82F6');
  toggleSelection = output<StacItem>();

  imgError = signal(false);

  getThumbnailUrl(item: StacItem): string {
    const thumb = item.assets?.['thumbnail'];
    if (thumb?.href) return thumb.href;
    const overview = item.assets?.['overview'];
    if (overview?.href) return overview.href;
    const rendered = item.assets?.['rendered_preview'];
    if (rendered?.href) return rendered.href;
    return '';
  }

  getDate(item: StacItem): string {
    const dt = item.properties['datetime'] as string;
    if (!dt) return 'N/A';
    return new Date(dt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  getCloudCover(item: StacItem): string {
    const cc = item.properties['eo:cloud_cover'] as number;
    return cc != null ? cc.toFixed(1) : 'N/A';
  }

  formatCollection(name: string): string {
    if (!name) return 'Unknown';
    return name
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }
}
