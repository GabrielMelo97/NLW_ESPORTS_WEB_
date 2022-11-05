interface GameBannerProps {
  bannerUrl: string;
  title: string;
  adsCount: number;
}

export function GameBanner(props: GameBannerProps){
  return(
    <a className='relative overflow-hidden rounded-lg hover:opacity-60 min-w-[160px] first:ml-4 last:mr-4' href="">
      <img src={props.bannerUrl} />

      <div className='w-full pt-16 pb-4 px-4 bg-game-gradient absolute bottom-0 left-0 right-0'>
        <strong className='block font-bold text-white'>{props.title}</strong>
        <span className='block text-zinc-300 text-sm'>{props.adsCount} anúncio(s)</span>
      </div>
    </a>
  )
}