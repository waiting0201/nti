namespace Nti.Api.Models.Entities;

/// <summary>後台角色（docs/08 §4.14）。三個系統角色不可刪，種子見 db/seed/100_role.sql。</summary>
public sealed class Role
{
    public int    Id       { get; set; }
    public string Code     { get; set; } = null!;   // SuperAdmin|Editor|Viewer
    public string Name     { get; set; } = null!;
    public bool   IsSystem { get; set; }
}

/// <summary>
/// 角色權限（docs/09 §6 的 171 列矩陣）。
/// <para>權限碼值域見 <see cref="Common.PermissionCodes"/>；SuperAdmin 亦逐列展開，不用萬用碼。</para>
/// </summary>
public sealed class RolePermission
{
    public int    RoleId         { get; set; }
    public string PermissionCode { get; set; } = null!;
}
