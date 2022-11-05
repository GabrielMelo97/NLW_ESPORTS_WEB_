import { useEffect, useState } from 'react'
import { GameBanner } from './components/GameBanner'
import { CreateAdBanner } from './components/CreateAdBanner'
import * as Dialog from '@radix-ui/react-dialog'

import './styles/main.css'
import Logo from './assets/Logo.svg'
import { CreateAdModal } from './components/CreateAdModal'
import axios from 'axios';


interface GameProps {
  id: string;
  bannerUrl: string;
  title: string
  _count: {
    ads: number;
  }
}

function App() {
  const [games, setGames] = useState<GameProps[]>([]);

  useEffect(() => {
    axios('http://localhost:3333/games').then(response => {
      setGames(response.data)
    })
  },[])

  return (
    <div className='max-w-[1344px] m-auto flex items-center flex-col my-20 px-6'>
      <img src={Logo} className="w-[60%] sm:w-[40%] md:w-auto" />

      <h1 className='text-white text-2xl sm:text-4xl md:text-6xl font-black mt-20'>
        Seu <span className='text-transparent bg-nlw-gradient bg-clip-text'>duo</span> está aqui.
      </h1>

      <div>
        <div className='grid pb-6 grid grid-cols-[_repeat_(_auto-fill_,minmax(_160px,_1fr))] grid-flow-col max-w-[95vw] xl:p-0 xl:grid-cols-6  overflow-auto gap-6 mt-16 '>
          {games.map((game) => (
            <GameBanner 
              key={game.id}
              bannerUrl={game.bannerUrl} 
              title={game.title} 
              adsCount={game._count.ads} 
            />
          ))}
        </div>

        <Dialog.Root>
          <CreateAdBanner />
          <CreateAdModal />
        </Dialog.Root>
      </div>
    </div>
  )
}

export default App
