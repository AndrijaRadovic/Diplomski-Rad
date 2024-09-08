using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Common.Domain
{
    [Serializable]
    public class Racun : IEntity
    {
        public int SifraRacuna { get; set; }
        public DateTime DatumVreme { get; set; }
        public double UkupnaCenaRacuna { get; set; }
        public Korisnik Korisnik { get; set; }
        public List<StavkaRacuna> StavkeRacuna { get; set; }
        public StatusRacuna StatusRacuna { get; set; }

        [JsonIgnore]
        public string TableName => "Racun";

        [JsonIgnore]
        public string PrimaryKey => "sifraRacuna";

        public string AddColumn()
        {
            return "";
        }

        public string GetByIdQuery(string use = "")
        {
            return $"sifraRacuna = {SifraRacuna}";
        }

        public string GetFilterQuery(string filter, string field = "")
        {
            return $"cast(datumVreme as date) = '{filter}'";
        }

        public string GetParameters(string use = "")
        {
            return "@datumVreme, @ukupnaCenaRacuna, @sifraKorisnika, @statusRacuna";
        }

        public List<IEntity> GetReaderList(SqlDataReader reader)
        {
            throw new NotImplementedException();
        }

        public IEntity GetReaderResult(SqlDataReader reader)
        {
            if (reader.Read())
            {
                Racun racun = new Racun
                {
                    SifraRacuna = (int)reader["sifraRacuna"],
                    DatumVreme = (DateTime)reader["datumVreme"],
                    UkupnaCenaRacuna = (double)reader["ukupnaCenaRacuna"],
                    StatusRacuna = (StatusRacuna)Enum.Parse(typeof(StatusRacuna), (string)reader["statusRacuna"]),
                    Korisnik = new Korisnik
                    {
                        SifraKorisnika = (int)reader["sifraKorisnika"],
                        Ime = (string)reader["ime"],
                        Prezime = (string)reader["prezime"],
                        Pol = (Pol)Enum.Parse(typeof(Pol), (string)reader["pol"]),
                        Uloga = (Uloga)Enum.Parse(typeof(Uloga), (string)reader["uloga"]),
                        Username = (string)reader["username"],
                        Password = null,
                        Jmbg = (string)reader["jmbg"],
                        Email = (string)reader["email"],
                        BrojTelefona = (string)reader["brojTelefona"]
                    }
                };
                return racun;
            }
            return null;
        }

        public string GetSearchAttributes()
        {
            return "*";
        }

        public string GetTableName(string use = "")
        {
            return TableName;
        }

        public string JoinQuery()
        {
            return " inner join Korisnik on Racun.sifraKorisnika = Korisnik.sifraKorisnika";
        }

        public void PrepareCommand(SqlCommand command, string use = "")
        {
            command.Parameters.AddWithValue("@datumVreme", DatumVreme);
            command.Parameters.AddWithValue("@ukupnaCenaRacuna", UkupnaCenaRacuna);
            command.Parameters.AddWithValue("@sifraKorisnika", Korisnik.SifraKorisnika);
            command.Parameters.AddWithValue("@statusRacuna", StatusRacuna.ToString());
        }

        public List<IEntity> ReadAllSearch(SqlDataReader reader)
        {
            List<IEntity> entities = new List<IEntity>();

            while (reader.Read())
            {
                Racun racun = new Racun
                {
                    SifraRacuna = (int)reader["sifraRacuna"],
                    DatumVreme = (DateTime)reader["datumVreme"],
                    UkupnaCenaRacuna = (double)reader["ukupnaCenaRacuna"],
                    StatusRacuna = (StatusRacuna)Enum.Parse(typeof(StatusRacuna), (string)reader["statusRacuna"]),
                    Korisnik = new Korisnik
                    {
                        SifraKorisnika = (int)reader["sifraKorisnika"],
                        Ime = (string)reader["ime"],
                        Prezime = (string)reader["prezime"],
                        Pol = (Pol)Enum.Parse(typeof(Pol), (string)reader["pol"]),
                        Uloga = (Uloga)Enum.Parse(typeof(Uloga), (string)reader["uloga"]),
                        Username = (string)reader["username"],
                        Password = null,
                        Jmbg = (string)reader["jmbg"],
                        Email = (string)reader["email"],
                        BrojTelefona = (string)reader["brojTelefona"]
                    }
                };
                entities.Add(racun);
            }

            return entities;
        }

        public string UpdateQuery(string field = "")
        {
            if (field == "statusRacuna")
                return $"statusRacuna = '{StatusRacuna.Storniran.ToString()}'";

            return $"datumVreme = '{DatumVreme}', ukupnaCenaRacuna = {UkupnaCenaRacuna}, sifraKorisnika = {Korisnik.SifraKorisnika}, statusRacuna = '{StatusRacuna.ToString()}'";
        }

        public override string ToString()
        {
            return DatumVreme.ToString("dd/MM/yyyy HH:mm") + " " + Korisnik.Ime + " " + Korisnik.Prezime + " Status: " + StatusRacuna;
        }

        public string OrderByQuery()
        {
            return "order by datumVreme desc";
        }
    }
}
