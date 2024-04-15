'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const GameMenu = () => {
    const [gameId, setGameId] = useState<string>('');

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
  }
  
  useEffect(() => {
    setGameId(uuidv4());
  }, []);

  return (
    <div className='flex flex-col items-start gap-4 rounded-lg border-2 border-neutral-400 p-4'>
      <label>Game ID:</label>
      <input
        type="text"
        className='w-full p-2 rounded-lg text-neutral-900'
        value={gameId}
        onChange={(e) => setGameId(e.target.value)}
        onClick={() => copyToClipboard(gameId)}
      />
      <button
        className='bg-neutral-400 px-4 py-2 w-full rounded-lg text-neutral-900'
        onClick={() => setGameId(uuidv4())}
      >Generate New Game ID</button>
      <Link
        className='text-center w-full bg-neutral-400 px-4 py-2 w-full rounded-lg text-neutral-900'
        href={`/game?gameId=${gameId}`}
      >Join Game</Link>
    </div>
  )
}

export default GameMenu;