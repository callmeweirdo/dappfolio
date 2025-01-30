import { useState, useEffect } from "react";
import { ethers } from "ethers";

const useMetaMask = () => {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);

    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    useEffect(() => {
        if (window.ethereum) {
            const newProvider = new ethers.web3Provider(window.ethereum);
            setProvider(newProvider);

            newProvider.send("eth_requestAccounts", []).then(() => {
                setSigner(newProvider.getSigner());
            });

        } else {
            console.log("Meta Mask is not installed");
        }
    }, []);

    return { provider, signer };

}