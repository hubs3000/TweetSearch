namespace TweetSearch.Models
{
    public class SearchData
    {
        public SearchMeta meta { get; set; }

        public List<Tweet> tweets { get; set; }
    }

    public class SearchMeta
    {
        public string query { get; set; }
        public string dateTime { get; set; }
        public bool hasImages { get; set; }
        public int result_count { get; set; }
    }
}
