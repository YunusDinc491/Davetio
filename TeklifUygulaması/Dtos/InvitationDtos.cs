namespace TeklifUygulaması.Dtos
{
    public record CreateInvitationRequest(string RecipientName);
    public record RespondRequest(string TimeSlot, string Activity, string Location, DateOnly? MeetingDate);

    public record InvitationDto(
        int Id,
        string RecipientName,
        string Slug,
        string Status,
        bool IsSeenByOwner,
        string? TimeSlot,
        string? Activity,
        string? Location,
        DateOnly? MeetingDate,
        DateTime CreatedAt,
        DateTime? CompletedAt);

    public record PublicInvitationDto(string RecipientName, string Status, string OwnerUsername);
}