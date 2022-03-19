import { expect } from "chai";
import { ethers } from "hardhat";
import { Greeter__factory } from "../typechain";

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const [signer] = await ethers.getSigners();
    const greeter = await new Greeter__factory(signer).deploy("hello, world");
    console.log(await greeter.greet());
  });
});
