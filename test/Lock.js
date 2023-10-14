const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const hre = require("hardhat")
const { expect } = require("chai");

describe("Vault", function () {
  async function deployFixtureVault() {
    const [owner, user1] = await hre.ethers.getSigners();
    const vault = await hre.ethers.deployContract("Vault", {
        value: hre.ethers.parseEther("2")
    });

    return { vault, owner, user1 }
  }

  it('Should unlock funds when provided with a valid signature', async function () {
      const { vault, owner, user1 } = await loadFixture(deployFixtureVault);
      const message = hre.ethers.solidityPackedKeccak256(['uint256', 'address'], [0, await user1.getAddress()]);
      const signature = await owner.signMessage(hre.ethers.toBeArray(message));
      const { v, r, s } = hre.ethers.Signature.from(signature);
      // const gasPrice = (await hre.ethers.provider.getFeeData()).gasPrice;
      // const gasLimit = await vault.connect(user1).unlock.estimateGas(r, s, v);
      // const gasCost = gasPrice - gasLimit;
      const tx = await vault.connect(user1).unlock(r, s, v);
      expect(tx).to.changeEtherBalance(user1, hre.ethers.parseEther("2"))
  });
});
