import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { OrderStoreService } from '../../../core/services/order-store.service';
import { OrderApiService } from '../../../core/services/order-api.service';
import { FamilyBadgeComponent } from '../../../shared/components/family-badge/family-badge.component';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [FamilyBadgeComponent],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-foreground">Review & Submit</h1>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Order Details -->
        <div class="rounded-lg border border-border bg-card p-4">
          <h3 class="mb-3 text-sm font-semibold text-foreground">Order Details</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Order Name</span>
              <span class="text-foreground">{{ store.schedule().orderName }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Family</span>
              <span>
                @if (store.family(); as f) { <app-family-badge [familyId]="f.id" /> }
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Imagery Type</span>
              <span class="text-foreground">{{ store.productType()?.name }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Tier</span>
              <span class="text-foreground">{{ store.tier()?.name }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">GSD</span>
              <span class="text-foreground">{{ store.tier()?.gsdRange }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Delivery Time</span>
              <span class="text-foreground">{{ store.tier()?.deliveryTime }}</span>
            </div>
          </div>
        </div>

        <!-- Selected Imagery -->
        <div class="rounded-lg border border-border bg-card p-4">
          <h3 class="mb-3 text-sm font-semibold text-foreground">Selected Imagery</h3>
          <p class="text-sm text-muted-foreground">{{ store.selectedScenes().length }} scene(s)</p>
          @if (store.areaOfInterest(); as aoi) {
            <p class="mt-1 text-xs text-muted-foreground">
              AOI: {{ aoi.type === 'circle' ? 'Circle (' + aoi.radiusKm?.toFixed(1) + ' km)' : 'Polygon' }}
            </p>
          }
          <div class="mt-2 max-h-32 overflow-y-auto space-y-1">
            @for (scene of store.selectedScenes(); track scene.id) {
              <div class="flex justify-between text-xs">
                <span class="text-muted-foreground truncate max-w-[60%]">{{ scene.id }}</span>
                <span class="text-foreground">{{ getCloudCover(scene) }}% cloud</span>
              </div>
            }
          </div>
        </div>

        <!-- Configuration -->
        <div class="rounded-lg border border-border bg-card p-4">
          <h3 class="mb-3 text-sm font-semibold text-foreground">Product Configuration</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Cloud Cover Max</span>
              <span class="text-foreground">{{ store.configuration().cloudCoverMax }}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Spectral Bands</span>
              <span class="text-foreground">{{ store.configuration().spectralBands.join(', ') || 'None' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Delivery Format</span>
              <span class="text-foreground">{{ store.configuration().deliveryFormat }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Processing Level</span>
              <span class="text-foreground">{{ store.configuration().processingLevel }}</span>
            </div>
            @if (store.configuration().notes) {
              <div>
                <span class="text-muted-foreground">Notes</span>
                <p class="mt-1 text-foreground">{{ store.configuration().notes }}</p>
              </div>
            }
          </div>
        </div>

        <!-- Schedule -->
        <div class="rounded-lg border border-border bg-card p-4">
          <h3 class="mb-3 text-sm font-semibold text-foreground">Schedule</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Start Date</span>
              <span class="text-foreground">{{ store.schedule().startDate }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">End Date</span>
              <span class="text-foreground">{{ store.schedule().endDate }}</span>
            </div>
            @if (store.schedule().expirationDate) {
              <div class="flex justify-between">
                <span class="text-muted-foreground">Expiration</span>
                <span class="text-foreground">{{ store.schedule().expirationDate }}</span>
              </div>
            }
            <div class="flex justify-between">
              <span class="text-muted-foreground">Priority</span>
              <span class="text-foreground">{{ store.schedule().priority }}</span>
            </div>
            @if (store.schedule().recurring) {
              <div class="flex justify-between">
                <span class="text-muted-foreground">Recurring</span>
                <span class="text-foreground">{{ store.schedule().frequency }} - {{ store.schedule().dayOfWeek }}</span>
              </div>
              @if (store.schedule().deliveryWindow) {
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Delivery Window</span>
                  <span class="text-foreground">{{ store.schedule().deliveryWindow }}</span>
                </div>
              }
            }
          </div>
        </div>
      </div>

      <!-- Estimated Cost -->
      @if (store.tier(); as tier) {
        <div class="rounded-lg border border-border bg-card p-4">
          <h3 class="mb-2 text-sm font-semibold text-foreground">Estimated Cost</h3>
          <p class="text-3xl font-bold" [style.color]="store.family()?.color ?? '#3B82F6'">
            \${{ (tier.pricePerSqKm * store.selectedScenes().length * 100).toLocaleString() }}
          </p>
          <p class="mt-1 text-xs text-muted-foreground">
            \${{ tier.pricePerSqKm }}/km² × {{ store.selectedScenes().length }} scenes × 100 km²
          </p>
        </div>
      }

      <div class="flex gap-3">
        <button class="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
                (click)="goBack()">Back</button>
        <button class="rounded-lg px-4 py-2 text-sm font-medium text-white"
                [style.background-color]="store.family()?.color ?? '#3B82F6'"
                [disabled]="submitting()"
                (click)="submitOrder()">
          {{ submitting() ? 'Submitting...' : 'Submit Order' }}
        </button>
        <button class="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
                (click)="saveAsTemplate()">Save as Template</button>
      </div>

      <!-- Success Dialog -->
      @if (orderId()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div class="mx-4 max-w-md rounded-lg border border-border bg-card p-6">
            <h2 class="mb-2 text-lg font-bold text-foreground">Order Submitted!</h2>
            <p class="mb-4 text-sm text-muted-foreground">Your order has been successfully submitted.</p>
            <p class="mb-4 text-sm">
              <span class="text-muted-foreground">Order ID: </span>
              <span class="font-mono font-medium" [style.color]="store.family()?.color ?? '#3B82F6'">{{ orderId() }}</span>
            </p>
            <button class="w-full rounded-lg px-4 py-2 text-sm font-medium text-white"
                    [style.background-color]="store.family()?.color ?? '#3B82F6'"
                    (click)="newOrder()">
              New Order
            </button>
          </div>
        </div>
      }

      <!-- Error -->
      @if (error()) {
        <div class="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
          {{ error() }}
        </div>
      }
    </div>
  `,
})
export class ReviewComponent {
  store = inject(OrderStoreService);
  private orderApi = inject(OrderApiService);
  private router = inject(Router);

  submitting = signal(false);
  orderId = signal<string | null>(null);
  error = signal<string | null>(null);

  getCloudCover(scene: any): string {
    const cc = scene.properties?.['eo:cloud_cover'];
    return cc != null ? cc.toFixed(1) : 'N/A';
  }

  submitOrder(): void {
    const family = this.store.family();
    const productType = this.store.productType();
    const tier = this.store.tier();
    if (!family || !productType || !tier) return;

    this.submitting.set(true);
    this.error.set(null);

    this.orderApi.createOrder({
      familyId: family.id,
      productTypeId: productType.id,
      tierId: tier.id,
      configuration: this.store.configuration(),
      schedule: this.store.schedule(),
      selectedSceneIds: this.store.selectedScenes().map(s => s.id),
    }).subscribe({
      next: (response) => {
        this.submitting.set(false);
        this.orderId.set(response.orderId);
      },
      error: (err) => {
        this.submitting.set(false);
        this.error.set('Failed to submit order. Please try again.');
        console.error('Submit error:', err);
      },
    });
  }

  saveAsTemplate(): void {
    alert('Save as Template is not yet implemented.');
  }

  goBack(): void {
    const family = this.store.family();
    if (family) this.router.navigate(['/order', family.id, 'schedule']);
  }

  newOrder(): void {
    this.store.reset();
    this.router.navigate(['/order']);
  }
}
