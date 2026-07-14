import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SoundSettingsStore {
  soundEnabled: boolean;
  audioElement: HTMLAudioElement | null;
  registerAudioElement: (element: HTMLAudioElement | null) => void;
  toggleSound: () => void;
  setSoundEnabled: (soundEnabled: boolean) => void;
}

const useSoundSettingsStore = create<SoundSettingsStore>()(
  persist(
    (set, get) => ({
      soundEnabled: true,
      audioElement: null,
      registerAudioElement: (element) => set({ audioElement: element }),
      toggleSound: () => {
        const nextEnabled = !get().soundEnabled;
        const audio = get().audioElement;
        if (audio) {
          if (nextEnabled) {
            // Tie a play()/pause() to this click (a real user gesture) so the
            // browser's autoplay policy allows the later, gesture-less
            // play() call triggered from the notification timer.
            audio
              .play()
              .then(() => audio.pause())
              .catch(() => {});
          } else {
            audio.pause();
          }
        }
        set({ soundEnabled: nextEnabled });
      },
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
    }),
    {
      name: "sound-settings",
      partialize: (state) => ({ soundEnabled: state.soundEnabled }),
    }
  )
);

export default useSoundSettingsStore;
