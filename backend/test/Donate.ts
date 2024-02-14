import {ethers} from "hardhat";
import {loadFixture} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {expect} from "chai";

describe("Donate", () => {

    async function deployWithSampleCharities() {
        const [manager, defaultCharity, ...signers] = await ethers.getSigners();

        const charity = {
            charityAddress: defaultCharity,
            name: 'Age of Hope',
            description: 'In addition to organizing camps, we organize regular fundraisers with the help of our sponsors and partner organizations.',
        }

        const Donate = await ethers.getContractFactory("Donate");

        const donate = await Donate.deploy();

        await donate.addCharity(charity.charityAddress, charity.name, charity.description);

        return {donate, charity, manager, signers};
    }

    describe("Deploy", () => {
        it("should set the manager correct", async () => {
            const {donate, manager} = await loadFixture(deployWithSampleCharities);

            expect(await donate.manager()).to.equal(manager)
        });
    })

    describe("New charity", () => {
        it("should add new charity by manager", async () => {
            const {donate, charity, signers} = await loadFixture(deployWithSampleCharities);

            await donate.addCharity(signers[0], 'WFP', '');

            expect(await donate.charities(signers[0])).to.eql([
                signers[0].address.toString(), 'WFP', '', 0n, 1n
            ]);
            expect(await donate.getAllCharityAddress()).to.eql([
                charity.charityAddress.address.toString(),
                signers[0].address.toString(),
            ]);
        });

        it("should avoid to add the same charity", async () => {
            const {donate, manager, charity, signers} = await loadFixture(deployWithSampleCharities);

            await expect(
                donate.addCharity(charity.charityAddress, charity.name, charity.description)
            ).to.be.revertedWith(
                "This charity is already in our list."
            );
        })

        it("should reject add new charity call by NOT the manager", async () => {
            const {donate, manager, charity, signers} = await loadFixture(deployWithSampleCharities);

            await expect(
                donate.connect(signers[0]).addCharity(signers[0], 'WFP', '')
            ).to.be.revertedWith(
                "Only the manager can perform this action."
            );
        });
    })

    describe("Donate", () => {
        it("should donate to the right charity", async () => {
            const {donate, charity, signers} = await loadFixture(deployWithSampleCharities)

            await donate.donate(charity.charityAddress, {
                value: 1,
            });

            const storedCharity = await donate.charities(charity.charityAddress)

            expect(storedCharity[3]).to.eq(1);
        });

        it("should reject if charity is not registered", async () => {
            const {donate, manager, charity, signers} = await loadFixture(deployWithSampleCharities);

            await expect(
                donate.connect(signers[0]).donate(signers[1], {
                    value: 1,
                })
            ).to.be.revertedWith(
                "This charity is not registered."
            );
        });
    });

    describe("Withdraw", () => {
        it("should withdraw all collected funds", async () => {
            const {donate, charity, signers} = await loadFixture(deployWithSampleCharities);
            const initialBalance = await ethers.provider.getBalance(charity.charityAddress);
            await donate.connect(signers[0]).donate(charity.charityAddress, {
                value: ethers.parseEther('1.01'),
            });

            await donate.connect(charity.charityAddress).withdraw();
            const storedCharity = await donate.charities(charity.charityAddress)

            expect(await ethers.provider.getBalance(charity.charityAddress) - initialBalance).to.gt(ethers.parseEther('1'));
            expect(storedCharity.balance).to.eq(0);
        });

        it("should reject withdraw if charity not registered;", async () => {
            const {donate, charity, signers} = await loadFixture(deployWithSampleCharities);

            await expect(donate.connect(signers[0]).withdraw()).to.be.revertedWith("This charity is not registered.");
        });

        it("should reject withdraw if there is funds", async () => {
            const {donate, charity, signers} = await loadFixture(deployWithSampleCharities);

            await expect(donate.connect(charity.charityAddress).withdraw()).to.be.revertedWith("There is no funds.");
        });
    });

    describe("Remove charity", () => {
        it("should remove charity and withdraw 0 funds", async () => {
            const {donate, charity} = await loadFixture(deployWithSampleCharities);
            const initialBalance = await ethers.provider.getBalance(charity.charityAddress);

            await donate.removeCharity(charity.charityAddress);
            const storedCharity = await donate.charities(charity.charityAddress);

            expect(storedCharity[1]).to.eq("");
            expect(await ethers.provider.getBalance(charity.charityAddress)).to.eq(initialBalance);
            expect(await donate.getAllCharityAddress()).to.eql([
                "0x0000000000000000000000000000000000000000",
            ]);
        });

        it("should remove charity and withdraw all funds", async () => {
            const {donate, charity, signers} = await loadFixture(deployWithSampleCharities);
            const initialBalance = await ethers.provider.getBalance(charity.charityAddress);
            await donate.donate(charity.charityAddress, {
                value: ethers.parseEther("1"),
            });

            await donate.removeCharity(charity.charityAddress);
            const storedCharity = await donate.charities(charity.charityAddress);

            expect(storedCharity[1]).to.eq("");
            expect(await ethers.provider.getBalance(charity.charityAddress)).to.eq(initialBalance + BigInt(ethers.parseEther("1")));
        });

        it("should reject if charity is not registired", async () => {
            const {donate, signers} = await loadFixture(deployWithSampleCharities);

            await expect(donate.removeCharity(signers[0])).to.be.revertedWith("This charity is not registered.");
        });
    });

    describe("Be the manager", () => {
        it("should change the manager to the transaction sender", async () => {
            const {donate, signers} = await loadFixture(deployWithSampleCharities);

            await donate.connect(signers[0]).beTheOwner();

            expect(await donate.manager()).to.eq(signers[0]);
        })
    });

})