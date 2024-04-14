'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const CreateGame = () => {
    const [gameId, setGameId] = useState<string>('');

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
  }
  
  useEffect(() => {
    setGameId(uuidv4());
  }, []);

  return (
      <div className='flex flex-col justify-center items-center'>
        <h1>Create Game</h1>
        <div>
            <label>Game ID:</label>
            <input type="text" value={gameId} readOnly onClick={() => copyToClipboard(gameId)} />
        </div>
        <button onClick={() => setGameId(uuidv4())}>Generate New Game ID</button>
        <Link href={`/game?gameId=${gameId}`}>Join Game</Link>
    </div>
  )
}

export default CreateGame