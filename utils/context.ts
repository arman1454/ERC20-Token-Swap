import { BigNumber, ethers } from "ethers";
import { contract, tokenContract } from "./contract";
import { toEth } from "./utils";

export async function swapEthToToken(tokenName: string, amount: string): Promise<any> {
    try {
        let tx = { value: toWei(amount) };
        const contractObj = await contract();
        if (!contractObj) return "Contract not available";
        const data = await contractObj.swapEthToToken(tokenName, tx);
        const receipt = await data.wait();
        return receipt;
    } catch (error: any) {
        return parseErrorMsg(error);
    }
}

export async function hasValidAllowance(owner: string, tokenName: string, amount: string): Promise<boolean | string> {
    try {
        const contractObj = await contract();
        if (!contractObj) return false;
        const address = await contractObj.getTokenAddress(tokenName);
        const tokenContractObj = await tokenContract(address);
        if (!tokenContractObj) return false;
        const data = await tokenContractObj.allowance(
            owner,
            "0x71Af1e641214A125DF79714e0758394d4C3FbBf1"
        );
        const result = BigNumber.from(data.toString()).gte(
            BigNumber.from(toWei(amount))
        );
        return result;
    } catch (error: any) {
        return parseErrorMsg(error);
    }
}

export async function swapTokenToEth(tokenName: string, amount: string): Promise<any> {
    try {
        const contractObj = await contract();
        if (!contractObj) return "Contract not available";
        const data = await contractObj.swapTokenToEth(tokenName, toWei(amount));
        const receipt = await data.wait();
        return receipt;
    } catch (error: any) {
        return parseErrorMsg(error);
    }
}

export async function swapTokenToToken(srcToken: string, destToken: string, amount: string): Promise<any> {
    try {
        const contractObj = await contract();
        if (!contractObj) return "Contract not available";
        const data = await contractObj.swapTokenToToken(
            srcToken,
            destToken,
            toWei(amount)
        );
        const receipt = await data.wait();
        return receipt;
    } catch (error: any) {
        return parseErrorMsg(error);
    }
}

export async function getTokenBalance(tokenName: string, address: string): Promise<BigNumber | string> {
    const contractObj = await contract();
    if (!contractObj) return "Contract not available";
    const balance = await contractObj.getBalance(tokenName, address);
    return BigNumber.from(balance);
}

export async function getTokenAddress(tokenName: string): Promise<string | string> {
    try {
        const contractObj = await contract();
        if (!contractObj) return "Contract not available";
        const address = await contractObj.getTokenAddress(tokenName);
        return address;
    } catch (error: any) {
        return parseErrorMsg(error);
    }
}

export async function increaseAllowance(tokenName: string, amount: string): Promise<any> {
    try {
        const contractObj = await contract();
        if (!contractObj) return "Contract not available";
        const address = await contractObj.getTokenAddress(tokenName);
        const tokenContractObj = await tokenContract(address);
        if (!tokenContractObj) return "Token contract not available";
        const data = await tokenContractObj.approve(
            "0x71Af1e641214A125DF79714e0758394d4C3FbBf1",
            toWei(amount)
        );
        const receipt = await data.wait();
        return receipt;
    } catch (error: any) {
        return parseErrorMsg(error);
    }
}

export async function getAllHistory(): Promise<any[] | string> {
    try {
        const contractObj = await contract();
        if (!contractObj) return "Contract not available";
        const getAllHistory = await contractObj.getAllHistory();
        const historyTransaction = getAllHistory.map((history: any, i: number) => ({
            historyId: history.historyId.toNumber(),
            tokenA: history.tokenA,
            tokenB: history.tokenB,
            inputValue: toEth(history?.inputValue),
            outputValue: toEth(history?.outputValue),
            userAddress: history.userAddress,
        }));
        return historyTransaction;
    } catch (error: any) {
        return parseErrorMsg(error);
    }
}

function toWei(amount: string): string {
    const toWei = ethers.utils.parseUnits(amount.toString());
    return toWei.toString();
}

function parseErrorMsg(e: any): string {
    const json = JSON.parse(JSON.stringify(e));
    return json?.reason || json?.error?.message;
}