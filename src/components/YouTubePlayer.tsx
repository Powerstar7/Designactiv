import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Maximize2 } from 'lucide-react';

interface YouTubePlayerProps {
  videoId: string;
  accentColor?: string;
}

export default function YouTubePlayer({ videoId, accentColor = '#f97316' }: YouTubePlayerProps) {
  const [muted, setMuted] = useState(true);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerId = useRef(`yt-player-${videoId}-${Math.random().toString(36).slice(2)}`);

  const muteParam = muted ? '&mute=1' : '&mute=0';
  const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1${muteParam}`;

  useEffect(() => {
    const timer = setTimeout(() => setPlayerReady(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSoundToggle = () => {
    setMuted((prev) => !prev);
    setOverlayVisible(false);
  };

  const handleOverlayClick = () => {
    setMuted(false);
    setOverlayVisible(false);
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-2xl border border-gray-700/50 bg-black">
      <div className="relative" style={{ paddingTop: '56.25%' }}>
        <iframe
          ref={iframeRef}
          id={playerId.current}
          src={src}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          title="Video Player"
        />

        {overlayVisible && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer z-10"
            style={{ background: 'rgba(0,0,0,0.45)' }}
            onClick={handleOverlayClick}
          >
            <div className="flex flex-col items-center gap-3 pointer-events-none">
              <div className="relative">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center animate-pulse"
                  style={{ backgroundColor: accentColor + '30', border: `2px solid ${accentColor}` }}
                >
                  <VolumeX className="w-7 h-7 text-white" />
                </div>
                <div
                  className="absolute -inset-2 rounded-full animate-ping opacity-40"
                  style={{ backgroundColor: accentColor + '40' }}
                />
              </div>
              <div className="text-center">
                <p className="text-white font-bold text-base">
                  {playerReady ? 'Video is Playing...' : 'Loading...'}
                </p>
                <p
                  className="font-black text-sm mt-1"
                  style={{ color: accentColor }}
                >
                  Click For Sound
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="absolute bottom-3 right-3 flex items-center gap-2 z-20">
          <button
            onClick={handleSoundToggle}
            className="flex items-center gap-1.5 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-all hover:scale-105"
            style={{ backgroundColor: accentColor }}
          >
            {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            {muted ? 'Click For Sound' : 'Mute'}
          </button>
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black/70 hover:bg-black/90 text-white p-1.5 rounded-full transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </a>
        </div>

        {!playerReady && (
          <div className="absolute inset-0 bg-[#050d1a] flex items-center justify-center z-30">
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: accentColor, borderTopColor: 'transparent' }}
              />
              <p className="text-gray-400 text-sm">Loading video...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
