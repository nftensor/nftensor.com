import React, { useState, ChangeEvent, useEffect } from "react";
import { useAccount, usePrepareContractWrite, useContractRead, useWaitForTransaction, useContractWrite } from 'wagmi';
import tokenABI from "../abis/tokenABI.json";
import nftABI from "../abis/nftABI.json";

const ApproveAndMint = () => {

    // required constants 
    const mintPrice = "1000000000";
    // real address 
    // const wTAOAddress = '0x77E06c9eCCf2E797fd462A92B6D7642EF85b0A44';
    const wTAOAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'; // test wTAO Address

    // test NFTensor address
    const nftAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

    // get account 
    const { address: userAddress, isDisconnected } = useAccount();

    // create state variable for user query
    const [inputValue, setInputValue] = useState("");

    // create state variable to disable button if no query is provided
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);

    // create a function that executes upon input change to the text area
    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
        setIsButtonEnabled(e.target.value.trim() !== "");
    };

    // state variable to check if user is approved
    const [isApproved, setIsApproved] = React.useState(false);

    // react hook to read user allowance
    const { data: erc20Allowance } = useContractRead({
        address: wTAOAddress,
        abi: tokenABI,
        functionName: 'allowance',
        watch: true,
        args: [userAddress, nftAddress],
    });

    // react hook to prepare approve transaction 
    const { config: approveConfig } = usePrepareContractWrite({
        address: wTAOAddress,
        abi: tokenABI,
        functionName: 'approve',
        args: [nftAddress, mintPrice],
    });

    // react hook to prepare mint transaction 
    const { config: mintConfig } = usePrepareContractWrite({
        address: nftAddress,
        abi: nftABI,
        functionName: 'mint',
        args: [inputValue],
    });

    // react hook to execute approve transaction
    const { data: approveData, write: writeApprove } = useContractWrite(approveConfig);

    // react hook to execute mint transaction
    const { data: mintData, write: writeMint } = useContractWrite(mintConfig);

    useEffect(() => {
        if (erc20Allowance && mintPrice) {
            const allowance = erc20Allowance as bigint;
            console.log(allowance);
            if (allowance >= parseInt(mintPrice)) {
                setIsApproved(true);
            } else {
                setIsApproved(false);  // Ensures that isApproved is set to false when the condition isn't met
            }
        }
    }, [erc20Allowance, mintPrice]);


    // react hook to wait for mint transaction to complete
    const { isLoading: approveIsLoading, isSuccess: approveIsSuccess } = useWaitForTransaction({
        hash: approveData?.hash,
    })

    const { isLoading: mintIsLoading, isSuccess: mintIsSuccess } = useWaitForTransaction({
        hash: mintData?.hash,
    });



    const buttonClass = `inline-flex items-center py-2.5 px-4 font-rounded 
                        font-bold text-center text-white rounded-lg
                        ${isDisconnected || !isButtonEnabled ? "bg-gray-400" : "bg-blue hover:bg-green-400  focus:ring-4 focus:ring-fuchsia-300"}`;

    const handleButton = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (isDisconnected || !isButtonEnabled) {
            return;
        }

        if (!isApproved) {
            writeApprove?.();
            return;
        }

        writeMint?.();

    }




    return (
        <form className="container mx-auto">
            <div className="mb-4 border border-gray-600 rounded-lg h-fit">
                <div className="p-4 bg-white rounded-t-lg">
                    <label className="sr-only">Prompt Bittensor Here!</label>
                    <textarea
                        id="comment"
                        rows={4}
                        className="w-full px-8 py-6 text-xl focus:shadow-soft-primary-outline appearance-none rounded-lg border-2 border-solid border-"
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="flex items-center justify-end px-3 py-2 border-t">
                    <button
                        type="submit"
                        className={buttonClass}
                        onClick={handleButton}
                        disabled={!isButtonEnabled && !isDisconnected}>
                        {!isDisconnected
                            ? isButtonEnabled
                                ? isApproved
                                    ? "Query and Mint"
                                    : "Approve"
                                : "Enter Prompt"
                            : "Connect Wallet"
                        }
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ApproveAndMint;

