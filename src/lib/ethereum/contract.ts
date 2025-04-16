
import { ethers } from 'ethers';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './abi';
import { createMockContract } from './utils/mockData';

export const getVotingContract = async (withSigner = false) => {
  try {
    const { ethereum } = window as any;
    
    if (!ethereum) {
      throw new Error("MetaMask is not installed");
    }
    
    const provider = new ethers.providers.Web3Provider(ethereum);
    
    if (withSigner) {
      const signer = provider.getSigner();
      return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    }
    
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
  } catch (error) {
    console.error("Error getting contract instance:", error);
    return createMockContract();
  }
};
