import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  /** Renders the confirm action in the danger color and uses a warning icon. */
  danger?: boolean;
  icon?: string;
}

/**
 * Generic confirmation dialog. Callers pass already-localized strings so the
 * dialog stays presentation-only and reusable across features.
 * Closes with `true` on confirm, `false`/undefined otherwise.
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog">
      <header class="dialog__head">
        <span class="dialog__icon" [class.dialog__icon--danger]="data.danger">
          <mat-icon>{{ data.icon || (data.danger ? 'warning_amber' : 'help_outline') }}</mat-icon>
        </span>
        <h2 mat-dialog-title>{{ data.title }}</h2>
      </header>

      <div mat-dialog-content class="dialog__body">
        <p>{{ data.message }}</p>
      </div>

      <div mat-dialog-actions class="dialog__actions">
        <button mat-button type="button" (click)="cancel()">{{ data.cancelLabel }}</button>
        <button mat-flat-button type="button"
                class="dialog__confirm"
                [class.dialog__confirm--danger]="data.danger"
                (click)="confirm()">
          <mat-icon>{{ data.danger ? 'delete' : 'check' }}</mat-icon>
          {{ data.confirmLabel }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .dialog { display: grid; gap: 18px; padding: 4px; color: var(--ink-800); }
    .dialog__head { display: flex; align-items: flex-start; gap: 14px; }
    .dialog__icon {
      display: grid; place-items: center;
      width: 44px; height: 44px;
      border-radius: 12px;
      background: var(--brand-50); color: var(--brand-600);
      flex-shrink: 0;
    }
    .dialog__icon--danger { background: var(--danger-soft); color: var(--danger); }
    .dialog h2[mat-dialog-title] {
      margin: 0; align-self: center;
      color: var(--ink-900);
      font-family: var(--font-heading);
      font-size: 1.2rem; font-weight: 700; letter-spacing: -0.01em;
    }
    .dialog__body { padding: 0 !important; max-height: none !important; }
    .dialog__body p { margin: 0; color: var(--ink-600); line-height: 1.55; font-size: 0.94rem; }
    .dialog__actions { padding: 0 !important; display: flex !important; justify-content: flex-end; gap: 8px; }
    .dialog__confirm.dialog__confirm--danger {
      background: var(--danger) !important;
      color: #fff !important;
    }
  `]
})
export class ConfirmDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData) {}

  confirm() { this.dialogRef.close(true); }
  cancel() { this.dialogRef.close(false); }
}
