using System;
using System.Collections.Generic;

namespace DataAccessLayer.Model
{
    public partial class User
    {
        public User()
        {
            AuctionBids = new HashSet<AuctionBid>();
            OrderHosts = new HashSet<Order>();
            OrderWinners = new HashSet<Order>();
            WalletRequests = new HashSet<WalletRequest>();
            Wallets = new HashSet<Wallet>();
        }

        public Guid Id { get; set; }
        public string FullName { get; set; }
        public string Gender { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string Image { get; set; }
        public bool? Status { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public Guid? RoleId { get; set; }

        public virtual Role Role { get; set; }
        public virtual ICollection<AuctionBid> AuctionBids { get; set; }
        public virtual ICollection<Order> OrderHosts { get; set; }
        public virtual ICollection<Order> OrderWinners { get; set; }
        public virtual ICollection<WalletRequest> WalletRequests { get; set; }
        public virtual ICollection<Wallet> Wallets { get; set; }
    }
}
