import { Component, input, computed } from '@angular/core';
import { FAMILIES } from '../../../core/models/product.model';

@Component({
  selector: 'app-family-badge',
  standalone: true,
  template: `
    <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium"
          [style.background-color]="bgColor()"
          [style.color]="color()"
          [style.border-color]="color()">
      {{ label() }}
    </span>
  `,
})
export class FamilyBadgeComponent {
  familyId = input.required<string>();

  private family = computed(() => FAMILIES.find(f => f.id === this.familyId()));
  color = computed(() => this.family()?.color ?? '#3B82F6');
  bgColor = computed(() => this.color() + '20');
  label = computed(() => this.family()?.name ?? this.familyId());
}
