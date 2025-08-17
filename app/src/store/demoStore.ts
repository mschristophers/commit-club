import { create } from 'zustand';

export interface DemoCommitment {
  id: string;
  name: string;
  organizer: string;
  stakeAmount: string;
  minCheckIns: number;
  deadline: string;
  totalStaked: string;
  joiners: string[];
  attendees: string[];
  settled: boolean;
  code: string;
}

interface DemoState {
  commitments: DemoCommitment[];
  nextId: number;
  addCommitment: (commitment: Omit<DemoCommitment, 'id' | 'totalStaked' | 'joiners' | 'attendees' | 'settled'>) => string;
  joinCommitment: (id: string, userAddress: string) => void;
  checkInToCommitment: (id: string, userAddress: string, code: string) => boolean;
  settleCommitment: (id: string) => void;
  getCommitment: (id: string) => DemoCommitment | null;
}

/**
 * Demo store for managing commitments locally
 */
export const useDemoStore = create<DemoState>((set, get) => ({
  commitments: [
    {
      id: '1',
      name: 'Central Park Morning Run Challenge',
      organizer: '0x1234567890123456789012345678901234567890',
      stakeAmount: '0.1',
      minCheckIns: 3,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      totalStaked: '0.3',
      joiners: ['0x1234567890123456789012345678901234567890', '0x2345678901234567890123456789012345678901'],
      attendees: ['0x1234567890123456789012345678901234567890'],
      settled: false,
      code: 'morningrun2024'
    }
  ],
  nextId: 2,

  addCommitment: (commitment) => {
    const id = get().nextId.toString();
    const newCommitment: DemoCommitment = {
      ...commitment,
      id,
      totalStaked: '0',
      joiners: [],
      attendees: [],
      settled: false,
    };

    set((state) => ({
      commitments: [...state.commitments, newCommitment],
      nextId: state.nextId + 1,
    }));

    return id;
  },

  joinCommitment: (id, userAddress) => {
    set((state) => ({
      commitments: state.commitments.map((commitment) => {
        if (commitment.id === id && !commitment.joiners.includes(userAddress)) {
          return {
            ...commitment,
            joiners: [...commitment.joiners, userAddress],
            totalStaked: (parseFloat(commitment.totalStaked) + parseFloat(commitment.stakeAmount)).toString(),
          };
        }
        return commitment;
      }),
    }));
  },

  checkInToCommitment: (id, userAddress, code) => {
    const commitment = get().commitments.find(c => c.id === id);
    if (!commitment || commitment.code !== code || !commitment.joiners.includes(userAddress)) {
      return false;
    }

    set((state) => ({
      commitments: state.commitments.map((c) => {
        if (c.id === id && !c.attendees.includes(userAddress)) {
          return {
            ...c,
            attendees: [...c.attendees, userAddress],
          };
        }
        return c;
      }),
    }));

    return true;
  },

  settleCommitment: (id) => {
    set((state) => ({
      commitments: state.commitments.map((commitment) => {
        if (commitment.id === id) {
          return {
            ...commitment,
            settled: true,
          };
        }
        return commitment;
      }),
    }));
  },

  getCommitment: (id) => {
    return get().commitments.find(c => c.id === id) || null;
  },
}));
