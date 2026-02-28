import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { StepperComponent } from '../../shared/components/stepper/stepper.component';
import { OrderStoreService } from '../../core/services/order-store.service';

@Component({
  selector: 'app-order-wizard',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, StepperComponent],
  template: `
    <div class="min-h-screen bg-background text-foreground">
      <app-navbar />
      <div class="mx-auto max-w-7xl px-6 py-4">
        <app-stepper [currentStep]="store.currentStep()"
                     [familyColor]="store.family()?.color ?? '#3B82F6'" />
      </div>
      <main class="mx-auto max-w-7xl px-6 py-6">
        <router-outlet />
      </main>
    </div>
  `,
})
export class OrderWizardComponent {
  store = inject(OrderStoreService);
}
