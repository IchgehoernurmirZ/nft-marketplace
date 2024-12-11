"use client";

import React, { useState } from "react";
import { Upload, Button, Form, Input, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const UploadNFTForm: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleFinish = (values: { name: string; description: string; file: any }) => {
    const { name, description, file } = values;
  
    // Get the file object correctly
    const uploadedFile = file.fileList[0]?.originFileObj;
    if (!uploadedFile) {
      message.error("No file uploaded!");
      return;
    }
  
    const mockCID = `mock-cid-${Date.now()}`; // Generate a fake CID
  
    const nftCollection = JSON.parse(localStorage.getItem("nftCollection") || "[]");
    const newNFT = {
      name,
      description,
      cid: mockCID,
      image: URL.createObjectURL(uploadedFile), // Generate local URL for the uploaded file
    };
  
    nftCollection.push(newNFT);
    localStorage.setItem("nftCollection", JSON.stringify(nftCollection));
    message.success("NFT uploaded successfully!");
  };
  
  return (
    <Form
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{ name: "", description: "" }}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please enter the NFT name" }]}
      >
        <Input placeholder="Enter the name of your NFT" />
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: "Please enter the NFT description" }]}
      >
        <Input.TextArea placeholder="Enter a description for your NFT" />
      </Form.Item>
      <Form.Item
        label="Image"
        name="file"
        rules={[{ required: true, message: "Please upload an image" }]}
      >
        <Upload beforeUpload={() => false} listType="picture">
          <Button icon={<UploadOutlined />}>Upload Image</Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Mint NFT
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UploadNFTForm;
