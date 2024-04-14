'use client';

import { Peer, useRoomContext } from "@/components/Room";
import clsx from "clsx";
import { useState } from "react";

const GameBoard = () => {
    const [board, setBoard] = useState<string[]>(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const { room, peers, selfId, selfName } = useRoomContext();
    const [players, setPlayers] = useState<{
        peer: Peer;
        symbol: string;
    }[]>([]);

    if (!room) { return <p>Chargement...</p> };
    if (peers.length < 1) { return <p>En attente d&apos;un autre joueur...</p> };
    console.log(selfId, peers, players);
    
    const [sendPlayers, getPlayers] = room.makeAction('players');
    const [sendMove, getMove] = room.makeAction('move');
    const winner = calculateWinner(board);
    const mySymbol = players.find(player => player.peer.id === selfId)?.symbol ?? '';

    if (selfId && selfName && peers.length > 0 && players.length < 2) {
        console.log('setting players');
        const newPlayers = [
            { peer: { id: selfId, name: selfName }, symbol: 'X' },
            { peer: peers[0], symbol: 'O' }
        ];
        setPlayers(newPlayers);
        sendPlayers({players: newPlayers});
    }

    getPlayers((data, peerId) => {
        const playersData = data as { players: { peer: Peer; symbol: string }[] };
        setPlayers(playersData.players);
    });

    getMove((data, peerId) => {
        if (peerId !== peers[0].id || !data) return;
        const moveData = data as { cellIndex: number };
        updateBoard(moveData.cellIndex);
    });

    const handleClick = (index: number) => {
        if ((mySymbol === 'X' && isXNext) || (mySymbol === 'O' && !isXNext)) {
            sendMove({ cellIndex: index });
            updateBoard(index);
        }
    };

    const updateBoard = (index: number) => {
        if (board[index] || calculateWinner(board)) {
            // Case déjà occupée ou partie terminée
            return;
          }
      
          const newBoard = [...board];
          newBoard[index] = isXNext ? 'X' : 'O';
          setBoard(newBoard);
          setIsXNext(!isXNext);
    };

    return (
        <div>
            <ul className="grid grid-cols-3 grid-rows-3">
                {board.map((cell, index) => (
                    <li
                        key={index}
                        className={clsx(
                            "border border-gray-400 h-16 flex items-center justify-center text-2xl", 
                            (mySymbol === 'X' && isXNext) || (mySymbol === 'O' && !isXNext) ? 'cursor-pointer' : 'cursor-not-allowed'
                        )}
                        onClick={() => handleClick(index)}
                    >
                        {cell}
                    </li>
                ))}
            </ul>
            
            {winner ? (
                <p>Le joueur {players.find((p) => p.symbol === winner)?.peer.name} a gagné !</p>
            ) : (
                <p>au tour du joueur {isXNext ? players.find((p) => p.symbol === 'X')?.peer.name : players.find((p) => p.symbol === 'O')?.peer.name}</p>
            )}
        </div>
      );
};

const calculateWinner = (cells: string[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
  
    for (const [a, b, c] of lines) {
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
        return cells[a];
      }
    }
  
    return null;
};

export default GameBoard;