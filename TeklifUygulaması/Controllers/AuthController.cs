using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeklifUygulaması.Data;
using TeklifUygulaması.Dtos;
using TeklifUygulaması.Models;
using TeklifUygulaması.Services;

namespace TeklifUygulaması.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly ITokenService _tokens;

        public AuthController(AppDbContext db, ITokenService tokens)
        {
            _db = db;
            _tokens = tokens;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register(RegisterRequest req)
        {
            var username = (req.Username ?? "").Trim();
            var password = req.Password ?? "";

            if (username.Length < 3 || username.Length > 50)
                return BadRequest(new { message = "Kullanıcı adı 3-50 karakter olmalı." });
            if (password.Length < 6)
                return BadRequest(new { message = "Şifre en az 6 karakter olmalı." });

            if (await _db.Users.AnyAsync(u => u.Username == username))
                return Conflict(new { message = "Bu kullanıcı adı zaten alınmış." });

            var user = new User
            {
                Username = username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                CreatedAt = DateTime.UtcNow,
                LastLoginAt = DateTime.UtcNow
            };
            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return new AuthResponse(_tokens.CreateToken(user), user.Username);
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(LoginRequest req)
        {
            var username = (req.Username ?? "").Trim();
            var password = req.Password ?? "";

            var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user is null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                return Unauthorized(new { message = "Kullanıcı adı veya şifre hatalı." });

            user.LastLoginAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            return new AuthResponse(_tokens.CreateToken(user), user.Username);
        }
    }
}