import React, { useState, ChangeEvent } from "react";
import { useDebounce } from 'use-debounce';
import { useAccount, usePrepareContractWrite, useContractRead, usePrepareSendTransaction, useSendTransaction, useWaitForTransaction, useContractWrite } from 'wagmi';
import { parseUnits } from 'viem';
import tokenABI from "../abis/tokenABI.json";
const ApproveAndMint = () => {

    // required constants 
    const mintPrice = "1000000000";
    const wTAOAddress = '0x77E06c9eCCf2E797fd462A92B6D7642EF85b0A44';
    const nftAddress = '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2';

    // get account 
    const { address: userAddress, isConnecting, isDisconnected } = useAccount();

    // handle Query
    const [inputValue, setInputValue] = useState("");
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
        setIsButtonEnabled(e.target.value.trim() !== "");
    };

    // handle approvals
    const [isApproved, setIsApproved] = React.useState(false);

    const { data: erc20Allowance } = useContractRead({
        address: wTAOAddress,
        abi: tokenABI,
        functionName: 'allowance',
        watch: true,
        args: [userAddress, nftAddress],
    });



    // handle contract reads 
    const { config: mintConfig } = usePrepareContractWrite({
        address: nftAddress,
        abi: [
            {
                name: 'mint',
                type: 'function',
                stateMutability: 'nonpayable',
                inputs: [],
                outputs: [],
            },
        ],
        functionName: 'mint',
    });

    const { config: approveConfig } = usePrepareContractWrite({
        address: wTAOAddress,
        abi: tokenABI,
        functionName: 'approve',
        args: [nftAddress, mintPrice],
    });

    const { data: approveData, write: writeApprove } = useContractWrite(approveConfig);

    const { data: mintData, write: writeMint } = useContractWrite(mintConfig);


    const { isLoading: approveIsLoading, isSuccess: approveIsSuccess } = useWaitForTransaction({
        hash: approveData?.hash,
    })

    const { isLoading: mintIsLoading, isSuccess: mintIsSuccess } = useWaitForTransaction({
        hash: mintData?.hash,
    });

    const handleApprove = () => {
        let allowance = erc20Allowance as bigint;
        console.log(allowance);
        console.log(writeApprove);
        writeApprove?.();
        if (allowance > parseInt(mintPrice)) {
            setIsApproved(true);
        } 

    }


    const handleButton = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (isDisconnected) {
            return;
        }

        if (!isButtonEnabled) {
            return;
        }

        if (!isApproved) {
            console.log("do we even make it here");
            handleApprove();
        }
    }

    const buttonClass = `inline-flex items-center py-2.5 px-4 font-rounded 
                        font-bold text-center text-white rounded-lg
                        ${isDisconnected || !isButtonEnabled ? "bg-gray-400" : "bg-blue hover:bg-green-400  focus:ring-4 focus:ring-fuchsia-300"}`; 
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
                        {!isDisconnected ? (isButtonEnabled ? (isApproved ? 'Query and Mint' : 'Approve wTAO') : 'Enter Prompt') : 'Connect Wallet'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ApproveAndMint;

