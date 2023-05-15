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
                    <div className="container flex justify-between px-6 py-8 mx-auto">
                        <Link href="/">
                            <a className="text-xl font-bold text-black md:text-2xl hover:text-red">
                                NFTensor
                            </a>
                        </Link>
                        <ConnectButton />

                    </div>
                </div>
                <div className="text-teal-500 text-center">
                  hi
                </div>
            </main>
        </div>
    );
};

export default Home;