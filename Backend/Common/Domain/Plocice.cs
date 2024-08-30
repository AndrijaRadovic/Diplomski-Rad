using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Domain
{
    [Serializable]
    public class Plocice : Proizvod
    {
        public string Materijal { get; set; }
        public double Duzina { get; set; }
        public double Sirina { get; set; }
        public new string TableName => "Plocice";
        public override string GetTableName(string use = "")
        {
            if (use == "parent")
                return base.GetTableName();
            return this.TableName;
        }
        public override string GetParameters(string use = "")
        {
            if (use == "parent")
                return base.GetParameters(use);
            return "@sifraProizvoda, @materijal, @duzina, @sirina";
        }
        public override void PrepareCommand(SqlCommand command, string use = "")
        {
            if(use == "parent")
                base.PrepareCommand(command, use);

            else
            {
                command.Parameters.AddWithValue("@sifraProizvoda", SifraProizvoda);
                command.Parameters.AddWithValue("@materijal", Materijal);
                command.Parameters.AddWithValue("@duzina", Duzina);
                command.Parameters.AddWithValue("@sirina", Sirina);
            }
        }

        public override string GetSearchAttributes()
        {
            return "Proizvod.sifraProizvoda, nazivProizvoda, cena, materijal, duzina, sirina";
        }
        public override string JoinQuery()
        {
            return " inner join Proizvod on Plocice.sifraProizvoda = Proizvod.sifraProizvoda";
        }
        public override List<IEntity> ReadAllSearch(SqlDataReader reader)
        {
            List<IEntity> entities = new List<IEntity>();
            while (reader.Read())
            {
                Plocice plocice = new Plocice
                {
                    SifraProizvoda = (int)reader["sifraProizvoda"],
                    Cena = (double)reader["cena"],
                    NazivProizvoda = (string)reader["nazivProizvoda"],
                    Materijal = (string)reader["materijal"],
                    Duzina = (double)reader["duzina"],
                    Sirina = (double)reader["sirina"],
                    TipProizvoda = TipProizvoda.Plocice
                };
                entities.Add(plocice);
            }
            return entities;
        }

        public override string UpdateQuery(string field = "")
        {
            if (field == "parent")
                return base.UpdateQuery();

            return $"materijal = '{Materijal}', duzina = {Duzina}, sirina = {Sirina}";
        }

        public override string AddColumn()
        {
            return "";
        }
    }
}
