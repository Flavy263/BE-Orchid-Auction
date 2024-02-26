using System;
using System.Collections.Generic;

namespace DataAccessLayer.Model
{
    public partial class Product
    {
        public Product()
        {
            Auctions = new HashSet<Auction>();
        }

        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public string Video { get; set; }
        public string Description { get; set; }
        public double? Price { get; set; }

        public virtual ICollection<Auction> Auctions { get; set; }
    }
}
