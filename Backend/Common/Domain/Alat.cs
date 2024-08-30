using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace Common.Domain
{
    [Serializable]
    public class Alat : Proizvod
    {
        public TipAlata TipAlata { get; set; }
        public new string TableName => "Alat";
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

            return "@sifraProizvoda, @tipAlata";
        }
        public override void PrepareCommand(SqlCommand command, string use = "")
        {
            if (use == "parent")
                base.PrepareCommand(command, use);

            else
            {
                command.Parameters.AddWithValue("@sifraProizvoda", SifraProizvoda);
                command.Parameters.AddWithValue("@tipAlata", TipAlata.ToString());
            }
        }
        public override string GetSearchAttributes()
        {
            return "Proizvod.sifraProizvoda, nazivProizvoda, cena, tipAlata";
        }

        public override string JoinQuery()
        {
            return " inner join Proizvod on Alat.sifraProizvoda = Proizvod.sifraProizvoda";
        }

        public override List<IEntity> ReadAllSearch(SqlDataReader reader)
        {
            List<IEntity> entities = new List<IEntity>();
            while (reader.Read())
            {
                Alat alat = new Alat
                {
                    SifraProizvoda = (int)reader["sifraProizvoda"],
                    Cena = (double)reader["cena"],
                    NazivProizvoda = (string)reader["nazivProizvoda"],
                    TipAlata = (TipAlata)Enum.Parse(typeof(TipAlata), (string)reader["tipAlata"]),
                    TipProizvoda = TipProizvoda.Alat
                };
                entities.Add(alat);
            }
            return entities;
        }

        public override string UpdateQuery(string field = "")
        {
            if (field == "parent")
                return base.UpdateQuery();

            return $"tipAlata = '{TipAlata.ToString()}'";
        }

        public override string AddColumn()
        {
            return "";
        }
    }
}
