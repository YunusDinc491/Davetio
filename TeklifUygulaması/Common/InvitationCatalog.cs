namespace TeklifUygulaması.Common
{
    public static class InvitationCatalog
    {
        public const int MaxPerOwner = 20;
        public static readonly string[] TimeSlots = { "morning", "noon", "afternoon", "evening" };
        public static readonly string[] Activities = { "dessert", "coffee", "cinema", "walk" };
        public static readonly string[] Locations = { "custom", "kadikoy", "besiktas", "uskudar", "taksim" };
    }
}