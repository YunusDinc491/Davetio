namespace TeklifUygulaması.Models
{
    public class Invitation
    {
        public int Id { get; set; }
        public string RecipientName { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending";
        public bool IsSeenByOwner { get; set; }
        public string? TimeSlot { get; set; }
        public string? Activity { get; set; }
        public string? Location { get; set; }
        public DateOnly? MeetingDate { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public int OwnerId { get; set; }
        public User? Owner { get; set; }
        
        
    }
}
