import { useEffect, useState } from "react";
import { ethers } from "ethers";
import PortfolioManager from "../contract/PortfolioManager.json";
import Education from "../contract/Education.json";
import Experience from "../contract/Experience.json"; // Corrected import
import Projects from "../contract/Projects.json";
import { MetaMaskSDK } from "@metamask/sdk-react-native";

const metamask = new MetaMaskSDK();
const PortfolioManagerAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Your contract address

export const useContracts = () => {
    const [portfolioManagerContract, setPortfolioManagerContract] = useState(null);
    const [educationContract, setEducationContract] = useState(null);
    const [projectContract, setProjectContract] = useState(null);
    const [experienceContract, setExperienceContract] = useState(null);

    const [portfolioManagerDetails, setPortfolioManagerDetails] = useState(null); // Corrected initial value
    const [educationDetails, setEducationDetails] = useState([]);
    const [projectDetails, setProjectDetails] = useState([]);
    const [experienceDetails, setExperienceDetails] = useState([]);

    const [account, setAccount] = useState(null);
    const [connected, setConnected] = useState(false);
    const [chainId, setChainId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true; // Flag for mount status

        const initializeContracts = async () => {
            setLoading(true);
            try {
                const provider = await metamask.getProvider();
                if (!provider) {
                    throw new Error("MetaMask provider not found");
                }

                const web3Provider = new ethers.providers.Web3Provider(provider);
                const signer = web3Provider.getSigner();
                const address = await signer.getAddress();

                const network = await web3Provider.getNetwork();
                const chainId = network.chainId;

                // Chain ID Check (Sepolia)
                if (chainId !== 11155111) {
                    try {
                        await provider.request({
                            method: "wallet_switchEthereumChain",
                            params: [{ chainId: "0x11155111" }],
                        });
                    } catch (switchError) {
                        if (switchError.code !== 4902) {
                            throw switchError; // Re-throw if not a user rejection
                        }
                        // Handle user rejection (if needed)
                    }
                }

                if (!isMounted) return; // Check mount status
                setAccount(address);
                setChainId(chainId);
                setConnected(true);

                const portfolioManagerInstance = new ethers.Contract(
                    PortfolioManagerAddress,
                    PortfolioManager.abi,
                    signer
                );
                setPortfolioManagerContract(portfolioManagerInstance);

                const [educationAddress, projectsAddress, experienceAddress] =
                    await portfolioManagerInstance.getContractAddresses();

                const educationInstance = new ethers.Contract(educationAddress, Education.abi, signer);
                setEducationContract(educationInstance);

                const projectInstance = new ethers.Contract(projectsAddress, Projects.abi, signer);
                setProjectContract(projectInstance);

                const experienceInstance = new ethers.Contract(experienceAddress, Experience.abi, signer);
                setExperienceContract(experienceInstance);

                // Fetch Data (after contract instantiation and mount check)
                const educationData = await educationInstance.allEducationDetails();
                if (isMounted) setEducationDetails(educationData);

                const projectData = await projectInstance.allProjectDetails();
                if (isMounted) setProjectDetails(projectData);

                const experienceData = await experienceInstance.allExperienceDetails();
                if (isMounted) setExperienceDetails(experienceData);

                const portfolioManagerData = await portfolioManagerInstance.getPortfolioDetails(address);
                if (isMounted) setPortfolioManagerDetails(portfolioManagerData);

            } catch (error) {
                console.error("Error initializing contracts:", error);
                setError(error.message);
                setConnected(false);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        initializeContracts();

        return () => {
            isMounted = false; // Cleanup: Set mount flag to false
        };
    }, []);

    return {
        portfolioManagerContract,
        educationContract,
        projectContract,
        experienceContract,
        portfolioManagerDetails,
        educationDetails,
        projectDetails,
        experienceDetails,
        account,
        connected,
        chainId,
        loading,
        error,
    };
};