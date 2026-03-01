import { Component, inject, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderStoreService } from '../../../core/services/order-store.service';
import { RadioPillGroupComponent, PillOption } from '../../../shared/components/radio-pill-group/radio-pill-group.component';
import { OrderSummaryComponent } from '../../../shared/components/order-summary/order-summary.component';
import flatpickr from 'flatpickr';
import { Instance as FlatpickrInstance } from 'flatpickr/dist/types/instance';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [FormsModule, RadioPillGroupComponent, OrderSummaryComponent],
  template: `
    <div class="flex gap-6">
      <div class="flex-1 space-y-6">
        <h1 class="text-2xl font-bold text-foreground">Schedule Order</h1>

        <!-- Order Details -->
        <div class="rounded-lg border border-border bg-card p-4">
          <h3 class="mb-3 text-sm font-semibold text-foreground">Order Details</h3>
          <div>
            <label class="mb-1 block text-xs text-muted-foreground">Order Name</label>
            <input type="text" placeholder="Enter order name..."
                   class="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground"
                   [(ngModel)]="sched.orderName" (ngModelChange)="saveSchedule()" />
          </div>
        </div>

        @if (isHistorical) {
          <!-- Historical mode hint -->
          <div class="rounded-lg border border-border bg-card p-4">
            <div class="flex items-start gap-3">
              <svg class="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              <p class="text-sm text-muted-foreground">
                You selected <span class="font-medium text-foreground">Historical Imagery</span>.
                Delivery schedule dates are not required — the archived imagery you selected will be delivered upon order completion.
              </p>
            </div>
          </div>
        }

        @if (!isHistorical) {
          <!-- Delivery Schedule (Future mode only) -->
          <div class="rounded-lg border border-border bg-card p-4">
            <h3 class="mb-3 text-sm font-semibold text-foreground">Delivery Schedule</h3>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label class="mb-1 block text-xs text-muted-foreground">Start Date</label>
                <input #startDateInput type="text" placeholder="Select start date..."
                       class="flatpickr-input w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground" readonly />
              </div>
              <div>
                <label class="mb-1 block text-xs text-muted-foreground">End Date</label>
                <input #endDateInput type="text" placeholder="Select end date..."
                       class="flatpickr-input w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground" readonly />
              </div>
              <div>
                <label class="mb-1 block text-xs text-muted-foreground">Expiration Date</label>
                <input #expirationDateInput type="text" placeholder="Optional..."
                       class="flatpickr-input w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground" readonly />
              </div>
            </div>
          </div>

          <!-- Recurring Schedule (Future mode only) -->
          <div class="rounded-lg border border-border bg-card p-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-semibold text-foreground">Recurring Schedule</h3>
              <label class="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" class="peer sr-only"
                       [(ngModel)]="sched.recurring" (ngModelChange)="saveSchedule()" />
                <div class="h-5 w-9 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-foreground after:transition-all peer-checked:after:translate-x-full"
                     [style.background-color]="sched.recurring ? (store.family()?.color ?? '#3B82F6') : undefined"></div>
              </label>
            </div>

            @if (sched.recurring) {
              <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label class="mb-1 block text-xs text-muted-foreground">Frequency</label>
                  <select class="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground"
                          [(ngModel)]="sched.frequency" (ngModelChange)="saveSchedule()">
                    <option value="">Select...</option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Biweekly">Biweekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label class="mb-1 block text-xs text-muted-foreground">Day of Week</label>
                  <select class="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground"
                          [(ngModel)]="sched.dayOfWeek" (ngModelChange)="saveSchedule()">
                    <option value="">Select...</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>
                <div>
                  <label class="mb-2 block text-xs text-muted-foreground">Delivery Window</label>
                  <app-radio-pill-group
                    [options]="windowOptions"
                    [value]="sched.deliveryWindow"
                    [accentColor]="store.family()?.color ?? '#3B82F6'"
                    (valueChange)="sched.deliveryWindow = $event; saveSchedule()" />
                </div>
              </div>
            }
          </div>
        }

        <div class="flex gap-3">
          <button class="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
                  (click)="goBack()">Back</button>
          <button class="rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                  [style.background-color]="store.family()?.color ?? '#3B82F6'"
                  [disabled]="!canContinue"
                  (click)="goNext()">Continue</button>
        </div>
      </div>

      <div class="hidden w-72 shrink-0 lg:block">
        <app-order-summary />
      </div>
    </div>
  `,
})
export class ScheduleComponent implements OnInit, AfterViewInit, OnDestroy {
  store = inject(OrderStoreService);
  private router = inject(Router);

  @ViewChild('startDateInput') startDateInput!: ElementRef<HTMLInputElement>;
  @ViewChild('endDateInput') endDateInput!: ElementRef<HTMLInputElement>;
  @ViewChild('expirationDateInput') expirationDateInput!: ElementRef<HTMLInputElement>;

  private fpStart: FlatpickrInstance | null = null;
  private fpEnd: FlatpickrInstance | null = null;
  private fpExpiration: FlatpickrInstance | null = null;

  sched = {
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

  windowOptions: PillOption[] = [
    { value: 'Morning', label: 'Morning' },
    { value: 'Afternoon', label: 'Afternoon' },
    { value: 'Evening', label: 'Evening' },
    { value: 'Overnight', label: 'Overnight' },
  ];

  get isHistorical(): boolean {
    return this.store.orderMode() === 'historical';
  }

  get canContinue(): boolean {
    if (!this.sched.orderName) return false;
    if (!this.isHistorical) {
      return this.sched.startDate !== '' && this.sched.endDate !== '';
    }
    return true;
  }

  ngOnInit(): void {
    const s = this.store.schedule();
    this.sched = { ...s };
  }

  ngAfterViewInit(): void {
    if (!this.isHistorical) {
      this.initFlatpickr();
    }
  }

  ngOnDestroy(): void {
    this.fpStart?.destroy();
    this.fpEnd?.destroy();
    this.fpExpiration?.destroy();
  }

  private initFlatpickr(): void {
    const baseConfig = {
      altInput: true,
      altFormat: 'F j, Y',
      dateFormat: 'Y-m-d',
      minDate: 'today' as const,
    };

    if (this.startDateInput) {
      this.fpStart = flatpickr(this.startDateInput.nativeElement, {
        ...baseConfig,
        defaultDate: this.sched.startDate || undefined,
        onChange: (_dates: Date[], dateStr: string) => {
          this.sched.startDate = dateStr;
          this.saveSchedule();
          if (this.fpEnd) {
            this.fpEnd.set('minDate', dateStr);
          }
        },
      });
    }

    if (this.endDateInput) {
      this.fpEnd = flatpickr(this.endDateInput.nativeElement, {
        ...baseConfig,
        defaultDate: this.sched.endDate || undefined,
        minDate: this.sched.startDate || 'today',
        onChange: (_dates: Date[], dateStr: string) => {
          this.sched.endDate = dateStr;
          this.saveSchedule();
        },
      });
    }

    if (this.expirationDateInput) {
      this.fpExpiration = flatpickr(this.expirationDateInput.nativeElement, {
        ...baseConfig,
        defaultDate: this.sched.expirationDate || undefined,
        onChange: (_dates: Date[], dateStr: string) => {
          this.sched.expirationDate = dateStr;
          this.saveSchedule();
        },
      });
    }
  }

  saveSchedule(): void {
    this.store.updateSchedule({ ...this.sched });
  }

  goBack(): void {
    const family = this.store.family();
    if (family) this.router.navigate(['/order', family.id, 'configure']);
  }

  goNext(): void {
    const family = this.store.family();
    if (family) this.router.navigate(['/order', family.id, 'review']);
  }
}
