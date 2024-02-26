using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.Model
{
    public class ApplicationUser : IdentityUser
    {
        public string FirstName { get; set; } = string.Empty; // =nul!;
        public string LastName { get; set; } = string.Empty;
    }
}
