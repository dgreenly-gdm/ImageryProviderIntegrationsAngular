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

      @if (store.orderMode(); as mode) {
        <div class="mb-3 space-y-1">
          <p class="text-xs text-muted-foreground">Order Type</p>
          <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
                [class]="mode === 'historical'
                  ? 'bg-blue-500/10 text-blue-400'
                  : 'bg-emerald-500/10 text-emerald-400'">
            @if (mode === 'historical') {
              <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
              Historical
            } @else {
              <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
              Future Collection
            }
          </span>
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

      @if (store.anyAvailable()) {
        <div class="mb-3 space-y-1">
          <p class="text-xs text-muted-foreground">Search Mode</p>
          <span class="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
            <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            Any Available
          </span>
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
