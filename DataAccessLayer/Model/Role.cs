using System;
using System.Collections.Generic;

namespace DataAccessLayer.Model
{
    public partial class Role
    {
        public Role()
        {
            Users = new HashSet<User>();
        }

        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

        public virtual ICollection<User> Users { get; set; }
    }
}
