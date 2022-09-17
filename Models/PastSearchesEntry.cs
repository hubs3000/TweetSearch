namespace TweetSearch.Models
{
    public class PastSearchesEntry
    {
        public string query { get; set; }
        public string dateTime { get; set; }
        public bool hasImages { get; set; }
        public string oldest_id { get; set; }
        public string newest_id { get; set; }
        public int result_count { get; set; }
    }
}
