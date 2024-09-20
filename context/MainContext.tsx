"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import {contractAdds} from "@/utils/contractAdds"
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import abi from "@/utils/abis/tokenABI"

type GlobalContextType = {
  tryan: number | 0;
  setTryan: Dispatch<SetStateAction<number | 0>>
}

const GlobalContext = createContext<GlobalContextType>({
  tryan: 0,
  setTryan:() => {}
});


export const GlobalContextProvider = ({ children }:{children:ReactNode}) => {
  const [tryan, setTryan] = useState<number>(0);

  const {address} = useAccount()

  async function getTryan() {
    try {
        //@ts-ignore
            const add = contractAdds.tryanToken;
            
            //@ts-ignore
            const provider = new ethers.getDefaultProvider("https://polygon-mainnet.infura.io/v3/572a699984034c5bb63ebdc9dafa15d1");;
            console.log(add);
            //@ts-ignore
            const contract = new ethers.Contract(add, abi, provider);
            const tokens = Number(ethers.utils.formatEther(await contract.balanceOf(address)));
            console.log(tokens);

            setTryan(tokens);
    }
    catch (err) {
        console.error(err);
    }
}

    useEffect(()=>{
      if(address)
        getTryan()
    }, [address])

  return (
    <GlobalContext.Provider value={{ tryan, setTryan}}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
