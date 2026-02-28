import { Component, inject } from '@angular/core';
import { OrderStoreService } from '../../../core/services/order-store.service';
import { FamilyBadgeComponent } from '../family-badge/family-badge.component';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [FamilyBadgeComponent],
  template: `
    <div class="rounded-lg border border-border bg-card p-4">
      <h3 class="mb-3 text-sm font-semibold text-foreground">Order Summary</h3>

      @if (store.family(); as family) {
        <div class="mb-3 space-y-1">
          <p class="text-xs text-muted-foreground">Product Family</p>
          <app-family-badge [familyId]="family.id" />
        </div>
      }

      @if (store.productType(); as type) {
        <div class="mb-3 space-y-1">
          <p class="text-xs text-muted-foreground">Imagery Type</p>
          <p class="text-sm text-foreground">{{ type.name }}</p>
        </div>
      }

      @if (store.tier(); as tier) {
        <div class="mb-3 space-y-1">
          <p class="text-xs text-muted-foreground">Tier</p>
          <p class="text-sm text-foreground">{{ tier.name }}</p>
          <p class="text-xs text-muted-foreground">{{ tier.gsdRange }} GSD &middot; {{ tier.deliveryTime }}</p>
        </div>
      }

      @if (store.selectedScenes().length > 0) {
        <div class="mb-3 space-y-1">
          <p class="text-xs text-muted-foreground">Selected Scenes</p>
          <p class="text-sm text-foreground">{{ store.selectedScenes().length }} scene(s)</p>
        </div>
      }

      @if (store.configuration().deliveryFormat) {
        <div class="mb-3 space-y-1">
          <p class="text-xs text-muted-foreground">Delivery Format</p>
          <p class="text-sm text-foreground">{{ store.configuration().deliveryFormat }}</p>
        </div>
      }

      @if (store.schedule().orderName) {
        <div class="mb-3 space-y-1">
          <p class="text-xs text-muted-foreground">Order Name</p>
          <p class="text-sm text-foreground">{{ store.schedule().orderName }}</p>
        </div>
      }

      @if (store.tier(); as tier) {
        @if (store.selectedScenes().length > 0) {
          <div class="mt-4 border-t border-border pt-3">
            <p class="text-xs text-muted-foreground">Estimated Cost</p>
            <p class="text-lg font-bold text-foreground">
              \${{ (tier.pricePerSqKm * store.selectedScenes().length * 100).toLocaleString() }}
            </p>
          </div>
        }
      }
    </div>
  `,
})
export class OrderSummaryComponent {
  store = inject(OrderStoreService);
}
