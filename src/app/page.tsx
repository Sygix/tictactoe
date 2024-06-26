import GameMenu from "@/components/GameMenu";

export default function Home() {
  
  return (
    <div className="h-full flex flex-1 flex-col justify-center gap-4 items-center">
      <h1>Welcome to TicTacToe</h1>
      <p>Using Peer-to-peer WebRTC and Nosrt Relays for signals</p> 
      <GameMenu />
    </div>
  );
}
