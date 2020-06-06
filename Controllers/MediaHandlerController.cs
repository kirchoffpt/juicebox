using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace audio_player.Controllers {
    [ApiController]
    [Route("[controller]")]
    public class AudioPlayerController : ControllerBase {
        public int Get() {
            System.Console.WriteLine("here");
            var t = new MediaHandler();
            var ret = t.GetMedia;
            return ret;

        }
    }

}