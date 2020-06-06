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
        public int Get() {
            System.Console.WriteLine("here");
            var t = new MediaHandler();
            var ret = t.GetMedia;
            return ret;
        }


        [HttpPost]
        public void UploadMedia([FromBody] Media media) {
            System.Console.WriteLine(media.MediaName);
            System.Console.WriteLine(media.Blob);
            // System.Console.WriteLine(blob);
            var t = new MediaHandler();
            // t.UploadMediaFile(fileName, blob);
        }
    }
}