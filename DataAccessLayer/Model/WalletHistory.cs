using System;
using System.Collections.Generic;

namespace DataAccessLayer.Model
{
    public partial class WalletHistory
    {
        public Guid Id { get; set; }
        public Guid? WalletId { get; set; }

        public virtual Wallet Wallet { get; set; }
    }
}
