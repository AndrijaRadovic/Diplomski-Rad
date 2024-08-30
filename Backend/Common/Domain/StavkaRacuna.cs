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
    public class StavkaRacuna : IEntity
    {
        [JsonIgnore]
        public Racun? Racun { get; set; }
        public int RedniBroj { get; set; }
        public int Kolicina { get; set; }
        public double UkupnaCenaStavke { get; set; }
        public Proizvod Proizvod { get; set; }
        public string TableName => "StavkaRacuna";
        public string PrimaryKey => "redniBroj";

        public string AddColumn()
        {
            return "";
        }

        public string GetByIdQuery(string use = "")
        {
            if (use == "deleteAll")
                return $"sifraRacuna = {Racun.SifraRacuna}";

            throw new NotImplementedException();
        }

        public string GetFilterQuery(string filter, string field = "")
        {
            return $"{field} = {filter}";
        }

        public string GetParameters(string use = "")
        {
            return "@sifraRacuna, @redniBroj, @kolicina, @ukupnaCenaStavke, @sifraProizvoda";
        }

        public List<IEntity> GetReaderList(SqlDataReader reader)
        {
            throw new NotImplementedException();
        }

        public IEntity GetReaderResult(SqlDataReader reader)
        {
            throw new NotImplementedException();
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
            return " inner join Proizvod on StavkaRacuna.sifraProizvoda = Proizvod.sifraProizvoda";
        }

        public string OrderByQuery()
        {
            return "";
        }

        public void PrepareCommand(SqlCommand command, string use = "")
        {
            
            command.Parameters.AddWithValue("@sifraRacuna", Racun.SifraRacuna);
            command.Parameters.AddWithValue("@redniBroj", RedniBroj);
            command.Parameters.AddWithValue("@kolicina", Kolicina);
            command.Parameters.AddWithValue("@ukupnaCenaStavke", UkupnaCenaStavke);
            command.Parameters.AddWithValue("@sifraProizvoda", Proizvod.SifraProizvoda);
        }

        public List<IEntity> ReadAllSearch(SqlDataReader reader)
        {
            List<IEntity> entities = new List<IEntity>();
            while (reader.Read())
            {
                StavkaRacuna stavkaRacuna = new StavkaRacuna
                {
                    Racun = new Racun
                    {
                        SifraRacuna = (int)reader["sifraRacuna"]
                    },
                    RedniBroj = (int)reader["redniBroj"],
                    Kolicina = (int)reader["kolicina"],
                    UkupnaCenaStavke = (double)reader["ukupnaCenaStavke"],
                    Proizvod = new Proizvod
                    {
                        SifraProizvoda = (int)reader["sifraProizvoda"],
                        NazivProizvoda = (string)reader["nazivProizvoda"]
                    }
                };
                entities.Add(stavkaRacuna);
            }
            return entities;
        }

        public string UpdateQuery(string field = "")
        {
            throw new NotImplementedException();
        }

    }
}
