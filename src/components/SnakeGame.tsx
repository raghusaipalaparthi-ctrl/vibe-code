import React, { useState, useEffect, useRef } from 'react';

const GRID_SIZE = 20;
const TICK_RATE = 100;

type Point = { x: number; y: number };

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const directionRef = useRef(direction);
  const lastProcessedDirectionRef = useRef(direction);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (gameOver) return;

      const { x: lastX, y: lastY } = lastProcessedDirectionRef.current;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (lastY !== 1) directionRef.current = { x: 0, y: -1 };
          if (!hasStarted) setHasStarted(true);
          break;
        case 'ArrowDown':
        case 's':
          if (lastY !== -1) directionRef.current = { x: 0, y: 1 };
          if (!hasStarted) setHasStarted(true);
          break;
        case 'ArrowLeft':
        case 'a':
          if (lastX !== 1) directionRef.current = { x: -1, y: 0 };
          if (!hasStarted) setHasStarted(true);
          break;
        case 'ArrowRight':
        case 'd':
          if (lastX !== -1) directionRef.current = { x: 1, y: 0 };
          if (!hasStarted) setHasStarted(true);
          break;
        case ' ':
          if (hasStarted) setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, hasStarted]);

  useEffect(() => {
    if (gameOver || isPaused || !hasStarted) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const currentDir = directionRef.current;
        lastProcessedDirectionRef.current = currentDir;

        const newHead = { x: head.x + currentDir.x, y: head.y + currentDir.y };

        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          handleGameOver();
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          handleGameOver();
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          let newFood: Point;
          while (true) {
            newFood = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
            if (!newSnake.some(s => s.x === newFood.x && s.y === newFood.y)) break;
          }
          setFood(newFood);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, TICK_RATE);
    return () => clearInterval(intervalId);
  }, [food, gameOver, isPaused, hasStarted]);

  const handleGameOver = () => {
    setGameOver(true);
    setHasStarted(false);
    if (score > highScore) setHighScore(score);
  };

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 1, y: 0 });
    directionRef.current = { x: 1, y: 0 };
    lastProcessedDirectionRef.current = { x: 1, y: 0 };
    setFood({ x: 15, y: 10 });
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setHasStarted(false);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-lg">
      <div className="w-full flex justify-between items-center px-6 py-4 brutal-box">
        <div className="flex flex-col">
          <span className="text-xl text-[#FF00FF] font-vt">SCORE</span>
          <span className="text-2xl font-pixel text-[#00FFFF]">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xl text-[#00FFFF] font-vt">HI_SCORE</span>
          <span className="text-2xl font-pixel text-[#FF00FF]">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div className="relative p-2 brutal-box bg-black">
        <div
          className="grid bg-[#050505] border-2 border-[#333]"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: 'min(100vw - 4rem, 400px)',
            height: 'min(100vw - 4rem, 400px)',
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnakeHead = snake[0].x === x && snake[0].y === y;
            const isSnakeBody = snake.some((s, idx) => idx !== 0 && s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={i}
                className={`w-full h-full border border-[#111] ${
                  isSnakeHead
                    ? 'bg-[#00FFFF]'
                    : isSnakeBody
                    ? 'bg-[#008888]'
                    : isFood
                    ? 'bg-[#FF00FF] animate-[pulse_0.2s_infinite]'
                    : 'bg-transparent'
                }`}
              />
            );
          })}
        </div>

        {!hasStarted && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-30">
            <div className="text-center">
              <p className="text-[#00FFFF] text-xl font-pixel animate-[flicker_0.1s_infinite]">AWAITING_INPUT</p>
              <p className="text-[#FF00FF] text-2xl font-vt mt-4">[PRESS ARROW KEYS]</p>
            </div>
          </div>
        )}

        {isPaused && hasStarted && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-30">
            <p className="text-[#FF00FF] text-3xl font-pixel animate-[flicker_0.5s_infinite]">HALTED</p>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-30 space-y-8 animate-tear">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-pixel text-[#FF00FF] glitch-text" data-text="FATAL_ERR">FATAL_ERR</h2>
              <p className="text-[#00FFFF] text-2xl font-vt mt-4">FINAL_SCORE: {score}</p>
            </div>
            <button
              onClick={resetGame}
              className="brutal-button px-6 py-4 text-xl"
            >
              EXECUTE_REBOOT
            </button>
          </div>
        )}
      </div>
      
      <div className="text-center text-[#FF00FF] text-xl font-vt bg-black border-2 border-[#00FFFF] px-4 py-2">
        [WASD/ARROWS] = MOVE_VECTOR | [SPACE] = INTERRUPT
      </div>
    </div>
  );
}
