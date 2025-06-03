declare global {
    interface Window {
        ethereum?: any;
    }
}

import { ethers } from "ethers";
import CustomDexABI from "../utils/CustomDex.json";
import CustomTokenABI from "../utils/CustomToken.json";

export const tokenContract = async (address: string): Promise<ethers.Contract | undefined> => {
    const provider = new ethers.providers.Web3Provider(window?.ethereum);
    const { ethereum } = window;

    if (ethereum) {
        const signer = provider.getSigner();
        const contractReader = new ethers.Contract(
            address,
            CustomTokenABI.abi,
            signer
        );
        return contractReader;
    }
    return undefined;
};

export const contract = async (): Promise<ethers.Contract | undefined> => {
    const provider = new ethers.providers.Web3Provider(window?.ethereum);
    const { ethereum } = window;

    if (ethereum) {
        const signer = provider.getSigner();
        const contractReader = new ethers.Contract(
            "0x71Af1e641214A125DF79714e0758394d4C3FbBf1",
            CustomDexABI.abi,
            signer
        );
        return contractReader;
    }
    return undefined;
};