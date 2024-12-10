using System.Numerics;

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
    private readonly Web3 _web3;
    private readonly string _abi;

    // Mapowanie numerów sensorów na adresy blockchain
    private readonly Dictionary<int, string> _sensorAddressMap = new()
    {
        { 1, "0x123456789abcdef123456789abcdef1234567801" },
        { 2, "0x123456789abcdef123456789abcdef1234567802" },
        { 3, "0x123456789abcdef123456789abcdef1234567803" },
        { 4, "0x123456789abcdef123456789abcdef1234567804" },
        { 5, "0x123456789abcdef123456789abcdef1234567805" },
        { 6, "0x123456789abcdef123456789abcdef1234567806" },
        { 7, "0x123456789abcdef123456789abcdef1234567807" },
        { 8, "0x123456789abcdef123456789abcdef1234567808" },
        { 9, "0x123456789abcdef123456789abcdef1234567809" },
        { 10, "0x123456789abcdef123456789abcdef1234567810" },
        { 11, "0x123456789abcdef123456789abcdef1234567811" },
        { 12, "0x123456789abcdef123456789abcdef1234567812" },
        { 13, "0x123456789abcdef123456789abcdef1234567813" },
        { 14, "0x123456789abcdef123456789abcdef1234567814" },
        { 15, "0x123456789abcdef123456789abcdef1234567815" },
        { 16, "0x123456789abcdef123456789abcdef1234567816" },
    };
    
    public BlockchainService(string rpcUrl, string contractAddress, string adminPrivateKey, string abi)
    {
        _rpcUrl = rpcUrl;
        _contractAddress = contractAddress;
        _adminPrivateKey = adminPrivateKey;
        _web3 = new Web3(new Nethereum.Web3.Accounts.Account(adminPrivateKey), rpcUrl);
        _abi = abi;
    }

    public async Task RewardSensorAsync(int sensorNr, decimal rewardAmount)
    {
        
        string sensorAddress = GetSensorBlockchainAddress(sensorNr);
        
        var contract = _web3.Eth.GetContract(_abi, _contractAddress);
        var rewardFunction = contract.GetFunction("rewardSensor");

        var gas = new HexBigInteger(300_000); // Limit gazu
        var value = new HexBigInteger(0); // Brak ETH przesyłanego w transakcji
        var cancellationToken = new CancellationTokenSource().Token; // Token anulowania
        
        var functionParameters = new object[] { sensorAddress, Web3.Convert.ToWei(rewardAmount) };

        // Utworzenie i wysłanie transakcji
        var receipt = await rewardFunction.SendTransactionAndWaitForReceiptAsync(
            _web3.TransactionManager.Account.Address, // Adres nadawcy
            gas, // Limit gazu
            value, // Wartość ETH w transakcji
            cancellationToken, // Token anulowania
            functionParameters // Parametry funkcji kontraktu
        );

        // Weryfikacja statusu transakcji
        if (receipt.Status.Value != 1)
        {
            throw new Exception($"Transaction failed: {receipt.TransactionHash}");
        }
        Console.WriteLine($"Sensor {sensorNr} został nagrodzony kwotą {rewardAmount} na adres {sensorAddress}.");
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
        var balanceFunction = contract.GetFunction("checkBalance");

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

// Reprezentacja danych sensora
    public class SensorInfo
    {
        public int SensorNr { get; set; }
        public string Address { get; set; }
        public decimal Balance { get; set; }
    }

}
