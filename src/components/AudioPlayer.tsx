import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Volume2, VolumeX, Music } from 'lucide-react';

// Using free open source audio links for MVP demonstration
const AUDIO_SOURCES = {
  none: '',
  forest: 'https://cdn.freesound.org/previews/515/515254_11172810-lq.mp3', // CC0 Forest Birds
  campfire: 'https://cdn.freesound.org/previews/439/439228_8227666-lq.mp3', // CC0 Campfire
  rain: 'https://cdn.freesound.org/previews/401/401276_5121236-lq.mp3',     // CC0 Rain
};

export function AudioPlayer() {
  const { settings, updateSettings, timerStatus } = useAppStore();
  const audioRef = useRef<HTMLAudioElement>(null);

  // Map timer phase to default sounds if they want it dynamic, but for now user selects
  // Or we can auto-switch: Focus = Forest/Rain, Break = Campfire
  // For MVP: Let the user select the track explicitly in settings, but default to 'none'.

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = settings.audioVolume;
    }
  }, [settings.audioVolume]);

  useEffect(() => {
    if (audioRef.current) {
      if (timerStatus === 'running' && settings.selectedAudio !== 'none') {
        // Need to handle browser autoplay policies: only play if running
        audioRef.current.play().catch((e) => console.log('Audio autoplay prevented:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [timerStatus, settings.selectedAudio]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ audioVolume: parseFloat(e.target.value) });
  };

  const cycleAudio = () => {
    const options: ('none' | 'forest' | 'campfire' | 'rain')[] = ['none', 'forest', 'campfire', 'rain'];
    const currentIndex = options.indexOf(settings.selectedAudio);
    const nextIndex = (currentIndex + 1) % options.length;
    updateSettings({ selectedAudio: options[nextIndex] });
  };

  const audioLabels = {
    none: 'No Audio',
    forest: 'Forest',
    campfire: 'Campfire',
    rain: 'Rain',
  };

  return (
    <div className="flex items-center gap-3 bg-amber-100/80 px-4 py-2 rounded-full border-2 border-storybook-forest-dark shadow-sm backdrop-blur w-fit mb-4 mx-auto">
      <audio
        ref={audioRef}
        src={AUDIO_SOURCES[settings.selectedAudio]}
        loop
      />

      <button
        onClick={cycleAudio}
        className="flex items-center gap-2 text-sm font-bold text-storybook-forest-dark hover:text-storybook-rust-base transition-colors shrink-0 w-28"
      >
        <Music className="w-4 h-4" />
        {audioLabels[settings.selectedAudio]}
      </button>

      <div className="w-px h-4 bg-storybook-forest-dark/20 shrink-0" />

      <div className="flex items-center gap-2">
        <button
          onClick={() => updateSettings({ audioVolume: settings.audioVolume === 0 ? 0.5 : 0 })}
          className="text-storybook-forest-dark hover:text-storybook-rust-base transition-colors shrink-0"
        >
          {settings.audioVolume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={settings.audioVolume}
          onChange={handleVolumeChange}
          className="w-20 h-2 bg-white rounded-lg appearance-none cursor-pointer accent-storybook-rust-base border border-storybook-forest-dark/30"
        />
      </div>
    </div>
  );
}
