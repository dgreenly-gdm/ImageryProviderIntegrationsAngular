import { Component, input, output } from '@angular/core';
import { ImageryTypeConfig } from '../../../../../core/models/product.model';

@Component({
  selector: 'app-type-selector',
  standalone: true,
  template: `
    <div>
      <h2 class="mb-3 text-lg font-semibold text-foreground">Select Imagery Type</h2>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        @for (type of types(); track type.id) {
          @let isSelected = selectedId() === type.id;
          <button class="rounded-lg border p-4 text-left transition-all"
                  [class]="isSelected
                    ? 'border-transparent ring-2 bg-card'
                    : 'border-border bg-card hover:border-foreground/20'"
                  [style.ring-color]="isSelected ? accentColor() : undefined"
                  (click)="typeSelected.emit(type)">
            <h3 class="text-sm font-semibold text-foreground">{{ type.name }}</h3>
            <p class="mt-1 text-xs text-muted-foreground line-clamp-2">{{ type.description }}</p>
            <p class="mt-2 text-xs" [style.color]="accentColor()">{{ type.tiers.length }} tiers</p>
          </button>
        }
      </div>
    </div>
  `,
})
export class TypeSelectorComponent {
  types = input.required<ImageryTypeConfig[]>();
  selectedId = input<string | null>(null);
  accentColor = input<string>('#3B82F6');
  typeSelected = output<ImageryTypeConfig>();
}
