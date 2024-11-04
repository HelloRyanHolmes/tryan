import React from 'react'
import { WalletConnectButton } from './walletConnectButton'
import telegramDown from "@/assets/Telegram_Button_Down.png"
import telegramUp from "@/assets/Telegram_Button_Up.png"
import websiteDown from "@/assets/Website_Button_Down.png"
import websiteUp from "@/assets/Website_Button_Up.png"
import Image from 'next/image'
import buildUp from "@/assets/Build_Button_Up.png";
import buildDown from "@/assets/Build_Button_down.png";

export const Navbar = () => {
  return (
    <div className='w-screen h-20 fixed top-0 left-0 flex max-md:flex-col-reverse max-md:gap-4 max-md:mt-10 items-center justify-center p-4 z-[100]'>
        <div className='md:w-[60%] flex items-center gap-2'>
            <a href='https://t.me/RichOrDieTRYAN' target='_blank' className='group w-20'><Image src={telegramUp} alt='teleUp' className='group-hover:hidden' /><Image src={telegramDown} alt='teleDown' className='hidden group-hover:flex' /></a>
            <a href='https://www.richordietryan.club/' target='_blank' className='group w-20'><Image src={websiteUp} alt='webUp' className='group-hover:hidden' /><Image src={websiteDown} alt='webDown' className='hidden group-hover:flex' /></a>
            <a className='group grayscale w-20'><Image src={buildUp} alt='webUp' className='group-hover:hidden' /><Image src={buildDown} alt='webDown' className='hidden group-hover:flex' /></a>
        </div>
        <div className='md:w-[40%] flex justify-end items-center'>
            <WalletConnectButton/>
        </div>
    </div>
  )
}
