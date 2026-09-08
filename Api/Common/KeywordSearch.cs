using System.Linq.Expressions;
using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Nti.Api.Common;

/// <summary>
/// 後台清單的關鍵字搜尋（04-api §3.4 的 <c>keyword</c> 參數）。
/// <para>
/// <b>搜尋一定要下推到 SQL</b>：後台清單一律分頁（docs/10 §8.7），在前端過濾當頁資料
/// 只會搜到那 20 筆，第二頁以後的資料明明符合卻找不到——比沒有搜尋更誤導人。
/// </para>
/// <para>
/// 搜尋範圍是**所有有長度上限的字串欄**，與 <c>FillI18nAsync</c> 挑欄位的規則同一條：
/// <c>nvarchar(max)</c>（內文 HTML）不進來。內文動輒數 KB，逐列 LIKE 掃描會把
/// Basic 的 5 DTU 吃光，而且後台要找的是標題與名稱，不是內文段落。
/// </para>
/// </summary>
public static class KeywordSearch
{
    /// <summary>LIKE 的跳脫字元。使用者輸入的 % 與 _ 要當成字面值，不能當萬用字元。</summary>
    private const char Escape = '\\';

    private static readonly MethodInfo EfProperty = typeof(EF)
        .GetMethod(nameof(EF.Property), BindingFlags.Public | BindingFlags.Static)!
        .MakeGenericMethod(typeof(string));

    private static readonly MethodInfo Like = typeof(DbFunctionsExtensions).GetMethod(
        nameof(DbFunctionsExtensions.Like),
        [typeof(DbFunctions), typeof(string), typeof(string), typeof(string)])!;

    /// <summary>
    /// 組出「任一個有長度上限的字串欄含有關鍵字」的條件；該實體沒有可搜尋的欄位時回 null。
    /// </summary>
    public static Expression<Func<T, bool>>? Predicate<T>(IEntityType type, string keyword)
    {
        var pattern   = Expression.Constant($"%{EscapeLike(keyword)}%");
        var escapeArg = Expression.Constant(Escape.ToString());
        var functions = Expression.Constant(EF.Functions);
        var parameter = Expression.Parameter(typeof(T), "e");

        Expression? body = null;

        foreach (var property in Searchable(type))
        {
            var value = Expression.Call(EfProperty, parameter, Expression.Constant(property.Name));
            var like  = Expression.Call(Like, functions, value, pattern, escapeArg);

            body = body is null ? like : Expression.OrElse(body, like);
        }

        return body is null ? null : Expression.Lambda<Func<T, bool>>(body, parameter);
    }

    /// <summary>沒有 i18n 側表的清單直接用這個：關鍵字為空就原樣回傳。</summary>
    public static IQueryable<T> Apply<T>(IQueryable<T> query, IEntityType type, string? keyword)
    {
        if (keyword is null) return query;

        var predicate = Predicate<T>(type, keyword);
        return predicate is null ? query : query.Where(predicate);
    }

    /// <summary>有長度上限的字串欄，排除影子屬性。</summary>
    public static IEnumerable<IProperty> Searchable(IEntityType type) =>
        type.GetProperties().Where(p =>
            !p.IsShadowProperty() &&
            p.ClrType == typeof(string) &&
            p.GetMaxLength() is not null);

    /// <summary>兩個條件取聯集。第二個參數的參數節點會被換成第一個的，兩式才組得起來。</summary>
    public static Expression<Func<T, bool>> Or<T>(Expression<Func<T, bool>> left, Expression<Func<T, bool>> right)
    {
        var rebound = new ParameterReplacer(right.Parameters[0], left.Parameters[0]).Visit(right.Body);
        return Expression.Lambda<Func<T, bool>>(Expression.OrElse(left.Body, rebound), left.Parameters[0]);
    }

    private static string EscapeLike(string value) => value
        .Replace(Escape.ToString(), $"{Escape}{Escape}")
        .Replace("%", $"{Escape}%")
        .Replace("_", $"{Escape}_")
        .Replace("[", $"{Escape}[");

    private sealed class ParameterReplacer(ParameterExpression from, ParameterExpression to) : ExpressionVisitor
    {
        protected override Expression VisitParameter(ParameterExpression node) => node == from ? to : node;
    }
}
