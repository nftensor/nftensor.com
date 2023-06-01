import React, { useState, ChangeEvent, useEffect } from "react";
import { useDebounce } from 'use-debounce';
import { useAccount, usePrepareContractWrite, useContractRead, usePrepareSendTransaction, useSendTransaction, useWaitForTransaction, useContractWrite } from 'wagmi';
import { parseUnits } from 'viem';
import tokenABI from "../abis/tokenABI.json";
const ApproveAndMint = () => {

    // required constants 
    const mintPrice = "1000000000";
    // real address 
    // const wTAOAddress = '0x77E06c9eCCf2E797fd462A92B6D7642EF85b0A44';
    const wTAOAddress = '0x59C4e2c6a6dC27c259D6d067a039c831e1ff4947'; // test wTAO Address

    // test NFTensor address
    const nftAddress = '0x9D3DA37d36BB0B825CD319ed129c2872b893f538';

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

    // react hook to execute approve transaction
    const { data: approveData, write: writeApprove } = useContractWrite(approveConfig);

    // react hook to execute mint transaction
    const { data: mintData, write: writeMint } = useContractWrite(mintConfig);

    // react hook to wait for approve transaction to complete
    const { isLoading: mintIsLoading, isSuccess: mintIsSuccess } = useWaitForTransaction({
        hash: mintData?.hash,
    });

    // function to check if user has approved NFTensor to spend at least the mint price in tao
    const checkIsApproved = () => {
        const allowance = erc20Allowance as bigint;
        if (allowance >= parseInt(mintPrice)) {
            setIsApproved(true);
        }
    }

    // react hook to wait for mint transaction to complete
    const {isLoading, isSuccess } = useWaitForTransaction({
        hash: approveData?.hash,
    })

    //   const handleApprove = async () => {
    //       let allowance = erc20Allowance as bigint;
    //       console.log(allowance);
    //       const receipt = writeApprove?.();
    //       const { data, isError, isLoading } = useWaitForTransaction({
    //           hash: writeApprove.data?.hash,
    //       });

    //       console.log(receipt);
    //       allowance = erc20Allowance as bigint;
    //       console.log(allowance);
    //       if (allowance >= parseInt(mintPrice)) {
    //           console.log("hello");
    //           setIsApproved(true);
    //           setButtonString("Query and Mint");
    //           console.log(isApproved);
    //       }

    //   }

    const handleMint = async () => {
        writeMint?.();
    }

    // define button default text
    const [buttonString, setButtonString] = React.useState('Approve');

    const buttonClass = `inline-flex items-center py-2.5 px-4 font-rounded 
                        font-bold text-center text-white rounded-lg
                        ${isDisconnected || !isButtonEnabled ? "bg-gray-400" : "bg-blue hover:bg-green-400  focus:ring-4 focus:ring-fuchsia-300"}`;

    const handleButton = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (isDisconnected) {
            return;
        }

        if (!isButtonEnabled) {
            return;
        }

        if (!isApproved) {
            writeApprove?.();
        }

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
                        {!isDisconnected ? (isButtonEnabled ? ( !isSuccess ? "Approve" : "Query and Mint" ) : 'Enter Prompt') : 'Connect Wallet'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ApproveAndMint;

