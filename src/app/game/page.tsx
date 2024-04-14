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
        <main className="flex min-h-screen flex-col items-center p-4">
            <Room gameId={gameId}>
                <PeersList />
                <GameBoard />
            </Room>
        </main>
    );
}
