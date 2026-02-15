import { create } from 'zustand'

export const useDirection = create(set => ({
  phase: 'loading',
  setPhase: phase => set(() => ({ phase })),

  open: undefined,
  setOpen: open => set(() => ({ open })),

  reveal: false,
  setReveal: reveal => set(() => ({ reveal })),

  writeFrontText: false,
  setWriteFrontText: writeFrontText => set(() => ({ writeFrontText })),
}))