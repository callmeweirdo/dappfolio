import { useState, useEffect } from "react";
import { ethers } from "ethers";

const useMetaMask = () => {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);

    useEffect(() => {
        if (window.ethereum) {
            const newProvider = new ethers.provider.web3Provider(window.ethereum);
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