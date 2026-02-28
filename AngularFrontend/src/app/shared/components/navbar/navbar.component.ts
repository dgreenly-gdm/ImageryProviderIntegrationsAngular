import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="sticky top-0 z-50 border-b border-border bg-navy">
      <div class="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <a routerLink="/" class="flex items-center gap-3">
          <div class="flex h-8 w-8 items-center justify-center rounded-md bg-family-blue">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M13 7 11.8 3.8a.6.6 0 0 0-1.1 0L9.6 7"/>
              <path d="m8 13-2.8 1.2a.6.6 0 0 0 0 1.1L8 16.4"/>
              <path d="m16 13 2.8 1.2a.6.6 0 0 1 0 1.1L16 16.4"/>
              <path d="m11.8 20.2-1.2 3a.6.6 0 0 0 1.1 0l1.2-3"/>
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2"/>
              <path d="M12 20v2"/>
              <path d="m4.93 4.93 1.41 1.41"/>
              <path d="m17.66 17.66 1.41 1.41"/>
              <path d="M2 12h2"/>
              <path d="M20 12h2"/>
              <path d="m6.34 17.66-1.41 1.41"/>
              <path d="m19.07 4.93-1.41 1.41"/>
            </svg>
          </div>
          <span class="text-sm font-bold tracking-widest text-white uppercase">
            Global Data Marketplace
          </span>
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
