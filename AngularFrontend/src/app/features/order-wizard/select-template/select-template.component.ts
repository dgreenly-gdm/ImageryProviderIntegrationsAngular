import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { OrderStoreService } from '../../../core/services/order-store.service';
import { FAMILIES, FamilyConfig } from '../../../core/models/product.model';

@Component({
  selector: 'app-select-template',
  standalone: true,
  template: `
    <div>
      <h1 class="mb-2 text-2xl font-bold text-foreground">Select Product Family</h1>
      <p class="mb-6 text-sm text-muted-foreground">Choose a product family to begin your order.</p>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        @for (family of families; track family.id) {
          <button
            class="group relative rounded-lg border border-border bg-card p-5 text-left transition-all hover:border-foreground/20"
            [class.opacity-50]="!family.available"
            [class.cursor-not-allowed]="!family.available"
            [disabled]="!family.available"
            (click)="selectFamily(family)">
            <!-- Color accent bar -->
            <div class="absolute left-0 top-0 h-full w-1 rounded-l-lg" [style.background-color]="family.color"></div>

            <div class="pl-3">
              <div class="mb-1 flex items-center justify-between">
                <h3 class="text-sm font-semibold text-foreground">{{ family.name }}</h3>
                @if (!family.available) {
                  <span class="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    Coming Soon
                  </span>
                }
              </div>
              <p class="mb-2 text-xs text-muted-foreground">{{ family.description }}</p>
              <p class="text-xs font-medium" [style.color]="family.color">
                {{ family.productCount }} products
              </p>
            </div>
          </button>
        }
      </div>
    </div>
  `,
})
export class SelectTemplateComponent {
  private store = inject(OrderStoreService);
  private router = inject(Router);
  families = FAMILIES;

  selectFamily(family: FamilyConfig): void {
    if (!family.available) return;
    this.store.reset();
    this.store.setFamily(family);
    this.router.navigate(['/order', family.id, 'products']);
  }
}
