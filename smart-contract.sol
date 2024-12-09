// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SensorToken is ERC20 {
    mapping(address => uint256) public sensorBalances;

    constructor() ERC20("SensorToken", "SENS") {}

    // Funkcja nagradzania sensora - może ją wywołać każdy użytkownik
    function rewardSensor(address sensor, uint256 amount) external {
        _mint(sensor, amount); // Mintowanie tokenów dla sensora
        sensorBalances[sensor] += amount;
    }

    // Sprawdzenie stanu tokenów dla sensora
    function checkBalance(address sensor) public view returns (uint256) {
        return balanceOf(sensor);
    }

    // Możliwość przeglądania stanu tokenów dla sensora przez każdego użytkownika
    function getSensorBalance(address sensor) external view returns (uint256) {
        return sensorBalances[sensor];
    }
}
// adres tokenu: 0x3D9042d5e322693b2208AEC319E83D0992e829F8
// siec: https://holesky.etherscan.io/
// paliwko: https://cloud.google.com/application/web3/faucet/ethereum/holesky
