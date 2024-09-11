using Common.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.SystemOperations.SOProdavac;
using Server.SystemOperations.SOProizvod;
using Server.SystemOperations.SORacun;

namespace Web_API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ReceiptsController : ControllerBase
    {
        [HttpPut("{receiptId}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        public IActionResult UpdateReceipt(int receiptId, [FromBody] Racun updatedReceipt)
        {
            try
            {
                updatedReceipt.SifraRacuna = receiptId;

                foreach (StavkaRacuna sr in updatedReceipt.StavkeRacuna)
                    sr.Racun = updatedReceipt;

                IzmeniRacunSO so = new IzmeniRacunSO(updatedReceipt);
                so.ExecuteTemplate();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            return NoContent();
        }

        [HttpPost]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        public IActionResult CreateReceipt([FromBody]Racun receipt)
        {
            try
            {
                foreach(StavkaRacuna sr in receipt.StavkeRacuna)
                    sr.Racun = receipt;
                

                KreirajRacunSO so = new KreirajRacunSO(receipt);
                so.ExecuteTemplate();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            return NoContent();
        }

        [HttpGet("search/{date}")]
        [ProducesResponseType(200, Type = typeof(List<Racun>))]
        public IActionResult FindProductsByDate(DateTime date)
        {
            try
            {
                PronadjiRacuneSO so = new PronadjiRacuneSO(date);
                so.ExecuteTemplate();
                List<Racun> receipts = so.Result.Cast<Racun>().ToList();

                if (receipts == null || receipts.Count == 0)
                    return NotFound();

                return Ok(receipts);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("cancel/{receiptId}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        public IActionResult CancelReceipt(int receiptId, [FromBody]Racun cancelledReceipt)
        {
            try
            {
                cancelledReceipt.SifraRacuna = receiptId;

                foreach(StavkaRacuna sr in cancelledReceipt.StavkeRacuna)
                    sr.Racun = cancelledReceipt;

                StornirajRacunSO so = new StornirajRacunSO(cancelledReceipt);
                so.ExecuteTemplate();
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }

            return NoContent();
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(List<Racun>))]
        [ProducesResponseType(400)]
        public IActionResult GetReceipts()
        {
            try
            {
                UcitajRacuneSO so = new UcitajRacuneSO();
                so.ExecuteTemplate();
                List<Racun> receipts = so.result.Cast<Racun>().ToList();

                if (receipts == null || receipts.Count == 0)
                    return NotFound();

                return Ok(receipts);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{receiptId}")]
        [ProducesResponseType(200, Type = typeof(Racun))]
        [ProducesResponseType(400)]
        public IActionResult GetProduct(int receiptId)
        {
            try
            {
                UcitajRacunSO so = new UcitajRacunSO(receiptId);
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
