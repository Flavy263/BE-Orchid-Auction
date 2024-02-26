using System;
using System.Collections.Generic;

namespace DataAccessLayer.Model
{
    public partial class Order
    {
        public Guid Id { get; set; }
        public Guid? WinnerId { get; set; }
        public Guid? AuctionId { get; set; }
        public Guid? HostId { get; set; }
        public bool? Status { get; set; }
        public double? Price { get; set; }
        public DateTime? Date { get; set; }

        public virtual Auction Auction { get; set; }
        public virtual User Host { get; set; }
        public virtual User Winner { get; set; }
    }
}
