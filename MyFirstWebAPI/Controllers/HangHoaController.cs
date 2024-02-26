using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MyFirstWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HangHoaController : ControllerBase
    {
        //public static List<HangHoa> listHangHoa = new List<HangHoa>();

        //[HttpGet]
        //public IActionResult GetAll()
        //{
        //    return Ok(listHangHoa);
        //}

        //[HttpPost]
        //public IActionResult Create(HangHoaVM hangHoaVM)
        //{
        //    var hangHoa = new HangHoa
        //    {
        //        MaHangHoa = Guid.NewGuid(),
        //        TenHangHoa = hangHoaVM.TenHangHoa,
        //        DonGia = hangHoaVM.DonGia
        //    };
        //    listHangHoa.Add(hangHoa);
        //    return Ok(new
        //    {
        //        Success = true,
        //        Data = hangHoa
        //    });
        //}
    }
}
