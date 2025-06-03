import { ethers } from 'ethers';

//for internal formating
export function toWei(amount: string, decimals: number = 18): string {
    const toWei = ethers.utils.parseUnits(amount, decimals);
    return toWei.toString();
}

//for external displaying
export function toEth(amount: string, decimals: number = 18): string {
    const toEth = ethers.utils.formatUnits(amount, decimals);
    return toEth.toString();
}