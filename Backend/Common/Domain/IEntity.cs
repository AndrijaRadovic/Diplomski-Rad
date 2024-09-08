using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Common
{
    public interface IEntity
    {
        [JsonIgnore]
        string TableName { get; }
        [JsonIgnore]
        string PrimaryKey { get; }
        List<IEntity> GetReaderList(SqlDataReader reader);
        IEntity GetReaderResult(SqlDataReader reader);
        string GetParameters(string use = "");
        void PrepareCommand(SqlCommand command, string use = "");
        string UpdateQuery(string field = "");
        string JoinQuery();
        string GetByIdQuery(string use = "");
        string GetSearchAttributes();
        string GetFilterQuery(string filter, string field = "");
        List<IEntity> ReadAllSearch(SqlDataReader reader);
        string GetTableName(string use = "");
        string AddColumn();
        string OrderByQuery();
    }
}
