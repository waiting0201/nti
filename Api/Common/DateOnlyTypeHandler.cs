using Dapper;
using System.Data;

namespace Nti.Api.Common;

/// <summary>
/// Dapper 的 <see cref="DateOnly"/> 對應（<c>DATE</c> 欄位）。
/// <para>
/// Dapper 讀出來的是 <see cref="DateTime"/>，而 <see cref="DateOnly"/> 不是 <see cref="IConvertible"/>，
/// 少了這個 handler 會在執行期炸 <c>Error parsing column</c>——編譯期看不出來，
/// 而且只有真的查到資料時才會發作（空結果集不會觸發）。
/// </para>
/// </summary>
public sealed class DateOnlyTypeHandler : SqlMapper.TypeHandler<DateOnly>
{
    public override DateOnly Parse(object value) => value switch
    {
        DateOnly d  => d,
        DateTime dt => DateOnly.FromDateTime(dt),
        string s    => DateOnly.Parse(s),
        _           => throw new InvalidCastException($"無法將 {value.GetType()} 轉為 DateOnly。"),
    };

    public override void SetValue(IDbDataParameter parameter, DateOnly value)
    {
        parameter.DbType = DbType.Date;
        parameter.Value  = value.ToDateTime(TimeOnly.MinValue);
    }

    /// <summary>在 <c>Program.cs</c> 啟動時呼叫一次。</summary>
    public static void Register()
    {
        SqlMapper.AddTypeHandler(new DateOnlyTypeHandler());
        SqlMapper.AddTypeHandler(new NullableDateOnlyTypeHandler());
    }
}

/// <summary>可空版本——Dapper 的 handler 是逐型別註冊的，<c>DateOnly?</c> 要另外掛。</summary>
public sealed class NullableDateOnlyTypeHandler : SqlMapper.TypeHandler<DateOnly?>
{
    public override DateOnly? Parse(object value) => value is null or DBNull
        ? null
        : DateOnly.FromDateTime(Convert.ToDateTime(value));

    public override void SetValue(IDbDataParameter parameter, DateOnly? value)
    {
        parameter.DbType = DbType.Date;
        parameter.Value  = value?.ToDateTime(TimeOnly.MinValue) ?? (object)DBNull.Value;
    }
}
