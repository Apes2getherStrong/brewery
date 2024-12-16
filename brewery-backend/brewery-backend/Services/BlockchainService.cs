using System.Numerics;
using Nethereum.Contracts.Standards.ERC20.ContractDefinition;
using Nethereum.Util;

namespace brewery_backend.Services;

using Nethereum.Web3;
using Nethereum.Contracts;
using Nethereum.Hex.HexTypes;
using System.Threading.Tasks;

public class BlockchainService
{
    private readonly string _rpcUrl;
    private readonly string _contractAddress;
    private readonly string _adminPrivateKey;
    private readonly string _adminPublicKey;
    private readonly Web3 _web3;
    private readonly string _abi;
    private readonly HexBigInteger _precalculatedGas;

    // Mapowanie numerów sensorów na adresy blockchain
    private readonly Dictionary<int, string> _sensorAddressMap = new()
    {
        { 1, "0x223456789abcdef123456789abcdef1234567801" },
        { 2, "0x223456789abcdef123456789abcdef1234567802" },
        { 3, "0x223456789abcdef123456789abcdef1234567803" },
        { 4, "0x223456789abcdef123456789abcdef1234567804" },
        { 5, "0x223456789abcdef123456789abcdef1234567805" },
        { 6, "0x223456789abcdef123456789abcdef1234567806" },
        { 7, "0x223456789abcdef123456789abcdef1234567807" },
        { 8, "0x223456789abcdef123456789abcdef1234567808" },
        { 9, "0x223456789abcdef123456789abcdef1234567809" },
        { 10, "0x223456789abcdef123456789abcdef1234567810" },
        { 11, "0x223456789abcdef123456789abcdef1234567811" },
        { 12, "0x223456789abcdef123456789abcdef1234567812" },
        { 13, "0x223456789abcdef123456789abcdef1234567813" },
        { 14, "0x223456789abcdef123456789abcdef1234567814" },
        { 15, "0x223456789abcdef123456789abcdef1234567815" },
        { 16, "0x223456789abcdef123456789abcdef1234567816" },
    };
    
    public BlockchainService(string rpcUrl, string contractAddress, string adminPrivateKey, string abi)
    {
        _rpcUrl = rpcUrl;
        _contractAddress = contractAddress;
        _adminPrivateKey = adminPrivateKey;
        _adminPublicKey = "0xd21Fc3B3Cf6030B7693aeF7D690B974c7c7069B8";
        _web3 = new Web3(new Nethereum.Web3.Accounts.Account(adminPrivateKey), rpcUrl);
        _abi = abi;
        _precalculatedGas = PrecalculateGasAsync().GetAwaiter().GetResult();
    }
    private async Task<HexBigInteger> PrecalculateGasAsync()
    {
        var contract = _web3.Eth.GetContract(_abi, _contractAddress);
        var transferFunction = contract.GetFunction("transfer");

        var dummyAddress = _sensorAddressMap.Values.First();
        var dummyAmount = 1000;

        var gas = await transferFunction.EstimateGasAsync(_adminPublicKey, null, null, dummyAddress, dummyAmount);
        return new HexBigInteger(gas.Value * 5); 
    }
    
    public async Task RewardSensorAsync(int sensorNr)
    {
        Console.WriteLine($"Zaczynam zapisywać nagrodę dla sensora {sensorNr}");
        var contract = _web3.Eth.GetContract(_abi, _contractAddress);
        var rewardFunction = contract.GetFunction("rewardSensor");
        
        var amountToSend = Web3.Convert.ToWei(1m);;
        
        var newAddress = GetSensorBlockchainAddress(sensorNr);
        var receiptFirstAmountSend = await rewardFunction.SendTransactionAndWaitForReceiptAsync(_adminPublicKey, _precalculatedGas, null, null, newAddress, amountToSend);
        Console.WriteLine($"Dodano nagrodę dla sensora {sensorNr}");
    }
    

    public string GetSensorBlockchainAddress(int sensorNr)
    {
        if (_sensorAddressMap.TryGetValue(sensorNr, out var address))
        {
            return address;
        }

        throw new KeyNotFoundException($"Nie znaleziono adresu dla numeru sensora: {sensorNr}");
    }
    public async Task<List<SensorInfo>> GetAllSensorsInfoAsync()
    {
        var contract = _web3.Eth.GetContract(_abi, _contractAddress);
        var balanceFunction = contract.GetFunction("balanceOf");

        var sensorsInfo = new List<SensorInfo>();

        foreach (var (sensorNr, address) in _sensorAddressMap)
        {
            var balance = await balanceFunction.CallAsync<BigInteger>(address);
            sensorsInfo.Add(new SensorInfo
            {
                SensorNr = sensorNr,
                Address = address,
                Balance = Web3.Convert.FromWei(balance)
            });
        }

        return sensorsInfo;
    }
    
    public class SensorInfo
    {
        public int SensorNr { get; set; }
        public string Address { get; set; }
        public decimal Balance { get; set; }
    }

}
