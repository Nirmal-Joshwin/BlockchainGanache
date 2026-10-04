import React, { useState, useEffect } from "react";
import PropertyRegistryContract from "./contracts/PropertyRegistry.json";
import getWeb3 from "./getWeb3";
import "./index.css";

function App() {
    const [state, setState] = useState({ web3: null, accounts: null, contract: null });
    const [properties, setProperties] = useState([]);
    const [newLocation, setNewLocation] = useState("");
    const [transferData, setTransferData] = useState({ id: "", newOwner: "" });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                const web3 = await getWeb3();
                const accounts = await web3.eth.getAccounts();
                const networkId = await web3.eth.net.getId();
                // MetaMask often forces Chain ID 1337, while Ganache GUI defaults to Network ID 5777.
                // We fallback to 5777 if the current network ID isn't found in the contract JSON.
                const deployedNetwork = PropertyRegistryContract.networks[networkId] || PropertyRegistryContract.networks["5777"] || PropertyRegistryContract.networks["1337"];
                
                if (!deployedNetwork) {
                    alert("Smart contract not deployed to detected network.");
                    setLoading(false);
                    return;
                }

                const instance = new web3.eth.Contract(
                    PropertyRegistryContract.abi,
                    deployedNetwork && deployedNetwork.address,
                );

                setState({ web3, accounts, contract: instance });
                await loadProperties(instance);
                setLoading(false);
            } catch (error) {
                alert("Failed to load web3, accounts, or contract. Check console for details.");
                console.error(error);
                setLoading(false);
            }
        };
        init();
    }, []);

    const loadProperties = async (contract) => {
        try {
            const count = await contract.methods.propertyCount().call();
            const loadedProperties = [];
            for (let i = 1; i <= count; i++) {
                const p = await contract.methods.getProperty(i).call();
                loadedProperties.push({
                    id: p[0],
                    location: p[1],
                    owner: p[2],
                    registered: p[3]
                });
            }
            setProperties(loadedProperties);
        } catch (error) {
            console.error("Error loading properties:", error);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const { contract, accounts } = state;
        if (!newLocation.trim()) return;
        
        setLoading(true);
        try {
            await contract.methods.registerProperty(newLocation).send({ from: accounts[0] });
            setNewLocation("");
            await loadProperties(contract);
        } catch (error) {
            console.error(error);
            alert("Error registering property");
        }
        setLoading(false);
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        const { contract, accounts } = state;
        if (!transferData.id || !transferData.newOwner) return;

        setLoading(true);
        try {
            await contract.methods.transferProperty(transferData.id, transferData.newOwner).send({ from: accounts[0] });
            setTransferData({ id: "", newOwner: "" });
            await loadProperties(contract);
        } catch (error) {
            console.error(error);
            alert("Error transferring property (make sure you own it)");
        }
        setLoading(false);
    };

    if (loading && !state.web3) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white"><p>Loading Web3, accounts, and contract...</p></div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6 md:p-12 font-sans">
            <header className="max-w-5xl mx-auto mb-10 text-center border-b border-gray-700 pb-6">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                    Property Ownership Registry
                </h1>
                <p className="mt-2 text-gray-400 text-lg">Decentralized Real Estate Ledger</p>
                <div className="mt-4 inline-block bg-gray-800 px-4 py-2 rounded-full border border-gray-700">
                    <span className="text-sm text-gray-400">Connected: </span>
                    <span className="text-sm font-mono text-green-400">{state.accounts ? state.accounts[0] : "Not Connected"}</span>
                </div>
            </header>

            <main className="max-w-5xl mx-auto space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Register Property */}
                    <section className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 text-green-400">Register New Property</h2>
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <label className="block text-gray-400 mb-1">Property Location / Details</label>
                                <input 
                                    type="text" 
                                    value={newLocation}
                                    onChange={(e) => setNewLocation(e.target.value)}
                                    className="w-full bg-gray-700 text-white rounded p-3 border border-gray-600 focus:border-green-500 focus:outline-none"
                                    placeholder="e.g. 123 Blockchain Ave"
                                    required
                                />
                            </div>
                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded transition-colors disabled:opacity-50"
                            >
                                {loading ? "Processing..." : "Register"}
                            </button>
                        </form>
                    </section>

                    {/* Transfer Property */}
                    <section className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 text-blue-400">Transfer Ownership</h2>
                        <form onSubmit={handleTransfer} className="space-y-4">
                            <div>
                                <label className="block text-gray-400 mb-1">Property ID</label>
                                <input 
                                    type="number" 
                                    value={transferData.id}
                                    onChange={(e) => setTransferData({...transferData, id: e.target.value})}
                                    className="w-full bg-gray-700 text-white rounded p-3 border border-gray-600 focus:border-blue-500 focus:outline-none"
                                    placeholder="Property ID"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-1">New Owner Address</label>
                                <input 
                                    type="text" 
                                    value={transferData.newOwner}
                                    onChange={(e) => setTransferData({...transferData, newOwner: e.target.value})}
                                    className="w-full bg-gray-700 text-white rounded p-3 border border-gray-600 focus:border-blue-500 focus:outline-none"
                                    placeholder="0x..."
                                    required
                                />
                            </div>
                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded transition-colors disabled:opacity-50"
                            >
                                {loading ? "Processing..." : "Transfer"}
                            </button>
                        </form>
                    </section>
                </div>

                {/* Property List */}
                <section className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 text-purple-400 border-b border-gray-700 pb-2">Registered Properties</h2>
                    {properties.length === 0 ? (
                        <p className="text-gray-400">No properties registered yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-700 text-gray-400">
                                        <th className="pb-3 px-4">ID</th>
                                        <th className="pb-3 px-4">Location</th>
                                        <th className="pb-3 px-4">Owner</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {properties.map(p => (
                                        <tr key={p.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                                            <td className="py-4 px-4 font-mono">{p.id}</td>
                                            <td className="py-4 px-4">{p.location}</td>
                                            <td className="py-4 px-4 font-mono text-sm break-all">
                                                {p.owner}
                                                {p.owner === state.accounts?.[0] && (
                                                    <span className="ml-2 inline-block bg-green-900 text-green-300 text-xs px-2 py-1 rounded">You</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default App;