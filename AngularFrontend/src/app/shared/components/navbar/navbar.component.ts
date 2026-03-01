import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="sticky top-0 z-50 border-b border-border bg-navy">
      <div class="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <a routerLink="/" class="flex items-center">
          <img src="/TMGDMP2.png" alt="Global Data Marketplace" class="h-8" />
        </a>

        <div class="flex items-center gap-6">
          <a routerLink="/order" class="text-sm font-medium text-slate-300 transition-colors hover:text-white">New Order</a>
          <a routerLink="/order" class="text-sm font-medium text-slate-300 transition-colors hover:text-white">Templates</a>
          <a routerLink="/order" class="text-sm font-medium text-slate-300 transition-colors hover:text-white">My Orders</a>
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent {}
