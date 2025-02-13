import { useEffect, useState } from "react";
import {ethers} from "ethers";
import PortfolioManager from "../contract/PortfolioManager.json";
import Education from "../contract/Education.json";
import Experience from "../contract/Experience";
import Projects from "../contract/Projects.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MetaMaskSDK } from "@metamask/sdk-react-native";

const metamask = new MetaMaskSDK();
const PortfolioManagerAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

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
    const [connected, setConnected] = useState(false);
    const [chainId, setChainId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const initializeContracts = async () => {
            setLoading(true);
            try {
                const provider = await metamask.getProvider();

                if (!provider) {
                    throw new Error("MetaMask provider not found") // handles the case where provider is not available
                }

                const web3Provider = new ethers.providers.web3Provider(provider);
                const signer = web3Provider.getSigner();
                const address = await signer.getAddress();
                setAccount(address);

                const network = await web3Provider.getNetwork();
                setChainId(network.chainId);
                setConnected(true);

                // contract instantiation
                const portfolioManagerInstance = new ethers.Contract(PortfolioManagerAddress, PortfolioManager.abi, signer)
                setPortfolioManagerContract(portfolioManagerInstance);

                const contractAddresses = await portfolioManagerInstance.getContractAddresses();

                const educationInstance = new ethers.Contract(
                    contractAddresses.education,
                    Education.abi,
                    signer
                )
                setEducationContract(educationInstance);

                const projectInstance = new ethers.Contract(contractAddresses.Projects, Projects.abi, signer);
                setProjectContract(projectInstance);

                const experienceInstance = new ethers.Contract(contractAddresses.experience, Experience.abi, signer);
                setExperienceContract(experienceInstance);

                // Fetch Data (Important: Do this after contract Intantiation)
                const educationData = await educationInstance.allEducationDetails();
                setEducationDetails(educationData);

                const projectData = await projectInstance.allProjectDetails();
                setProjectDetails(projectData);

                const experienceData = await experienceInstance.allExperienceDetails();
                setExperienceDetails(experienceData);

                const portfolioManagerData = await portfolioManagerInstance.getPortfolioDetails(address);
                setPortfolioManagerDetails(portfolioManagerData);
            } catch (error) {
                console.error("Error initializing contracts:", error);
                setError(error.message);
                setConnected(false);
            } finally {
                setLoading(false);
            }
        };
        initializeContracts();
    });

    return {
        portfolioManagerContract,
        educationContract,
        projectContract,
        experienceContract,
        portfolioManagerDetails,
        educationDetails,
        projectDetails,
        account,
        connected,
        chainId,
        loading,
        error
    };
};