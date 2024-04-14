'use client';

import { useRoomContext } from "@/components/Room";

const PeersList = () => {

  const peers = useRoomContext().peers;
  const selfName = useRoomContext().selfName;

  return (
    <div>
      <h2>Me : {selfName}</h2>
      <h2>Connected Peers :</h2>
            <ul>
                {peers.map((peer, index) => (
                  <li key={`${peer.id}-${index}`}>{peer.name}</li>
                ))}
            </ul>
        </div>
  )
}

export default PeersList