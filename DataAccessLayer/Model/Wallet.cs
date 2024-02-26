using System;
using System.Collections.Generic;

namespace DataAccessLayer.Model
{
    public partial class Wallet
    {
        public Wallet()
        {
            WalletHistories = new HashSet<WalletHistory>();
        }

        public Guid Id { get; set; }
        public Guid? UserId { get; set; }
        public double? Balance { get; set; }

        public virtual User User { get; set; }
        public virtual ICollection<WalletHistory> WalletHistories { get; set; }
    }
}
