using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System;

namespace SignalRData.Hubs
{
    public class DataHub : Hub
    {
        public async Task SendMessage(string song, int loc, string roomID, string user)
        {
            await Clients.OthersInGroup(roomID).SendAsync("ReceiveMessage", song, loc, user);
        }

        public async Task NewSongList(string roomID)
        {
            await Clients.OthersInGroup(roomID).SendAsync("UpdateSongList");
        }

        public Task RemoveUserFromClient(string roomID, string user)
        {
            return Clients.OthersInGroup(roomID).SendAsync("RemoveUserFromClient",  user);
        }

        public Task JoinRoom(string username, string roomId)
        {
            var uH = new UserHandler();
            uH.bindUserAndConnectionId(username, roomId, Context.ConnectionId);
            return Groups.AddToGroupAsync(Context.ConnectionId, roomId);
        }

        public Task LeaveRoom(string roomID)
        {
            return Groups.RemoveFromGroupAsync(Context.ConnectionId, roomID);
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            var uH = new UserHandler();
            UserInfo info = uH.GetUserInfoFromConnId(Context.ConnectionId);
            RemoveUserFromClient(info.RoomId, info.Username);
            uH.removeUser(info.Username);
            return base.OnDisconnectedAsync(exception);
        }
    }
}