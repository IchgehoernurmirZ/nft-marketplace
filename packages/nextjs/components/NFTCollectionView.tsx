import React, { useEffect, useState } from "react";
import { Button, Card, Col, Input, Modal, Row, Typography } from "antd";

const { Meta } = Card;
const { Title } = Typography;

const NFTCollectionView: React.FC = () => {
  const [nftCollection, setNFTCollection] = useState<any[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [auctionModalVisible, setAuctionModalVisible] = useState(false);
  const [mintModalVisible, setMintModalVisible] = useState(false);
  const [editNFT, setEditNFT] = useState<any>(null);
  const [auctionNFT, setAuctionNFT] = useState<any>(null);
  const [auctionDetails, setAuctionDetails] = useState({
    price: "",
    duration: "",
  });
  const [mintDetails, setMintDetails] = useState({
    name: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    const storedNFTs = JSON.parse(localStorage.getItem("nftCollection") || "[]");
    setNFTCollection(storedNFTs);
  }, []);

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

  const handleMint = () => {
    setMintModalVisible(true);
  };

  const mintNFT = () => {
    const newNFT = {
      id: Date.now(),
      name: mintDetails.name,
      description: mintDetails.description,
      image: mintDetails.image || "https://via.placeholder.com/200", // Default placeholder image
    };

    const updatedCollection = [...nftCollection, newNFT];
    setNFTCollection(updatedCollection);
    localStorage.setItem("nftCollection", JSON.stringify(updatedCollection));
    setMintModalVisible(false);
    setMintDetails({ name: "", description: "", image: "" });
    alert(`NFT "${newNFT.name}" minted successfully!`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Your NFT Collection</Title>
      <Button type="primary" onClick={handleMint} style={{ marginBottom: "20px" }}>
        Mint New NFT
      </Button>
      {nftCollection.length > 0 ? (
        <Row gutter={[16, 16]}>
          {nftCollection.map((nft, index) => (
            <Col key={nft.id || index} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={<img alt={nft.name} src={nft.image} style={{ height: "200px", objectFit: "cover" }} />}
                actions={[
                  <Button key={`edit-${index}`} type="primary" onClick={() => handleEdit(nft, index)}>
                    Edit
                  </Button>,
                  <Button key={`auction-${index}`} type="primary" onClick={() => handleAuction(nft)}>
                    Auction
                  </Button>,
                  <Button key={`delete-${index}`} type="primary" danger onClick={() => handleDelete(index)}>
                    Delete
                  </Button>,
                ]}
              >
                <Meta title={nft.name} description={nft.description} />
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p>No NFTs in your collection.</p>
      )}

      {/* Mint Modal */}
      <Modal title="Mint New NFT" visible={mintModalVisible} onOk={mintNFT} onCancel={() => setMintModalVisible(false)}>
        <Input
          placeholder="Name"
          value={mintDetails.name}
          onChange={e => setMintDetails({ ...mintDetails, name: e.target.value })}
          style={{ marginBottom: "10px" }}
        />
        <Input.TextArea
          placeholder="Description"
          value={mintDetails.description}
          onChange={e => setMintDetails({ ...mintDetails, description: e.target.value })}
          rows={4}
          style={{ marginBottom: "10px" }}
        />
        <Input
          placeholder="Image URL"
          value={mintDetails.image}
          onChange={e => setMintDetails({ ...mintDetails, image: e.target.value })}
        />
      </Modal>

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
