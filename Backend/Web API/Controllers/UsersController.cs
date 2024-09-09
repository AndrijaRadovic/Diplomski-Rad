using Common;
using Common.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.SystemOperations.SOProdavac;
using Server.SystemOperations.SORacun;
using System.Text.Json;

namespace Web_API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        [Authorize(Roles = "Administrator")]
        [HttpGet(Name = "GetUsers")]
        [ProducesResponseType(200, Type = typeof(List<Korisnik>))]
        [ProducesResponseType(400)]
        public IActionResult GetUsers()
        {
            try
            {
                UcitajListuKorisnikaSO so = new UcitajListuKorisnikaSO();
                so.ExecuteTemplate();
                List<Korisnik> users = so.result.Cast<Korisnik>().ToList();

                if (users == null || users.Count == 0)
                    return NotFound();

                return Ok(users);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [Authorize(Roles = "Administrator")]
        [HttpGet("search/{filter}")]
        [ProducesResponseType(200, Type = typeof(List<Korisnik>))]
        public IActionResult FindUsers(string filter)
        {
            try
            {
                string[] vrednosti = new string[] { filter, "" };
                PronadjiKorisnikeSO so = new PronadjiKorisnikeSO(vrednosti);
                so.ExecuteTemplate();
                List<Korisnik> users = so.Result.Cast<Korisnik>().ToList();

                if (users == null || users.Count == 0)
                    return NotFound("Nema gi bajo");

                return Ok(users);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Administrator")]
        [HttpPut("{userId}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        public IActionResult UpdateUser(int userId, [FromBody] Korisnik updatedUser)
        {
            try
            {
                updatedUser.SifraKorisnika = userId;
                IzmeniKorisnikaSO so = new IzmeniKorisnikaSO(updatedUser);
                so.ExecuteTemplate();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            return NoContent();
        }

        [Authorize(Roles = "Administrator")]
        [HttpPost]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        public IActionResult CreateUser([FromBody] Korisnik user)
        {
            try
            {
                ProveriUsernameSO usernameSO = new ProveriUsernameSO(user.Username);
                usernameSO.ExecuteTemplate();

                if (usernameSO.Result != null)
                    return BadRequest("Korisnik sa navedenim Username-om vec postoji");

                KreirajProdavcaSO so = new KreirajProdavcaSO(user);
                so.ExecuteTemplate();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            return NoContent();
        }

        [Authorize(Roles = "Administrator")]
        [HttpDelete("{userId}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult DeleteUser(int userId)
        {
            try
            {
                ObrisiProdavcaSO so = new ObrisiProdavcaSO(new Korisnik()
                {
                    SifraKorisnika = userId
                });
                so.ExecuteTemplate();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            return NoContent();
        }

        [HttpPut("{userId}/password")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        public IActionResult ChangePassword(int userId, [FromBody] JsonElement passwords)
        {
            //            struktura json-a:
            //            {
            //                "oldPassword": "qwe",
            //                "newPassword": "asd"
            //            }

            try
            {
                string[] vrednosti = new string[] { passwords.GetProperty("oldPassword").GetString(), "password" };
                PronadjiKorisnikeSO pretragaSO = new PronadjiKorisnikeSO(vrednosti);
                pretragaSO.ExecuteTemplate();
                List<Korisnik> korisnici = pretragaSO.Result.Cast<Korisnik>().ToList();

                if (korisnici == null || korisnici.Count == 0)
                    return BadRequest("Pogresno uneta lozinka");

                bool praviKorisnik = false;
                foreach(Korisnik k in korisnici)
                {
                    if (k.SifraKorisnika == userId)
                    {
                        praviKorisnik = true;
                        break;
                    }
                }

                if (!praviKorisnik)
                    return BadRequest("Pogresno uneta lozinka");

                PromeniSifruSO promenaSifreSO = new PromeniSifruSO(new Korisnik()
                {
                    SifraKorisnika = userId,
                    Password = passwords.GetProperty("newPassword").GetString()
                });
                promenaSifreSO.ExecuteTemplate();
                //return Ok(passwords.GetProperty("oldPassword").GetString() + passwords.GetProperty("newPassword").GetString());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            return NoContent();
        }

        [Authorize(Roles = "Administrator")]
        [HttpGet("{userId}")]
        [ProducesResponseType(200, Type = typeof(Korisnik))]
        [ProducesResponseType(400)]
        public IActionResult GetUser(int userId)
        {
            try
            {
                UcitajProdavcaSO so = new UcitajProdavcaSO(userId);
                so.ExecuteTemplate();
                so.Result.Password = null;
                return Ok(so.Result);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
