import { useContractWrite, usePrepareContractWrite, erc721ABI,  } from 'wagmi'
import { waitForTransaction } from '@wagmi/core'

type ApproveProps = {};
type TransferProps = {};
type SuccessProps = {};

const DOODLES_ADDRESS = '0xDoodles';
const operator = '0xOperator';
const from = '0xFrom';
const to = '0xTo';
const tokenId = 0;

const useApproveAndSwap = () => {
  const approveDoodleConfig = usePrepareContractWrite({
    address: DOODLES_ADDRESS,
    abi: erc721ABI,
    functionName: 'setApprovalForAll',
    args: [operator, true],
  })  
  const transferDoodleConfig = usePrepareContractWrite({
    address: DOODLES_ADDRESS,
    abi: erc721ABI,
    functionName: 'transferFrom',
    args: [from, to, tokenId],
  })

  const approveDoodle = useContractWrite({ 
    ...approveDoodleConfig.config,
  })
  const transferDoodle = useContractWrite({ 
    ...transferDoodleConfig.config,
  })

  const approveAndSwapSteps = [
    {
      stepElement: (props: ApproveProps) => (
        <ApproveCollection {...props} /> 
      ),
      action: () => approveDoodle.writeAsync(),
    },
    {
      stepElement: (props: TransferProps) => (
        <TransferNft {...props} />
      ),
      action: () => transferDoodle.writeAsync(),
    },
    {
      stepElement: (props: SuccessProps) => (
        <Success {...props} /> 
      ),
    },
  ];

  const approveAndSwap = async () => {
    if (!approveDoodle.writeAsync || !transferDoodle.writeAsync) return
    const approveHash = await approveDoodle.writeAsync()
    await waitForTransaction(approveHash)
    const transferHash = await transferDoodle.writeAsync()
    await waitForTransaction(transferHash)
  }

  return { approveAndSwapSteps, approveAndSwap }
}

export default useApproveAndSwap
