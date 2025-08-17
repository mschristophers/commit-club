import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'pending' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  timestamp: number;
}

interface UIState {
  toasts: Toast[];
  addToast: (message: string, type: ToastType) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

/**
 * Tiny Zustand store for transient UI state
 */
export const useUIStore = create<UIState>((set, get) => ({
  toasts: [],
  
  addToast: (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: Toast = {
      id,
      message,
      type,
      timestamp: Date.now(),
    };
    
    set((state) => ({
      toasts: [...state.toasts, toast],
    }));

    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      get().removeToast(id);
    }, 5000);
  },
  
  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
  
  clearToasts: () => {
    set({ toasts: [] });
  },
}));
