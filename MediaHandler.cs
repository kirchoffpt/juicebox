using System;
using MySql.Data.MySqlClient;

namespace audio_player {
    public class MediaHandler {
        private static string _sqlConnection = "server=96.253.124.15;port=3306;userid=dev;password=devpassword;database=myDatabase";
        public MediaHandler() {
        }

        public int GetMedia {
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
                return ret;
            }
        }

        public void UploadMediaFile(Media media) {
            MySqlConnection connection = new MySqlConnection(_sqlConnection);
            connection.Open();
            string query = "INSERT INTO songs VALUES(" + ");";
        }

    }
}