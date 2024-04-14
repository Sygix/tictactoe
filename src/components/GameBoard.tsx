'use client';

import { Peer, useRoomContext } from "@/components/Room";
import clsx from "clsx";
import { useEffect, useState } from "react";

const GameBoard = () => {
    const [board, setBoard] = useState<string[]>(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const { room, peers, selfId, selfName } = useRoomContext();
    const [players, setPlayers] = useState<{
        peer: Peer;
        symbol: string;
    }[]>([]);
    const [synced, setSynced] = useState(false);
    const [sendPlayers, getPlayers] = room ? room.makeAction('players') : [null, null];

    useEffect(() => {
        if (peers.length == 1 && !synced && selfId && selfName && sendPlayers) {
            const choosenSymbol = Math.random() > 0.5 ? 'X' : 'O';
            const newPlayers = [
                { peer: { id: selfId, name: selfName }, symbol: choosenSymbol },
                { peer: peers[0], symbol: choosenSymbol === 'X' ? 'O' : 'X' }
            ];
            setPlayers(newPlayers);
            sendPlayers({ players: newPlayers });
            setSynced(true);
        }
    }, [peers, synced, selfId, selfName, sendPlayers]);

    useEffect(() => {
        const playersStillConnected = players.filter(player => peers.some(peer => peer.id === player.peer.id));
        console.log('playersStillConnected : ', playersStillConnected);
        if (playersStillConnected.length < 2) {
            setBoard(Array(9).fill(null));
            setIsXNext(true);
            setPlayers([]);
            setSynced(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [peers]);

    if (!room) { return <p>Chargement...</p> };
    if (peers.length < 1) { return <p>En attente d&apos;un autre joueur...</p> };

    const [sendMove, getMove] = room.makeAction('move');
    const winner = calculateWinner(board);
    const mySymbol = players.find(player => player.peer.id === selfId)?.symbol ?? '';

    if (getPlayers) {
        getPlayers((data, peerId) => {
            const playersData = data as { players: { peer: Peer; symbol: string }[] };
            setPlayers(playersData.players);
            setSynced(true);
        });   
    }

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