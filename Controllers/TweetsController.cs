using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TweetSearch.Models;

namespace TweetSearch.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class TweetsController : ControllerBase
    {

        [HttpPost]
        public async Task<string> HandleRequest([FromBody] RequestData requestData)
        {

        }

    }
}
