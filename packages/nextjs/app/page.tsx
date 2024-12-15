"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import UploadNFTForm from "~~/components/UploadNFTForm";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  const [randomNFT, setRandomNFT] = useState(null);

  useEffect(() => {
    const storedNFTs = JSON.parse(localStorage.getItem("nftCollection") || "[]");
    if (storedNFTs.length > 0) {
      const randomIndex = Math.floor(Math.random() * storedNFTs.length);
      setRandomNFT(storedNFTs[randomIndex]);
    }
  }, []);

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">NFT Marketplace💰</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
        </div>
        <div>
          <h1 className="text-center">
            <span className="block text-2xl mb-2 font-bold"> Create Your NFT Collection</span>
          </h1>
          <UploadNFTForm />
        </div>
        <div>
      {randomNFT && (
        <div style={{ textAlign: "center" }}>
          <h3>🌟 Featured NFT 🌟</h3>
          <img src={randomNFT.url} alt={randomNFT.name} style={{ height: "300px", objectFit: "cover" }} />
          <h3>{randomNFT.name}</h3>
          <p>{randomNFT.description}</p>
        </div>
      )}
    </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
