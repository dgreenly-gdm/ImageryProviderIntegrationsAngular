import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { OrderStoreService } from '../../../core/services/order-store.service';
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
        <app-type-selector
          [types]="imageryTypes"
          [selectedId]="store.productType()?.id ?? null"
          [accentColor]="store.family()?.color ?? '#3B82F6'"
          (typeSelected)="onTypeSelected($event)" />

        @if (store.productType(); as type) {
          <app-tier-selector
            [tiers]="type.tiers"
            [selectedId]="store.tier()?.id ?? null"
            [accentColor]="store.family()?.color ?? '#3B82F6'"
            (tierSelected)="onTierSelected($event)" />
        }

        <div class="flex gap-3">
          <button class="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
                  (click)="goBack()">Back</button>
          <button class="rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                  [style.background-color]="store.family()?.color ?? '#3B82F6'"
                  [disabled]="!store.productType() || !store.tier()"
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
