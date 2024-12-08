import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Upload, message } from "antd";
import { create } from "ipfs-http-client";
import type { UploadRequestOption } from "rc-upload/lib/interface";

const ipfs = create({ url: "https://ipfs.infura.io:5001" });

const UploadNFTForm: React.FC = () => {
  const [cid, setCID] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleUpload = async (options: UploadRequestOption<any>) => {
    const { file } = options; // Extract 'file' from options
    setLoading(true);

    try {
      const result = await ipfs.add(file as File);
      setCID(result.path);
      message.success(`Image uploaded successfully: ${result.path}`);
    } catch (error) {
      console.error("Error uploading file to IPFS:", error);
      message.error("Failed to upload the file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMintNFT = async (values: any) => {
    if (!cid) {
      message.error("Please upload an image to IPFS first!");
      return;
    }

    try {
      const { name, description } = values;
      const metadata = {
        name,
        description,
        image: `ipfs://${cid}`,
      };

      const metadataResult = await ipfs.add(JSON.stringify(metadata));
      const metadataCID = metadataResult.path;

      message.success(`Metadata uploaded to IPFS: ${metadataCID}`);
      // TODO: Call your smart contract's mint function here with `metadataCID`.

      console.log("Metadata CID:", metadataCID);
      message.success("NFT Minted Successfully!");
    } catch (error) {
      console.error("Error minting NFT:", error);
      message.error("Failed to mint the NFT. Please try again.");
    }
  };

  return (
    <Form onFinish={handleMintNFT} layout="vertical" style={{ maxWidth: "600px", margin: "auto", marginTop: "50px" }}>
      <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please input the name of your NFT!" }]}>
        <Input placeholder="Enter the name of your NFT" />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: "Please input a description for your NFT!" }]}
      >
        <Input.TextArea placeholder="Enter a description for your NFT" rows={4} />
      </Form.Item>

      <Form.Item label="Image" valuePropName="file" rules={[{ required: true, message: "Please upload an image!" }]}>
        <Upload name="image" listType="picture" customRequest={handleUpload} showUploadList={false}>
          <Button icon={<UploadOutlined />} loading={loading}>
            Upload Image
          </Button>
        </Upload>
        {cid && (
          <p>
            Image CID:{" "}
            <a href={`https://ipfs.io/ipfs/${cid}`} target="_blank" rel="noopener noreferrer">
              {cid}
            </a>
          </p>
        )}
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" disabled={!cid} style={{ width: "100%" }}>
          Mint NFT
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UploadNFTForm;
