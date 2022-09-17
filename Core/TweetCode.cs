using TweetSearch.Models;
using System.Text.Json;

namespace TweetSearch.Core
{
    public class TweetCode
    {
        private static readonly HttpClient client = new();
        private readonly string bearerToken = "AAAAAAAAAAAAAAAAAAAAAPy5dwEAAAAAuW50P0k5cWce90aCdt1E2v0wxFI%3DSv5sduU0pSi41ZaSdCu4BMv0hokFXZi2HxoId6CRhMbMse2NkK";
        private readonly string tweeterRecentSearchEndpoint = "https://api.twitter.com/2/tweets/search/recent?query= ";
        private readonly string pastSearchesFilePath = "PastSearches\\PastSearches.txt";

        // POST /tweets 
        public async Task<string> ProcessRequest(RequestData requestData)
        {
            string query = BuildQuery(requestData);
            string responseString = await SendRequest(query);

            if (responseString == "")
                return "";

            Response response = JsonSerializer.Deserialize<Response>(responseString)!;

            ProcessResponse(requestData, response);

            return "ok";
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
                return "";
            }

            string result = await response.Content.ReadAsStringAsync();

            return result;
        }

        // Create a new past searches entry and update the past searches list
        // Save the corresponding tweets list to file
        private void ProcessResponse(RequestData requestData, Response response)
        {
            PastSearchesEntry entry = new();
            entry.query = requestData.query;
            entry.hasImages = requestData.hasImages;
            entry.dateTime = DateTime.Now.ToString("yyyy.MM.dd-HH.mm.ss");
            entry.oldest_id = response.meta.oldest_id;
            entry.newest_id = response.meta.newest_id;
            entry.result_count = response.meta.result_count;

            RegisterNewSearchesEntry(entry);

            string entryTweets = JsonSerializer.Serialize(response.data);
            string entryFilePath = EntryTweetsFilePath(entry);
            using StreamWriter sw = new(entryFilePath, false);
            sw.Write(entryTweets);

        }

        private string EntryTweetsFilePath(PastSearchesEntry entry)
        {
            string filePath = "PastSearches\\";
            filePath += entry.dateTime + "-" + entry.query;
            filePath += ".txt";
            return filePath;
        }

        // Update the past searches list with the new entry
        // Remove oldest entry if the list already has 10 elements
        private void RegisterNewSearchesEntry(PastSearchesEntry entry)
        {
            List<PastSearchesEntry> pastSearches = GetPastSearchesList();
            
            // Remove oldest entry if there are 10 entries already
            if (pastSearches.Count == 10)
            {
                PastSearchesEntry oldestEntry = pastSearches[9];
                pastSearches.Remove(oldestEntry);
                RemovePastSearchesEntryFile(oldestEntry);
            }

            // Register the new entry and save the new past searches list to the file
            pastSearches.Insert(0, entry);

            SavePastSearchesListToFile(pastSearches);
        }

        // GET /tweets
        public string GetPastSearchesSerialized()
        {
            FileInfo fi = new(pastSearchesFilePath);
            if (!fi.Exists)
                return "{}";

            using StreamReader sr = new(pastSearchesFilePath);
            string pastSearchesString = sr.ReadToEnd();
            return pastSearchesString;
        }

        // Get the serialized past searches list and deserialize
        private List<PastSearchesEntry> GetPastSearchesList()
        {
            string pastSearchesString = GetPastSearchesSerialized();

            List<PastSearchesEntry> pastSearches = JsonSerializer.Deserialize<List<PastSearchesEntry>>(pastSearchesString)!;
            return pastSearches;
        }

        // serialize and save the past searches list to file
        private void SavePastSearchesListToFile(List<PastSearchesEntry> pastSearches)
        {
            string _pastSearches = JsonSerializer.Serialize(pastSearches);
            using StreamWriter sw = new(pastSearchesFilePath, false);
            sw.Write(_pastSearches);

        }

        // Remove the tweets file of a given entry
        private void RemovePastSearchesEntryFile(PastSearchesEntry entry)
        {
            string filePath = EntryTweetsFilePath(entry);
            FileInfo fi = new FileInfo(filePath);
            fi.Delete();
        }

        private PastSearchesEntry GetPastSearchesEntryByIndex(int ind)
        {
            List<PastSearchesEntry> pastSearches = GetPastSearchesList();
            return pastSearches[ind];
        }

        // GET /tweets/id
        // Get the serialized tweets list corresponding to the given entry
        public string GetPastSearchesEntryTweetsByIndex(int ind)
        {
            PastSearchesEntry entry = GetPastSearchesEntryByIndex(ind);
            string filePath = EntryTweetsFilePath(entry);
            using StreamReader sr = new(filePath);
            return sr.ReadToEnd();
        }

        // DELETE /tweets/id
        public void RemovePastSearchesEntryByIndex(int ind)
        {
            PastSearchesEntry entry = GetPastSearchesEntryByIndex(ind);
            List<PastSearchesEntry> pastSearches = GetPastSearchesList();
            pastSearches.Remove(entry);
            RemovePastSearchesEntryFile(entry);
        }
    }
}
