import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import ApproveAndMint from "../components/ApproveAndMint";
const Home: NextPage = () => {
    return (
        <div className="bg-white border min-h-screen">
            <Head>
                <title>0xcacti webby</title>
                <meta
                    content="width=device-width, initial-scale=1.0"
                    name="meow"
                />
                <link href="/favicon.ico" rel="icon" />
            </Head>

            <main>
                <div className="mb-5">
                    <div className="container flex justify-between  py-8 mx-auto">
                        <Link href="/">
                            <a className="text-xl font-bold text-black md:text-2xl hover:text-red">
                                NFTensor
                            </a>
                        </Link>
                        <ConnectButton />

                    </div>
                </div>
                <ApproveAndMint />
                <div className="container mx-auto mt-10 flex flex-col space-y-2">
                    <h1 className="text-2xl">What is NFTensor?</h1>
                    <p>
                        NFTensor is a fun experiment in for creating NFTs out of responses to queries provided by the Bittensor prompting network.
                        Essentially, make any query you want and see the Bittensor network's response immortalized forever as an NFT. The NFT will
                        only capture the first sentence of the provided response, so make it count!
                    </p>
                    <h1 className="text-2xl">How It Works</h1>
                    <p>
                        When you submit your query, it will be stored forever in the NFTensor NFT contract. Because this data is stored on Ethereum
                        longer queries will cost larger amounts of gas.  Keep your query concise for cheaper minting costs.
                        Asynchronously, an NFTensor python service will read these queries, prompt the Bittensor,
                        and generate the response image. This image is then uploaded to IPFS, and the NFT JSON Metadata is posted at NFTensor.com/images/
                        during the minting period. At the end of the minting period all json metadata is uploaded to IPFS.
                    </p>
                    <h1 className="text-2xl">How to Mint</h1>
                    <p>
                        First, connect your wallet to NFTensor.com. Approve the NFTensor contract to spend at least 1 of your wTAO.
                        Next, enter your query in the text box and click "Query and Mint". Congratualtions you have minted your NFT!
                        Remember, the longer the query the greater the transaction fee.
                    </p>
                    <h1 className="text-2xl">Minting Details</h1>
                    <p>
                        The price of minting is 1 wTAO.  This is a fixed price, and will not change.  The minting period is 5 days.  After the minting period,
                        no more NFTs can be minted. There can be a maximum of 500 NFTensor NFTs minted.

                    </p>
                    <h1 className="text-2xl">DISCLAIMER</h1>
                    <p>
                        ALL CODE IS UNAUDITED AND PROVIDED AS IS. USE AT YOUR OWN RISK.
                    </p>

                </div>
            </main>
        </div>
    );
};

export default Home;
