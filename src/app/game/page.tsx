import GameBoard from "@/components/GameBoard";
import PeersList from "@/components/PeersList";
import dynamic from "next/dynamic";

const Room = dynamic(() => import("@/components/Room"), { ssr: false });

export default function Game({
    searchParams,
  }: {
    searchParams: { [key: string]: string | string[] | undefined }
  }) {
    const gameId = searchParams.gameId as string;

    if (!gameId) return (<div>Invalid Game ID</div>);
  
  return (
    <>
      <Room gameId={gameId}>
          <PeersList />
          <GameBoard />
      </Room>
    </>
  );
}
