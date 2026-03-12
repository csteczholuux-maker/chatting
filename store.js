import { create } from 'zustand';

export const useChatStore = create((set) => ({
  messages: [],
  reports: [],
  recoveredCount: 0,
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  addReport: (rep) => set((state) => ({ reports: [rep, ...state.reports] })),
  setRecovered: (count) => set({ recoveredCount: count }),
}));
