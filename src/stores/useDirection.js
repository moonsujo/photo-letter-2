import { create } from 'zustand'

export const useDirection = create(set => ({
  phase: 'loading',
  setPhase: phase => set(() => ({ phase })),

  open: false,
  setOpen: open => set(() => ({ open }))
}))