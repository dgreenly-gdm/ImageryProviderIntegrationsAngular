import { Component, inject, input, output, NgZone, ElementRef, viewChild, afterNextRender } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-draw';
import { StacItem, AreaOfInterest } from '../../../../../core/models/stac.model';

@Component({
  selector: 'app-imagery-map',
  standalone: true,
  template: `
    <div class="relative">
      <div #mapContainer class="h-[550px] w-full rounded-lg border border-border"></div>

      <!-- Overlay hint when no AOI drawn -->
      @if (!hasAoi()) {
        <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div class="rounded-lg bg-background/80 px-4 py-2 backdrop-blur-sm">
            <p class="text-sm text-muted-foreground">
              Use the draw tools (top right) to select an area of interest
            </p>
          </div>
        </div>
      }
    </div>
  `,
})
export class ImageryMapComponent {
  private ngZone = inject(NgZone);
  mapContainer = viewChild.required<ElementRef>('mapContainer');

  accentColor = input<string>('#3B82F6');
  stacResults = input<StacItem[]>([]);
  selectedSceneIds = input<string[]>([]);
  hasAoi = input<boolean>(false);
  aoiChanged = output<AreaOfInterest>();
  sceneClicked = output<StacItem>();

  private map!: L.Map;
  private drawnItems = new L.FeatureGroup();
  private footprintLayer = new L.FeatureGroup();

  constructor() {
    afterNextRender(() => {
      this.initMap();
    });
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    this.ngZone.runOutsideAngular(() => {
      this.map = L.map(this.mapContainer().nativeElement, {
        center: [38.8977, -77.0365],
        zoom: 6,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(this.map);

      this.map.addLayer(this.drawnItems);
      this.map.addLayer(this.footprintLayer);

      const drawControl = new L.Control.Draw({
        position: 'topright',
        draw: {
          circle: { shapeOptions: { color: this.accentColor() } } as any,
          polygon: { shapeOptions: { color: this.accentColor() } } as any,
          rectangle: { shapeOptions: { color: this.accentColor() } } as any,
          polyline: false,
          marker: false,
          circlemarker: false,
        },
        edit: {
          featureGroup: this.drawnItems,
        },
      });
      this.map.addControl(drawControl);

      this.map.on(L.Draw.Event.CREATED, (event: any) => {
        this.drawnItems.clearLayers();
        const layer = event.layer;
        this.drawnItems.addLayer(layer);

        this.ngZone.run(() => {
          if (event.layerType === 'circle') {
            const center = (layer as L.Circle).getLatLng();
            const radiusM = (layer as L.Circle).getRadius();
            const radiusKm = radiusM / 1000;
            const bbox = this.circleToBbox(center, radiusKm);
            this.aoiChanged.emit({
              type: 'circle',
              center: { lat: center.lat, lng: center.lng },
              radiusKm,
              bbox,
            });
          } else {
            const coords = (layer as L.Polygon).getLatLngs()[0] as L.LatLng[];
            const lngLats = coords.map(c => [c.lng, c.lat]);
            const bbox = this.polygonToBbox(lngLats);
            this.aoiChanged.emit({
              type: 'polygon',
              coordinates: lngLats,
              bbox,
            });
          }
        });
      });
    });
  }

  updateFootprints(results: StacItem[], selectedIds: string[]): void {
    if (!this.map) return;
    this.ngZone.runOutsideAngular(() => {
      this.footprintLayer.clearLayers();
      results.forEach(item => {
        const isSelected = selectedIds.includes(item.id);
        const geo = L.geoJSON(item.geometry as any, {
          style: {
            color: isSelected ? '#FFFFFF' : this.accentColor(),
            fillColor: this.accentColor(),
            fillOpacity: isSelected ? 0.3 : 0.08,
            weight: isSelected ? 2 : 1,
          },
        });
        geo.on('click', () => {
          this.ngZone.run(() => this.sceneClicked.emit(item));
        });
        this.footprintLayer.addLayer(geo);
      });

      if (results.length > 0) {
        this.map.fitBounds(this.footprintLayer.getBounds(), { padding: [20, 20] });
      }
    });
  }

  private circleToBbox(center: L.LatLng, radiusKm: number): [number, number, number, number] {
    const degPerKm = 1 / 111.32;
    const latDelta = radiusKm * degPerKm;
    const lngDelta = radiusKm * degPerKm / Math.cos((center.lat * Math.PI) / 180);
    return [
      center.lng - lngDelta,
      center.lat - latDelta,
      center.lng + lngDelta,
      center.lat + latDelta,
    ];
  }

  private polygonToBbox(coords: number[][]): [number, number, number, number] {
    const lngs = coords.map(c => c[0]);
    const lats = coords.map(c => c[1]);
    return [Math.min(...lngs), Math.min(...lats), Math.max(...lngs), Math.max(...lats)];
  }
}
