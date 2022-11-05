import * as Dialog from '@radix-ui/react-dialog'
import * as Checkbox from '@radix-ui/react-checkbox'
import * as ToggleGroup from '@radix-ui/react-toggle-group';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FormEvent, useEffect, useState } from 'react'

import { Check, CircleNotch, GameController } from 'phosphor-react'
import { Input } from './Form/Input'
import axios from 'axios';
import { Loading } from './Loading/Loadind';

interface GameProps {
  id: string;
  title: string;
}

export function CreateAdModal(){
  const [games, setGames] = useState<GameProps[]>([]);
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const [useVoiceChannel, setUseVoiceChannel] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [gameSelected, setGameSelected] = useState<string>('');
  const [nameSelected, setNameSelected] = useState<string>('');
  const [yearsSelected, setYearsSelected] = useState<string>('');
  const [discordSelected, setDiscordSelected] = useState<string>('');
  const [hourStartSelected, setHourStartSelected] = useState<string>('');
  const [hourEndSelected, setHourEndSelected] = useState<string>('');

  useEffect(() => {
    axios('http://localhost:3333/games').then(response => {
      setGames(response.data)
      setLoading(false)
    })
  },[])

  async function handleCreateAd(event: FormEvent){
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData);

    const emptyGame = data.game == null;
    const emptyName = data.name == '';
    const emptyDiscord = data.discord == '';
    const emptyWeekDays = weekDays.length == 0;
    const emptyHourStart = data.hourStart == '';
    const emptyHourEnd = data.hourEnd == '';

    if(emptyGame || emptyName || emptyDiscord || 
    emptyWeekDays || emptyHourStart || emptyHourEnd){

      toast.error('Preencha todos os campos obrigatórios "*"!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

    }else{
      setLoading(true);

      try{
        await axios.post(`http://localhost:3333/games/${data.game}/ads`, {
          name: data.name,
          yearsPlaying: Number(data.yearsPLaying),
          discord: data.discord,
          weekDays: weekDays.map(Number),
          useVoiceChannel: useVoiceChannel,
          hourStart: data.hourStart,
          hourEnd: data.hourEnd,
        })

        toast.success('Anuncio criado com sucesso!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        setGameSelected('');
        setNameSelected('');
        setYearsSelected('');
        setDiscordSelected('');
        setHourStartSelected('');
        setHourEndSelected('');
        setWeekDays([]);
        setUseVoiceChannel(false);

        await axios('http://localhost:3333/games').then(response => {
          console.log(response.data)
          setGames(response.data)
          setLoading(false)
        })

        // setLoading(false);
      }catch (err){
        console.log(err)

        setLoading(false);

        toast.error('Não foi possível criar o anúncio, tente novamente!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        
      }

    }
  }

  return(
    <>
      {loading && <Loading />}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Dialog.Portal>
        <Dialog.Overlay className='bg-black/60 inset-0 fixed'>
          <Dialog.Content className='bg-[#2A2634] text-white fixed p-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[90%] sm:w-[480px] shadow-lg shadow-black/25'>

            <Dialog.Title className='text-3xl font-black'>
              Publique um anúncio
            </Dialog.Title>

            <form onSubmit={handleCreateAd} className='mt-8 flex flex-col gap-4'>
              <div className='flex flex-col gap-2'>
                <label htmlFor="game" className='font-semibold'>Qual o game? *</label>
                <select 
                  id='game'
                  name='game'
                  value={gameSelected}
                  onChange={(e) => setGameSelected(e.target.value)}
                  className='bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500'
                  defaultValue=""
                >
                  <option  hidden disabled value="">Selecione o game que deseja jogar</option>
                { games.map(game => {
                  return <option key={game.id} value={game.id}>{game.title}</option>
                })}
                </select>
              </div>

              <div className='flex flex-col gap-2'>
                <label htmlFor="name">Seu nome (ou nickname) *</label>
                <Input 
                  value={nameSelected}
                  onChange={(e) => setNameSelected(e.target.value)} 
                  type="text" id='name' name='name' 
                  placeholder='Como te chamam dentro do game?' 
                />
              </div>

              <div className='grid sm:grid-cols-2 gap-6'>
                <div  className='flex flex-col gap-2'>
                  <label htmlFor="yearsPLaying">Joga há quantos anos?</label>
                  <Input 
                    value={yearsSelected}
                    onChange={(e) => setYearsSelected(e.target.value)}
                    type="number" id='yearsPLaying' name='yearsPLaying' 
                    placeholder='Tudo bem ser ZERO'
                  />
                </div>

                <div  className='flex flex-col gap-2'>
                  <label htmlFor="discord">Qual seu Discord? *</label>
                  <Input 
                    value={discordSelected}
                    onChange={(e) => setDiscordSelected(e.target.value)}
                    type="text" id='discord' name='discord' 
                    placeholder='Usuario#0000'
                  />
                </div>
              </div>

              <div className='sm:flex gap-6'>
                <div className='flex flex-col gap-2'>
                  <label htmlFor="weekDays">Quando costuma jogar? *</label>
                  <ToggleGroup.Root type='multiple' value={weekDays} onValueChange={setWeekDays} className='grid grid-cols-7 sm:grid-cols-4 gap-2  gap-y-2'>
                    <ToggleGroup.Item value='0' className={`w-8 h-8 rounded  ${weekDays.includes('0')? 'bg-violet-500' : 'bg-zinc-900'}`} title='Domingo'>D</ToggleGroup.Item>
                    <ToggleGroup.Item value='1' className={`w-8 h-8 rounded  ${weekDays.includes('1')? 'bg-violet-500' : 'bg-zinc-900'}`} title='Segunda'>S</ToggleGroup.Item>
                    <ToggleGroup.Item value='2' className={`w-8 h-8 rounded  ${weekDays.includes('2')? 'bg-violet-500' : 'bg-zinc-900'}`} title='Terça'>T</ToggleGroup.Item>
                    <ToggleGroup.Item value='3' className={`w-8 h-8 rounded  ${weekDays.includes('3')? 'bg-violet-500' : 'bg-zinc-900'}`} title='Quarta'>Q</ToggleGroup.Item>
                    <ToggleGroup.Item value='4' className={`w-8 h-8 rounded  ${weekDays.includes('4')? 'bg-violet-500' : 'bg-zinc-900'}`} title='Quinta'>Q</ToggleGroup.Item>
                    <ToggleGroup.Item value='5' className={`w-8 h-8 rounded  ${weekDays.includes('5')? 'bg-violet-500' : 'bg-zinc-900'}`} title='Sexta'>S</ToggleGroup.Item>
                    <ToggleGroup.Item value='6' className={`w-8 h-8 rounded  ${weekDays.includes('6')? 'bg-violet-500' : 'bg-zinc-900'}`} title='Sábado'>S</ToggleGroup.Item>
                  </ToggleGroup.Root>
                </div>
                <div className='flex flex-col flex-1 gap-2'>
                  <label htmlFor="hourStart">Qual horário do dia? *</label>
                  <div className='grid grid-cols-2 gap-2'>
                    <Input 
                      value={hourStartSelected}
                      onChange={(e) => setHourStartSelected(e.target.value)}
                      type="time" name="hourStart" id="hourStart" 
                      placeholder='De'
                    />
                    <Input 
                      value={hourEndSelected}
                      onChange={(e) => setHourEndSelected(e.target.value)}
                      type="time" name="hourEnd" id="hourEnd" 
                      placeholder='Até'
                    />
                  </div>
                </div>
              </div>

              <label className='mt-2 flex gap-2 text-sm items-center'>
                <Checkbox.Root 
                  checked={useVoiceChannel}
                  className='w-6 h-6 p-1 rounded bg-zinc-900'
                  onCheckedChange={(checked) => {
                    if(checked === true){
                      setUseVoiceChannel(true)
                    }else{
                      setUseVoiceChannel(false)
                    }
                  }}
                >
                  <Checkbox.Indicator>
                    <Check className='w-4 h-4 text-emerald-400' />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                Costumo me conectar ao chat de voz
              </label>

              <footer className='mt-4 flex justify-end gap-4'>
                <Dialog.Close 
                  type='button'
                  className='bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600'
                >
                  Cancelar
                </Dialog.Close>
                <button 
                  type="submit" 
                  className='bg-violet-500 flex items-center gap-3 px-5 h-12 rounded-md font-semibold hover:bg-violet-600'
                >
                  <GameController size={24} />
                  Encontrar duo
                </button>
              </footer>
            </form>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </>
  )
}