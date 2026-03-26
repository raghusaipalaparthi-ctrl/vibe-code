import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  { id: 1, title: "DATA.CORRUPTION", artist: "UNKNOWN_ENTITY", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "MEMORY.LEAK", artist: "SYS_ADMIN", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "BUFFER.OVERFLOW", artist: "GHOST_IN_MACHINE", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("ERR_PLAYBACK:", e));
    }
  }, [currentTrackIndex, isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("ERR_PLAYBACK:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  const prevTrack = () => setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);

  return (
    <div className="brutal-box p-6 flex flex-col gap-8 w-full max-w-sm animate-tear">
      <div className="text-center border-b-2 border-[#00FFFF] pb-4">
        <h2 className="text-2xl font-pixel text-[#FF00FF]">AUDIO.EXE</h2>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="w-32 h-32 border-4 border-[#00FFFF] flex items-center justify-center bg-black relative overflow-hidden">
           {isPlaying && (
             <div className="absolute inset-0 bg-[#FF00FF] opacity-20 mix-blend-screen animate-pulse" style={{ animationDuration: '0.1s' }} />
           )}
           <div className={`w-full h-2 bg-[#00FFFF] absolute ${isPlaying ? 'animate-[bounce_0.5s_infinite]' : ''}`} style={{ top: '50%' }} />
           <div className={`w-2 h-full bg-[#FF00FF] absolute ${isPlaying ? 'animate-[ping_1s_infinite]' : ''}`} style={{ left: '50%' }} />
        </div>
        
        <div className="text-center w-full px-4 bg-[#00FFFF] text-black p-2">
          <h3 className="text-xl font-pixel truncate">{currentTrack.title}</h3>
          <p className="text-lg font-vt mt-1">AUTHOR: {currentTrack.artist}</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button onClick={prevTrack} className="brutal-button p-3">
          <SkipBack size={24} />
        </button>
        
        <button onClick={togglePlay} className="brutal-button p-4">
          {isPlaying ? <Pause size={28} /> : <Play size={28} />}
        </button>
        
        <button onClick={nextTrack} className="brutal-button p-3">
          <SkipForward size={24} />
        </button>
      </div>

      <div className="flex items-center gap-4 bg-black border-2 border-[#FF00FF] p-2">
        <button onClick={() => setIsMuted(!isMuted)} className="text-[#FF00FF] hover:text-[#00FFFF]">
          {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <input
          type="range"
          min="0" max="1" step="0.01"
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            if (isMuted) setIsMuted(false);
          }}
          className="w-full h-4 bg-black border border-[#00FFFF] appearance-none cursor-pointer accent-[#FF00FF]"
        />
      </div>

      <audio ref={audioRef} src={currentTrack.url} onEnded={nextTrack} className="hidden" />
    </div>
  );
}
