import React, { useEffect, useState } from "react";
import { Button, Card, Col, Input, Modal, Row, Typography, message } from "antd";
import { ethers } from "ethers";
import NFTCollectionABI from "~~/public/NFTCollection.json";

const { Meta } = Card;
const { Title } = Typography;

const NFTCollectionView: React.FC = () => {
  const [nftCollection, setNFTCollection] = useState<any[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [auctionModalVisible, setAuctionModalVisible] = useState(false);
  const [editNFT, setEditNFT] = useState<any>(null);
  const [auctionNFT, setAuctionNFT] = useState<any>(null);
  const [auctionDetails, setAuctionDetails] = useState({
    price: "",
    duration: "",
  });

  useEffect(() => {
    const storedNFTs = JSON.parse(localStorage.getItem("nftCollection") || "[]");
    setNFTCollection(storedNFTs);
  }, []);

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const handleDelete = (index: number) => {
    const updatedCollection = nftCollection.filter((_, i) => i !== index);
    setNFTCollection(updatedCollection);
    localStorage.setItem("nftCollection", JSON.stringify(updatedCollection));
  };

  const handleEdit = (nft: any, index: number) => {
    setEditNFT({ ...nft, index });
    setEditModalVisible(true);
  };

  const saveEdit = () => {
    const updatedCollection = [...nftCollection];
    if (editNFT) {
      updatedCollection[editNFT.index] = {
        ...updatedCollection[editNFT.index],
        name: editNFT.name,
        description: editNFT.description,
      };
    }
    setNFTCollection(updatedCollection);
    localStorage.setItem("nftCollection", JSON.stringify(updatedCollection));
    setEditModalVisible(false);
    setEditNFT(null);
  };

  const handleMintNFT = async (imageURL: string, name: string, description: string) => {
    try {
      if (!window.ethereum) {
        message.error("Please install MetaMask to mint an NFT.");
        return;
      }

      const metadata = {
        name: name || "NFT Name",
        description: description || "NFT Description",
        image: imageURL,
      };

      const metadataResponse = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: "b06ae8f0f25a0f1f41a8",
          pinata_secret_api_key: "3dd2fb390cf7a90b9f6ea9617532d833468b1ac833d57aebe6f7c6ed5ce04252",
        },
        body: JSON.stringify(metadata),
      });

      const metadataData = await metadataResponse.json();
      const metadataURL = `https://gateway.pinata.cloud/ipfs/${metadataData.IpfsHash}`;

      const provider = new ethers.JsonRpcProvider(
        "https://virtual.sepolia.rpc.tenderly.co/8801bf9a-1dff-40bb-aa0d-194f7d42d9c2",
        {
          name: "tenderly_sepolia",
          chainId: 11155111,
        },
      );
      const signer = await provider.getSigner();

      const contractAddress = "0xC97d6E249120D0a4F569e4Ba5D169dBd1627a033";

      const nftContract = new ethers.Contract(contractAddress, NFTCollectionABI.abi, signer);
      const recipient = await signer.getAddress();

      const tx = await nftContract.mintNFT(recipient, metadataURL);
      message.loading("Minting NFT...");
      const receipt = await tx.wait();

      const tokenId = BigInt(receipt.logs[0]?.args?.tokenId).toString();

      const newNFT = {
        name: metadata.name,
        description: metadata.description,
        url: metadata.image,
        tokenId: tokenId.toString(),
      };

      setNFTCollection((prev) => {
        const updatedCollection = [...prev, newNFT];
        localStorage.setItem("nftCollection", JSON.stringify(updatedCollection));
        return updatedCollection;
      });

      console.log("Token ID:", tokenId);

      message.success("NFT minted successfully!");
    } catch (error) {
      console.error("Error minting NFT:", error);
      message.error("Failed to mint NFT. Please try again.");
    }
  };

  const handleAuction = (nft: any) => {
    setAuctionNFT(nft);
    setAuctionModalVisible(true);
  };

  const startAuction = () => {
    if (auctionNFT) {
      console.log("Auction started for NFT:", auctionNFT);
      console.log("Auction details:", auctionDetails);
      alert(
        `Auction started for NFT: ${auctionNFT.name}\nStarting Price: ${auctionDetails.price} ETH\nDuration: ${auctionDetails.duration} hours`,
      );
    }
    setAuctionModalVisible(false);
    setAuctionNFT(null);
    setAuctionDetails({ price: "", duration: "" });
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Your NFT Collection</Title>
      {nftCollection.length > 0 ? (
        <Row gutter={[16, 16]}>
          {nftCollection.map((nft, index) => (
            <Col key={nft.id || index} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={<img alt={nft.name} src={nft.url} style={{ height: "200px", objectFit: "cover" }} />}
                actions={[
                  <Button key={`edit-${index}`} size="small" type="primary" onClick={() => handleEdit(nft, index)}>
                    Edit
                  </Button>,
                  <Button key={`delete-${index}`} type="primary" danger onClick={() => handleDelete(index)}>
                    Delete
                  </Button>,
                  <Button key={`auction-${index}`} type="primary" onClick={() => handleAuction(nft)}>
                    Auction
                  </Button>,
                  <Button
                    key={`mint-${index}`}
                    type="primary"
                    onClick={() => handleMintNFT(nft.url, nft.name, nft.description)}
                  >
                    Mint NFT
                  </Button>,
                ]}
              >
                <Meta
                  title={nft.name}
                  description={
                    <>
                      <p>{nft.description}</p>
                      <p>
                        <strong>Metadata:</strong>{" "}
                        <a href={nft.url} target="_blank" rel="noopener noreferrer">
                          {truncateText(nft.url, 30)}
                        </a>
                      </p>
                      <p>
                        <strong>NFT Token ID:</strong> {nft.tokenId}
                      </p>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p>No NFTs in your collection.</p>
      )}

      {/* Edit Modal */}
      {editNFT && (
        <Modal title="Edit NFT" visible={editModalVisible} onOk={saveEdit} onCancel={() => setEditModalVisible(false)}>
          <Input
            placeholder="Name"
            value={editNFT.name}
            onChange={e => setEditNFT({ ...editNFT, name: e.target.value })}
            style={{ marginBottom: "10px" }}
          />
          <Input.TextArea
            placeholder="Description"
            value={editNFT.description}
            onChange={e => setEditNFT({ ...editNFT, description: e.target.value })}
            rows={4}
          />
        </Modal>
      )}

      {/* Auction Modal */}
      {auctionNFT && (
        <Modal
          title={`Set Auction for ${auctionNFT.name}`}
          visible={auctionModalVisible}
          onOk={startAuction}
          onCancel={() => setAuctionModalVisible(false)}
        >
          <Input
            placeholder="Starting Price (ETH)"
            value={auctionDetails.price}
            onChange={e => setAuctionDetails({ ...auctionDetails, price: e.target.value })}
            style={{ marginBottom: "10px" }}
          />
          <Input
            placeholder="Duration (Hours)"
            value={auctionDetails.duration}
            onChange={e => setAuctionDetails({ ...auctionDetails, duration: e.target.value })}
            style={{ marginBottom: "10px" }}
          />
        </Modal>
      )}
    </div>
  );
};

export default NFTCollectionView;
