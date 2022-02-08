import { expect } from "chai";
import { ethers } from "hardhat";
import { SimpleNFT } from "../typechain";

describe("SimpleNFT", function () {
  let simpleNFT: SimpleNFT;
  const BASE_PRICE = ethers.utils.parseEther("0.01");
  const BASE_URI = "https://api.simplenft.eth/id/";
  const BASE_URI_2 = "https://api2.simplenft.eth/id/";

  beforeEach(async () => {
    const SimpleNFT = await ethers.getContractFactory("SimpleNFT");
    simpleNFT = await SimpleNFT.deploy(5, BASE_URI, BASE_PRICE, BASE_PRICE);
    await simpleNFT.deployed();
  })

  it("Should deploy SimpleNFT with correct fields", async function () {
    expect(await simpleNFT.name()).to.equal("SimpleNFT");
    expect(await simpleNFT.symbol()).to.equal("SNFT");
    expect(await simpleNFT.price()).to.equal(BASE_PRICE);
    expect(await simpleNFT.priceIncrementSize()).to.equal(BASE_PRICE);
  });

  it("Should update tokenBaseURI by owner", async function () {
    const [owner] = await ethers.getSigners();
    await expect(simpleNFT.setBaseURI(BASE_URI_2))
      .to.emit(simpleNFT, 'UpdateBaseURI').withArgs(BASE_URI, BASE_URI_2);
    await simpleNFT.mint(owner.address, {value: BASE_PRICE});
    expect(await simpleNFT.tokenURI(0)).to.equal(`${BASE_URI_2}0`);
  });

  it("Should NOT update tokenBaseURI by non-owner", async function () {
    const [, addr1] = await ethers.getSigners();
    await expect(simpleNFT.connect(addr1).setBaseURI(BASE_URI_2))
      .to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should mint 1 NFT with correct fields", async function () {
    const [, addr1] = await ethers.getSigners();
    await simpleNFT.mint(addr1.address, {value: BASE_PRICE});
    expect(await simpleNFT.nextTokenId()).to.equal(1);
    expect(await simpleNFT.ownerOf(0)).to.equal(addr1.address);
    expect(await simpleNFT.tokenURI(0)).to.equal(`${BASE_URI}0`);
    expect(await simpleNFT.nextTokenId()).to.equal(1);
  });

  it("Should NOT mint w/o enough eth", async function () {
    const [, addr1] = await ethers.getSigners();
    await expect(simpleNFT.mint(addr1.address, {value: BASE_PRICE.div(2)}))
      .to.be.revertedWith('Not enough ETH');
  });

  it("Should NOT mint after reach max supply", async function () {
    const [, addr1] = await ethers.getSigners();
    let currentPrice = await simpleNFT.price();
    for (let i = 0; i < 5; i++) {
      await simpleNFT.mint(addr1.address, {value: currentPrice});
      currentPrice = await simpleNFT.price();
    }
    await expect(simpleNFT.mint(addr1.address, {value: currentPrice}))
      .to.be.revertedWith('Reached max supply');
  });
});
