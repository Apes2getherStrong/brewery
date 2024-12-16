// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BreweryToken is ERC20 {
    address public admin;
    constructor(uint256 initialSupply) ERC20("BreweryToken", "BTK") {
        _mint(msg.sender, initialSupply * 10 ** uint256(decimals()));
        admin = msg.sender;
    }

    function rewardSensor(address sensor, uint256 amount) external {
        require(msg.sender == admin, "Only admin can reward sensors");
        _mint(sensor, amount);
    }
}

// adres tokenu: 0x611388Cb6c1f87FD5a8DA35C2C703B7DDE906557
// siec: wss://ethereum-holesky-rpc.publicnode.com
// paliwko: https://cloud.google.com/application/web3/faucet/ethereum/holesky


//w razie w:  https://holesky.infura.io/v3/69ee0144dbab421c8ef771b1f54ce655