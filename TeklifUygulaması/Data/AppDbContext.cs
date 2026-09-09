using Microsoft.EntityFrameworkCore;
using TeklifUygulaması.Models;

namespace TeklifUygulaması.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Invitation> Invitations => Set<Invitation>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(e =>
            {
                e.HasIndex(u => u.Username).IsUnique();
                e.Property(u => u.Username).HasMaxLength(50).IsRequired();
                e.Property(u => u.PasswordHash).IsRequired();
            });

            modelBuilder.Entity<Invitation>(e =>
            {
                e.HasIndex(i => i.Slug).IsUnique();
                e.Property(i => i.RecipientName).HasMaxLength(100).IsRequired();
                e.Property(i => i.Slug).HasMaxLength(20).IsRequired();
                e.Property(i => i.Status).HasMaxLength(20).IsRequired();

                e.HasOne(i => i.Owner)
                 .WithMany(u => u.Invitations)
                 .HasForeignKey(i => i.OwnerId)
                 .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
