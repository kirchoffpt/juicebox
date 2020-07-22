using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using SignalRData;

namespace audio_player.Controllers {
    [ApiController]
    [Route("[controller]/[action]")]
    public class UserHandlerController : ControllerBase {

        [HttpGet]
        public IEnumerable<string> getOtherUsers(string thisUser, string roomId) {
            return new UserHandler().getOtherUsers(thisUser, roomId);
        }

        //GET RID OF THIS
        [HttpGet]
        public IEnumerable<string> TESTgetDatabaseUrl() {
            return new UserHandler().TESTgetDatabaseUrl();
        }
    }
}