import * as React from 'react';
import { useDebounce } from 'use-debounce';
import { usePrepareContractWrite, usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from 'wagmi';
import { parseEther } from 'viem';
import tokenABI from "../abis/tokenABI.json";
const ApproveAndMint = () => {
    const [to, setTo] = React.useState('')
    const [debouncedTo] = useDebounce(to, 500)

    const [amount, setAmount] = React.useState('')
    const [debouncedAmount] = useDebounce(amount, 500)

    const { config: mintConfig } = usePrepareContractWrite({
        address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
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
        address: '0x77E06c9eCCf2E797fd462A92B6D7642EF85b0A44',
        abi: tokenABI,
        functionName: 'approve',
    });

    const { writeApprove } = useContractWrite(config);

    const { writeMint } = useContractWrite(mintConfig);

    const { config } = usePrepareSendTransaction({
        request: {
            to: debouncedTo,
            value: debouncedAmount ? parseEther(debouncedAmount) : undefined,
        },
    })

    const { data, sendTransaction } = useSendTransaction(config)

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    })




    return (

        <form className="container mx-auto"
            onSubmit={(e) => {
                e.preventDefault()
                sendTransaction?.()
            }}>
            <div className="mb-4 border border-gray-600 rounded-lg h-fit">
                <div className="p-4 bg-white rounded-t-lg">
                    <label className="sr-only">Prompt Bittensor Here!</label>
                    <textarea id="comment" rows="4" className="w-full px-8 py-6 text-xl focus:shadow-soft-primary-outline appearance-none rounded-lg border-2 border-solid border-gray-300 bg-white text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none" placeholder="Prompt Bittensor Here" required></textarea>
                </div>
                <div className="flex items-center justify-end px-3 py-2 border-t">
                    <button type="submit" className="inline-flex items-center py-2.5 px-4 font-rounded font-bold  text-center text-white bg-blue rounded-lg focus:ring-4 focus:ring-fuchsia-300 hover:bg-green-500">
                        {isLoading ? 'Sending...' : 'Send'}
                    </button>

                </div>
            </div>
            <button disabled={!sendTransaction || !to || !amount}>
            </button>
            {
                isSuccess && (
                    <div>
                        Successfully sent {amount} ether to {to}
                        <div>
                            <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
                        </div>
                    </div>
                )
            }
        </form >
    );
};

export default ApproveAndMint;

