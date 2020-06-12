using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace audio_player.Controllers {
    [ApiController]
    [Route("[controller]/[action]")]
    public class MediaHandlerController : ControllerBase {

        [HttpPost]
        public int UploadMedia([FromBody] Media media) {
            var m = new MediaHandler();
            m.UploadMediaFile(media);
            return 0;
        }

        [HttpGet]
        public Media DownloadMedia(string name) {
            return new MediaHandler().DownloadMediaFile(name);
        }

        [HttpGet]
        //should probably deprecate at some point. useful for prototyping for now
        public string[] GetColumnFromName(string name, string column) {
            return new MediaHandler().GetColumnFromName(name, column);
        }

        [HttpGet]
        public string[] GetSongNames() {
            return new MediaHandler().GetSongNames();
        }

        [HttpGet]
        public string[] DownloadMediaChunk(string name, int idx, int size) {
            return new MediaHandler().DownloadMediaChunk(name, idx, size);
        }
    }
}