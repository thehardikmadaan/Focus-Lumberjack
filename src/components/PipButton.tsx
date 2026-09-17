import { useState, useCallback, useEffect } from 'react';
import { useTimer } from '../lib/useTimer';
import { PictureInPicture2 } from 'lucide-react';
import { createPortal } from 'react-dom';

// Types for the experimental Document Picture-in-Picture API
declare global {
  interface Window {
    documentPictureInPicture?: {
      requestWindow(options?: { width?: number; height?: number }): Promise<Window>;
    };
  }
}

export function PipButton() {
  const [pipWindow, setPipWindow] = useState<Window | null>(null);

  const {
    timeLeft,
    timerPhase,
    timerStatus,
    startTimer,
    pauseTimer,
  } = useTimer();

  const isSupported = 'documentPictureInPicture' in window;

  const togglePip = useCallback(async () => {
    if (pipWindow) {
      pipWindow.close();
      setPipWindow(null);
      return;
    }

    if (!window.documentPictureInPicture) return;

    try {
      const pip = await window.documentPictureInPicture.requestWindow({
        width: 300,
        height: 200,
      });

      // Copy styles so Tailwind works in the new window
      [...document.styleSheets].forEach((styleSheet) => {
        try {
          const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join('');
          const style = document.createElement('style');
          style.textContent = cssRules;
          pip.document.head.appendChild(style);
        } catch (e) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.type = styleSheet.type;
          link.media = styleSheet.media.mediaText;
          link.href = styleSheet.href || '';
          pip.document.head.appendChild(link);
        }
      });

      pip.addEventListener('pagehide', () => {
        setPipWindow(null);
      });

      setPipWindow(pip);
    } catch (error) {
      console.error('Failed to open PiP window', error);
    }
  }, [pipWindow]);

  useEffect(() => {
    return () => {
      if (pipWindow) pipWindow.close();
    };
  }, [pipWindow]);

  if (!isSupported) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const isFocusing = timerPhase === 'focus';

  const pipContent = (
    <div className={`flex flex-col items-center justify-center w-full h-screen ${isFocusing ? 'bg-storybook-forest-dark text-amber-50' : 'bg-storybook-teal-dark text-amber-50'} font-sans p-4`}>
      <div className="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">
        {timerPhase.replace('_', ' ')}
      </div>
      <div className="text-6xl font-black tabular-nums tracking-tighter mb-4 drop-shadow-md">
        {timeString}
      </div>
      <button
        onClick={timerStatus === 'running' ? pauseTimer : startTimer}
        className={`px-6 py-2 rounded-full font-bold border-2 shadow-sm transition-all ${
          timerStatus === 'running'
            ? 'bg-storybook-rust-base border-storybook-forest-dark hover:bg-storybook-rust-light'
            : 'bg-storybook-forest-light border-storybook-forest-base hover:bg-storybook-forest-base'
        }`}
      >
        {timerStatus === 'running' ? 'Pause' : 'Start'}
      </button>
    </div>
  );

  return (
    <>
      <button
        onClick={togglePip}
        className="absolute top-4 right-4 p-2 text-storybook-forest-dark/50 hover:text-storybook-forest-base transition-colors"
        title="Pop out timer"
      >
        <PictureInPicture2 className="w-5 h-5" />
      </button>
      {pipWindow && createPortal(pipContent, pipWindow.document.body)}
    </>
  );
}
