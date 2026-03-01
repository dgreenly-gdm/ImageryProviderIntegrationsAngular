import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { OrderStoreService } from '../../../core/services/order-store.service';
import { OrderMode } from '../../../core/models/order.model';
import { IMAGERY_TYPES, ImageryTypeConfig, ImageryTierConfig } from '../../../core/models/product.model';
import { TypeSelectorComponent } from './components/type-selector/type-selector.component';
import { TierSelectorComponent } from './components/tier-selector/tier-selector.component';
import { OrderSummaryComponent } from '../../../shared/components/order-summary/order-summary.component';

@Component({
  selector: 'app-select-products',
  standalone: true,
  imports: [TypeSelectorComponent, TierSelectorComponent, OrderSummaryComponent],
  template: `
    <div class="flex gap-6">
      <div class="flex-1 space-y-6">

        <!-- Mode Selector: Historical vs Future -->
        <div>
          <h2 class="mb-1 text-lg font-semibold text-foreground">Order Type</h2>
          <p class="mb-3 text-sm text-muted-foreground">What kind of imagery are you looking for?</p>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <!-- Historical Card -->
            <button class="rounded-lg border p-5 text-left transition-all"
                    [class]="store.orderMode() === 'historical'
                      ? 'border-transparent ring-2 bg-card'
                      : 'border-border bg-card hover:border-foreground/20'"
                    [style.ring-color]="store.orderMode() === 'historical' ? accentColor : undefined"
                    (click)="onModeSelected('historical')">
              <div class="mb-2 flex items-center gap-2">
                <svg class="h-5 w-5" [style.color]="store.orderMode() === 'historical' ? accentColor : undefined"
                     fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                <span class="text-sm font-semibold text-foreground">Historical Imagery</span>
              </div>
              <p class="text-xs text-muted-foreground">
                Browse and order from existing archived satellite imagery.
                Select specific scenes for immediate delivery.
              </p>
            </button>

            <!-- Future Card -->
            <button class="rounded-lg border p-5 text-left transition-all"
                    [class]="store.orderMode() === 'future'
                      ? 'border-transparent ring-2 bg-card'
                      : 'border-border bg-card hover:border-foreground/20'"
                    [style.ring-color]="store.orderMode() === 'future' ? accentColor : undefined"
                    (click)="onModeSelected('future')">
              <div class="mb-2 flex items-center gap-2">
                <svg class="h-5 w-5" [style.color]="store.orderMode() === 'future' ? accentColor : undefined"
                     fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
                <span class="text-sm font-semibold text-foreground">Future Collection</span>
              </div>
              <p class="text-xs text-muted-foreground">
                Request new satellite collection over your area of interest.
                Set a schedule for future tasking and delivery.
              </p>
            </button>
          </div>
        </div>

        <!-- Type Selector (shown after mode is selected) -->
        @if (store.orderMode()) {
          <app-type-selector
            [types]="imageryTypes"
            [selectedId]="store.productType()?.id ?? null"
            [accentColor]="accentColor"
            (typeSelected)="onTypeSelected($event)" />
        }

        <!-- Tier Selector (shown after type is selected) -->
        @if (store.productType(); as type) {
          <app-tier-selector
            [tiers]="type.tiers"
            [selectedId]="store.tier()?.id ?? null"
            [accentColor]="accentColor"
            (tierSelected)="onTierSelected($event)" />
        }

        <div class="flex gap-3">
          <button class="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
                  (click)="goBack()">Back</button>
          <button class="rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                  [style.background-color]="accentColor"
                  [disabled]="!store.orderMode() || !store.productType() || !store.tier()"
                  (click)="goNext()">Continue</button>
        </div>
      </div>

      <div class="hidden w-72 shrink-0 lg:block">
        <app-order-summary />
      </div>
    </div>
  `,
})
export class SelectProductsComponent {
  store = inject(OrderStoreService);
  private router = inject(Router);
  imageryTypes = IMAGERY_TYPES;

  get accentColor(): string {
    return this.store.family()?.color ?? '#3B82F6';
  }

  onModeSelected(mode: OrderMode): void {
    this.store.setOrderMode(mode);
  }

  onTypeSelected(type: ImageryTypeConfig): void {
    this.store.setProductType(type);
  }

  onTierSelected(tier: ImageryTierConfig): void {
    this.store.setTier(tier);
  }

  goBack(): void {
    this.router.navigate(['/order']);
  }

  goNext(): void {
    const family = this.store.family();
    if (family) {
      this.router.navigate(['/order', family.id, 'browse']);
    }
  }
}
