using System;
using System.Collections.Generic;

namespace DataAccessLayer.Model
{
    public partial class WalletRequest
    {
        public Guid Id { get; set; }
        public Guid? UserId { get; set; }
        public double? MoneyRequest { get; set; }
        public bool? Status { get; set; }

        public virtual User User { get; set; }
    }
}
