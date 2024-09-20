"use client"

import { Navbar } from "@/components/Navbar";
import { WalletConnectButton } from "@/components/walletConnectButton";
import Image from "next/image";
import { useEffect, useState } from "react";
import { contractAdds } from "@/utils/contractAdds";
import abi from "@/utils/abis/nftABI"
import { ethers } from "ethers";
//@ts-ignore
import polyLogo from "@/assets/polygon-matic-logo.png"
import { IoIosArrowBack, IoMdArrowBack } from "react-icons/io";
import { RiLoader5Fill } from "react-icons/ri";

export default function Home() {
  const [amount, setAmount] = useState<number>(1);
  const [amountBoxShow, setAmountBoxShow] = useState<boolean>(false);

  const [tryanCost, setTryanCost] = useState<number>(0);
  const [polCost, setPolCost] = useState<number>(0)

  const [loading, setLoading] = useState<boolean>(false);

  async function fetchDetails(){
    try{
      const contract = await contractSetup();
      setTryanCost(Number(ethers.utils.formatEther(await contract?.tryanCost())));
      setPolCost(Number(ethers.utils.formatEther(await contract?.polCost())));

      
    }
    catch(err){
      console.log(err);
    }
  }

  useEffect(()=>{
    fetchDetails()
  },[])

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

  async function mint(type:string) {
    try{
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

    }
    catch(err){
      console.log(err);
      setLoading(false);

    }
}

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Navbar/>

      <div onClick={()=>{setAmountBoxShow(true)}} className="w-screen h-screen bg-green-500 fixed top-0 left-0">
      </div>

      {amountBoxShow &&
                <div className="bg-yellow-400 z-10 border-2 pointer-events-auto border-black rounded-2xl w-80 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-2xl shadow-black">
                    <div className="relative flex flex-col items-center justify-center w-full h-full p-2 pt-10">
                        <h2 onClick={() => { setAmountBoxShow(false) }} className="absolute top-0 right-0 cursor-pointer m-2 mx-4 text-black hover:text-red-600 transform hover:scale-125 transition-all duration-200 ease-in-out">x</h2>
                        
                        <div className="grid grid-flow-col grid-cols-3 items-center gap-5">
                            <button onClick={()=>{if(amount > 0){setAmount((prev)=>(prev-1))}}} className="hover:scale-125 text-black text-5xl duration-200">
                              <IoIosArrowBack className=""/>
                            </button>
                            <div className="text-[2.5rem] text-center text-black">{amount}</div>
                            <button onClick={()=>{setAmount((prev)=>(prev+1))}} className="hover:scale-125 rotate-180 text-black text-5xl duration-200">
                              <IoIosArrowBack/>
                            </button>
                        </div>
                        {loading ? <RiLoader5Fill className="text-3xl animate-spin text-black h-20" /> :<div className="flex gap-2 w-full">
                          <button onClick={()=>{mint("matic")}} className='w-1/2 mt-5 group p-2 rounded-xl gap-4 flex items-center justify-center bg-white text-purple-600 duration-200 hover:-translate-y-1 hover:brightness-110'><div className="w-[20%]"><Image src={polyLogo} alt="polyLogo" className="w-6 mx-auto p-1 "/></div><div className="w-[80%] flex flex-col items-center justify-center"><h3 className="text-lg">Mint</h3><h3 className="text-[0.7rem]">{(polCost*amount).toLocaleString()} $POL</h3></div></button>
                          <button onClick={()=>{mint("tryan")}} className='w-1/2 mt-5 group p-2 rounded-xl gap-4 flex items-center justify-center bg-purple-700 duration-200 hover:-translate-y-1 hover:brightness-110'><div className=" w-[20%]"><Image src={polyLogo} alt="polyLogo" className="w-6 mx-auto bg-white rounded-full p-1 "/></div><div className="w-[80%] flex flex-col items-center justify-center"><h3 className="text-lg">Mint</h3><h3 className="text-[0.7rem]">{(tryanCost*amount).toLocaleString()} $TRYAN</h3></div></button>
                        </div>}
                    </div>
                </div>}


    </div>
  );
}
