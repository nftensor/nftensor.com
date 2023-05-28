import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

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
                <div className="mb-10">
                    <div className="container flex justify-between  py-8 mx-auto">
                        <Link href="/">
                            <a className="text-xl font-bold text-black md:text-2xl hover:text-red">
                                NFTensor
                            </a>
                        </Link>
                        <ConnectButton />

                    </div>
                </div>
                <form className="container mx-auto">
                    <div className="mb-4 border border-gray-600 rounded-lg h-fit">
                        <div className="p-4 bg-white rounded-t-lg">
                            <label className="sr-only">Prompt Bittensor Here!</label>
                            <textarea id="comment" rows="4" className="w-full px-8 py-6 text-xl focus:shadow-soft-primary-outline appearance-none rounded-lg border-2 border-solid border-gray-300 bg-white text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none" placeholder="Prompt Bittensor Here" required></textarea>
                        </div>
                        <div className="flex items-center justify-end px-3 py-2 border-t">
                            <button type="submit" className="inline-flex items-center py-2.5 px-4 font-rounded font-bold  text-center text-white bg-blue rounded-lg focus:ring-4 focus:ring-fuchsia-300 hover:bg-green-500">
                                Prompt and Mint
                            </button>

                        </div>
                    </div>
                </form>
                <div className="container mx-auto mt-10 flex flex-col space-y-2">
                    <h1 className="text-2xl">What is NFTensor?</h1>
                    <p>
                        NFTensor is a fun experiment in for creating NFTs out of responses to queries provided by the Bittensor prompting network.
                        Essentially, make any query you want and see the Bittensor network's response immortalized forever as an NFT.
                    </p>
                    <h1 className="text-2xl">How It Works</h1>
                    <p>
                        When you submit your query, it will be stored forever in the NFTensor NFT contract. Asynchronously, an NFTensor python service will read these queries,
                        prompt the Bittensor, and generate the response image. This image is then uploaded to IPFS, and the NFT JSON Metadata is posted at NFTensor.com/images/ 
                        during the minting period. At the end of the minting period all json metadata is uploaded to IPFS.
                    </p>
                    <h1 className="text-2xl">How to Mint</h1>
                    <p>
                        First, connect your wallet to NFTensor.com. Next, enter your query in the text box and click "Prompt and Mint". 
                        You will first be prompted to approve the NFTensor NFT to spend your wTAO.  Once approved, you will be prompted 
                        to sign a transaction to mint your NFT.
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
