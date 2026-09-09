using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeklifUygulaması.Common;
using TeklifUygulaması.Data;
using TeklifUygulaması.Dtos;

namespace TeklifUygulaması.Controllers
{
    [ApiController]
    [Route("api/invite")]
    public class InviteController : ControllerBase
    {
        private readonly AppDbContext _db;
        public InviteController(AppDbContext db) => _db = db;

        [HttpGet("{slug}")]
        public async Task<ActionResult<PublicInvitationDto>> Get(string slug)
        {
            var inv = await _db.Invitations
                .Include(i => i.Owner)
                .FirstOrDefaultAsync(i => i.Slug == slug);
            if (inv is null) return NotFound(new { message = "Bu davet bulunamadı." });
            return new PublicInvitationDto(inv.RecipientName, inv.Status, inv.Owner!.Username);
        }

        [HttpPost("{slug}/respond")]
        public async Task<IActionResult> Respond(string slug, RespondRequest req)
        {
            var inv = await _db.Invitations.FirstOrDefaultAsync(i => i.Slug == slug);
            if (inv is null) return NotFound(new { message = "Bu davet bulunamadı." });
            if (inv.Status == "Completed")
                return Conflict(new { message = "Bu davet zaten yanıtlanmış." });

            if (!InvitationCatalog.TimeSlots.Contains(req.TimeSlot))
                return BadRequest(new { message = "Geçersiz zaman dilimi." });
            if (!InvitationCatalog.Activities.Contains(req.Activity))
                return BadRequest(new { message = "Geçersiz aktivite." });
            if (!InvitationCatalog.Locations.Contains(req.Location))
                return BadRequest(new { message = "Geçersiz yer." });
            if (req.MeetingDate is null)
                return BadRequest(new { message = "Tarih gerekli." });
            if (req.MeetingDate < DateOnly.FromDateTime(DateTime.UtcNow.Date))
                return BadRequest(new { message = "Tarih geçmişte olamaz." });

            inv.Status = "Completed";
            inv.IsSeenByOwner = false;
            inv.TimeSlot = req.TimeSlot;
            inv.Activity = req.Activity;
            inv.Location = req.Location;
            inv.MeetingDate = req.MeetingDate;
            inv.CompletedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}