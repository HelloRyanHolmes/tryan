"use client"

import { Navbar } from "@/components/Navbar";
import { WalletConnectButton } from "@/components/walletConnectButton";
import Image from "next/image";
import { useEffect, useState } from "react";
import { contractAdds } from "@/utils/contractAdds";
import abi from "@/utils/abis/nftABI"
import { ethers } from "ethers";
import erc20abi from "@/utils/abis/tokenABI"
//@ts-ignore
import polyLogo from "@/assets/polygon-matic-logo.png"
import { IoIosArrowBack, IoMdArrowBack } from "react-icons/io";
import { RiLoader5Fill } from "react-icons/ri";
import { useAccount } from "wagmi";
//@ts-ignore
import tryanhead from "@/assets/TRYAN_head.png"
import { Background } from "@/components/Background";

export default function Home() {
  const [amount, setAmount] = useState<number>(1);
  const [amountBoxShow, setAmountBoxShow] = useState<boolean>(false);

  const [tryanCost, setTryanCost] = useState<number>(0);
  const [polCost, setPolCost] = useState<number>(0)
  const [holding, setHolding] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false);

  const{address} = useAccount();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2024-11-22T10:12:00-05:00'); // EST is UTC-5

    const calculateTimeLeft = () => {
      const now = new Date();
      // @ts-ignore
      const difference = targetDate - now;

      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      };
    };

    // Update immediately
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      const timeLeft = calculateTimeLeft();
      setTimeLeft(timeLeft);

      // Clear interval when target date is reached
      if (Object.values(timeLeft).every(value => value === 0)) {
        clearInterval(timer);
      }
    }, 1000);

    // Cleanup on unmount
    return () => clearInterval(timer);
  }, []);

  async function fetchDetails(){
    try{
      const contract = await contractSetup();
      setTryanCost(Number(ethers.utils.formatEther(await contract?.tryanCost())));
      setPolCost(Number(ethers.utils.formatEther(await contract?.polCost())));
      setHolding(Number(await contract?.balanceOf(address)));
    }
    catch(err){
      console.log(err);
    }
  }

  useEffect(()=>{
    fetchDetails()
  },[address])

  async function contractSetup() {
    try {
        //@ts-ignore
        if (typeof window.ethereum !== 'undefined') {

            //@ts-ignore
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const add = contractAdds.tryanCollection;

            //@ts-ignore
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            //@ts-ignore
            const contract = new ethers.Contract(add, abi, signer);
            return contract;

        }

    }
    catch (err) {
        console.error(err);
    }
}

async function setERC20() {

  // @ts-ignore
  if (typeof window.ethereum !== 'undefined') {

    //@ts-ignore
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    //@ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

  try {
    const contract = new ethers.Contract(contractAdds.tryanToken, erc20abi, signer);
    return contract;
  }
  catch (err) {
    console.log(err);
  }
}
}



async function approval() {

  try {
    setLoading(true);
    const contract = await setERC20();

    const shit = await contract?.allowance(address, contractAdds.tryanCollection);

    if(Number(ethers.utils.formatEther(String(shit)))<tryanCost*amount){
      const approve = await contract?.approve(contractAdds.tryanCollection, ethers.utils.parseEther(String(tryanCost*amount)));
      approve.wait().then((res:any) => {
        mint("tryan");
      });

    }

    else{
      mint("tryan");
    }



  }
  catch (err) {
    console.log(err);
    setLoading(false);
  }

}

async function mint(type:string) {
  try{
    if(amount > 0){
      const contract = await contractSetup();
      setLoading(true);

      if(type === "tryan"){
        const txn = await contract?.mintTryan(amount);
        await txn.wait().then((res:any)=>{
          setLoading(false);
        })
      }

      if(type === "matic"){
        const txn = await contract?.mintPol( amount, {value: ethers.utils.parseEther(String(polCost*amount))});
        await txn.wait().then((res:any)=>{
          setLoading(false);
        })
      }

      window.location.reload()

    }

  }
    catch(err){
      console.log(err);
      setLoading(false);

    }
    
}

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Navbar/>
      <Background/>
      <div className="fixed z-50 bottom-0 bg-[#fcdc0f] shadow-xl shadow-black/20 rounded-t-xl border-x-4 border-t-4 px-6 pb-6 pt-2 border-black">
          <h2 className="text-center text-black">Reveals in:</h2>
        <div className="grid grid-cols-4 gap-4 text-center text-black">
            <div className="flex flex-col">
              <span className="text-4xl font-bold">{timeLeft.days}</span>
              <span className="text-sm">Days</span>
            </div>
            <div className="flex flex-col">
              <span className="text-4xl font-bold">{timeLeft.hours}</span>
              <span className="text-sm">Hours</span>
            </div>
            <div className="flex flex-col">
              <span className="text-4xl font-bold">{timeLeft.minutes}</span>
              <span className="text-sm">Minutes</span>
            </div>
            <div className="flex flex-col">
              <span className="text-4xl font-bold">{timeLeft.seconds}</span>
              <span className="text-sm">Seconds</span>
            </div>
          </div>
      </div>
                <div className="bg-yellow-400 z-10 border-2 pointer-events-auto border-black rounded-2xl w-80 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-2xl shadow-black">
                    <div className="relative flex flex-col items-center justify-center w-full h-full p-2 pt-10">                        
                        <div className="grid grid-flow-col grid-cols-3 items-center gap-5">
                            <button onClick={()=>{if(amount > 0){setAmount((prev)=>(prev-1))}}} className="hover:scale-125 text-black text-5xl duration-200">
                              <IoIosArrowBack className=""/>
                            </button>
                            <div className="text-[2.5rem] text-center text-black">{amount}</div>
                            <button onClick={()=>{if(amount+holding<5)setAmount((prev)=>(prev+1))}} className="hover:scale-125 rotate-180 text-black text-5xl duration-200">
                              <IoIosArrowBack/>
                            </button>
                        </div>
                        {loading ? <RiLoader5Fill className="text-3xl animate-spin text-black h-20" /> :<div className="flex gap-2 w-full">
                          <button onClick={()=>{approval()}} className='w-1/2 text-white mt-5 group p-2 rounded-xl gap-4 flex items-center justify-center bg-purple-700 duration-200 hover:-translate-y-1 hover:brightness-110'><div className=" w-[25%]"><Image src={tryanhead} alt="polyLogo" className="w-8 mx-auto"/></div><div className="w-[75%] flex flex-col items-center justify-center"><h3 className="text-lg">Mint</h3><h3 className="text-[0.7rem]">{(tryanCost*amount).toLocaleString()} $TRYAN</h3></div></button>
                          <button onClick={()=>{mint("matic")}} className='w-1/2 mt-5 group p-2 rounded-xl gap-4 flex items-center justify-center bg-white text-purple-600 duration-200 hover:-translate-y-1 hover:brightness-110'><div className="w-[25%]"><Image src={polyLogo} alt="polyLogo" className="w-8 mx-auto p-1 "/></div><div className="w-[75%] flex flex-col items-center justify-center"><h3 className="text-lg">Mint</h3><h3 className="text-[0.7rem]">{(polCost*amount).toLocaleString()} $POL</h3></div></button>
                        </div>}
                    </div>
                </div>


    </div>
  );
}
