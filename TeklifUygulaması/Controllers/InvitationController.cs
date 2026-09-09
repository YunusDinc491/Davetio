using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeklifUygulaması.Common;
using TeklifUygulaması.Data;
using TeklifUygulaması.Dtos;
using TeklifUygulaması.Models;
using TeklifUygulaması.Services;

namespace TeklifUygulaması.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/invitations")]
    public class InvitationsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public InvitationsController(AppDbContext db) => _db = db;

        private int CurrentUserId =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        public async Task<ActionResult<IEnumerable<InvitationDto>>> GetAll()
        {
            var rows = await _db.Invitations
                .Where(i => i.OwnerId == CurrentUserId)
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();
            return rows.Select(ToDto).ToList();
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<InvitationDto>> GetOne(int id)
        {
            var inv = await _db.Invitations
                .FirstOrDefaultAsync(i => i.Id == id && i.OwnerId == CurrentUserId);
            if (inv is null) return NotFound(new { message = "Davet bulunamadı." });
            return ToDto(inv);
        }

        [HttpPost]
        public async Task<ActionResult<InvitationDto>> Create(CreateInvitationRequest req)
        {
            var name = (req.RecipientName ?? "").Trim();
            if (name.Length is < 1 or > 100)
                return BadRequest(new { message = "İsim 1-100 karakter olmalı." });

            name = char.ToUpper(name[0]) + name[1..];

            var count = await _db.Invitations.CountAsync(i => i.OwnerId == CurrentUserId);
            if (count >= InvitationCatalog.MaxPerOwner)
                return BadRequest(new { message = $"En fazla {InvitationCatalog.MaxPerOwner} davet oluşturabilirsin." });

            string slug;
            do { slug = SlugGenerator.New(); }
            while (await _db.Invitations.AnyAsync(i => i.Slug == slug));

            var inv = new Invitation
            {
                RecipientName = name,
                Slug = slug,
                Status = "Pending",
                IsSeenByOwner = true,
                OwnerId = CurrentUserId,
                CreatedAt = DateTime.UtcNow
            };
            _db.Invitations.Add(inv);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOne), new { id = inv.Id }, ToDto(inv));
        }

        [HttpPatch("{id:int}/seen")]
        public async Task<IActionResult> MarkSeen(int id)
        {
            var inv = await _db.Invitations
                .FirstOrDefaultAsync(i => i.Id == id && i.OwnerId == CurrentUserId);
            if (inv is null) return NotFound(new { message = "Davet bulunamadı." });

            if (!inv.IsSeenByOwner)
            {
                inv.IsSeenByOwner = true;
                await _db.SaveChangesAsync();
            }
            return NoContent();
        }

        private static InvitationDto ToDto(Invitation i) => new(
            i.Id, i.RecipientName, i.Slug, i.Status, i.IsSeenByOwner,
            i.TimeSlot, i.Activity, i.Location, i.MeetingDate, i.CreatedAt, i.CompletedAt);
    }
}