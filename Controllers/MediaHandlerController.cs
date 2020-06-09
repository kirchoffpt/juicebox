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
        public Media Get() {
            return new MediaHandler().GetMedia;
        }


        [HttpPost]
        public int UploadMedia([FromBody] Media media) {
            var m = new MediaHandler();
            m.UploadMediaFile(media);
            return 0;
        }

        [HttpGet]
        public Media DownloadMedia(string name) {
            var m = new MediaHandler();
            return m.DownloadMediaFile(name);
        }
    }
}