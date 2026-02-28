import { Component, input, output } from '@angular/core';
import { ImageryTierConfig } from '../../../../../core/models/product.model';

@Component({
  selector: 'app-tier-selector',
  standalone: true,
  template: `
    <div>
      <h2 class="mb-3 text-lg font-semibold text-foreground">Select Tier</h2>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        @for (tier of tiers(); track tier.id) {
          @let isSelected = selectedId() === tier.id;
          <button class="rounded-lg border p-4 text-left transition-all"
                  [class]="isSelected
                    ? 'border-transparent ring-2 bg-card'
                    : 'border-border bg-card hover:border-foreground/20'"
                  [style.ring-color]="isSelected ? accentColor() : undefined"
                  (click)="tierSelected.emit(tier)">
            <h3 class="text-sm font-semibold text-foreground">{{ tier.name }}</h3>
            <p class="mt-1 text-xs text-muted-foreground">{{ tier.description }}</p>
            <div class="mt-3 space-y-1">
              <div class="flex justify-between text-xs">
                <span class="text-muted-foreground">GSD</span>
                <span class="text-foreground">{{ tier.gsdRange }}</span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-muted-foreground">Delivery</span>
                <span class="text-foreground">{{ tier.deliveryTime }}</span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-muted-foreground">Price</span>
                <span class="font-medium" [style.color]="accentColor()">\${{ tier.pricePerSqKm }}/km²</span>
              </div>
            </div>
          </button>
        }
      </div>
    </div>
  `,
})
export class TierSelectorComponent {
  tiers = input.required<ImageryTierConfig[]>();
  selectedId = input<string | null>(null);
  accentColor = input<string>('#3B82F6');
  tierSelected = output<ImageryTierConfig>();
}
