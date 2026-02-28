import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxPillGroupComponent, PillOption } from '../../../../../shared/components/checkbox-pill-group/checkbox-pill-group.component';

export interface SearchFormValues {
  startDate: string;
  endDate: string;
  cloudCoverMax: number;
  collections: string[];
}

@Component({
  selector: 'app-search-controls',
  standalone: true,
  imports: [FormsModule, CheckboxPillGroupComponent],
  template: `
    <div class="rounded-lg border border-border bg-card p-4">
      <h3 class="mb-3 text-sm font-semibold text-foreground">Search Parameters</h3>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label class="mb-1 block text-xs text-muted-foreground">Start Date</label>
          <input type="date" class="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground"
                 [ngModel]="formValues.startDate" (ngModelChange)="formValues.startDate = $event" />
        </div>
        <div>
          <label class="mb-1 block text-xs text-muted-foreground">End Date</label>
          <input type="date" class="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground"
                 [ngModel]="formValues.endDate" (ngModelChange)="formValues.endDate = $event" />
        </div>
      </div>

      <div class="mt-3">
        <label class="mb-1 block text-xs text-muted-foreground">Max Cloud Cover: {{ formValues.cloudCoverMax }}%</label>
        <input type="range" min="0" max="100" class="w-full"
               [ngModel]="formValues.cloudCoverMax" (ngModelChange)="formValues.cloudCoverMax = $event" />
      </div>

      @if (availableCollections().length > 0) {
        <div class="mt-3">
          <label class="mb-1 block text-xs text-muted-foreground">Collections</label>
          <app-checkbox-pill-group
            [options]="collectionOptions()"
            [values]="formValues.collections"
            [accentColor]="accentColor()"
            (valuesChange)="formValues.collections = $event" />
        </div>
      }

      <button class="mt-4 w-full rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              [style.background-color]="accentColor()"
              [disabled]="!canSearch"
              (click)="onSearch()">
        Search Catalog
      </button>
    </div>
  `,
})
export class SearchControlsComponent {
  availableCollections = input<string[]>([]);
  accentColor = input<string>('#3B82F6');
  search = output<SearchFormValues>();

  formValues: SearchFormValues = {
    startDate: '',
    endDate: '',
    cloudCoverMax: 30,
    collections: [],
  };

  get canSearch(): boolean {
    return this.formValues.startDate !== '' && this.formValues.endDate !== '';
  }

  collectionOptions = (): PillOption[] => {
    return this.availableCollections().map(c => ({ value: c, label: c }));
  };

  onSearch(): void {
    this.search.emit({ ...this.formValues });
  }
}
