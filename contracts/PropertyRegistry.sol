// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PropertyRegistry {
    struct Property {
        uint256 id;
        string location;
        address owner;
        bool registered;
    }

    mapping(uint256 => Property) public properties;
    uint256 public propertyCount;

    event PropertyRegistered(uint256 indexed id, string location, address indexed owner);
    event PropertyTransferred(uint256 indexed id, address indexed oldOwner, address indexed newOwner);

    function registerProperty(string memory _location) public {
        propertyCount++;
        properties[propertyCount] = Property(propertyCount, _location, msg.sender, true);
        
        emit PropertyRegistered(propertyCount, _location, msg.sender);
    }

    function transferProperty(uint256 _id, address _newOwner) public {
        require(_id > 0 && _id <= propertyCount, "Invalid property ID");
        require(properties[_id].owner == msg.sender, "You are not the owner of this property");
        require(_newOwner != address(0), "Invalid new owner address");

        address oldOwner = properties[_id].owner;
        properties[_id].owner = _newOwner;

        emit PropertyTransferred(_id, oldOwner, _newOwner);
    }

    function getProperty(uint256 _id) public view returns (uint256, string memory, address, bool) {
        require(_id > 0 && _id <= propertyCount, "Invalid property ID");
        Property memory p = properties[_id];
        return (p.id, p.location, p.owner, p.registered);
    }
}
