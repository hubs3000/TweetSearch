namespace TweetSearch.Models
{
    public class Response
    {
        public List<Tweet>? data { get; set; }
        public ResponseMeta meta { get; set; }
    }
    public class ResponseMeta
    {
        public string? oldest_id { get; set; }
        public string? newest_id { get; set; }
        public int result_count { get; set; }
    }
}
