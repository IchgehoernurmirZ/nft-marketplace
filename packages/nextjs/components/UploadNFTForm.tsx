"use client";

import { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Upload, message } from "antd";
import axios from "axios";

const UploadNFTForm: React.FC = () => {
  const [form] = Form.useForm();
  const [cid, setCID] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const PINATA_API_KEY = "b06ae8f0f25a0f1f41a8";
  const PINATA_API_SECRET = "3dd2fb390cf7a90b9f6ea9617532d833468b1ac833d57aebe6f7c6ed5ce04252";

  const handleFinish = async (values: { name: string; description: string; file: any }) => {
    const { name, description, file } = values;

    const uploadedFile = file.fileList[0]?.originFileObj;
    if (!uploadedFile) {
      message.error("No file uploaded!");
      return;
    }

    try {
      setLoading(true);
      message.loading("Uploading file to IPFS via Pinata...");

      const formData = new FormData();
      formData.append("file", uploadedFile);

      const metadata = JSON.stringify({
        name,
        keyvalues: { description },
      });
      formData.append("pinataMetadata", metadata);

      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_API_SECRET,
        },
      });

      const fileCID = res.data.IpfsHash;

      setCID(`https://gateway.pinata.cloud/ipfs/${fileCID}`);
      message.success("File uploaded to IPFS successfully!");
    } catch (error) {
      console.error("Pinata upload failed:", error);
      message.error("Failed to upload file to IPFS via Pinata.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ name: "", description: "" }}>
        <Form.Item label="NFT Name" name="name" rules={[{ required: true, message: "Please enter the NFT name" }]}>
          <Input placeholder="Enter the name of your NFT" />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter the NFT description" }]}
        >
          <Input.TextArea placeholder="Enter a description for your NFT" />
        </Form.Item>
        <Form.Item label="Upload File" name="file" rules={[{ required: true, message: "Please upload a file" }]}>
          <Upload
            beforeUpload={() => false} // Prevent auto-upload
            showUploadList={true}
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Upload to IPFS
          </Button>
        </Form.Item>
      </Form>

      {cid && (
        <div style={{ marginTop: "20px" }}>
          <p>
            <strong>File URL:</strong>{" "}
            <a href={cid} target="_blank" rel="noopener noreferrer">
              {cid}
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadNFTForm;
