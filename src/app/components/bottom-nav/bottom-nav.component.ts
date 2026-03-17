import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="bottom-nav" aria-label="Main navigation">
      <a routerLink="/dhamnagar-dashboard/dashboard" routerLinkActive="active" class="nav-item">
        <i class="fa-solid fa-chart-bar"></i>
        <span>DASHBOARD</span>
      </a>
      <a routerLink="/dhamnagar-dashboard/departments" routerLinkActive="active" class="nav-item">
        <i class="fa-solid fa-building-columns"></i>
        <span>DEPTS</span>
      </a>
      <a routerLink="/dhamnagar-dashboard/priorities" routerLinkActive="active" class="nav-item">
        <i class="fa-solid fa-star"></i>
        <span>PRIORITIES</span>
      </a>
      <a routerLink="/dhamnagar-dashboard/intervention" routerLinkActive="active" class="nav-item">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <span>INTERVENE</span>
      </a>
    </nav>
  `,
  styles: [`
    .bottom-nav {
      display: none;
    }

    @media (max-width: 767px) {
      .bottom-nav {
        display: flex;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 60px;
        background: #fff;
        border-top: 1px solid #e2e8f0;
        box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
        z-index: 50;
      }
    }

    .nav-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      color: #94a3b8;
      text-decoration: none;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.04em;
      transition: color 0.2s;
    }

    .nav-item i {
      font-size: 18px;
    }

    .nav-item.active {
      color: #4f46e5;
    }

    .nav-item:active {
      background: #f1f5f9;
    }
  `]
})
export class BottomNavComponent {}
