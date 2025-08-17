import { create } from 'zustand';
import { FLOW_EVM_TESTNET } from '../lib/chain';

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

// Chain state
interface ChainState {
  selectedChain: {
    id: number;
    name: string;
    symbol: string;
  };
  setSelectedChain: (chain: { id: number; name: string; symbol: string }) => void;
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

/**
 * Chain state store
 */
export const useChainStore = create<ChainState>((set) => ({
  selectedChain: {
    id: FLOW_EVM_TESTNET.id,
    name: FLOW_EVM_TESTNET.name,
    symbol: 'FLOW'
  },
  setSelectedChain: (chain) => {
    // Determine symbol based on chain
    let symbol = 'FLOW';
    if (chain.id === 421614) symbol = 'USDC'; // Arbitrum Sepolia
    if (chain.id === 84532) symbol = 'USDC';  // Base Sepolia
    
    set({ selectedChain: { ...chain, symbol } });
  },
}));
