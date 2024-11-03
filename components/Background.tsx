import React from 'react'
import bg from "@/assets/bg.png"
import Image from 'next/image'
import pcbg from "@/assets/minting_dapp_bg.png"

export const Background = () => {
  return (
    <div className='h-screen w-screen fixed top-0 left-0 '>
        <Image src={bg} alt='bg' className='object-cover h-screen md:hidden ' />
        <Image src={pcbg} alt='bg' className='object-cover h-screen max-md:hidden ' />
    </div>
  )
}
