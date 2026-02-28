import { Component, input, output } from '@angular/core';

export interface PillOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-radio-pill-group',
  standalone: true,
  template: `
    <div class="flex flex-wrap gap-2">
      @for (option of options(); track option.value) {
        @let selected = value() === option.value;
        <button type="button"
                class="rounded-full border px-3 py-1 text-xs font-medium transition-colors"
                [class]="selected ? 'text-white border-transparent' : 'text-muted-foreground border-border hover:border-foreground/30'"
                [style.background-color]="selected ? accentColor() : 'transparent'"
                (click)="select(option.value)">
          {{ option.label }}
        </button>
      }
    </div>
  `,
})
export class RadioPillGroupComponent {
  options = input.required<PillOption[]>();
  value = input.required<string>();
  accentColor = input<string>('#3B82F6');
  valueChange = output<string>();

  select(value: string): void {
    this.valueChange.emit(value);
  }
}
