import { Component, input, output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderMode } from '../../../../../core/models/order.model';

export interface SearchFormValues {
  startDate: string;
  endDate: string;
  cloudCoverMax: number;
}

@Component({
  selector: 'app-search-controls',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="rounded-lg border border-border bg-card p-3">
      <div class="flex flex-col gap-3 lg:flex-row lg:items-end">
        <!-- Date range -->
        <div class="flex gap-3">
          <div class="min-w-[140px]">
            <label class="mb-1 block text-xs text-muted-foreground">Start Date</label>
            <input type="date"
                   class="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground"
                   [ngModel]="formValues.startDate"
                   (ngModelChange)="formValues.startDate = $event" />
          </div>
          <div class="min-w-[140px]">
            <label class="mb-1 block text-xs text-muted-foreground">End Date</label>
            <input type="date"
                   class="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground"
                   [ngModel]="formValues.endDate"
                   (ngModelChange)="formValues.endDate = $event" />
          </div>
        </div>

        <!-- Cloud cover -->
        <div class="min-w-[160px]">
          <label class="mb-1 block text-xs text-muted-foreground">
            Max Cloud Cover: {{ formValues.cloudCoverMax }}%
          </label>
          <input type="range" min="0" max="100" class="w-full"
                 [ngModel]="formValues.cloudCoverMax"
                 (ngModelChange)="formValues.cloudCoverMax = $event" />
        </div>

        <!-- Search button -->
        <div class="flex items-end">
          <button class="flex items-center gap-2 rounded-lg px-5 py-1.5 text-sm font-medium text-white disabled:opacity-50"
                  [style.background-color]="accentColor()"
                  [disabled]="!canSearch"
                  (click)="onSearch()">
            @if (isLoading()) {
              <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            } @else {
              Search Catalog
            }
          </button>
        </div>
      </div>

      <!-- AOI hint -->
      @if (!hasAoi()) {
        <p class="mt-2 text-xs text-muted-foreground italic">
          Draw a circle, polygon, or rectangle on the map above to enable search.
        </p>
      }
    </div>
  `,
})
export class SearchControlsComponent implements OnInit {
  hasAoi = input<boolean>(false);
  isLoading = input<boolean>(false);
  accentColor = input<string>('#3B82F6');
  orderMode = input<'future' | 'historical' | null>(null);
  search = output<SearchFormValues>();

  formValues: SearchFormValues = {
    startDate: '',
    endDate: '',
    cloudCoverMax: 30,
  };

  ngOnInit(): void {
    const mode = this.orderMode();
    const daysBack = mode === 'future' ? 7 : 90;
    const start = new Date();
    start.setDate(start.getDate() - daysBack);
    this.formValues.startDate = start.toISOString().slice(0, 10);
    this.formValues.endDate = new Date().toISOString().slice(0, 10);
  }

  get canSearch(): boolean {
    return this.hasAoi()
      && !this.isLoading()
      && this.formValues.startDate !== ''
      && this.formValues.endDate !== '';
  }

  onSearch(): void {
    this.search.emit({ ...this.formValues });
  }
}
