using System;
using System.Collections.Generic;

namespace DataAccessLayer.Model
{
    public partial class AuctionBid
    {
        public Guid Id { get; set; }
        public Guid? AuctionId { get; set; }
        public Guid? CustomerId { get; set; }
        public double? Price { get; set; }
        public DateTime? CreateTime { get; set; }

        public virtual Auction Auction { get; set; }
        public virtual User Customer { get; set; }
    }
}
