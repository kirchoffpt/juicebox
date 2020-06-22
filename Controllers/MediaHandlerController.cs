using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;

namespace audio_player.Controllers {
    [ApiController]
    [Route("[controller]/[action]")]
    public class MediaHandlerController : ControllerBase {

        [HttpPost]
        public int UploadMedia(IFormCollection data, IFormFile file) {
            System.Console.WriteLine(data["name"]);
            var m = new MediaHandler();
            m.UploadMediaFile(file, data["roomId"]);
            return 0;
        }

        [HttpGet]
        public Media DownloadMedia(string name) {
            return new MediaHandler().DownloadMediaFile(name);
        }

        [HttpGet]
        public IEnumerable<string> GetSongNames(string roomId) {
            return new MediaHandler().GetSongNames(roomId);
        }

        [HttpGet]
        public string[] DownloadMediaChunk(string name, int idx, int size) {
            return new MediaHandler().DownloadMediaChunk(name, idx, size);
        }

        [HttpGet]
        public FileContentResult GetSong(string name, int seek, string roomId) {
            //System.Console.WriteLine(this.ModelState.IsValid);
            var myfile = new MediaHandler().GetSong(name, seek, roomId);
            return myfile;
        }

        [HttpGet]
        public FileStreamResult GetSongStream(string name, int seek) {
            //System.Console.WriteLine(this.ModelState.IsValid);
            return new MediaHandler().GetSongStream(name, seek);
        }
    }
}