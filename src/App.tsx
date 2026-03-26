import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#00FFFF] font-vt relative overflow-hidden flex flex-col selection:bg-[#FF00FF] selection:text-black">
      <div className="static-noise" />
      <div className="scanlines" />
      
      <header className="w-full p-8 z-10 text-center border-b-4 border-[#FF00FF] bg-black animate-tear">
        <h1 className="text-4xl md:text-6xl glitch-text" data-text="SYS.OVERRIDE">
          SYS.OVERRIDE
        </h1>
        <p className="text-[#00FFFF] mt-4 text-xl tracking-[0.3em] font-pixel">
          [ AUDIO_VISUAL_INTERFACE_v9.9 ]
        </p>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-16 p-6 md:p-12 z-10 w-full max-w-7xl mx-auto">
        <div className="w-full max-w-md lg:w-1/3 flex justify-center lg:justify-end order-2 lg:order-1">
          <MusicPlayer />
        </div>

        <div className="w-full lg:w-2/3 flex justify-center lg:justify-start order-1 lg:order-2">
          <SnakeGame />
        </div>
      </main>
    </div>
  );
}
