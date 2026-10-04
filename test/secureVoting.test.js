const SecureVoting = artifacts.require("SecureVoting");
const truffleAssert = require('truffle-assertions');

contract("SecureVoting", (accounts) => {
    let secureVotingInstance;
    const admin = accounts[0];
    const voter1 = accounts[1];
    const voter2 = accounts[2];

    before(async () => {
        secureVotingInstance = await SecureVoting.deployed();
    });

    it("initializes with admin and NotStarted state", async () => {
        const contractAdmin = await secureVotingInstance.admin();
        const electionState = await secureVotingInstance.electionState();
        
        assert.equal(contractAdmin, admin, "Admin should be the deployer");
        assert.equal(electionState.toNumber(), 0, "Initial state should be NotStarted (0)");
    });

    it("allows admin to add candidates", async () => {
        await secureVotingInstance.addCandidate("Candidate 1", { from: admin });
        await secureVotingInstance.addCandidate("Candidate 2", { from: admin });
        
        const count = await secureVotingInstance.candidateCount();
        assert.equal(count.toNumber(), 2, "Candidate count should be 2");

        const candidate1 = await secureVotingInstance.candidates(1);
        assert.equal(candidate1.name, "Candidate 1", "First candidate should be Candidate 1");
    });

    it("prevents non-admin from adding candidates", async () => {
        await truffleAssert.reverts(
            secureVotingInstance.addCandidate("Candidate 3", { from: voter1 }),
            "Only administrator can perform this action"
        );
    });

    it("prevents voting before election starts", async () => {
        await truffleAssert.reverts(
            secureVotingInstance.vote(1, { from: voter1 }),
            "Election is not active"
        );
    });

    it("allows admin to start election", async () => {
        const tx = await secureVotingInstance.startElection({ from: admin });
        truffleAssert.eventEmitted(tx, 'ElectionStarted');

        const electionState = await secureVotingInstance.electionState();
        assert.equal(electionState.toNumber(), 1, "State should be Active (1)");
    });

    it("prevents adding candidates after election has started", async () => {
        await truffleAssert.reverts(
            secureVotingInstance.addCandidate("Candidate 3", { from: admin }),
            "Cannot add candidates after election has started"
        );
    });

    it("allows a voter to cast a valid vote", async () => {
        const tx = await secureVotingInstance.vote(1, { from: voter1 });
        truffleAssert.eventEmitted(tx, 'VoteCast', (ev) => {
            return ev.voter === voter1 && ev.candidateId.toNumber() === 1;
        });

        const hasVoted = await secureVotingInstance.voters(voter1);
        assert.equal(hasVoted, true, "Voter1 should be marked as voted");

        const candidate1 = await secureVotingInstance.candidates(1);
        assert.equal(candidate1.voteCount.toNumber(), 1, "Candidate 1 vote count should increment");
    });

    it("prevents duplicate voting", async () => {
        await truffleAssert.reverts(
            secureVotingInstance.vote(2, { from: voter1 }),
            "Voter has already voted"
        );
    });

    it("prevents voting for invalid candidates", async () => {
        await truffleAssert.reverts(
            secureVotingInstance.vote(99, { from: voter2 }),
            "Invalid candidate"
        );
    });

    it("allows admin to end the election", async () => {
        const tx = await secureVotingInstance.endElection({ from: admin });
        truffleAssert.eventEmitted(tx, 'ElectionEnded');

        const electionState = await secureVotingInstance.electionState();
        assert.equal(electionState.toNumber(), 2, "State should be Ended (2)");
    });

    it("prevents voting after election has ended", async () => {
        await truffleAssert.reverts(
            secureVotingInstance.vote(2, { from: voter2 }),
            "Election is not active"
        );
    });
});
