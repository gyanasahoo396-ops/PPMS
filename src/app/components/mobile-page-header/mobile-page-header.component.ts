import { Component, input, output, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mobile-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mobile-header md:hidden">
      <button class="back-btn" (click)="back.emit()" aria-label="Go back">
        <i class="fa-solid fa-arrow-left"></i>
      </button>
      <span class="page-title">{{ title() }}</span>
      @if (showAvatar()) {
        <div class="user-avatar" [attr.aria-label]="'User: ' + userInitial()">
          {{ userInitial() }}
        </div>
      }
    </div>
  `,
  styles: [`
    .mobile-header {
      position: sticky;
      top: 0;
      z-index: 20;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      background: #312e81;
      color: white;
      height: 56px;
    }

    .back-btn {
      background: transparent;
      border: none;
      color: rgba(255,255,255,0.8);
      font-size: 16px;
      cursor: pointer;
      padding: 4px;
      flex-shrink: 0;
    }

    .page-title {
      flex: 1;
      font-size: 16px;
      font-weight: 700;
      color: white;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: white;
      font-size: 14px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
  `]
})
export class MobilePageHeaderComponent {
  title = input<string>('');
  showAvatar = input<boolean>(true);
  back = output<void>();

  private authService = inject(AuthService);
  private currentUser = computed(() => this.authService.currentUser());

  userInitial = computed(() => {
    const name = this.currentUser()?.displayName || '';
    return name ? name.charAt(0).toUpperCase() : 'U';
  });
}
