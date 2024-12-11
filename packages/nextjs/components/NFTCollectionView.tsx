"use client";

import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography } from "antd";

const { Meta } = Card;
const { Title } = Typography;

const NFTCollectionView: React.FC = () => {
  const [nftCollection, setNFTCollection] = useState<any[]>([]);

  useEffect(() => {
    const storedNFTs = JSON.parse(localStorage.getItem("nftCollection") || "[]");
    setNFTCollection(storedNFTs);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Your NFT Collection</Title>
      {nftCollection.length > 0 ? (
        <Row gutter={[16, 16]}>
          {nftCollection.map((nft, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6}>
              <Card
              hoverable
              cover={
                <img
                  alt={nft.name}
                  src={
                    nft.image
                      ? `https://ipfs.io/ipfs/${nft.image.split("ipfs://")[1]}`
                      : "https://via.placeholder.com/200"
                  }
                  style={{ height: "200px", objectFit: "cover" }}
                />
              }
            >
              <Meta title={nft.name} description={nft.description} />
            </Card>

            </Col>
          ))}
        </Row>
      ) : (
        <p>You haven't added any NFTs yet! Start minting your collection now.</p>
      )}
    </div>
  );
};

export default NFTCollectionView;
