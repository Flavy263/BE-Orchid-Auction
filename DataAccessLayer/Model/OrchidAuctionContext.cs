using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace DataAccessLayer.Model
{
    public partial class OrchidAuctionContext : IdentityDbContext<ApplicationUser>
    {
        public OrchidAuctionContext()
        {
        }

        public OrchidAuctionContext(DbContextOptions<OrchidAuctionContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Auction> Auctions { get; set; }
        public virtual DbSet<AuctionBid> AuctionBids { get; set; }
        public virtual DbSet<Order> Orders { get; set; }
        public virtual DbSet<Product> Products { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Wallet> Wallets { get; set; }
        public virtual DbSet<WalletHistory> WalletHistories { get; set; }
        public virtual DbSet<WalletRequest> WalletRequests { get; set; }

        public DbSet<T>? Set<T>()
        {
            throw new NotImplementedException();
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Server=(local);database=OrchidAuction;uid=sa;pwd=12345;Trusted_Connection=True;TrustServerCertificate=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Auction>(entity =>
            {
                entity.ToTable("Auction");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.EndTime)
                    .HasColumnType("datetime")
                    .HasColumnName("end_time");

                entity.Property(e => e.HostId).HasColumnName("host_id");

                entity.Property(e => e.MinimumPriceStep).HasColumnName("minimum_price_step");

                entity.Property(e => e.ProductId).HasColumnName("product_id");

                entity.Property(e => e.RegistrationEndTime)
                    .HasColumnType("datetime")
                    .HasColumnName("registration_end_time");

                entity.Property(e => e.RegistrationStartTime)
                    .HasColumnType("datetime")
                    .HasColumnName("registration_start_time");

                entity.Property(e => e.StartTime)
                    .HasColumnType("datetime")
                    .HasColumnName("start_time");

                entity.Property(e => e.Status).HasColumnName("status");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.Auctions)
                    .HasForeignKey(d => d.ProductId)
                    .HasConstraintName("FK__Auction__product__4D94879B");
            });

            modelBuilder.Entity<AuctionBid>(entity =>
            {
                entity.ToTable("Auction_Bid");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.AuctionId).HasColumnName("auction_id");

                entity.Property(e => e.CreateTime)
                    .HasColumnType("datetime")
                    .HasColumnName("create_time");

                entity.Property(e => e.CustomerId).HasColumnName("customer_id");

                entity.Property(e => e.Price).HasColumnName("price");

                entity.HasOne(d => d.Auction)
                    .WithMany(p => p.AuctionBids)
                    .HasForeignKey(d => d.AuctionId)
                    .HasConstraintName("FK__Auction_B__aucti__571DF1D5");

                entity.HasOne(d => d.Customer)
                    .WithMany(p => p.AuctionBids)
                    .HasForeignKey(d => d.CustomerId)
                    .HasConstraintName("FK__Auction_B__custo__5812160E");
            });

            modelBuilder.Entity<Order>(entity =>
            {
                entity.ToTable("Order");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.AuctionId).HasColumnName("auction_id");

                entity.Property(e => e.Date)
                    .HasColumnType("datetime")
                    .HasColumnName("date");

                entity.Property(e => e.HostId).HasColumnName("host_id");

                entity.Property(e => e.Price).HasColumnName("price");

                entity.Property(e => e.Status).HasColumnName("status");

                entity.Property(e => e.WinnerId).HasColumnName("winner_id");

                entity.HasOne(d => d.Auction)
                    .WithMany(p => p.Orders)
                    .HasForeignKey(d => d.AuctionId)
                    .HasConstraintName("FK__Order__auction_i__534D60F1");

                entity.HasOne(d => d.Host)
                    .WithMany(p => p.OrderHosts)
                    .HasForeignKey(d => d.HostId)
                    .HasConstraintName("FK__Order__host_id__52593CB8");

                entity.HasOne(d => d.Winner)
                    .WithMany(p => p.OrderWinners)
                    .HasForeignKey(d => d.WinnerId)
                    .HasConstraintName("FK__Order__winner_id__5165187F");
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.ToTable("Product");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.Description).HasColumnName("description");

                entity.Property(e => e.Image).HasColumnName("image");

                entity.Property(e => e.Name)
                    .HasMaxLength(255)
                    .HasColumnName("name");

                entity.Property(e => e.Price).HasColumnName("price");

                entity.Property(e => e.Video).HasColumnName("video");
            });

            modelBuilder.Entity<Role>(entity =>
            {
                entity.ToTable("role");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.Description).HasColumnName("description");

                entity.Property(e => e.Title)
                    .HasMaxLength(255)
                    .HasColumnName("title");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("User");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.Address)
                    .HasMaxLength(255)
                    .HasColumnName("address");

                entity.Property(e => e.Email)
                    .HasMaxLength(255)
                    .HasColumnName("email");

                entity.Property(e => e.FullName)
                    .HasMaxLength(255)
                    .HasColumnName("full_name");

                entity.Property(e => e.Gender)
                    .HasMaxLength(10)
                    .HasColumnName("gender");

                entity.Property(e => e.Image).HasColumnName("image");

                entity.Property(e => e.Password)
                    .HasMaxLength(255)
                    .HasColumnName("password");

                entity.Property(e => e.Phone)
                    .HasMaxLength(20)
                    .HasColumnName("phone");

                entity.Property(e => e.RoleId).HasColumnName("role_id");

                entity.Property(e => e.Status).HasColumnName("status");

                entity.Property(e => e.UserName)
                    .HasMaxLength(50)
                    .HasColumnName("user_name");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.Users)
                    .HasForeignKey(d => d.RoleId)
                    .HasConstraintName("FK__User__role_id__3B75D760");
            });

            modelBuilder.Entity<Wallet>(entity =>
            {
                entity.ToTable("Wallet");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.Balance).HasColumnName("balance");

                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Wallets)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK__Wallet__user_id__3F466844");
            });

            modelBuilder.Entity<WalletHistory>(entity =>
            {
                entity.ToTable("Wallet_History");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.WalletId).HasColumnName("wallet_id");

                entity.HasOne(d => d.Wallet)
                    .WithMany(p => p.WalletHistories)
                    .HasForeignKey(d => d.WalletId)
                    .HasConstraintName("FK__Wallet_Hi__walle__4316F928");
            });

            modelBuilder.Entity<WalletRequest>(entity =>
            {
                entity.ToTable("Wallet_Request");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.MoneyRequest).HasColumnName("money_request");

                entity.Property(e => e.Status).HasColumnName("status");

                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.WalletRequests)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK__Wallet_Re__user___46E78A0C");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
