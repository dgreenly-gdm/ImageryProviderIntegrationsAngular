import { Injectable, computed, signal } from '@angular/core';
import { FamilyConfig, ImageryTypeConfig, ImageryTierConfig } from '../models/product.model';
import { OrderConfiguration, OrderSchedule, OrderMode } from '../models/order.model';
import { StacItem, StacSearchParams, AreaOfInterest } from '../models/stac.model';

const defaultConfiguration: OrderConfiguration = {
  poi: null,
  cloudCoverMax: 20,
  spectralBands: [],
  deliveryFormat: '',
  processingLevel: '',
  notes: '',
};

const defaultSchedule: OrderSchedule = {
  orderName: '',
  startDate: '',
  endDate: '',
  expirationDate: '',
  priority: 'Standard',
  recurring: false,
  frequency: '',
  dayOfWeek: '',
  deliveryWindow: '',
};

const defaultStacSearchParams: StacSearchParams = {
  bbox: null,
  startDate: '',
  endDate: '',
  collections: [],
  cloudCoverMax: 30,
  limit: 20,
};

@Injectable({ providedIn: 'root' })
export class OrderStoreService {
  // Product Selection
  readonly orderMode = signal<OrderMode | null>(null);
  readonly anyAvailable = signal(false);
  readonly family = signal<FamilyConfig | null>(null);
  readonly productType = signal<ImageryTypeConfig | null>(null);
  readonly tier = signal<ImageryTierConfig | null>(null);

  // Order Configuration
  readonly configuration = signal<OrderConfiguration>({ ...defaultConfiguration });
  readonly schedule = signal<OrderSchedule>({ ...defaultSchedule });

  // Browse Imagery (STAC)
  readonly areaOfInterest = signal<AreaOfInterest | null>(null);
  readonly stacSearchParams = signal<StacSearchParams>({ ...defaultStacSearchParams });
  readonly stacResults = signal<StacItem[]>([]);
  readonly stacTotalMatched = signal<number>(0);
  readonly selectedScenes = signal<StacItem[]>([]);

  // Computed current step
  readonly currentStep = computed(() => {
    const family = this.family();
    const mode = this.orderMode();
    const productType = this.productType();
    const tier = this.tier();
    const scenes = this.selectedScenes();
    const config = this.configuration();
    const sched = this.schedule();

    const anyAvail = this.anyAvailable();

    if (!family) return 1;
    if (!mode || (!anyAvail && (!productType || !tier))) return 2;
    if (scenes.length === 0) return 3;
    // Step 4 (configure) no longer gates on delivery format
    if (mode === 'historical') {
      if (!sched.orderName) return 5;
    } else {
      if (!sched.orderName || !sched.startDate || !sched.endDate) return 5;
    }
    return 6;
  });

  setOrderMode(mode: OrderMode): void {
    this.orderMode.set(mode);
    this.anyAvailable.set(false);
    this.productType.set(null);
    this.tier.set(null);
    this.areaOfInterest.set(null);
    this.stacResults.set([]);
    this.stacTotalMatched.set(0);
    this.selectedScenes.set([]);
    this.stacSearchParams.set({ ...defaultStacSearchParams });
  }

  setFamily(family: FamilyConfig): void {
    this.family.set(family);
    this.orderMode.set(null);
    this.productType.set(null);
    this.tier.set(null);
    this.areaOfInterest.set(null);
    this.stacResults.set([]);
    this.stacTotalMatched.set(0);
    this.selectedScenes.set([]);
    this.stacSearchParams.set({ ...defaultStacSearchParams });
  }

  setProductType(productType: ImageryTypeConfig): void {
    this.productType.set(productType);
    this.tier.set(null);
  }

  setTier(tier: ImageryTierConfig): void {
    this.tier.set(tier);
  }

  updateConfig(config: Partial<OrderConfiguration>): void {
    this.configuration.update(current => ({ ...current, ...config }));
  }

  updateSchedule(sched: Partial<OrderSchedule>): void {
    this.schedule.update(current => ({ ...current, ...sched }));
  }

  setAreaOfInterest(aoi: AreaOfInterest | null): void {
    this.areaOfInterest.set(aoi);
  }

  setStacSearchParams(params: Partial<StacSearchParams>): void {
    this.stacSearchParams.update(current => ({ ...current, ...params }));
  }

  setStacResults(results: StacItem[], totalMatched: number): void {
    this.stacResults.set(results);
    this.stacTotalMatched.set(totalMatched);
  }

  addSelectedScene(scene: StacItem): void {
    this.selectedScenes.update(scenes => {
      if (scenes.some(s => s.id === scene.id)) return scenes;
      return [...scenes, scene];
    });
  }

  removeSelectedScene(sceneId: string): void {
    this.selectedScenes.update(scenes => scenes.filter(s => s.id !== sceneId));
  }

  clearSelectedScenes(): void {
    this.selectedScenes.set([]);
  }

  setAnyAvailable(val: boolean): void {
    this.anyAvailable.set(val);
    if (val) {
      this.productType.set(null);
      this.tier.set(null);
    }
  }

  reset(): void {
    this.family.set(null);
    this.orderMode.set(null);
    this.anyAvailable.set(false);
    this.productType.set(null);
    this.tier.set(null);
    this.configuration.set({ ...defaultConfiguration });
    this.schedule.set({ ...defaultSchedule });
    this.areaOfInterest.set(null);
    this.stacSearchParams.set({ ...defaultStacSearchParams });
    this.stacResults.set([]);
    this.stacTotalMatched.set(0);
    this.selectedScenes.set([]);
  }
}
