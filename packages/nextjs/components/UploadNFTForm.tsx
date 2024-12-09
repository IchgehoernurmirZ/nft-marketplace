"use client";

import { Upload, Button, Form, Input, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const UploadNFTForm: React.FC = () => {
  const [form] = Form.useForm();

  const handleFinish = (values: { name: string; description: string; file: any }) => {
    const { name, description, file } = values;
  
    const uploadedFile = file.fileList[0]?.originFileObj;
    if (!uploadedFile) {
      message.error("No file uploaded!");
      return;
    }
  
    const mockCID = `mock-cid-${Date.now()}`; 
  
    const nftCollection = JSON.parse(localStorage.getItem("nftCollection") || "[]");
    const newNFT = {
      name,
      description,
      cid: mockCID,
      image: URL.createObjectURL(uploadedFile), 
    };
  
    nftCollection.push(newNFT);
    localStorage.setItem("nftCollection", JSON.stringify(nftCollection));
    message.success("NFT uploaded successfully!");

    form.resetFields();
  };
  
  return (
    <Form
      form={form}
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
        <Button type="primary" htmlType="submit">
          Mint NFT
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UploadNFTForm;
