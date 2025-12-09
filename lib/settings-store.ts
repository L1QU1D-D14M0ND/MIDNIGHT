import { create } from "zustand"
import { persist } from "zustand/middleware"

export type FpsOption = "uncapped" | 60 | 30 | 24

interface SettingsState {
  isSettingsOpen: boolean
  fpsLimit: FpsOption
  toggleSettings: () => void
  setFpsLimit: (limit: FpsOption) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      isSettingsOpen: false,
      fpsLimit: "uncapped",
      toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),
      setFpsLimit: (limit) => set({ fpsLimit: limit }),
    }),
    {
      name: "poker-bebop-settings",
    }
  )
)