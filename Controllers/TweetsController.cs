using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TweetSearch.Models;
using TweetSearch.Core;

namespace TweetSearch.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class TweetsController : ControllerBase
    {
        TweetCode tc = new();

        [HttpPost]
        public async Task<string> HandleRequest([FromBody] RequestData requestData)
        {
            string result = await tc.ProcessRequest(requestData);
            return result;
        }

        [HttpGet]
        public string GetPastSearchesList()
        {
            string result = tc.GetPastSearchesSerialized();
            return result;
        }

        [HttpGet("id:int")]
        public string GetTweetsListByIndex(int id)
        {
            string result = tc.GetPastSearchesEntryTweetsByIndex(id);
            return result;
        }
    }
}
