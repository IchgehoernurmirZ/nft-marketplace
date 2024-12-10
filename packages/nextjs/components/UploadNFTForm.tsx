import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Upload, message } from "antd";

const UploadNFTForm: React.FC = () => {
  const [cid, setCID] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const [form] = Form.useForm();

  const handleUpload = async () => {
    setLoading(true);
    try {
      const fakeCID = `${Math.random().toString(36).substring(2, 15)}`;
      setCID(fakeCID);
      message.success(`Image uploaded successfully: ${fakeCID}`);
      updateFormValidity(fakeCID);
    } catch (error) {
      console.error("Error uploading file:", error);
      message.error("Failed to upload the file. Please try again.");
    } finally {
      setLoading(false);
      updateFormValidity();
    }
  };

  const updateFormValidity = (updatedCid: string | null = cid) => {
    const values = form.getFieldsValue();
    const isValid = values.name?.trim() && values.description?.trim() && !!updatedCid;
    setIsFormValid(isValid);
  };

  const handleMintNFT = async (values: any) => {
    if (!cid) {
      message.error("Please upload an image to IPFS first!");
      return;
    }

    const { name, description } = values;
    const metadata = {
      name,
      description,
      image: `ipfs://${cid}`,
    };

    try {
      const existingNFTs = JSON.parse(localStorage.getItem("nftCollection") || "[]");
      const updatedNFTs = [...existingNFTs, metadata];
      localStorage.setItem("nftCollection", JSON.stringify(updatedNFTs));

      message.success("NFT added to your collection!");
    } catch (error) {
      console.error("Error saving NFT:", error);
      message.error("Failed to add NFT to your collection.");
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleMintNFT}
      layout="vertical"
      style={{ maxWidth: "600px", margin: "auto", marginTop: "50px" }}
      onValuesChange={updateFormValidity}
    >
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

      <Form.Item label="Image">
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
        <Button type="primary" htmlType="submit" disabled={!isFormValid} style={{ width: "100%" }}>
          Mint NFT
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UploadNFTForm;
