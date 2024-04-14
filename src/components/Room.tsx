'use client';

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { BaseRoomConfig, RelayConfig, Room as TrysteroRoom, joinRoom, selfId } from "trystero/nostr";
import { uniqueNamesGenerator, animals } from 'unique-names-generator';

export type Peer = {
    name: string;
    id: string;
};

const RoomContext = createContext<{
    room: TrysteroRoom | null;
    peers: Peer[];
    selfId: string | null;
    selfName: string | null;
}>({
    room: null,
    peers: [],
    selfId: null,
    selfName: null
});

export const useRoomContext = () => {
    const context = useContext(RoomContext);
    if (!context) {
      throw new Error('useRoomContext must be used within a Room');
    }
    return context;
};
  

const Room = ({ gameId, children }: { gameId: string; children: ReactNode }) => {
    const [myRandomName, setMyRandomName] = useState<string>('');
    const config: BaseRoomConfig & RelayConfig = { appId: 'sygix-tictactoe' };
    const room = joinRoom(config, gameId);
    const [sendName, getName] = room.makeAction('name');
    
    const [peers, setPeers] = useState<Peer[]>([]);

    room.onPeerJoin(peerId => {
        setPeers(peers => [...peers, { id: peerId, name: '...' }]);
        setTimeout(() => {
            sendName({ name: myRandomName });
        }, 1000);
    });

    room.onPeerLeave(peerId => {
        setPeers(peers => peers.filter(peer => peer.id !== peerId));
    });

    getName((data, peerId) => {
        const nameData = data as { name: string };
        const peer = peers.find(peer => peer.id === peerId);
        if (peer) {
            peer.name = nameData.name;
            setPeers([...peers]);
        }
    });

    useEffect(() => {
        setMyRandomName(uniqueNamesGenerator({
            dictionaries: [animals],
            style: 'capital'
        }));
    }, []);
    
    return (
        <RoomContext.Provider value={{
            room,
            peers,
            selfId: selfId,
            selfName: myRandomName
        }} >
            {children}
        </RoomContext.Provider>
    );
}

export default Room