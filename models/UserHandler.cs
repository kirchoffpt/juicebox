using System;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using MySql.Data.MySqlClient;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace SignalRData {
    public class UserHandler {
        private static string _sqlConnection = "server=96.253.124.15;port=3306;userid=dev;password=devpassword;database=myDatabase";
        public string roomId;
        public string userName;
        public UserHandler() {
        }

        public UserHandler(string connId){
            MySqlConnection connection = new MySqlConnection(_sqlConnection);
            connection.Open();
            var cmd = new MySqlCommand();
            cmd.Connection = connection;
            cmd.CommandText = "SELECT username,roomid FROM users WHERE connid=@connid;";
            cmd.Parameters.AddWithValue("@connid", connId);
            var reader = cmd.ExecuteReader();
            if(reader.Read()){
                this.roomId = reader.GetString("roomid");
                this.userName = reader.GetString("username");
            }
            reader.Close();
            connection.Close();
        }

        public void removeUser(string username) {
            MySqlConnection connection = new MySqlConnection(_sqlConnection);
            connection.Open();
            var cmd = new MySqlCommand();
            cmd.Connection = connection;
            cmd.CommandText = "DELETE FROM users WHERE username=@username";
            cmd.Parameters.AddWithValue("@username", username);
            cmd.ExecuteNonQuery();
            connection.Close();
        }

        public void bindUserAndConnectionId(string username, string roomId, string connId) {
            MySqlConnection connection = new MySqlConnection(_sqlConnection);
            connection.Open();
            var cmd = new MySqlCommand();
            cmd.Connection = connection;
            cmd.CommandText = "INSERT INTO users(username,connid,roomid) VALUES(@name, @connid, @roomid) ON DUPLICATE KEY UPDATE connid=@connid, roomid=@roomid";
            cmd.Parameters.AddWithValue("@name", username);
            cmd.Parameters.AddWithValue("@connid", connId);
            cmd.Parameters.AddWithValue("@roomid", roomId);
            cmd.ExecuteNonQuery();
            connection.Close();
        }

        public IEnumerable<string> getOtherUsers(string thisUser, string roomId) {
            List<string> users = new List<string>();
            MySqlConnection connection = new MySqlConnection(_sqlConnection);
            connection.Open();
            var cmd = new MySqlCommand();
            cmd.Connection = connection;
            cmd.CommandText = "SELECT username FROM users WHERE roomid=@roomid AND username!=@username";
            cmd.Parameters.AddWithValue("@username", thisUser);
            cmd.Parameters.AddWithValue("@roomid", roomId);
            var reader = cmd.ExecuteReader();
            while(reader.Read()){
                users.Add(reader.GetString("username"));
            }
            reader.Close();
            connection.Close();
            return users;
        }
    }
}