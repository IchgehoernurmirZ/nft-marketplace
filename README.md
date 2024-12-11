# NFT Marketplace

This project is an **NFT Marketplace** built using modern web technologies. Users can mint NFTs, edit their metadata, delete them, place them up for auction, and view their collections. The project leverages local storage for mock data handling, while allowing integration with blockchain for auction and storage.

## Features

- **Mint NFTs**: Users can mint NFTs by uploading an image and providing a name and description.
- **Edit NFTs**: Users can update the metadata of their minted NFTs.
- **Delete NFTs**: Users can remove unwanted NFTs from their collection.
- **Auction NFTs**: Users can set their NFTs for auction (future integration with blockchain for smart contract handling).
- **View Collection**: Users can view all their NFTs in a styled card layout.

## Technologies Used

### Frontend
- **React**: Library for building the user interface.
- **Next.js**: Framework for server-rendered React applications.
- **Ant Design**: UI library for styling and components.
- **TypeScript**: For static typing and improved developer experience.

### Blockchain
- **Hardhat**: Ethereum development environment.
- **Ethers.js**: JavaScript library for interacting with Ethereum.

### Storage
- **IPFS**: Integration for decentralized file storage.

### Deployment
- **Vercel**: For hosting the frontend application.

## Installation

To set up the project locally, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/nft-marketplace.git
   cd nft-marketplace
   ```

2. **Install Dependencies**:
   ```bash
   yarn install
   ```

3. **Run the Development Server**:
   ```bash
   yarn dev
   ```

4. **Run Blockchain (Optional)**:
   - Install Hardhat globally:
     ```bash
     npm install --save-dev hardhat
     ```
   - Run the local Ethereum network:
     ```bash
     npx hardhat node
     ```
   - Deploy smart contracts:
     ```bash
     npx hardhat run scripts/deploy.js --network localhost
     ```

5. **Visit the Application**:
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

## Project Structure

```
.
├── components
│   ├── Header.tsx            # Header component with navigation
│   ├── NFTCollectionView.tsx # Displays the collection of NFTs
│   ├── UploadNFTForm.tsx     # Form for minting NFTs
├── pages
│   ├── index.tsx             # Homepage
│   ├── collection.tsx        # NFT Collection page
├── contracts
│   ├── NFTMarketplace.sol    # Smart contract (optional)
├── public                    # Public assets
├── styles                    # Global and component styles
├── package.json              # Project metadata
└── README.md                 # Project documentation
```

## Deployment

To deploy the project:

1. **Push Code to GitHub**:
   Ensure all code is committed and pushed to a GitHub repository.

2. **Connect Vercel**:
   - Go to [Vercel](https://vercel.com/).
   - Connect your GitHub repository.

3. **Set Environment Variables**:
   - Add any required environment variables (e.g., for Hardhat or API keys).

4. **Deploy**:
   Vercel will automatically build and deploy the project.

## Roadmap

- [ ] Integrate IPFS for decentralized storage.
- [ ] Implement blockchain-based auction functionality.
- [ ] Add authentication using WalletConnect or MetaMask.
- [ ] Improve UI/UX with animations and advanced design patterns.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

## Acknowledgments

- [Ant Design](https://ant.design/)
- [Next.js](https://nextjs.org/)
- [Hardhat](https://hardhat.org/)
