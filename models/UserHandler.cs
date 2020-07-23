using System;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using MySql.Data.MySqlClient;
using Npgsql;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace SignalRData {
    public class UserHandler {
        private static string _sqlConnection = Environment.GetEnvironmentVariable("DATABASE_URL");
        public string roomId;
        public string userName;
        public UserHandler() {
            Uri url;
            bool isUrl = Uri.TryCreate(_sqlConnection, UriKind.Absolute, out url);
            if(isUrl) {
                var connectionUrl = $"host={url.Host};port={url.Port};username={url.UserInfo.Split(':')[0]};password={url.UserInfo.Split(':')[1]};database={url.LocalPath.Substring(1)};SSL Mode=Require;Trust Server Certificate=true";
                _sqlConnection = connectionUrl;
            }
        }

        public UserInfo GetUserInfoFromConnId(string connId){
            UserInfo result = new UserInfo();
            NpgsqlConnection connection = new NpgsqlConnection(_sqlConnection);
            connection.Open();
            var cmd = new NpgsqlCommand();
            cmd.Connection = connection;
            cmd.CommandText = "SELECT username,roomid FROM users WHERE connid=@connid;";
            cmd.Parameters.AddWithValue("@connid", connId);
            var reader = cmd.ExecuteReader();
            if(reader.Read()){
                result.RoomId = reader.GetString(1);
                result.Username = reader.GetString(0);
            }
            reader.Close();
            connection.Close();
            return result;
        }

        public void removeUser(string username) {
            NpgsqlConnection connection = new NpgsqlConnection(_sqlConnection);
            connection.Open();
            var cmd = new NpgsqlCommand();
            cmd.Connection = connection;
            cmd.CommandText = "DELETE FROM users WHERE username=@username";
            cmd.Parameters.AddWithValue("@username", username);
            cmd.ExecuteNonQuery();
            connection.Close();
        }

        public void bindUserAndConnectionId(string username, string roomId, string connId) {
            NpgsqlConnection connection = new NpgsqlConnection(_sqlConnection);
            connection.Open();
            var cmd = new NpgsqlCommand();
            cmd.Connection = connection;
            cmd.CommandText = "INSERT INTO users(username,connid,roomid) VALUES(@name, @connid, @roomid) ON CONFLICT (username) DO UPDATE SET connid=@connid, roomid=@roomid";
            cmd.Parameters.AddWithValue("@name", username);
            cmd.Parameters.AddWithValue("@connid", connId);
            cmd.Parameters.AddWithValue("@roomid", roomId);
            cmd.ExecuteNonQuery();
            connection.Close();
        }

        public IEnumerable<string> getOtherUsers(string thisUser, string roomId) {
            List<string> users = new List<string>();
            System.Console.WriteLine(_sqlConnection);
            NpgsqlConnection connection = new NpgsqlConnection(_sqlConnection);
            connection.Open();
            var cmd = new NpgsqlCommand();
            cmd.Connection = connection;
            cmd.CommandText = "SELECT username FROM users WHERE roomid=@roomid AND username!=@username";
            cmd.Parameters.AddWithValue("@username", thisUser);
            cmd.Parameters.AddWithValue("@roomid", roomId);
            var reader = cmd.ExecuteReader();
            while(reader.Read()){
                users.Add(reader.GetString(0));
            }
            reader.Close();
            connection.Close();
            return users;
        }
        public IEnumerable<string> TESTgetDatabaseUrl() {
            List<string> results = new List<string>();
            results.Add(Environment.GetEnvironmentVariable("DATABASE_URL"));
            return results;
        }
    }
}