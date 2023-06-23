import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import ApproveAndMint from "../components/ApproveAndMint";
const Home: NextPage = () => {
    return (
        <div className="bg-white mb-10 min-h-screen">
            <Head>
                <title>NFTensor</title>
                <meta
                    content="width=device-width, initial-scale=1.0"
                    name="NFTensor"
                />
                <link href="image/favicon.ico" rel="icon" />
                <link rel="apple-touch-icon" sizes="180x180" href="image/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="image/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="image/favicon-16x16.png" />
                <link rel="manifest" href="image/site.webmanifest" />
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
                        NFTensor is a fun experiment for creating NFTs out of responses to queries provided by the Bittensor prompting network.
                        Essentially, make any query you want and see the Bittensor network&apos;s response immortalized forever as an NFT. The NFT will
                        only capture the first sentence of the provided response, so make it count!
                    </p>
                    <h1 className="text-2xl">How It Works</h1>
                    <p>
                        When you submit your query, it will be stored forever in the NFTensor NFT contract. Data is stored on Ethereum forever, so
                        longer queries will incur larger transaction fees.  Keep your query concise for cheaper minting costs.
                        Asynchronously, an NFTensor python service will read these queries, prompt the Bittensor network,
                        and generate the response image. During the minting period, the image and NFT JSON Metadata are hosted at 
                        text.NFTensor.com/images/ and text.NFTensor.com/metadata/ respectively. At the end of the minting period the images 
                        and json metadata are uploaded to IPFS.

                        Note, it can take a few minutes before your NFT is visible.
                        The generation depends on a separate blockchain network and this can cause latency issues.  Additionally, the NFT generation code checks
                        for Ethereum re-orgs every 30 minutes.  This process can add an additional few minutes to the NFT generation process.  The best way to
                        check if your NFT is visible is to refresh the metadata on your preferred viewing platform.
                    </p>
                    <h1 className="text-2xl">How to Mint</h1>
                    <p>
                        First, connect your wallet to NFTensor.com. Approve the NFTensor contract to spend at least 1 of your wTAO.
                        Next, enter your query in the text box and click &quot;Query and Mint&quot;. Congratulations, you have minted your NFT!
                        You should now be able to see your NFT, remember to refresh the metadata if the NFT is not visible.
                    </p>
                    <h1 className="text-2xl">Minting Details</h1>
                    <p>
                        The price of minting is 1 wTAO.  This is a fixed price, and will not change.  The minting period is 10 days.  After the minting period,
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
