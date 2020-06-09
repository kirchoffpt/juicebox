using System;
using MySql.Data.MySqlClient;

namespace audio_player {
    public class MediaHandler {
        private static string _sqlConnection = "server=96.253.124.15;port=3306;userid=dev;password=devpassword;database=myDatabase";
        public MediaHandler() {
        }

        public Media GetMedia {
            get {
                MySqlConnection connection = new MySqlConnection(_sqlConnection);
                connection.Open();
                string query = "select * from numbers";
                MySqlCommand cmd = new MySqlCommand(query, connection);
                var reader = cmd.ExecuteReader();
                var ret = 0;
                while (reader.Read()) {
                    System.Console.WriteLine(reader[0]);
                    ret = Int16.Parse(reader[0].ToString());
                }
                connection.Close();
                System.Console.WriteLine(ret);
                return new Media();
            }
        }

        public void UploadMediaFile(Media media) {
            MySqlConnection connection = new MySqlConnection(_sqlConnection);
            connection.Open();
            var cmd = new MySqlCommand();
            cmd.Connection = connection;
            cmd.CommandText = "INSERT INTO songs(name,data) VALUES(@name, @data) ON DUPLICATE KEY UPDATE data=@data";
            cmd.Parameters.AddWithValue("@name", media.Name);
            cmd.Parameters.AddWithValue("@data", media.Blob);
            cmd.ExecuteNonQuery();
            connection.Close();
        }

        public Media DownloadMediaFile(string medianame) {
            MySqlConnection connection = new MySqlConnection(_sqlConnection);
            connection.Open();
            var cmd = new MySqlCommand();
            var media = new Media();
            cmd.Connection = connection;
            cmd.CommandText = "SELECT name,data FROM songs WHERE name=@name;";
            cmd.Parameters.AddWithValue("@name", medianame);
            var reader = cmd.ExecuteReader();
            if(reader.Read()){
                media.Name = reader.GetString("name");
                media.Blob = reader.GetString("data");
            }
            reader.Close();
            connection.Close();
            return media;
        }

    }
}