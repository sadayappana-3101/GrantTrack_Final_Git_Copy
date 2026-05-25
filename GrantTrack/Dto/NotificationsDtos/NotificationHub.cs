using System;
using Microsoft.AspNetCore.SignalR;
namespace GrantTrack.Dto.NotificationsDtos;

public class NotificationHub : Hub
{
    // Indha method vazhiya dhaan message pōgum
    public async Task SendNotification(int userId, string message)
    {
        await Clients.User(userId.ToString()).SendAsync("ReceiveNotification", message);
    }
    public override async Task OnConnectedAsync()
    {
        // User connect aagumpodu log panna use aagum
        await base.OnConnectedAsync();
    }
}
