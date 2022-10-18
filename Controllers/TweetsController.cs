using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TweetSearch.Models;
using System.Text.Json;

namespace TweetSearch.Controllers
{
    [Route("[controller]")]
    public class TweetsController : ControllerBase
    {
        private static readonly HttpClient client = new();
        private readonly string bearerToken = "AAAAAAAAAAAAAAAAAAAAAPy5dwEAAAAAuW50P0k5cWce90aCdt1E2v0wxFI%3DSv5sduU0pSi41ZaSdCu4BMv0hokFXZi2HxoId6CRhMbMse2NkK";
        private readonly string tweeterRecentSearchEndpoint = "https://api.twitter.com/2/tweets/search/recent?query= ";


        [HttpPost]
        public string HandleRequest([FromBody] RequestData requestData)
        {
            string result = ProcessRequest(requestData);
            return result;
        }

        public string ProcessRequest(RequestData requestData)
        {
            string query = BuildQuery(requestData);
            string responseString = SendRequest(query).Result;

            if (responseString == "[]")
            {
                Console.WriteLine("null response");
                return "[]";
            }

            string resultString = ProcessResponse(requestData, responseString);

            return resultString;
        }

        // Build the search query to be sent to Twitter
        private string BuildQuery(RequestData requestData)
        {
            string query = tweeterRecentSearchEndpoint;
            query += requestData.query;
            if (requestData.hasImages)
                query += " has:images";
            query += " -is:retweet -is:quote -is:reply &max_results=100";
            return query;
        }

        // Send the request to Twitter and get response
        private async Task<string> SendRequest(string query)
        {
            var request = new HttpRequestMessage(HttpMethod.Get, query);

            request.Headers.Add("Authorization", "Bearer " + bearerToken);

            var response = await client.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine("http request unsuccessful");
                return "[]";
            }

            string result = await response.Content.ReadAsStringAsync();

            return result;
        }

        private string ProcessResponse(RequestData requestData, string responseString)
        {
            List<Tweet> _tweets = new();

            Response response = JsonSerializer.Deserialize<Response>(responseString)!;

            SearchMeta _meta = new SearchMeta
            {
                query = requestData.query,
                dateTime = DateTime.Now.ToString("yyyy.MM.dd-HH.mm.ss"),
                hasImages = requestData.hasImages,
                result_count = response.meta.result_count
            };
                

            if (response.meta.result_count == 0)
                Console.WriteLine("No results");
            else
                _tweets = response.data!;

            SearchData result = new SearchData {
                meta = _meta,
                tweets = _tweets
            };

            string resultString = JsonSerializer.Serialize(result);
            return resultString;

        }

    }
}
