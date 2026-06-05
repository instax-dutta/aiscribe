'use client';

import type { Toast } from '@/hooks/useToast';

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div id="toast-container">
      {toasts.map((toast) => {
        const icons: Record<string, string> = { success: '✓', error: '✗', info: 'ℹ' };
        return (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span className="toast-icon">{icons[toast.type] || 'ℹ'}</span>
            <span className="toast-text">{toast.message}</span>
            <button type="button" className="toast-close" onClick={() => onDismiss(toast.id)}>&times;</button>
          </div>
        );
      })}
    </div>
  );
}
