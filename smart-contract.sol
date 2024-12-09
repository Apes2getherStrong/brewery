// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SensorToken is ERC20 {
    address public admin;
    mapping(address => uint256) public sensorBalances;

    constructor() ERC20("SensorToken", "SENS") {
        admin = msg.sender;
    }

    function rewardSensor(address sensor, uint256 amount) external {
        require(msg.sender == admin, "Only admin can reward sensors");
        _mint(sensor, amount);
        sensorBalances[sensor] += amount;
    }

    // Sprawdzenie stanu tokenów dla sensora
    function checkBalance(address sensor) public view returns (uint256) {
        return balanceOf(sensor);
    }

    // Możliwość przeglądania stanu tokenów dla sensora przez administratora
    function getSensorBalance(address sensor) external view returns (uint256) {
        return sensorBalances[sensor];
    }
}
