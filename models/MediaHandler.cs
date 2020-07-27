using System;
using System.IO;
using System.Linq;
using System.Data.SqlClient;
using System.Collections.Generic;
using Npgsql;
using MySql.Data.MySqlClient;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

namespace audio_player {
    public class MediaHandler {
        private static string _sqlConnection = Environment.GetEnvironmentVariable("DATABASE_URL");
        private static Regex rgx = new Regex("[^a-zA-Z0-9.! -]"); //for sanitizing 
        public MediaHandler() {
            Uri url;
            System.Console.WriteLine(_sqlConnection);
            bool isUrl = Uri.TryCreate(_sqlConnection, UriKind.Absolute, out url);
            if(isUrl) {
               var connectionUrl = $"host={url.Host};port={url.Port};username={url.UserInfo.Split(':')[0]};password={url.UserInfo.Split(':')[1]};database={url.LocalPath.Substring(1)};SSL Mode=Require;Trust Server Certificate=true";
                _sqlConnection = connectionUrl;
            }
        }

        private string SanitizeString(string input){
            if(input == null) return null;
            return rgx.Replace(input, "");
        }

        public void UploadMediaFile(IFormFile file, string roomId) {
            byte[] result;
            roomId = SanitizeString(roomId);
            var filename = SanitizeString(file.FileName);
            System.IO.Directory.CreateDirectory("Songs/"+roomId+"/");
            var filePath = @"./Songs/"+roomId+"/"+filename;
            if(File.Exists(filePath)) return;

                using(var memoryStream = new MemoryStream())
                {
                    file.OpenReadStream().CopyTo(memoryStream);
                    result = memoryStream.ToArray();
                }
           
                using (FileStream fs = File.Create(filePath)){
                    fs.Write(result,0,result.Length);
                }

            // MySqlConnection connection = new MySqlConnection(_sqlConnection);
            // connection.Open();
            // var cmd = new MySqlCommand();
            // cmd.Connection = connection;
            // cmd.CommandText = "INSERT INTO songs(name,size,data) VALUES(@name,@size,@data) ON DUPLICATE KEY UPDATE data=@data, size=@size";
            // cmd.Parameters.AddWithValue("@name", file.FileName);
            // cmd.Parameters.AddWithValue("@data", result);
            // cmd.Parameters.AddWithValue("@size", file.Length);
            // cmd.ExecuteNonQuery();
            // connection.Close();
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

        public FileContentResult GetSong(string filename, int seek, string roomId) {
            roomId = SanitizeString(roomId);
            filename = SanitizeString(filename);
            var filepath=@"./Songs/"+roomId+"/"+filename;
            if(!File.Exists(filepath)){
                return null;
            }
            var myfile = System.IO.File.ReadAllBytes(filepath);
            seek = Math.Max(seek, 0);
            seek = Math.Min(seek, 1000); 
            int fileLength = myfile.Length;
            int skipBytes = (fileLength/1000)*seek;
            myfile = myfile.Skip(skipBytes).ToArray();
            var result = new FileContentResult(myfile, "audio/mpeg");
            result.EnableRangeProcessing = true;
            return result; 
        }

        public FileStreamResult GetSongStream(string filename, string roomId) {
            roomId = SanitizeString(roomId);
            filename = SanitizeString(filename);
            var filepath=@"./Songs/"+roomId+"/"+filename;
            if(!File.Exists(filepath)){
                return null;
            }
            //var fileContent = System.IO.File.ReadAllBytes(filepath);
            var fileStream = new FileStream(filepath, FileMode.Open, FileAccess.Read, FileShare.Read);
            var fileStreamResult = new FileStreamResult(fileStream, "audio/mpeg");
            fileStreamResult.FileDownloadName = filename;
            fileStreamResult.EnableRangeProcessing = true;
            return fileStreamResult; 
        }

        public string[] GetSongNamesSQL() {
            List<string> songnames = new List<string>();
            MySqlConnection connection = new MySqlConnection(_sqlConnection);
            connection.Open();
            var cmd = new MySqlCommand();
            var media = new Media();
            cmd.Connection = connection;
            cmd.CommandText = "SELECT name FROM songs;";
            var reader = cmd.ExecuteReader();
            while(reader.Read()){
                songnames.Add(reader.GetString("name"));
            }
            reader.Close();
            connection.Close();
            return songnames.ToArray();
        }

        public IEnumerable<string> GetSongNames(string roomId) {
            roomId = SanitizeString(roomId);
            var path = @"./Songs/" + roomId + "/";
            System.IO.Directory.CreateDirectory(path);
            var files = Directory.EnumerateFiles(path).Select(Path.GetFileName);
            return files;
        }

        //https://localhost:5001/mediahandler/downloadmediachunk?name=easy.mp3?idx=1?size=100
        public string[] DownloadMediaChunk(string name, int idx, int size) {
            MySqlConnection connection = new MySqlConnection(_sqlConnection);
            string[] chunks = new string[1];
            connection.Open();
            var cmd = new MySqlCommand();
            cmd.Connection = connection;
            cmd.CommandText = "SELECT SUBSTR(data, @idx, @size) AS chunk FROM songs WHERE name=@name;";
            cmd.Parameters.AddWithValue("@name", name);
            cmd.Parameters.AddWithValue("@idx", idx);
            cmd.Parameters.AddWithValue("@size", size);
            var reader = cmd.ExecuteReader();
            if(reader.Read()){
                chunks[0] = reader.GetString(0);
            }
            reader.Close();
            connection.Close();
            return chunks;
        }

        public IEnumerable<string> getUsedRooms() {
            List<string> rooms = new List<string>();
            //NpgsqlConnection connection = new NpgsqlConnection(_sqlConnection);
            var path = @"./Songs/";
            System.IO.Directory.CreateDirectory(path);
            string[] allrooms =  System.IO.Directory.GetDirectories(path);
            foreach (string roompath in allrooms)
            {
                if( Directory.GetFiles(roompath+"/").Length > 0 ) rooms.Add(Path.GetFileName(roompath));
            }
            return rooms;
        }
    }
}