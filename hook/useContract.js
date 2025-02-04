import { useEffect, useState } from "react";
import {ethers} from "ethers";
import PortfolioManager from "../contract/PortfolioManager.json";
import Education from "../contract/Education.json";
import Experience from "../contract/Experience";
import Projects from "../contract/Experience.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MetaMaskSDK } from "@metamask/sdk-react-native";

const metamask = new MetaMaskSDK();
const PortfolioManagerAddress = "YOUR_CONTRACT_ADDRESS";

export const useContracts = () => {
    const [portfolioManagerContract, setPortfolioManagerContract] = useState(null);
    const [educationContract, setEducationContract] = useState(null);
    const [projectContract, setProjectContract] = useState(null);
    const [experienceContract, setExperienceContract] = useState(null);

    const [portfolioManagerDetails, setPortfolioManagerDetails] = useState([]);
    const [educationDetails, setEducationDetails] = useState([]);
    const [projectDetails, setProjectDetails] = useState([]);
    const [experienceDetails, setExperienceDetails] = useState([]);

    const [account, setAccount] = useState(null);
    const [connected, setConnected] = useState(null);
    const [chainId, setChainId] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const initializeContracts = async () => {
            try {
                const provider = metamask.getProvider();
                const web3Provider = new ethers.providers.web3Provider(provider);
                const signer = web3Provider.getSigner();
                const address = await signer.getAddress.getAddress();
                setAccount(address);

                const network = await web3Provider.getNetwork();
                setChainId(network.chainId);

            } catch {
            }
        }
    });
}