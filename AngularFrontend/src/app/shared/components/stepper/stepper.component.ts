import { Component, input, computed } from '@angular/core';

interface StepDef {
  number: number;
  label: string;
}

@Component({
  selector: 'app-stepper',
  standalone: true,
  template: `
    <div class="flex items-center gap-2">
      @for (step of steps; track step.number; let last = $last) {
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-2">
            @if (step.number < currentStep()) {
              <!-- Completed -->
              <div class="flex h-8 w-8 items-center justify-center rounded-full text-white text-sm font-medium"
                   [style.background-color]="familyColor()">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            } @else if (step.number === currentStep()) {
              <!-- Active -->
              <div class="flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold text-white"
                   [style.border-color]="familyColor()" [style.color]="familyColor()">
                {{ step.number }}
              </div>
            } @else {
              <!-- Upcoming -->
              <div class="flex h-8 w-8 items-center justify-center rounded-full border border-muted-foreground/30 text-sm text-muted-foreground">
                {{ step.number }}
              </div>
            }
            <span class="text-xs font-medium"
                  [class]="step.number <= currentStep() ? 'text-foreground' : 'text-muted-foreground'">
              {{ step.label }}
            </span>
          </div>
          @if (!last) {
            <div class="mx-1 h-px w-8"
                 [style.background-color]="step.number < currentStep() ? familyColor() : 'var(--border)'"></div>
          }
        </div>
      }
    </div>
  `,
})
export class StepperComponent {
  currentStep = input.required<number>();
  familyColor = input<string>('#3B82F6');

  steps: StepDef[] = [
    { number: 1, label: 'Template' },
    { number: 2, label: 'Products' },
    { number: 3, label: 'Browse' },
    { number: 4, label: 'Configure' },
    { number: 5, label: 'Schedule' },
    { number: 6, label: 'Review' },
  ];
}
