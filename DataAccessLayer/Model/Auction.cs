using System;
using System.Collections.Generic;

namespace DataAccessLayer.Model
{
    public partial class Auction
    {
        public Auction()
        {
            AuctionBids = new HashSet<AuctionBid>();
            Orders = new HashSet<Order>();
        }

        public Guid Id { get; set; }
        public double? MinimumPriceStep { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public DateTime? RegistrationStartTime { get; set; }
        public DateTime? RegistrationEndTime { get; set; }
        public bool? Status { get; set; }
        public Guid? HostId { get; set; }
        public Guid? ProductId { get; set; }

        public virtual Product Product { get; set; }
        public virtual ICollection<AuctionBid> AuctionBids { get; set; }
        public virtual ICollection<Order> Orders { get; set; }
    }
}
