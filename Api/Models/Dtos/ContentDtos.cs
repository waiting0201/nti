namespace Nti.Api.Models.Dtos;

/// <summary>首頁 Banner（後台單元 01）。</summary>
public sealed class HomeBannerDto
{
    public int     Id              { get; set; }
    public string  ImagePath       { get; set; } = null!;
    public string? ImagePathMobile { get; set; }
    public string  MediaType       { get; set; } = null!;
    public string? VideoPath       { get; set; }
    public string? LinkUrl         { get; set; }
    public bool    OpenInNewTab    { get; set; }
    public int     SortOrder       { get; set; }
    public string  ImageAlt        { get; set; } = null!;
}

/// <summary>方案卡（後台單元 02）。首頁 Printing Solutions 四張卡與 solutions 列表共用。</summary>
public sealed class SolutionListDto
{
    public int     Id             { get; set; }
    public string  Code           { get; set; } = null!;
    public string  CoverImagePath { get; set; } = null!;
    public int     SortOrder      { get; set; }
    public string  Name           { get; set; } = null!;
    public string  H1             { get; set; } = null!;
    public string? Summary        { get; set; }
    public string  CoverAlt       { get; set; } = null!;
    public string  Slug           { get; set; } = null!;
}

/// <summary>方案詳細頁：列表欄位 + 導言 + 品項卡 + SEO。</summary>
public sealed class SolutionDetailDto
{
    public int     Id             { get; set; }
    public string  Code           { get; set; } = null!;
    public string  CoverImagePath { get; set; } = null!;
    public string  Name           { get; set; } = null!;
    public string  H1             { get; set; } = null!;
    public string? Summary        { get; set; }
    public string? IntroHtml      { get; set; }
    public string  CoverAlt       { get; set; } = null!;

    public SeoDto                 Seo   { get; set; } = null!;
    public IEnumerable<SolutionItemDto> Items { get; set; } = [];
}

public sealed class SolutionItemDto
{
    public int     Id          { get; set; }
    public string  ImagePath   { get; set; } = null!;
    public int     SortOrder   { get; set; }
    public string  Name        { get; set; } = null!;
    public string? Description { get; set; }
    public string  ImageAlt    { get; set; } = null!;
}

/// <summary>案例實績（後台單元 03）。無詳細頁，卡片即完整內容。</summary>
public sealed class ProjectDto
{
    public int     Id           { get; set; }
    public int     CategoryId   { get; set; }
    public string  CategoryCode { get; set; } = null!;
    public string  CategoryName { get; set; } = null!;
    public string  ImagePath    { get; set; } = null!;
    public string? VideoUrl     { get; set; }
    public string? StatValue    { get; set; }
    public int     SortOrder    { get; set; }
    public string  Title        { get; set; } = null!;
    public string? Summary      { get; set; }
    public string? StatLabel    { get; set; }
    public string  ImageAlt     { get; set; } = null!;
}

/// <summary>最新消息列表（後台單元 04）。</summary>
public sealed class NewsListDto
{
    public int      Id             { get; set; }
    public int      CategoryId     { get; set; }
    public string   CategoryCode   { get; set; } = null!;
    public string   CategoryName   { get; set; } = null!;
    public DateOnly PublishDate    { get; set; }
    public string   CoverImagePath { get; set; } = null!;
    public bool     IsFeaturedHome { get; set; }
    public string   Title          { get; set; } = null!;
    public string?  Summary        { get; set; }
    public string   CoverAlt       { get; set; } = null!;
    public string   Slug           { get; set; } = null!;
}

/// <summary>最新消息詳細頁。</summary>
public sealed class NewsDetailDto
{
    public int      Id             { get; set; }
    public int      CategoryId     { get; set; }
    public string   CategoryCode   { get; set; } = null!;
    public string   CategoryName   { get; set; } = null!;
    public DateOnly PublishDate    { get; set; }
    public string   CoverImagePath { get; set; } = null!;
    public string   Title          { get; set; } = null!;
    public string?  Summary        { get; set; }
    public string   BodyHtml       { get; set; } = null!;
    public string   CoverAlt       { get; set; } = null!;

    public SeoDto   Seo            { get; set; } = null!;
}

/// <summary>Green Vlog（後台單元 05）。無詳細頁，外連 YouTube。</summary>
public sealed class VlogDto
{
    public int     Id                { get; set; }
    public int     CategoryId        { get; set; }
    public string  CategoryCode      { get; set; } = null!;
    public string  CategoryName      { get; set; } = null!;
    public string  YoutubeId         { get; set; } = null!;
    public string? ThumbOverridePath { get; set; }
    public bool    IsMainFeature     { get; set; }
    public int     SortOrder         { get; set; }
    public string  Title             { get; set; } = null!;
    public string? Description       { get; set; }
}

/// <summary>常見問題（後台單元 06）。分類可為空——faq 頁的「未分組」區塊。</summary>
public sealed class FaqDto
{
    public int     Id           { get; set; }
    public int?    CategoryId   { get; set; }
    public string? CategoryCode { get; set; }
    public string? CategoryName { get; set; }
    public int     SortOrder    { get; set; }
    public string  Question     { get; set; } = null!;
    public string  AnswerHtml   { get; set; } = null!;
}

/// <summary>產業趨勢（後台單元 07）。</summary>
public sealed class IndustryTrendDto
{
    public int    Id        { get; set; }
    public int    SortOrder { get; set; }
    public string Title     { get; set; } = null!;
    public string BodyHtml  { get; set; } = null!;
}

/// <summary>認證／夥伴／獎項（後台單元 08）。</summary>
public sealed class CertificationDto
{
    public int     Id           { get; set; }
    public int?    CategoryId   { get; set; }
    public string? CategoryCode { get; set; }
    public string? CategoryName { get; set; }
    public string  LogoPath     { get; set; } = null!;
    public string? LinkUrl      { get; set; }
    public bool    ShowOnHome   { get; set; }
    public int     SortOrder    { get; set; }
    public string  Name         { get; set; } = null!;
    public string? Description  { get; set; }
    public string  LogoAlt      { get; set; } = null!;
}

/// <summary>客戶 logo（後台單元 09）。品牌名不翻譯，<see cref="Name"/> 同時作為 alt。</summary>
public sealed class ClientLogoDto
{
    public int     Id        { get; set; }
    public string  Name      { get; set; } = null!;
    public string  LogoPath  { get; set; } = null!;
    public string? LinkUrl   { get; set; }
    public int     SortOrder { get; set; }
}

/// <summary>設備卡（後台單元 10）。<see cref="CategoryCode"/> 即 facility 的五個子頁。</summary>
public sealed class FacilityItemDto
{
    public int     Id           { get; set; }
    public int     CategoryId   { get; set; }
    public string  CategoryCode { get; set; } = null!;
    public string  CategoryName { get; set; } = null!;
    public string  ImagePath    { get; set; } = null!;
    public int     SortOrder    { get; set; }
    public string  Name         { get; set; } = null!;
    public string? Description  { get; set; }
    public string  ImageAlt     { get; set; } = null!;
}

/// <summary>職缺（後台單元 11）。</summary>
public sealed class JobPostingDto
{
    public int     Id              { get; set; }
    public int     SortOrder       { get; set; }
    public string  Title           { get; set; } = null!;
    public string? Location        { get; set; }
    public string  DescriptionHtml { get; set; } = null!;
}
