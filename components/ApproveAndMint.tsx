import React, { useState, ChangeEvent, useEffect } from "react";
import { useAccount, usePrepareContractWrite, useContractRead, useWaitForTransaction, useContractWrite } from 'wagmi';
import tokenABI from "../abis/tokenABI.json";
import nftABI from "../abis/nftABI.json";

// required constants
const mintPrice = "1000000000";

// wTAO Address
const wTAOAddress = '0x148D80Cd7047c941bD28092a4005DbeC843b5c02';

// NFTensor address
const nftAddress = '0xC3da50e6c7dA5d5E17564B21885A20919B75470e';

const ApproveAndMint = () => {

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

    // state variable to see if minting is possible
    const [isMintingOpen, setIsMintingOpen] = React.useState(true);

    // react hook to read user allowance
    const { data: erc20Allowance } = useContractRead({
        address: wTAOAddress,
        abi: tokenABI,
        functionName: 'allowance',
        watch: true,
        args: [userAddress, nftAddress],
    });

    const { data: isMintWindowClosed } = useContractRead({
        address: nftAddress,
        abi: nftABI,
        functionName: 'isMintingPeriodOver',
        watch: true,
    });

    const { data: tokenCount } = useContractRead({
        address: nftAddress,
        abi: nftABI,
        functionName: 'tokenID',
        watch: true,
    });


    // react hook to prepare approve transaction
    const { config: approveConfig, error: approveConfigError, isError: isApproveConfigError } = usePrepareContractWrite({
        address: wTAOAddress,
        abi: tokenABI,
        functionName: 'approve',
        args: [nftAddress, mintPrice],
    });

    // react hook to prepare mint transaction
    const { config: mintConfig, error: mintConfigError, isError: isMintConfigError } = usePrepareContractWrite({
        address: nftAddress,
        abi: nftABI,
        functionName: 'mint',
        args: [inputValue],
        enabled: Boolean(isApproved),
    });


    // react hook to execute approve transaction
    const { data: approveData, error: approveError, isError: isErrorApprove, write: writeApprove } = useContractWrite(approveConfig);

    // react hook to execute mint transaction
    const { data: mintData, error: mintError, isError: isErrorMint, write: writeMint } = useContractWrite(mintConfig);

    // react hook to wait for approve transaction to complete
    const { isLoading: approveIsLoading } = useWaitForTransaction({
        hash: approveData?.hash,
    })
    // react hook to wait for mint transaction
    const { isLoading: mintIsLoading, isSuccess: mintIsSuccess } = useWaitForTransaction({
        hash: mintData?.hash,
    });


    // react use effect hooks for updating state vars
    useEffect(() => {
        if (erc20Allowance && mintPrice) {
            const allowance = erc20Allowance as bigint;
            if (allowance >= parseInt(mintPrice)) {
                setIsApproved(true);
            } else {
                setIsApproved(false);  // Ensures that isApproved is set to false when the condition isn't met
            }
        }
    }, [erc20Allowance, mintPrice]);

    useEffect(() => {
        const numNFTs = tokenCount as bigint;
        if (isMintWindowClosed || numNFTs >= 500) {
            setIsMintingOpen(false);
        } else {
            setIsMintingOpen(true);
        }
    }, [isMintWindowClosed, tokenCount]);


    // logic for buton
    const buttonClass = `inline-flex items-center py-2.5 px-4 font-rounded
                        font-bold text-center text-white rounded-lg
                        ${isDisconnected || !isButtonEnabled || approveIsLoading || mintIsLoading || !isMintingOpen ? "bg-gray-400" : "bg-blue hover:bg-green-400  focus:ring-4 focus:ring-fuchsia-300"}`;


    const handleButton = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        if (isDisconnected || !isButtonEnabled) {
            return;
        }
        if (!isApproved) {

            writeApprove?.();

            mintConfig;

            if (isErrorApprove || isApproveConfigError) {

                console.log({ "approve config error": approveConfigError });
                console.log({ "approve error": approveError });
            }
            return;
        }

        writeMint?.();

        if (isErrorMint || isMintConfigError) {
            console.log({ "mint config error": mintConfigError });
            console.log({ "mint error": mintError });
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
                        className="w-full px-8 py-6 text-xl focus:shadow-soft-primary-outline appearance-none rounded-lg border-2 border-solid"
                        placeholder="What is the capital of Mongolia?"
                        value={inputValue}
                        onChange={handleInputChange}
                    ></textarea>
                </div>
                <div className="flex items-center justify-between px-3 py-2 border-t space-x-5">
                    <div className="flex items-center">
                        {mintIsSuccess ? <p className="text-green-500 underline">
                            Minted!  <a className="underline" href={`https://etherscan.io/tx/${mintData?.hash}`}> View on Etherscan</a>
                        </p> : null}
                    </div>
                    <button
                        type="submit"
                        className={buttonClass}
                        onClick={handleButton}
                        disabled={!isButtonEnabled && !isDisconnected || approveIsLoading || mintIsLoading || !isMintingOpen}>
                        {isMintingOpen
                            ? !isDisconnected
                                ? isButtonEnabled
                                    ? !approveIsLoading
                                        ? !mintIsLoading
                                            ? isApproved
                                                ? "Query and Mint"
                                                : "Approve"
                                            : "Minting"
                                        : "Waiting for Approval"
                                    : "Enter Prompt"
                                : "Connect Wallet"
                            : "Minting Closed"
                        }
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ApproveAndMint;
