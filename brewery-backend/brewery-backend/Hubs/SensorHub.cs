using Microsoft.AspNetCore.SignalR;

namespace brewery_backend.Hubs
{
    public class SensorHub : Hub
    {
        // Metody do logowania połączeń
        public override async Task OnConnectedAsync()
        {
            Console.WriteLine($"Client connected: {Context.ConnectionId}");
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            Console.WriteLine($"Client disconnected: {Context.ConnectionId}");
            await base.OnDisconnectedAsync(exception);
        }
    }
}