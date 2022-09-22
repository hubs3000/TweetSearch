using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TweetSearch.Models;
using TweetSearch.Core;
using System.Text.Json;

namespace TweetSearch.Controllers
{
    [Route("[controller]")]
    public class TweetsController : ControllerBase
    {
        TweetCode tc = new();

        [HttpPost]
        public string HandleRequest([FromBody] RequestData requestData)
        {
            string result = tc.ProcessRequest(requestData);
            return result;
        }

        [HttpGet]
        public string GetPastSearchesList()
        {
            string result = tc.GetPastSearchesSerialized();
            return result;
        }

        [HttpGet("{ind:int}")]
        public string GetTweetsListByIndex(int ind)
        {
            string result = tc.GetPastSearchesEntryTweetsByIndex(ind);
            return result;
        }

        [HttpDelete("{ind:int}")]
        public void RemovePastSearchesEntryByIndex(int ind)
        {
            tc.RemovePastSearchesEntryByIndex(ind);
        }
    }
}
