import {ethers} from "hardhat";
import {loadFixture} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {expect} from "chai";

describe("Donate", () => {

    async function deployWithSampleCharities() {
        const [owner, defaultCharity, ...signers] = await ethers.getSigners();

        const charity = {
            withdrawAddress: defaultCharity,
            name: 'Age of Hope',
            description: 'In addition to organizing camps, we organize regular fundraisers with the help of our sponsors and partner organizations.',
        }

        const Donate = await ethers.getContractFactory("Donate");

        const donate = await Donate.deploy();

        await donate.addCharity(charity.withdrawAddress, charity.name, charity.description);

        return {donate, charity, owner, signers};
    }

    it("should set the owner correct", async () => {
        const {donate, owner} = await loadFixture(deployWithSampleCharities);

        expect(await donate.owner()).to.equal(owner)
    });

    it("should add new charity by owner", async () => {
        const {donate, charity, signers} = await loadFixture(deployWithSampleCharities);

        await donate.addCharity(signers[0], 'WFP', '');

        const storedCharity = await donate.charities(signers[0]);

        expect(storedCharity[0]).to.eq(signers[0]);
        expect(storedCharity[3]).to.eq(false);
    });

    it("should avoid to add the same charity", async () => {
        const {donate, owner, charity, signers} = await loadFixture(deployWithSampleCharities);

        await expect(
            donate.addCharity(charity.withdrawAddress, charity.name, charity.description)
        ).to.be.revertedWith(
          "This charity is already in our list!"
        );
    })

    it("should reject add new charity call by NOT the owner", async () => {
        const {donate, owner, charity, signers} = await loadFixture(deployWithSampleCharities);

        await expect(
            donate.connect(signers[0]).addCharity(signers[0], 'WFP', '')
        ).to.be.revertedWith(
          "Only the owner can perform this action!"
        );
    });

    it("should donate to the right charity", async () => {
        const {donate, charity, signers } = await loadFixture(deployWithSampleCharities)

        await donate.donate(charity.withdrawAddress, {
            value: 1,
        });

        const storedCharity = await donate.charities(charity.withdrawAddress)

        expect(storedCharity[4]).to.eq(1);
    });

      it("should reject if charity is not registered", async () => {
        const {donate, owner, charity, signers} = await loadFixture(deployWithSampleCharities);

        await expect(
            donate.connect(signers[0]).donate(signers[1], {
                value: 1,
            })
        ).to.be.revertedWith(
          "This charity is not registered!"
        );
    });
})