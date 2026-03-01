import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderStoreService } from '../../../core/services/order-store.service';
import { StacItem } from '../../../core/models/stac.model';
import { CheckboxPillGroupComponent, PillOption } from '../../../shared/components/checkbox-pill-group/checkbox-pill-group.component';
import { OrderSummaryComponent } from '../../../shared/components/order-summary/order-summary.component';

@Component({
  selector: 'app-configure',
  standalone: true,
  imports: [FormsModule, CheckboxPillGroupComponent, OrderSummaryComponent],
  template: `
    <div class="flex gap-6">
      <div class="flex-1 space-y-6">
        <h1 class="text-2xl font-bold text-foreground">Configure Order</h1>

        <!-- Selected Imagery Summary -->
        <div class="rounded-lg border border-border bg-card p-4">
          <h3 class="mb-2 text-sm font-semibold text-foreground">Selected Imagery</h3>
          <p class="text-sm text-muted-foreground">{{ store.selectedScenes().length }} scene(s) selected</p>
          @if (store.areaOfInterest(); as aoi) {
            <p class="mt-1 text-xs text-muted-foreground">
              AOI: {{ aoi.type === 'circle' ? 'Circle (' + aoi.radiusKm?.toFixed(1) + ' km radius)' : 'Polygon' }}
            </p>
          }
          <div class="mt-2 flex flex-wrap gap-1">
            @for (scene of store.selectedScenes(); track scene.id) {
              <span class="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">
                {{ getSceneDate(scene) }}
              </span>
            }
          </div>
        </div>

        <!-- Image Specifications -->
        <div class="rounded-lg border border-border bg-card p-4">
          <h3 class="mb-3 text-sm font-semibold text-foreground">Image Specifications</h3>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-xs text-muted-foreground">GSD (from tier)</label>
              <input type="text" readonly
                     class="w-full rounded-md border border-input bg-muted px-3 py-1.5 text-sm text-muted-foreground"
                     [value]="store.tier()?.gsdRange ?? 'N/A'" />
            </div>
            <div>
              <label class="mb-1 block text-xs text-muted-foreground">Max Cloud Cover: {{ config.cloudCoverMax }}%</label>
              <input type="range" min="0" max="100" class="w-full"
                     [(ngModel)]="config.cloudCoverMax" (ngModelChange)="saveConfig()" />
            </div>
          </div>

          <div class="mt-4">
            <label class="mb-2 block text-xs text-muted-foreground">Spectral Bands</label>
            <app-checkbox-pill-group
              [options]="spectralBandOptions"
              [values]="config.spectralBands"
              [accentColor]="store.family()?.color ?? '#3B82F6'"
              (valuesChange)="config.spectralBands = $event; saveConfig()" />
          </div>

          <div class="mt-4">
            <label class="mb-1 block text-xs text-muted-foreground">Data Format</label>
            <p class="text-sm text-foreground">{{ getDataFormat() }}</p>
          </div>
        </div>

        <!-- Notes / Special Instructions -->
        <div class="rounded-lg border border-border bg-card p-4">
          <h3 class="mb-3 text-sm font-semibold text-foreground">Notes / Special Instructions</h3>
          <textarea rows="3" placeholder="Any special requirements for this order..."
                    class="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground"
                    [(ngModel)]="config.notes" (ngModelChange)="saveConfig()"></textarea>
        </div>

        <div class="flex gap-3">
          <button class="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
                  (click)="goBack()">Back</button>
          <button class="rounded-lg px-4 py-2 text-sm font-medium text-white"
                  [style.background-color]="store.family()?.color ?? '#3B82F6'"
                  (click)="goNext()">Continue</button>
        </div>
      </div>

      <div class="hidden w-72 shrink-0 lg:block">
        <app-order-summary />
      </div>
    </div>
  `,
})
export class ConfigureComponent implements OnInit {
  store = inject(OrderStoreService);
  private router = inject(Router);

  config = {
    cloudCoverMax: 20,
    spectralBands: [] as string[],
    notes: '',
  };

  spectralBandOptions: PillOption[] = [
    { value: 'Panchromatic', label: 'Panchromatic' },
    { value: 'Red', label: 'Red' },
    { value: 'Green', label: 'Green' },
    { value: 'Blue', label: 'Blue' },
    { value: 'NIR', label: 'NIR' },
    { value: 'SWIR', label: 'SWIR' },
  ];

  getSceneDate(scene: StacItem): string {
    const dt = scene.properties['datetime'] as string;
    return dt ? new Date(dt).toLocaleDateString() : scene.id;
  }

  getDataFormat(): string {
    const scenes = this.store.selectedScenes();
    if (scenes.length === 0) return 'N/A';
    const collections = new Set(scenes.map(s => s.collection));
    const hasSar = [...collections].some(c => c.includes('sentinel-1'));
    const hasOptical = [...collections].some(c => c.includes('sentinel-2') || c.includes('landsat'));
    if (hasSar && hasOptical) return 'GeoTIFF (mixed formats)';
    if (hasSar) return 'GeoTIFF';
    return 'Cloud Optimized GeoTIFF (COG)';
  }

  ngOnInit(): void {
    const c = this.store.configuration();
    this.config.cloudCoverMax = c.cloudCoverMax;
    this.config.spectralBands = [...c.spectralBands];
    this.config.notes = c.notes;
  }

  saveConfig(): void {
    this.store.updateConfig({
      cloudCoverMax: this.config.cloudCoverMax,
      spectralBands: this.config.spectralBands,
      notes: this.config.notes,
    });
  }

  goBack(): void {
    const family = this.store.family();
    if (family) this.router.navigate(['/order', family.id, 'browse']);
  }

  goNext(): void {
    const family = this.store.family();
    if (family) this.router.navigate(['/order', family.id, 'schedule']);
  }
}
