import React , {useEffect}from 'react'
import HeroSection from '../Components/GamePage/HeroSection';
import GamePreviewSection from '../Components/GamePage/GamePreviewSection';
import MintNftSection from '../Components/GamePage/MintNftSection';
import GameSection from '../Components/GamePage/GameSection';
import RecentGameSection from '../Components/GamePage/recentGameSection';
import { useUserStore } from '../Store/useUserStore';
import { useGameStore } from '../Store/useGameStore';
const GamePage = () => {
  const {user} = useUserStore();

  const { fetchRecentGames } = useGameStore();

   useEffect(() => {
    fetchRecentGames();
   },[])
   
  return (
    <div className='min-h-[640px]'>
      <HeroSection/>
      <GamePreviewSection/>
      <MintNftSection/>
      {
        (user && user.nftMinted) &&<GameSection/>
      }
      <RecentGameSection/>
    </div>
  )
}

export default GamePage