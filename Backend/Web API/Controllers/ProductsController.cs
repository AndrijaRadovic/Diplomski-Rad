using Common.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.SystemOperations.SOProdavac;
using Server.SystemOperations.SOProizvod;
using Server.SystemOperations.SORacun;
using System.Text.Json;

namespace Web_API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class ProductsController : ControllerBase
    {
        [Authorize(Roles = "Administrator")]
        [HttpPut("{productId}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        public IActionResult UpdateProduct(int productId, [FromBody] JsonElement product)
        {
            try
            {
                Proizvod proizvod;

                if (product.GetProperty("tipProizvoda").GetInt32() == ((int)TipProizvoda.Plocice))
                {
                    proizvod = new Plocice()
                    {
                        NazivProizvoda = product.GetProperty("nazivProizvoda").GetString(),
                        Cena = product.GetProperty("cena").GetDouble(),
                        TipProizvoda = (TipProizvoda)product.GetProperty("tipProizvoda").GetInt32(),
                        Materijal = product.GetProperty("materijal").GetString(),
                        Duzina = product.GetProperty("duzina").GetDouble(),
                        Sirina = product.GetProperty("sirina").GetDouble()
                    };
                }
                else if (product.GetProperty("tipProizvoda").GetInt32() == ((int)TipProizvoda.Farba))
                {
                    proizvod = new Farba()
                    {
                        NazivProizvoda = product.GetProperty("nazivProizvoda").GetString(),
                        Cena = product.GetProperty("cena").GetDouble(),
                        TipProizvoda = (TipProizvoda)product.GetProperty("tipProizvoda").GetInt32(),
                        Boja = product.GetProperty("boja").GetString(),
                        VelicinaPakovanja = product.GetProperty("velicinaPakovanja").GetDouble()
                    };
                }
                else
                {
                    proizvod = new Alat()
                    {
                        NazivProizvoda = product.GetProperty("nazivProizvoda").GetString(),
                        Cena = product.GetProperty("cena").GetDouble(),
                        TipProizvoda = (TipProizvoda)product.GetProperty("tipProizvoda").GetInt32(),
                        TipAlata = (TipAlata)product.GetProperty("tipAlata").GetInt32(),
                    };
                }

                proizvod.SifraProizvoda = productId;

                IzmeniProizvodSO so = new IzmeniProizvodSO(proizvod);
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
        public IActionResult CreateProduct([FromBody] JsonElement product)
        {
            try
            {
                Proizvod proizvod;

                if (product.GetProperty("tipProizvoda").GetInt32() == ((int)TipProizvoda.Plocice))
                {
                    proizvod = new Plocice()
                    {
                        NazivProizvoda = product.GetProperty("nazivProizvoda").GetString(),
                        Cena = product.GetProperty("cena").GetDouble(),
                        TipProizvoda = (TipProizvoda)product.GetProperty("tipProizvoda").GetInt32(),
                        Materijal = product.GetProperty("materijal").GetString(),
                        Duzina = product.GetProperty("duzina").GetDouble(),
                        Sirina = product.GetProperty("sirina").GetDouble()
                    };
                }
                else if (product.GetProperty("tipProizvoda").GetInt32() == ((int)TipProizvoda.Farba))
                {
                    proizvod = new Farba()
                    {
                        NazivProizvoda = product.GetProperty("nazivProizvoda").GetString(),
                        Cena = product.GetProperty("cena").GetDouble(),
                        TipProizvoda = (TipProizvoda)product.GetProperty("tipProizvoda").GetInt32(),
                        Boja = product.GetProperty("boja").GetString(),
                        VelicinaPakovanja = product.GetProperty("velicinaPakovanja").GetDouble()
                    };
                }
                else
                {
                    proizvod = new Alat()
                    {
                        NazivProizvoda = product.GetProperty("nazivProizvoda").GetString(),
                        Cena = product.GetProperty("cena").GetDouble(),
                        TipProizvoda = (TipProizvoda)product.GetProperty("tipProizvoda").GetInt32(),
                        TipAlata = (TipAlata) product.GetProperty("tipAlata").GetInt32(),
                    };
                }

                KreirajProizvodSO so = new KreirajProizvodSO(proizvod);
                so.ExecuteTemplate();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            return NoContent();
        }

        [Authorize(Roles = "Administrator")]
        [HttpDelete("{productId}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        public IActionResult DeleteProduct(int productId, [FromBody]TipProizvoda tipProizvoda)
        {
            try
            {
                Proizvod proizvod;

                if (tipProizvoda == TipProizvoda.Plocice)
                    proizvod = new Plocice()
                    {
                        SifraProizvoda = productId
                    };
                else if (tipProizvoda == TipProizvoda.Farba)
                    proizvod = new Farba()
                    {
                        SifraProizvoda = productId
                    };
                else
                    proizvod = new Alat()
                    {
                        SifraProizvoda = productId
                    };

                ObrisiProizvodSO so = new ObrisiProizvodSO(proizvod);
                so.ExecuteTemplate();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            return NoContent();
        }

        [HttpGet("search/{name}")]
        [ProducesResponseType(200, Type = typeof(List<Proizvod>))]
        public IActionResult FindProductsByName(string name)
        {
            try
            {
                PronadjiProizvodeSO so = new PronadjiProizvodeSO(name);
                so.ExecuteTemplate();
                List<Proizvod> products = so.Result.Cast<Proizvod>().ToList();

                if (products == null || products.Count == 0)
                    return NotFound();

                return Ok(products);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(List<Proizvod>))]
        [ProducesResponseType(400)]
        public IActionResult GetProducts()
        {
            try
            {
                UcitajProizvodeSO so = new UcitajProizvodeSO();
                so.ExecuteTemplate();
                List<Proizvod> products = so.result.Cast<Proizvod>().ToList();

                if (products == null || products.Count == 0)
                    return NotFound();

                return Ok(products);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{productId}")]
        [ProducesResponseType(200, Type = typeof(Proizvod))]
        [ProducesResponseType(400)]
        public IActionResult GetProduct(int productId)
        {
            try
            {
                UcitajProizvodSO so = new UcitajProizvodSO(productId);
                so.ExecuteTemplate();
                return Ok(so.Result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
