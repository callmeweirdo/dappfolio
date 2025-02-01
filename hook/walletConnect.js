import { useState, useEffect } from "react";
import { ethers } from "ethers";
import PortfolioManager from "../contract/PortfolioManager.json";
import Education from "../contract/Education.json";
import Projects from "../contract/Projects.json";
import Experience from "../contract/Experience.json";
import { connectWallet, disconnectWallet, connector } from "./walletConnect"; 

const portfolioManagerAddress = "0xYourContractAddress"; // Replace with actual contract address

export const useContracts = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [portfolioManagerContract, setPortfolioManagerContract] = useState(null);
  const [educationContract, setEducationContract] = useState(null);
  const [projectContract, setProjectContract] = useState(null);
  const [experienceContract, setExperienceContract] = useState(null);

  const portfolioManagerABI = PortfolioManager.abi;
  const educationABI = Education.abi;
  const projectABI = Projects.abi;
  const experienceABI = Experience.abi;

  // 🟢 Function to connect the wallet and set up provider & signer
  const setupProvider = async () => {
    try {
      let providerInstance;
      let signerInstance;
      let walletAddr;

      if (connector && connector.connected) {
        walletAddr = await connectWallet(); // Fetch wallet address
        providerInstance = new ethers.BrowserProvider(connector); // WalletConnect provider
        signerInstance = await providerInstance.getSigner();
      } else {
        providerInstance = new ethers.JsonRpcProvider("http://localhost:8545"); // Local Hardhat network
        signerInstance = providerInstance.getSigner();
        walletAddr = await signerInstance.getAddress();
      }

      setProvider(providerInstance);
      setSigner(signerInstance);
      setWalletAddress(walletAddr);
      return signerInstance;
    } catch (error) {
      console.error("Error setting up provider:", error);
    }
  };

  useEffect(() => {
    const initializeContracts = async () => {
      const signerInstance = await setupProvider();

      if (!signerInstance) {
        console.error("Signer is not available!");
        return;
      }

      if (!ethers.isAddress(portfolioManagerAddress)) {
        console.error("Invalid Portfolio Manager contract address:", portfolioManagerAddress);
        return;
      }

      const portfolioManagerInstance = new ethers.Contract(
        portfolioManagerAddress,
        portfolioManagerABI,
        signerInstance
      );
      setPortfolioManagerContract(portfolioManagerInstance);

      try {
        const contractAddresses = await portfolioManagerInstance.getContractsAddress();

        const educationInstance = new ethers.Contract(contractAddresses[0], educationABI, signerInstance);
        setEducationContract(educationInstance);

        const projectInstance = new ethers.Contract(contractAddresses[1], projectABI, signerInstance);
        setProjectContract(projectInstance);

        const experienceInstance = new ethers.Contract(contractAddresses[2], experienceABI, signerInstance);
        setExperienceContract(experienceInstance);
      } catch (error) {
        console.error("Error fetching sub-contracts:", error);
      }
    };

    initializeContracts();
  }, []);

  return {
    provider,
    signer,
    walletAddress,
    portfolioManagerContract,
    educationContract,
    projectContract,
    experienceContract,
    connectWallet,
    disconnectWallet,
  };
};
