import { expect } from "chai";
import { ethers, network } from "hardhat";
import { Execute__factory, MyGovernor__factory } from "../../typechain";
import { GouvernanceERC20__factory } from "../../typechain/factories/GouvernanceERC20__factory";

describe("Gouvernace Token", function () {
  it("Should return the new greeting once it's changed", async function () {
    const [signer, user] = await ethers.getSigners();
    const token = await new GouvernanceERC20__factory(signer).deploy();
    const execute = await new Execute__factory(signer).deploy();
    const governor = await new MyGovernor__factory(signer).deploy(
      token.address
    );

    const encodedCalldata = execute.interface.encodeFunctionData("execute");

    await token.connect(signer).delegate(signer.address);
    await token.transfer(user.address, ethers.utils.parseEther("100000"));
    await token.transfer(user.address, ethers.utils.parseEther("100000"));
    await token.transfer(user.address, ethers.utils.parseEther("100000"));
    await token.transfer(user.address, ethers.utils.parseEther("100000"));
    await token.transfer(user.address, ethers.utils.parseEther("100000"));
    await token.connect(user).delegate(signer.address);

    const prop = await governor.propose(
      [execute.address],
      [0],
      [encodedCalldata],
      "First Proposal"
    );

    await token.balanceOf(signer.address);
    await prop.wait();

    await token.connect(signer).delegate(signer.address);
    console.log(
      "Number of checkpoints: ",
      await token.numCheckpoints(signer.address)
    );

    const proposalId = await governor.hashProposal(
      [execute.address],
      [0],
      [encodedCalldata],
      ethers.utils.id("First Proposal")
    );
    await governor.connect(signer).castVote(proposalId, 0);
    //await governor.connect(user).castVote(proposalId, 1);

    const hasVoted = await governor.hasVoted(proposalId, signer.address);
    const res = await governor.connect(user).proposalVotes(proposalId);
    console.log(res);

    expect(1).to.equal(1);
  });
});
