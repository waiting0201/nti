using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Nti.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AuditLog",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AdminUserId = table.Column<int>(type: "int", nullable: true),
                    Action = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false),
                    EntityName = table.Column<string>(type: "varchar(60)", unicode: false, maxLength: 60, nullable: false),
                    EntityId = table.Column<int>(type: "int", nullable: true),
                    ChangesJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SourceIp = table.Column<string>(type: "varchar(45)", unicode: false, maxLength: 45, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_AuditLog_CreatedAt")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLog", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Category",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryType = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: false),
                    Code = table.Column<string>(type: "varchar(40)", unicode: false, maxLength: 40, nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0)
                        .Annotation("Relational:DefaultConstraintName", "DF_Category_SortOrder"),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                        .Annotation("Relational:DefaultConstraintName", "DF_Category_IsActive"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_Category_CreatedAt"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_Category_IsDeleted")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Category", x => x.Id);
                    table.UniqueConstraint("UQ_Category_Id_Type", x => new { x.Id, x.CategoryType });
                    table.UniqueConstraint("UQ_Category_Type_Code", x => new { x.CategoryType, x.Code });
                    table.CheckConstraint("CK_Category_Type", "[CategoryType] IN ('News','Project','Vlog','Faq','Certification','Facility','SupplierNotice','Industry','QuoteMaterial')");
                });

            migrationBuilder.CreateTable(
                name: "ClientLogo",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    LogoPath = table.Column<string>(type: "nvarchar(260)", maxLength: 260, nullable: false),
                    LinkUrl = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0)
                        .Annotation("Relational:DefaultConstraintName", "DF_ClientLogo_SortOrder"),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                        .Annotation("Relational:DefaultConstraintName", "DF_ClientLogo_IsPublished"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_ClientLogo_CreatedAt"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_ClientLogo_IsDeleted")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClientLogo", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ContactMessage",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(160)", maxLength: 160, nullable: false),
                    Company = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: true),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ConsentAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false),
                    Status = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false, defaultValue: "New")
                        .Annotation("Relational:DefaultConstraintName", "DF_ContactMessage_Status"),
                    InternalNote = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RepliedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    SourceIp = table.Column<string>(type: "varchar(45)", unicode: false, maxLength: 45, nullable: true),
                    UserAgent = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    SourceLang = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: true),
                    SubmittedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_ContactMessage_SubmittedAt"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_ContactMessage_CreatedAt"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_ContactMessage_IsDeleted")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContactMessage", x => x.Id);
                    table.CheckConstraint("CK_Contact_Status", "[Status] IN ('New','Replied','Closed','Spam')");
                });

            migrationBuilder.CreateTable(
                name: "EmailLog",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MailType = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: false),
                    ToAddress = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Subject = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    RelatedEntity = table.Column<string>(type: "varchar(60)", unicode: false, maxLength: 60, nullable: true),
                    RelatedId = table.Column<int>(type: "int", nullable: true),
                    Status = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    ErrorMessage = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    SentAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_EmailLog_SentAt")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailLog", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "HomeBanner",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ImagePath = table.Column<string>(type: "nvarchar(260)", maxLength: 260, nullable: false),
                    ImagePathMobile = table.Column<string>(type: "nvarchar(260)", maxLength: 260, nullable: true),
                    MediaType = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false, defaultValue: "image")
                        .Annotation("Relational:DefaultConstraintName", "DF_HomeBanner_MediaType"),
                    VideoPath = table.Column<string>(type: "nvarchar(260)", maxLength: 260, nullable: true),
                    LinkUrl = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    OpenInNewTab = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_HomeBanner_OpenInNewTab"),
                    SortOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0)
                        .Annotation("Relational:DefaultConstraintName", "DF_HomeBanner_SortOrder"),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                        .Annotation("Relational:DefaultConstraintName", "DF_HomeBanner_IsPublished"),
                    PublishAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UnpublishAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_HomeBanner_CreatedAt"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_HomeBanner_IsDeleted")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HomeBanner", x => x.Id);
                    table.CheckConstraint("CK_HomeBanner_MediaType", "[MediaType] IN ('image','video')");
                    table.CheckConstraint("CK_HomeBanner_Video", "[MediaType] = 'image' OR [VideoPath] IS NOT NULL");
                });

            migrationBuilder.CreateTable(
                name: "IndustryTrend",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SortOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0)
                        .Annotation("Relational:DefaultConstraintName", "DF_IndustryTrend_SortOrder"),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                        .Annotation("Relational:DefaultConstraintName", "DF_IndustryTrend_IsPublished"),
                    PublishAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UnpublishAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_IndustryTrend_CreatedAt"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_IndustryTrend_IsDeleted")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IndustryTrend", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "JobPosting",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SortOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0)
                        .Annotation("Relational:DefaultConstraintName", "DF_JobPosting_SortOrder"),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                        .Annotation("Relational:DefaultConstraintName", "DF_JobPosting_IsPublished"),
                    PublishAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UnpublishAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_JobPosting_CreatedAt"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_JobPosting_IsDeleted")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobPosting", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Member",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "nvarchar(160)", maxLength: 160, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    DisplayName = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    Company = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: true),
                    PreferredLang = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false, defaultValue: "zh")
                        .Annotation("Relational:DefaultConstraintName", "DF_Member_PreferredLang"),
                    Status = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false, defaultValue: "Pending")
                        .Annotation("Relational:DefaultConstraintName", "DF_Member_Status"),
                    EmailConfirmedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    LastLoginAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    FailedLoginCount = table.Column<byte>(type: "tinyint", nullable: false, defaultValue: (byte)0)
                        .Annotation("Relational:DefaultConstraintName", "DF_Member_FailedLoginCount"),
                    LockoutEndAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_Member_CreatedAt"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_Member_IsDeleted")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Member", x => x.Id);
                    table.UniqueConstraint("UQ_Member_Email", x => x.Email);
                    table.CheckConstraint("CK_Member_PreferredLang", "[PreferredLang] IN ('zh','en')");
                    table.CheckConstraint("CK_Member_Status", "[Status] IN ('Pending','Active','Suspended')");
                });

            migrationBuilder.CreateTable(
                name: "NewsletterSubscriber",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "nvarchar(160)", maxLength: 160, nullable: false),
                    DisplayName = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: true),
                    Company = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: true),
                    PreferredLang = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false, defaultValue: "en")
                        .Annotation("Relational:DefaultConstraintName", "DF_NewsletterSubscriber_PreferredLang"),
                    Status = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false, defaultValue: "Pending")
                        .Annotation("Relational:DefaultConstraintName", "DF_NewsletterSubscriber_Status"),
                    Source = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false, defaultValue: "Website")
                        .Annotation("Relational:DefaultConstraintName", "DF_NewsletterSubscriber_Source"),
                    ConsentAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    ConfirmToken = table.Column<byte[]>(type: "varbinary(32)", nullable: true),
                    ConfirmTokenExpiresAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    ConfirmedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UnsubscribeToken = table.Column<byte[]>(type: "varbinary(32)", nullable: true),
                    UnsubscribedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UnsubscribeReason = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    LastSentAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    BounceCount = table.Column<byte>(type: "tinyint", nullable: false, defaultValue: (byte)0)
                        .Annotation("Relational:DefaultConstraintName", "DF_NewsletterSubscriber_BounceCount"),
                    SourceIp = table.Column<string>(type: "varchar(45)", unicode: false, maxLength: 45, nullable: true),
                    UserAgent = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    SourceLang = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: true),
                    SubscribedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_NewsletterSubscriber_SubscribedAt"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_NewsletterSubscriber_CreatedAt"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_NewsletterSubscriber_IsDeleted")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NewsletterSubscriber", x => x.Id);
                    table.UniqueConstraint("UQ_NewsletterSubscriber_Email", x => x.Email);
                    table.CheckConstraint("CK_NewsletterSubscriber_Lang", "[PreferredLang] IN ('zh','en')");
                    table.CheckConstraint("CK_NewsletterSubscriber_Source", "[Source] IN ('Website','Import','Admin')");
                    table.CheckConstraint("CK_NewsletterSubscriber_Status", "[Status] IN ('Pending','Subscribed','Unsubscribed','Bounced')");
                });

            migrationBuilder.CreateTable(
                name: "Page",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PageKey = table.Column<string>(type: "varchar(60)", unicode: false, maxLength: 60, nullable: false),
                    RouteTemplate = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    HasRichBody = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_Page_HasRichBody"),
                    OgImagePath = table.Column<string>(type: "nvarchar(260)", maxLength: 260, nullable: true),
                    IsIndexable = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                        .Annotation("Relational:DefaultConstraintName", "DF_Page_IsIndexable"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_Page_CreatedAt"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_Page_IsDeleted")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Page", x => x.Id);
                    table.UniqueConstraint("UQ_Page_PageKey", x => x.PageKey);
                });

            migrationBuilder.CreateTable(
                name: "Redirect",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FromPath = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: false),
                    ToPath = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: false),
                    StatusCode = table.Column<short>(type: "smallint", nullable: false, defaultValue: (short)301)
                        .Annotation("Relational:DefaultConstraintName", "DF_Redirect_StatusCode"),
                    HitCount = table.Column<int>(type: "int", nullable: false, defaultValue: 0)
                        .Annotation("Relational:DefaultConstraintName", "DF_Redirect_HitCount"),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                        .Annotation("Relational:DefaultConstraintName", "DF_Redirect_IsActive"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_Redirect_CreatedAt"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_Redirect_IsDeleted")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Redirect", x => x.Id);
                    table.CheckConstraint("CK_Redirect_Status", "[StatusCode] IN (301,302,308)");
                });

            migrationBuilder.CreateTable(
                name: "Role",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    IsSystem = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_Role_IsSystem")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Role", x => x.Id);
                    table.UniqueConstraint("UQ_Role_Code", x => x.Code);
                });

            migrationBuilder.CreateTable(
                name: "SiteSetting",
                columns: table => new
                {
                    SettingKey = table.Column<string>(type: "varchar(60)", unicode: false, maxLength: 60, nullable: false),
                    GroupName = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: false),
                    ValueType = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    IsLocalized = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_SiteSetting_IsLocalized"),
                    ValueZh = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ValueEn = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0)
                        .Annotation("Relational:DefaultConstraintName", "DF_SiteSetting_SortOrder"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SiteSetting", x => x.SettingKey);
                    table.CheckConstraint("CK_SiteSetting_Group", "[GroupName] IN ('Company','Social','Home','Mail')");
                });

            migrationBuilder.CreateTable(
                name: "Solution",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: false),
                    CoverImagePath = table.Column<string>(type: "nvarchar(260)", maxLength: 260, nullable: false),
                    OgImagePath = table.Column<string>(type: "nvarchar(260)", maxLength: 260, nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0)
                        .Annotation("Relational:DefaultConstraintName", "DF_Solution_SortOrder"),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                        .Annotation("Relational:DefaultConstraintName", "DF_Solution_IsPublished"),
                    PublishAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UnpublishAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_Solution_CreatedAt"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_Solution_IsDeleted")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Solution", x => x.Id);
                    table.UniqueConstraint("UQ_Solution_Code", x => x.Code);
                });

            migrationBuilder.CreateTable(
                name: "SupplierDownload",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FilePath = table.Column<string>(type: "nvarchar(260)", maxLength: 260, nullable: false),
                    FileExt = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    FileSizeBytes = table.Column<long>(type: "bigint", nullable: false),
                    RequireLogin = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_SupplierDownload_RequireLogin"),
                    DownloadCount = table.Column<int>(type: "int", nullable: false, defaultValue: 0)
                        .Annotation("Relational:DefaultConstraintName", "DF_SupplierDownload_DownloadCount"),
                    SortOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0)
                        .Annotation("Relational:DefaultConstraintName", "DF_SupplierDownload_SortOrder"),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                        .Annotation("Relational:DefaultConstraintName", "DF_SupplierDownload_IsPublished"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_SupplierDownload_CreatedAt"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_SupplierDownload_IsDeleted")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SupplierDownload", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SupplierSpec",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SortOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0)
                        .Annotation("Relational:DefaultConstraintName", "DF_SupplierSpec_SortOrder"),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                        .Annotation("Relational:DefaultConstraintName", "DF_SupplierSpec_IsPublished"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_SupplierSpec_CreatedAt"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_SupplierSpec_IsDeleted")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SupplierSpec", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CategoryI18n",
                columns: table => new
                {
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    Lang = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CategoryI18n", x => new { x.CategoryId, x.Lang });
                    table.CheckConstraint("CK_CategoryI18n_Lang", "[Lang] IN ('zh','en')");
                    table.ForeignKey(
                        name: "FK_CategoryI18n_Category",
                        column: x => x.CategoryId,
                        principalTable: "Category",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Certification",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryId = table.Column<int>(type: "int", nullable: true),
                    LogoPath = table.Column<string>(type: "nvarchar(260)", maxLength: 260, nullable: false),
                    LinkUrl = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    ShowOnHome = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                        .Annotation("Relational:DefaultConstraintName", "DF_Certification_ShowOnHome"),
                    SortOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0)
                        .Annotation("Relational:DefaultConstraintName", "DF_Certification_SortOrder"),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                        .Annotation("Relational:DefaultConstraintName", "DF_Certification_IsPublished"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_Certification_CreatedAt"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_Certification_IsDeleted"),
                    CategoryTypeGuard = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: true, computedColumnSql: "CAST('Certification' AS VARCHAR(30))", stored: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Certification", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Certification_Category",
                        columns: x => new { x.CategoryId, x.CategoryTypeGuard },
                        principalTable: "Category",
                        principalColumns: new[] { "Id", "CategoryType" },
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "FacilityItem",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    ImagePath = table.Column<string>(type: "nvarchar(260)", maxLength: 260, nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0)
                        .Annotation("Relational:DefaultConstraintName", "DF_FacilityItem_SortOrder"),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                        .Annotation("Relational:DefaultConstraintName", "DF_FacilityItem_IsPublished"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_FacilityItem_CreatedAt"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_FacilityItem_IsDeleted"),
                    CategoryTypeGuard = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: true, computedColumnSql: "CAST('Facility' AS VARCHAR(30))", stored: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FacilityItem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FacilityItem_Category",
                        columns: x => new { x.CategoryId, x.CategoryTypeGuard },
                        principalTable: "Category",
                        principalColumns: new[] { "Id", "CategoryType" },
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Faq",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryId = table.Column<int>(type: "int", nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0)
                        .Annotation("Relational:DefaultConstraintName", "DF_Faq_SortOrder"),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                        .Annotation("Relational:DefaultConstraintName", "DF_Faq_IsPublished"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_Faq_CreatedAt"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_Faq_IsDeleted"),
                    CategoryTypeGuard = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: true, computedColumnSql: "CAST('Faq' AS VARCHAR(30))", stored: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Faq", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Faq_Category",
                        columns: x => new { x.CategoryId, x.CategoryTypeGuard },
                        principalTable: "Category",
                        principalColumns: new[] { "Id", "CategoryType" },
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "News",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    PublishDate = table.Column<DateOnly>(type: "date", nullable: false),
                    CoverImagePath = table.Column<string>(type: "nvarchar(260)", maxLength: 260, nullable: false),
                    OgImagePath = table.Column<string>(type: "nvarchar(260)", maxLength: 260, nullable: true),
                    IsFeaturedHome = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_News_IsFeaturedHome"),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_News_IsPublished"),
                    PublishAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UnpublishAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_News_CreatedAt"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_News_IsDeleted"),
                    CategoryTypeGuard = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: true, computedColumnSql: "CAST('News' AS VARCHAR(30))", stored: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_News", x => x.Id);
                    table.ForeignKey(
                        name: "FK_News_Category",
                        columns: x => new { x.CategoryId, x.CategoryTypeGuard },
                        principalTable: "Category",
                        principalColumns: new[] { "Id", "CategoryType" },
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Project",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    ImagePath = table.Column<string>(type: "nvarchar(260)", maxLength: 260, nullable: false),
                    VideoUrl = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    StatValue = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0)
                        .Annotation("Relational:DefaultConstraintName", "DF_Project_SortOrder"),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                        .Annotation("Relational:DefaultConstraintName", "DF_Project_IsPublished"),
                    PublishAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UnpublishAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_Project_CreatedAt"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_Project_IsDeleted"),
                    CategoryTypeGuard = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: true, computedColumnSql: "CAST('Project' AS VARCHAR(30))", stored: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Project", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Project_Category",
                        columns: x => new { x.CategoryId, x.CategoryTypeGuard },
                        principalTable: "Category",
                        principalColumns: new[] { "Id", "CategoryType" },
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SupplierNotice",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    NoticeDate = table.Column<DateOnly>(type: "date", nullable: false),
                    AttachmentPath = table.Column<string>(type: "nvarchar(260)", maxLength: 260, nullable: true),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                        .Annotation("Relational:DefaultConstraintName", "DF_SupplierNotice_IsPublished"),
                    PublishAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UnpublishAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_SupplierNotice_CreatedAt"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_SupplierNotice_IsDeleted"),
                    CategoryTypeGuard = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: true, computedColumnSql: "CAST('SupplierNotice' AS VARCHAR(30))", stored: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SupplierNotice", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SupplierNotice_Category",
                        columns: x => new { x.CategoryId, x.CategoryTypeGuard },
                        principalTable: "Category",
                        principalColumns: new[] { "Id", "CategoryType" },
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Vlog",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    YoutubeId = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false),
                    ThumbOverridePath = table.Column<string>(type: "nvarchar(260)", maxLength: 260, nullable: true),
                    IsMainFeature = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_Vlog_IsMainFeature"),
                    SortOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0)
                        .Annotation("Relational:DefaultConstraintName", "DF_Vlog_SortOrder"),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                        .Annotation("Relational:DefaultConstraintName", "DF_Vlog_IsPublished"),
                    PublishAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UnpublishAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_Vlog_CreatedAt"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_Vlog_IsDeleted"),
                    CategoryTypeGuard = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: true, computedColumnSql: "CAST('Vlog' AS VARCHAR(30))", stored: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vlog", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Vlog_Category",
                        columns: x => new { x.CategoryId, x.CategoryTypeGuard },
                        principalTable: "Category",
                        principalColumns: new[] { "Id", "CategoryType" },
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "HomeBannerI18n",
                columns: table => new
                {
                    HomeBannerId = table.Column<int>(type: "int", nullable: false),
                    Lang = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    ImageAlt = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HomeBannerI18n", x => new { x.HomeBannerId, x.Lang });
                    table.CheckConstraint("CK_HomeBannerI18n_Lang", "[Lang] IN ('zh','en')");
                    table.ForeignKey(
                        name: "FK_HomeBannerI18n_HomeBanner",
                        column: x => x.HomeBannerId,
                        principalTable: "HomeBanner",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "IndustryTrendI18n",
                columns: table => new
                {
                    IndustryTrendId = table.Column<int>(type: "int", nullable: false),
                    Lang = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    BodyHtml = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IndustryTrendI18n", x => new { x.IndustryTrendId, x.Lang });
                    table.CheckConstraint("CK_IndustryTrendI18n_Lang", "[Lang] IN ('zh','en')");
                    table.ForeignKey(
                        name: "FK_IndustryTrendI18n_IndustryTrend",
                        column: x => x.IndustryTrendId,
                        principalTable: "IndustryTrend",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "JobPostingI18n",
                columns: table => new
                {
                    JobPostingId = table.Column<int>(type: "int", nullable: false),
                    Lang = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(160)", maxLength: 160, nullable: false),
                    Location = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: true),
                    DescriptionHtml = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobPostingI18n", x => new { x.JobPostingId, x.Lang });
                    table.CheckConstraint("CK_JobPostingI18n_Lang", "[Lang] IN ('zh','en')");
                    table.ForeignKey(
                        name: "FK_JobPostingI18n_JobPosting",
                        column: x => x.JobPostingId,
                        principalTable: "JobPosting",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MemberToken",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MemberId = table.Column<int>(type: "int", nullable: false),
                    TokenType = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false),
                    TokenHash = table.Column<byte[]>(type: "varbinary(32)", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false),
                    UsedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_MemberToken_CreatedAt")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MemberToken", x => x.Id);
                    table.CheckConstraint("CK_MemberToken_Type", "[TokenType] IN ('EmailVerify','PasswordReset')");
                    table.ForeignKey(
                        name: "FK_MemberToken_Member",
                        column: x => x.MemberId,
                        principalTable: "Member",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PageI18n",
                columns: table => new
                {
                    PageId = table.Column<int>(type: "int", nullable: false),
                    Lang = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    BodyHtml = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Slug = table.Column<string>(type: "nvarchar(160)", maxLength: 160, nullable: false),
                    SeoTitle = table.Column<string>(type: "nvarchar(70)", maxLength: 70, nullable: true),
                    SeoDescription = table.Column<string>(type: "nvarchar(180)", maxLength: 180, nullable: true),
                    CanonicalUrl = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    OgTitle = table.Column<string>(type: "nvarchar(90)", maxLength: 90, nullable: true),
                    OgDescription = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PageI18n", x => new { x.PageId, x.Lang });
                    table.CheckConstraint("CK_PageI18n_Lang", "[Lang] IN ('zh','en')");
                    table.ForeignKey(
                        name: "FK_PageI18n_Page",
                        column: x => x.PageId,
                        principalTable: "Page",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AdminUser",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "nvarchar(160)", maxLength: 160, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    DisplayName = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    RoleId = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                        .Annotation("Relational:DefaultConstraintName", "DF_AdminUser_IsActive"),
                    LastLoginAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    FailedLoginCount = table.Column<byte>(type: "tinyint", nullable: false, defaultValue: (byte)0)
                        .Annotation("Relational:DefaultConstraintName", "DF_AdminUser_FailedLoginCount"),
                    LockoutEndAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    MustChangePassword = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                        .Annotation("Relational:DefaultConstraintName", "DF_AdminUser_MustChangePassword"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_AdminUser_CreatedAt"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_AdminUser_IsDeleted")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdminUser", x => x.Id);
                    table.UniqueConstraint("UQ_AdminUser_Email", x => x.Email);
                    table.ForeignKey(
                        name: "FK_AdminUser_Role",
                        column: x => x.RoleId,
                        principalTable: "Role",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RolePermission",
                columns: table => new
                {
                    RoleId = table.Column<int>(type: "int", nullable: false),
                    PermissionCode = table.Column<string>(type: "varchar(60)", unicode: false, maxLength: 60, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RolePermission", x => new { x.RoleId, x.PermissionCode });
                    table.ForeignKey(
                        name: "FK_RolePermission_Role",
                        column: x => x.RoleId,
                        principalTable: "Role",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "QuoteRequest",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuoteNo = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false),
                    MemberId = table.Column<int>(type: "int", nullable: true),
                    FullName = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    Company = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(160)", maxLength: 160, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: true),
                    SolutionId = table.Column<int>(type: "int", nullable: true),
                    IndustryCategoryId = table.Column<int>(type: "int", nullable: true),
                    Quantity = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    SizeText = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    MaterialCategoryId = table.Column<int>(type: "int", nullable: true),
                    TargetDate = table.Column<DateOnly>(type: "date", nullable: true),
                    NeedsSustainableAdvice = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_QuoteRequest_NeedsSustainableAdvice"),
                    Requirement = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ConsentAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false),
                    Status = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false, defaultValue: "New")
                        .Annotation("Relational:DefaultConstraintName", "DF_QuoteRequest_Status"),
                    AssigneeId = table.Column<int>(type: "int", nullable: true),
                    InternalNote = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RepliedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    SourceIp = table.Column<string>(type: "varchar(45)", unicode: false, maxLength: 45, nullable: true),
                    UserAgent = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    SourceLang = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: true),
                    SubmittedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_QuoteRequest_SubmittedAt"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_QuoteRequest_CreatedAt"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_QuoteRequest_IsDeleted"),
                    IndustryTypeGuard = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: true, computedColumnSql: "CAST('Industry' AS VARCHAR(30))", stored: true),
                    MaterialTypeGuard = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: true, computedColumnSql: "CAST('QuoteMaterial' AS VARCHAR(30))", stored: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuoteRequest", x => x.Id);
                    table.UniqueConstraint("UQ_QuoteRequest_QuoteNo", x => x.QuoteNo);
                    table.CheckConstraint("CK_Quote_Status", "[Status] IN ('New','InProgress','Quoted','Closed','Spam')");
                    table.ForeignKey(
                        name: "FK_QuoteRequest_Industry",
                        columns: x => new { x.IndustryCategoryId, x.IndustryTypeGuard },
                        principalTable: "Category",
                        principalColumns: new[] { "Id", "CategoryType" },
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuoteRequest_Material",
                        columns: x => new { x.MaterialCategoryId, x.MaterialTypeGuard },
                        principalTable: "Category",
                        principalColumns: new[] { "Id", "CategoryType" },
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuoteRequest_Member",
                        column: x => x.MemberId,
                        principalTable: "Member",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_QuoteRequest_Solution",
                        column: x => x.SolutionId,
                        principalTable: "Solution",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SolutionI18n",
                columns: table => new
                {
                    SolutionId = table.Column<int>(type: "int", nullable: false),
                    Lang = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    H1 = table.Column<string>(type: "nvarchar(160)", maxLength: 160, nullable: false),
                    Summary = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    IntroHtml = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CoverAlt = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(160)", maxLength: 160, nullable: false),
                    SeoTitle = table.Column<string>(type: "nvarchar(70)", maxLength: 70, nullable: true),
                    SeoDescription = table.Column<string>(type: "nvarchar(180)", maxLength: 180, nullable: true),
                    CanonicalUrl = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    OgTitle = table.Column<string>(type: "nvarchar(90)", maxLength: 90, nullable: true),
                    OgDescription = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SolutionI18n", x => new { x.SolutionId, x.Lang });
                    table.CheckConstraint("CK_SolutionI18n_Lang", "[Lang] IN ('zh','en')");
                    table.ForeignKey(
                        name: "FK_SolutionI18n_Solution",
                        column: x => x.SolutionId,
                        principalTable: "Solution",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SolutionItem",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SolutionId = table.Column<int>(type: "int", nullable: false),
                    ImagePath = table.Column<string>(type: "nvarchar(260)", maxLength: 260, nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0)
                        .Annotation("Relational:DefaultConstraintName", "DF_SolutionItem_SortOrder"),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
                        .Annotation("Relational:DefaultConstraintName", "DF_SolutionItem_IsPublished"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_SolutionItem_CreatedAt"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_SolutionItem_IsDeleted")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SolutionItem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SolutionItem_Solution",
                        column: x => x.SolutionId,
                        principalTable: "Solution",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SupplierDownloadI18n",
                columns: table => new
                {
                    SupplierDownloadId = table.Column<int>(type: "int", nullable: false),
                    Lang = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SupplierDownloadI18n", x => new { x.SupplierDownloadId, x.Lang });
                    table.CheckConstraint("CK_SupplierDownloadI18n_Lang", "[Lang] IN ('zh','en')");
                    table.ForeignKey(
                        name: "FK_SupplierDownloadI18n_SupplierDownload",
                        column: x => x.SupplierDownloadId,
                        principalTable: "SupplierDownload",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SupplierSpecI18n",
                columns: table => new
                {
                    SupplierSpecId = table.Column<int>(type: "int", nullable: false),
                    Lang = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(160)", maxLength: 160, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(600)", maxLength: 600, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SupplierSpecI18n", x => new { x.SupplierSpecId, x.Lang });
                    table.CheckConstraint("CK_SupplierSpecI18n_Lang", "[Lang] IN ('zh','en')");
                    table.ForeignKey(
                        name: "FK_SupplierSpecI18n_SupplierSpec",
                        column: x => x.SupplierSpecId,
                        principalTable: "SupplierSpec",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CertificationI18n",
                columns: table => new
                {
                    CertificationId = table.Column<int>(type: "int", nullable: false),
                    Lang = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    LogoAlt = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CertificationI18n", x => new { x.CertificationId, x.Lang });
                    table.CheckConstraint("CK_CertificationI18n_Lang", "[Lang] IN ('zh','en')");
                    table.ForeignKey(
                        name: "FK_CertificationI18n_Certification",
                        column: x => x.CertificationId,
                        principalTable: "Certification",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "FacilityItemI18n",
                columns: table => new
                {
                    FacilityItemId = table.Column<int>(type: "int", nullable: false),
                    Lang = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(160)", maxLength: 160, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(600)", maxLength: 600, nullable: true),
                    ImageAlt = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FacilityItemI18n", x => new { x.FacilityItemId, x.Lang });
                    table.CheckConstraint("CK_FacilityItemI18n_Lang", "[Lang] IN ('zh','en')");
                    table.ForeignKey(
                        name: "FK_FacilityItemI18n_FacilityItem",
                        column: x => x.FacilityItemId,
                        principalTable: "FacilityItem",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "FaqI18n",
                columns: table => new
                {
                    FaqId = table.Column<int>(type: "int", nullable: false),
                    Lang = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Question = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    AnswerHtml = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FaqI18n", x => new { x.FaqId, x.Lang });
                    table.CheckConstraint("CK_FaqI18n_Lang", "[Lang] IN ('zh','en')");
                    table.ForeignKey(
                        name: "FK_FaqI18n_Faq",
                        column: x => x.FaqId,
                        principalTable: "Faq",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "NewsI18n",
                columns: table => new
                {
                    NewsId = table.Column<int>(type: "int", nullable: false),
                    Lang = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Summary = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    BodyHtml = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CoverAlt = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(160)", maxLength: 160, nullable: false),
                    SeoTitle = table.Column<string>(type: "nvarchar(70)", maxLength: 70, nullable: true),
                    SeoDescription = table.Column<string>(type: "nvarchar(180)", maxLength: 180, nullable: true),
                    CanonicalUrl = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    OgTitle = table.Column<string>(type: "nvarchar(90)", maxLength: 90, nullable: true),
                    OgDescription = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NewsI18n", x => new { x.NewsId, x.Lang });
                    table.CheckConstraint("CK_NewsI18n_Lang", "[Lang] IN ('zh','en')");
                    table.ForeignKey(
                        name: "FK_NewsI18n_News",
                        column: x => x.NewsId,
                        principalTable: "News",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ProjectI18n",
                columns: table => new
                {
                    ProjectId = table.Column<int>(type: "int", nullable: false),
                    Lang = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Summary = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    StatLabel = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: true),
                    ImageAlt = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectI18n", x => new { x.ProjectId, x.Lang });
                    table.CheckConstraint("CK_ProjectI18n_Lang", "[Lang] IN ('zh','en')");
                    table.ForeignKey(
                        name: "FK_ProjectI18n_Project",
                        column: x => x.ProjectId,
                        principalTable: "Project",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SupplierNoticeI18n",
                columns: table => new
                {
                    SupplierNoticeId = table.Column<int>(type: "int", nullable: false),
                    Lang = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    BodyHtml = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SupplierNoticeI18n", x => new { x.SupplierNoticeId, x.Lang });
                    table.CheckConstraint("CK_SupplierNoticeI18n_Lang", "[Lang] IN ('zh','en')");
                    table.ForeignKey(
                        name: "FK_SupplierNoticeI18n_SupplierNotice",
                        column: x => x.SupplierNoticeId,
                        principalTable: "SupplierNotice",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "VlogI18n",
                columns: table => new
                {
                    VlogId = table.Column<int>(type: "int", nullable: false),
                    Lang = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VlogI18n", x => new { x.VlogId, x.Lang });
                    table.CheckConstraint("CK_VlogI18n_Lang", "[Lang] IN ('zh','en')");
                    table.ForeignKey(
                        name: "FK_VlogI18n_Vlog",
                        column: x => x.VlogId,
                        principalTable: "Vlog",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderNo = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false),
                    MemberId = table.Column<int>(type: "int", nullable: false),
                    QuoteRequestId = table.Column<int>(type: "int", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Status = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false, defaultValue: "Confirmed")
                        .Annotation("Relational:DefaultConstraintName", "DF_Orders_Status"),
                    ExpectedShipDate = table.Column<DateOnly>(type: "date", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_Orders_CreatedAt"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                        .Annotation("Relational:DefaultConstraintName", "DF_Orders_IsDeleted")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                    table.UniqueConstraint("UQ_Orders_OrderNo", x => x.OrderNo);
                    table.CheckConstraint("CK_Order_Status", "[Status] IN ('Confirmed','InProduction','Shipped','Completed','Cancelled')");
                    table.ForeignKey(
                        name: "FK_Orders_Member",
                        column: x => x.MemberId,
                        principalTable: "Member",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Orders_QuoteRequest",
                        column: x => x.QuoteRequestId,
                        principalTable: "QuoteRequest",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "QuoteAttachment",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuoteRequestId = table.Column<int>(type: "int", nullable: false),
                    FilePath = table.Column<string>(type: "nvarchar(260)", maxLength: 260, nullable: false),
                    OriginalName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    ContentType = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    SizeBytes = table.Column<long>(type: "bigint", nullable: false),
                    ScanStatus = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false, defaultValue: "Pending")
                        .Annotation("Relational:DefaultConstraintName", "DF_QuoteAttachment_ScanStatus"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_QuoteAttachment_CreatedAt")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuoteAttachment", x => x.Id);
                    table.CheckConstraint("CK_QuoteAtt_Scan", "[ScanStatus] IN ('Pending','Clean','Infected')");
                    table.ForeignKey(
                        name: "FK_QuoteAttachment_QuoteRequest",
                        column: x => x.QuoteRequestId,
                        principalTable: "QuoteRequest",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SolutionItemI18n",
                columns: table => new
                {
                    SolutionItemId = table.Column<int>(type: "int", nullable: false),
                    Lang = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    ImageAlt = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SolutionItemI18n", x => new { x.SolutionItemId, x.Lang });
                    table.CheckConstraint("CK_SolutionItemI18n_Lang", "[Lang] IN ('zh','en')");
                    table.ForeignKey(
                        name: "FK_SolutionItemI18n_SolutionItem",
                        column: x => x.SolutionItemId,
                        principalTable: "SolutionItem",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "OrderProgress",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderId = table.Column<int>(type: "int", nullable: false),
                    Stage = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false),
                    StageStatus = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false),
                    HappenedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false),
                    Note = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(0)", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                        .Annotation("Relational:DefaultConstraintName", "DF_OrderProgress_CreatedAt"),
                    CreatedBy = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderProgress", x => x.Id);
                    table.CheckConstraint("CK_OrderProgress_Stage", "[Stage] IN ('Design','PrePress','Printing','PostPress','QC','Shipping')");
                    table.CheckConstraint("CK_OrderProgress_StageStatus", "[StageStatus] IN ('Pending','Doing','Done')");
                    table.ForeignKey(
                        name: "FK_OrderProgress_Orders",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Category",
                columns: new[] { "Id", "CategoryType", "Code", "CreatedAt", "CreatedBy", "IsActive", "IsDeleted", "SortOrder", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { 1, "News", "esg", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 10, null, null },
                    { 2, "News", "awards", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 20, null, null },
                    { 3, "News", "partnership", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 30, null, null },
                    { 4, "News", "sustainability", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 40, null, null },
                    { 5, "News", "event", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 50, null, null },
                    { 6, "Project", "food", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 10, null, null },
                    { 7, "Project", "pharma", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 20, null, null },
                    { 8, "Project", "cosmetics", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 30, null, null },
                    { 9, "Project", "electronics", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 40, null, null },
                    { 10, "Project", "gift", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 50, null, null },
                    { 11, "Project", "other", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 60, null, null },
                    { 12, "Vlog", "sustainability", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 10, null, null },
                    { 13, "Vlog", "low-carbon", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 20, null, null },
                    { 14, "Vlog", "awards", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 30, null, null },
                    { 15, "Faq", "general", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 10, null, null },
                    { 16, "Faq", "ordering", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 20, null, null },
                    { 17, "Faq", "materials", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 30, null, null },
                    { 18, "Faq", "sustainability", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 40, null, null },
                    { 19, "Certification", "certification", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 10, null, null },
                    { 20, "Certification", "partnership", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 20, null, null },
                    { 21, "Certification", "award", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 30, null, null },
                    { 22, "Facility", "pre-press", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 10, null, null },
                    { 23, "Facility", "eco-printing", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 20, null, null },
                    { 24, "Facility", "post-press", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 30, null, null },
                    { 25, "Facility", "quality", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 40, null, null },
                    { 26, "Facility", "tour", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 50, null, null },
                    { 27, "SupplierNotice", "policy", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 10, null, null },
                    { 28, "SupplierNotice", "esg", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 20, null, null },
                    { 29, "SupplierNotice", "quality", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 30, null, null },
                    { 30, "SupplierNotice", "logistics", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 40, null, null },
                    { 31, "Industry", "food-beverage", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 10, null, null },
                    { 32, "Industry", "electronics", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 20, null, null },
                    { 33, "Industry", "beauty", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 30, null, null },
                    { 34, "Industry", "medical", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 40, null, null },
                    { 35, "Industry", "luxury-gift", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 50, null, null },
                    { 36, "Industry", "hardware", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 60, null, null },
                    { 37, "Industry", "automotive", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 70, null, null },
                    { 38, "Industry", "publishing", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 80, null, null },
                    { 39, "Industry", "home-lifestyle", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 90, null, null },
                    { 40, "Industry", "industrial", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 100, null, null },
                    { 41, "QuoteMaterial", "fsc", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 10, null, null },
                    { 42, "QuoteMaterial", "recycled", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 20, null, null },
                    { 43, "QuoteMaterial", "kraft", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 30, null, null },
                    { 44, "QuoteMaterial", "specialty", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, 40, null, null }
                });

            migrationBuilder.InsertData(
                table: "Page",
                columns: new[] { "Id", "CreatedAt", "CreatedBy", "HasRichBody", "IsDeleted", "IsIndexable", "OgImagePath", "PageKey", "RouteTemplate", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, true, null, "home", "/{lang}", null, null },
                    { 2, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, true, null, "about-hub", "/{lang}/about", null, null },
                    { 3, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, true, null, "about-difference", "/{lang}/about/difference", null, null },
                    { 4, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, true, null, "about-benefits", "/{lang}/about/benefits", null, null },
                    { 5, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, true, null, "about-certifications", "/{lang}/about/certifications", null, null },
                    { 6, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, true, null, "facility", "/{lang}/about/facility", null, null },
                    { 7, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, true, null, "facility-pre-press", "/{lang}/about/facility/pre-press", null, null },
                    { 8, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, true, null, "facility-eco-printing", "/{lang}/about/facility/eco-printing", null, null },
                    { 9, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, true, null, "facility-post-press", "/{lang}/about/facility/post-press", null, null },
                    { 10, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, true, null, "facility-quality", "/{lang}/about/facility/quality", null, null },
                    { 11, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, true, null, "facility-tour", "/{lang}/about/facility/tour", null, null },
                    { 12, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, true, null, "solutions", "/{lang}/solutions", null, null },
                    { 13, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, true, null, "projects", "/{lang}/projects", null, null },
                    { 14, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, true, null, "sustainability-hub", "/{lang}/sustainability", null, null },
                    { 15, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, true, null, "green-our-advantage", "/{lang}/sustainability/our-advantage", null, null },
                    { 16, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, true, null, "green-carbon", "/{lang}/sustainability/carbon-efficiency", null, null },
                    { 17, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, true, null, "green-materials", "/{lang}/sustainability/eco-materials", null, null },
                    { 18, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, true, null, "green-esg", "/{lang}/sustainability/esg", null, null },
                    { 19, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, false, null, "green-csr", "/{lang}/sustainability/csr", null, null },
                    { 20, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, true, null, "insights", "/{lang}/insights", null, null },
                    { 21, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, true, null, "news-list", "/{lang}/insights/news", null, null },
                    { 22, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, true, null, "green-vlog", "/{lang}/insights/green-vlog", null, null },
                    { 23, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, true, null, "faq", "/{lang}/insights/faq", null, null },
                    { 24, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, true, null, "industry-trends", "/{lang}/insights/industry-trends", null, null },
                    { 25, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, true, null, "careers", "/{lang}/careers", null, null },
                    { 26, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, true, null, "supplier-area", "/{lang}/supplier-area", null, null },
                    { 27, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, true, null, "contact", "/{lang}/contact", null, null },
                    { 28, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, true, null, "get-a-quote", "/{lang}/get-a-quote", null, null },
                    { 29, new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, true, false, true, null, "privacy-legal", "/{lang}/privacy-legal", null, null }
                });

            migrationBuilder.InsertData(
                table: "Role",
                columns: new[] { "Id", "Code", "IsSystem", "Name" },
                values: new object[,]
                {
                    { 1, "SuperAdmin", true, "超級管理員" },
                    { 2, "Editor", true, "內容編輯" },
                    { 3, "Viewer", true, "檢視者" }
                });

            migrationBuilder.InsertData(
                table: "SiteSetting",
                columns: new[] { "SettingKey", "GroupName", "IsLocalized", "SortOrder", "UpdatedAt", "UpdatedBy", "ValueEn", "ValueType", "ValueZh" },
                values: new object[,]
                {
                    { "company.address", "Company", true, 20, null, null, null, "multiline", null },
                    { "company.email", "Company", false, 60, null, null, null, "email", null },
                    { "company.fax", "Company", false, 50, null, null, null, "text", null },
                    { "company.hours", "Company", true, 30, null, null, null, "multiline", null },
                    { "company.map_embed", "Company", false, 70, null, null, null, "url", null },
                    { "company.name", "Company", true, 10, null, null, null, "text", null },
                    { "company.phone", "Company", false, 40, null, null, null, "text", null },
                    { "home.gallery_alt", "Home", true, 20, null, null, null, "text", null },
                    { "home.gallery_image", "Home", false, 10, null, null, null, "image", null },
                    { "mail.bcc", "Mail", false, 30, null, null, null, "email", null },
                    { "mail.contact_notify_to", "Mail", false, 20, null, null, null, "email", null },
                    { "mail.quote_notify_to", "Mail", false, 10, null, null, null, "email", null },
                    { "social.facebook", "Social", false, 10, null, null, null, "url", null },
                    { "social.linkedin", "Social", false, 20, null, null, null, "url", null },
                    { "social.youtube", "Social", false, 30, null, null, null, "url", null }
                });

            migrationBuilder.InsertData(
                table: "Solution",
                columns: new[] { "Id", "Code", "CoverImagePath", "CreatedAt", "CreatedBy", "IsDeleted", "IsPublished", "OgImagePath", "PublishAt", "SortOrder", "UnpublishAt", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { 1, "boxes", "solutions/_placeholder.webp", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, null, null, 10, null, null, null },
                    { 2, "cardboard", "solutions/_placeholder.webp", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, null, null, 20, null, null, null },
                    { 3, "uv", "solutions/_placeholder.webp", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, null, null, 30, null, null, null },
                    { 4, "other", "solutions/_placeholder.webp", new DateTime(2026, 9, 4, 0, 0, 0, 0, DateTimeKind.Utc), null, false, false, null, null, 40, null, null, null }
                });

            migrationBuilder.InsertData(
                table: "CategoryI18n",
                columns: new[] { "CategoryId", "Lang", "Name" },
                values: new object[,]
                {
                    { 1, "en", "ESG" },
                    { 1, "zh", "ESG 永續" },
                    { 2, "en", "Awards" },
                    { 2, "zh", "獲獎肯定" },
                    { 3, "en", "Partnership" },
                    { 3, "zh", "合作夥伴" },
                    { 4, "en", "Sustainability" },
                    { 4, "zh", "永續發展" },
                    { 5, "en", "Events" },
                    { 5, "zh", "活動訊息" },
                    { 6, "en", "Food" },
                    { 6, "zh", "食品" },
                    { 7, "en", "Pharmaceutical" },
                    { 7, "zh", "醫藥" },
                    { 8, "en", "Cosmetics" },
                    { 8, "zh", "美妝" },
                    { 9, "en", "Electronics" },
                    { 9, "zh", "電子" },
                    { 10, "en", "Gift" },
                    { 10, "zh", "禮品" },
                    { 11, "en", "Other" },
                    { 11, "zh", "其他" },
                    { 12, "en", "Sustainability" },
                    { 12, "zh", "永續" },
                    { 13, "en", "Low Carbon" },
                    { 13, "zh", "低碳" },
                    { 14, "en", "Awards" },
                    { 14, "zh", "獲獎" },
                    { 15, "en", "General" },
                    { 15, "zh", "一般問題" },
                    { 16, "en", "Ordering" },
                    { 16, "zh", "訂購流程" },
                    { 17, "en", "Materials" },
                    { 17, "zh", "材質相關" },
                    { 18, "en", "Sustainability" },
                    { 18, "zh", "永續相關" },
                    { 19, "en", "Certifications" },
                    { 19, "zh", "認證" },
                    { 20, "en", "Partnerships" },
                    { 20, "zh", "夥伴" },
                    { 21, "en", "Awards" },
                    { 21, "zh", "獎項" },
                    { 22, "en", "Pre-Press" },
                    { 22, "zh", "印前作業" },
                    { 23, "en", "Eco Printing" },
                    { 23, "zh", "環保印刷" },
                    { 24, "en", "Post-Press" },
                    { 24, "zh", "印後加工" },
                    { 25, "en", "Quality Control" },
                    { 25, "zh", "品質檢驗" },
                    { 26, "en", "Plant Tour" },
                    { 26, "zh", "廠區導覽" },
                    { 27, "en", "Policy" },
                    { 27, "zh", "政策公告" },
                    { 28, "en", "ESG" },
                    { 28, "zh", "ESG 規範" },
                    { 29, "en", "Quality" },
                    { 29, "zh", "品質要求" },
                    { 30, "en", "Logistics" },
                    { 30, "zh", "物流配送" },
                    { 31, "en", "Food & Beverage" },
                    { 31, "zh", "食品飲料" },
                    { 32, "en", "Electronics" },
                    { 32, "zh", "電子產品" },
                    { 33, "en", "Beauty & Skincare" },
                    { 33, "zh", "美妝保養" },
                    { 34, "en", "Medical & Healthcare" },
                    { 34, "zh", "醫療保健" },
                    { 35, "en", "Luxury & Gift Packaging" },
                    { 35, "zh", "精品禮盒" },
                    { 36, "en", "Hardware & Hand Tools" },
                    { 36, "zh", "五金手工具" },
                    { 37, "en", "Automotive" },
                    { 37, "zh", "汽車產業" },
                    { 38, "en", "Publishing & Stationery" },
                    { 38, "zh", "出版文具" },
                    { 39, "en", "Home & Lifestyle" },
                    { 39, "zh", "居家生活" },
                    { 40, "en", "Industrial & Consumer Goods" },
                    { 40, "zh", "工業與消費品" },
                    { 41, "en", "FSC™-certified board" },
                    { 41, "zh", "FSC™ 認證紙板" },
                    { 42, "en", "Recycled board" },
                    { 42, "zh", "再生紙板" },
                    { 43, "en", "Kraft" },
                    { 43, "zh", "牛皮紙" },
                    { 44, "en", "Specialty / metallized" },
                    { 44, "zh", "特殊／金屬鍍膜紙材" }
                });

            migrationBuilder.InsertData(
                table: "PageI18n",
                columns: new[] { "Lang", "PageId", "BodyHtml", "CanonicalUrl", "OgDescription", "OgTitle", "SeoDescription", "SeoTitle", "Slug" },
                values: new object[,]
                {
                    { "en", 1, null, null, null, null, null, null, "home" },
                    { "zh", 1, null, null, null, null, null, null, "home" },
                    { "en", 2, null, null, null, null, null, null, "about" },
                    { "zh", 2, null, null, null, null, null, null, "about" },
                    { "en", 3, null, null, null, null, null, null, "difference" },
                    { "zh", 3, null, null, null, null, null, null, "difference" },
                    { "en", 4, null, null, null, null, null, null, "benefits" },
                    { "zh", 4, null, null, null, null, null, null, "benefits" },
                    { "en", 5, null, null, null, null, null, null, "certifications" },
                    { "zh", 5, null, null, null, null, null, null, "certifications" },
                    { "en", 6, null, null, null, null, null, null, "facility" },
                    { "zh", 6, null, null, null, null, null, null, "facility" },
                    { "en", 7, null, null, null, null, null, null, "pre-press" },
                    { "zh", 7, null, null, null, null, null, null, "pre-press" },
                    { "en", 8, null, null, null, null, null, null, "eco-printing" },
                    { "zh", 8, null, null, null, null, null, null, "eco-printing" },
                    { "en", 9, null, null, null, null, null, null, "post-press" },
                    { "zh", 9, null, null, null, null, null, null, "post-press" },
                    { "en", 10, null, null, null, null, null, null, "quality" },
                    { "zh", 10, null, null, null, null, null, null, "quality" },
                    { "en", 11, null, null, null, null, null, null, "tour" },
                    { "zh", 11, null, null, null, null, null, null, "tour" },
                    { "en", 12, null, null, null, null, null, null, "solutions" },
                    { "zh", 12, null, null, null, null, null, null, "solutions" },
                    { "en", 13, null, null, null, null, null, null, "projects" },
                    { "zh", 13, null, null, null, null, null, null, "projects" },
                    { "en", 14, null, null, null, null, null, null, "sustainability" },
                    { "zh", 14, null, null, null, null, null, null, "sustainability" },
                    { "en", 15, null, null, null, null, null, null, "our-advantage" },
                    { "zh", 15, null, null, null, null, null, null, "our-advantage" },
                    { "en", 16, null, null, null, null, null, null, "carbon-efficiency" },
                    { "zh", 16, null, null, null, null, null, null, "carbon-efficiency" },
                    { "en", 17, null, null, null, null, null, null, "eco-materials" },
                    { "zh", 17, null, null, null, null, null, null, "eco-materials" },
                    { "en", 18, null, null, null, null, null, null, "esg" },
                    { "zh", 18, null, null, null, null, null, null, "esg" },
                    { "en", 19, null, null, null, null, null, null, "csr" },
                    { "zh", 19, null, null, null, null, null, null, "csr" },
                    { "en", 20, null, null, null, null, null, null, "insights" },
                    { "zh", 20, null, null, null, null, null, null, "insights" },
                    { "en", 21, null, null, null, null, null, null, "news" },
                    { "zh", 21, null, null, null, null, null, null, "news" },
                    { "en", 22, null, null, null, null, null, null, "green-vlog" },
                    { "zh", 22, null, null, null, null, null, null, "green-vlog" },
                    { "en", 23, null, null, null, null, null, null, "faq" },
                    { "zh", 23, null, null, null, null, null, null, "faq" },
                    { "en", 24, null, null, null, null, null, null, "industry-trends" },
                    { "zh", 24, null, null, null, null, null, null, "industry-trends" },
                    { "en", 25, null, null, null, null, null, null, "careers" },
                    { "zh", 25, null, null, null, null, null, null, "careers" },
                    { "en", 26, null, null, null, null, null, null, "supplier-area" },
                    { "zh", 26, null, null, null, null, null, null, "supplier-area" },
                    { "en", 27, null, null, null, null, null, null, "contact" },
                    { "zh", 27, null, null, null, null, null, null, "contact" },
                    { "en", 28, null, null, null, null, null, null, "get-a-quote" },
                    { "zh", 28, null, null, null, null, null, null, "get-a-quote" },
                    { "en", 29, null, null, null, null, null, null, "privacy-legal" },
                    { "zh", 29, null, null, null, null, null, null, "privacy-legal" }
                });

            migrationBuilder.InsertData(
                table: "RolePermission",
                columns: new[] { "PermissionCode", "RoleId" },
                values: new object[,]
                {
                    { "admin.delete", 1 },
                    { "admin.edit", 1 },
                    { "admin.view", 1 },
                    { "audit.resend", 1 },
                    { "audit.view", 1 },
                    { "category.delete", 1 },
                    { "category.edit", 1 },
                    { "category.view", 1 },
                    { "certification.delete", 1 },
                    { "certification.edit", 1 },
                    { "certification.publish", 1 },
                    { "certification.view", 1 },
                    { "client.delete", 1 },
                    { "client.edit", 1 },
                    { "client.publish", 1 },
                    { "client.view", 1 },
                    { "contact.edit", 1 },
                    { "contact.view", 1 },
                    { "dashboard.view", 1 },
                    { "facility.delete", 1 },
                    { "facility.edit", 1 },
                    { "facility.publish", 1 },
                    { "facility.view", 1 },
                    { "faq.delete", 1 },
                    { "faq.edit", 1 },
                    { "faq.publish", 1 },
                    { "faq.view", 1 },
                    { "home-banner.delete", 1 },
                    { "home-banner.edit", 1 },
                    { "home-banner.publish", 1 },
                    { "home-banner.view", 1 },
                    { "job.delete", 1 },
                    { "job.edit", 1 },
                    { "job.publish", 1 },
                    { "job.view", 1 },
                    { "member.edit", 1 },
                    { "member.view", 1 },
                    { "news.delete", 1 },
                    { "news.edit", 1 },
                    { "news.publish", 1 },
                    { "news.view", 1 },
                    { "order.edit", 1 },
                    { "order.view", 1 },
                    { "page.edit", 1 },
                    { "page.view", 1 },
                    { "project.delete", 1 },
                    { "project.edit", 1 },
                    { "project.publish", 1 },
                    { "project.view", 1 },
                    { "quote.download", 1 },
                    { "quote.edit", 1 },
                    { "quote.export", 1 },
                    { "quote.view", 1 },
                    { "redirect.delete", 1 },
                    { "redirect.edit", 1 },
                    { "redirect.export", 1 },
                    { "redirect.view", 1 },
                    { "setting.edit", 1 },
                    { "setting.view", 1 },
                    { "solution.delete", 1 },
                    { "solution.edit", 1 },
                    { "solution.publish", 1 },
                    { "solution.view", 1 },
                    { "supplier-download.delete", 1 },
                    { "supplier-download.edit", 1 },
                    { "supplier-download.publish", 1 },
                    { "supplier-download.view", 1 },
                    { "supplier-notice.delete", 1 },
                    { "supplier-notice.edit", 1 },
                    { "supplier-notice.publish", 1 },
                    { "supplier-notice.view", 1 },
                    { "supplier-spec.delete", 1 },
                    { "supplier-spec.edit", 1 },
                    { "supplier-spec.publish", 1 },
                    { "supplier-spec.view", 1 },
                    { "trend.delete", 1 },
                    { "trend.edit", 1 },
                    { "trend.publish", 1 },
                    { "trend.view", 1 },
                    { "vlog.delete", 1 },
                    { "vlog.edit", 1 },
                    { "vlog.publish", 1 },
                    { "vlog.view", 1 },
                    { "certification.delete", 2 },
                    { "certification.edit", 2 },
                    { "certification.publish", 2 },
                    { "certification.view", 2 },
                    { "client.delete", 2 },
                    { "client.edit", 2 },
                    { "client.publish", 2 },
                    { "client.view", 2 },
                    { "contact.edit", 2 },
                    { "contact.view", 2 },
                    { "dashboard.view", 2 },
                    { "facility.delete", 2 },
                    { "facility.edit", 2 },
                    { "facility.publish", 2 },
                    { "facility.view", 2 },
                    { "faq.delete", 2 },
                    { "faq.edit", 2 },
                    { "faq.publish", 2 },
                    { "faq.view", 2 },
                    { "home-banner.delete", 2 },
                    { "home-banner.edit", 2 },
                    { "home-banner.publish", 2 },
                    { "home-banner.view", 2 },
                    { "job.delete", 2 },
                    { "job.edit", 2 },
                    { "job.publish", 2 },
                    { "job.view", 2 },
                    { "news.delete", 2 },
                    { "news.edit", 2 },
                    { "news.publish", 2 },
                    { "news.view", 2 },
                    { "page.edit", 2 },
                    { "page.view", 2 },
                    { "project.delete", 2 },
                    { "project.edit", 2 },
                    { "project.publish", 2 },
                    { "project.view", 2 },
                    { "quote.edit", 2 },
                    { "quote.view", 2 },
                    { "redirect.delete", 2 },
                    { "redirect.edit", 2 },
                    { "redirect.export", 2 },
                    { "redirect.view", 2 },
                    { "solution.delete", 2 },
                    { "solution.edit", 2 },
                    { "solution.publish", 2 },
                    { "solution.view", 2 },
                    { "supplier-download.delete", 2 },
                    { "supplier-download.edit", 2 },
                    { "supplier-download.publish", 2 },
                    { "supplier-download.view", 2 },
                    { "supplier-notice.delete", 2 },
                    { "supplier-notice.edit", 2 },
                    { "supplier-notice.publish", 2 },
                    { "supplier-notice.view", 2 },
                    { "supplier-spec.delete", 2 },
                    { "supplier-spec.edit", 2 },
                    { "supplier-spec.publish", 2 },
                    { "supplier-spec.view", 2 },
                    { "trend.delete", 2 },
                    { "trend.edit", 2 },
                    { "trend.publish", 2 },
                    { "trend.view", 2 },
                    { "vlog.delete", 2 },
                    { "vlog.edit", 2 },
                    { "vlog.publish", 2 },
                    { "vlog.view", 2 },
                    { "category.view", 3 },
                    { "certification.view", 3 },
                    { "client.view", 3 },
                    { "contact.view", 3 },
                    { "dashboard.view", 3 },
                    { "facility.view", 3 },
                    { "faq.view", 3 },
                    { "home-banner.view", 3 },
                    { "job.view", 3 },
                    { "news.view", 3 },
                    { "page.view", 3 },
                    { "project.view", 3 },
                    { "quote.view", 3 },
                    { "redirect.view", 3 },
                    { "setting.view", 3 },
                    { "solution.view", 3 },
                    { "supplier-download.view", 3 },
                    { "supplier-notice.view", 3 },
                    { "supplier-spec.view", 3 },
                    { "trend.view", 3 },
                    { "vlog.view", 3 }
                });

            migrationBuilder.InsertData(
                table: "SolutionI18n",
                columns: new[] { "Lang", "SolutionId", "CanonicalUrl", "CoverAlt", "H1", "IntroHtml", "Name", "OgDescription", "OgTitle", "SeoDescription", "SeoTitle", "Slug", "Summary" },
                values: new object[,]
                {
                    { "en", 1, null, "Custom color box packaging by NTI", "Custom Color Box Packaging", null, "Color Box Packaging", null, null, null, null, "color-box-packaging", null },
                    { "zh", 1, null, "NTI 客製化彩盒包裝成品", "客製化彩盒包裝", null, "彩盒包裝", null, null, null, null, "color-box-packaging", null },
                    { "en", 2, null, "Custom packaging paperboard by NTI", "Custom Packaging Paperboard", null, "Packaging Paperboard", null, null, null, null, "packaging-paperboard", null },
                    { "zh", 2, null, "NTI 客製化包裝紙板成品", "客製化包裝紙板", null, "包裝紙板", null, null, null, null, "packaging-paperboard", null },
                    { "en", 3, null, "Eco-friendly UV printing by NTI", "Eco-Friendly UV Printing", null, "UV Printing", null, null, null, null, "uv-printing", null },
                    { "zh", 3, null, "NTI 環保 UV 印刷成品", "環保 UV 印刷", null, "UV 印刷", null, null, null, null, "uv-printing", null },
                    { "en", 4, null, "Other printing services by NTI", "Other Printing Services", null, "Other Printing", null, null, null, null, "other-printing", null },
                    { "zh", 4, null, "NTI 其他印刷服務成品", "其他印刷服務", null, "其他印刷", null, null, null, null, "other-printing", null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AuditLog_Entity",
                table: "AuditLog",
                columns: new[] { "EntityName", "EntityId", "CreatedAt" },
                descending: new[] { false, false, true });

            migrationBuilder.CreateIndex(
                name: "IX_Category_Type",
                table: "Category",
                columns: new[] { "CategoryType", "IsActive", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_Certification_Home",
                table: "Certification",
                columns: new[] { "IsDeleted", "IsPublished", "ShowOnHome", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_Contact_Status",
                table: "ContactMessage",
                columns: new[] { "Status", "SubmittedAt" },
                descending: new[] { false, true });

            migrationBuilder.CreateIndex(
                name: "IX_HomeBanner_List",
                table: "HomeBanner",
                columns: new[] { "IsDeleted", "IsPublished", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_MemberToken_Lookup",
                table: "MemberToken",
                column: "TokenHash")
                .Annotation("SqlServer:Include", new[] { "MemberId", "ExpiresAt", "UsedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_News_List",
                table: "News",
                columns: new[] { "IsDeleted", "IsPublished", "PublishDate" },
                descending: new[] { false, false, true })
                .Annotation("SqlServer:Include", new[] { "CategoryId", "CoverImagePath" });

            migrationBuilder.CreateIndex(
                name: "UX_NewsI18n_Lang_Slug",
                table: "NewsI18n",
                columns: new[] { "Lang", "Slug" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_NewsletterSubscriber_Status",
                table: "NewsletterSubscriber",
                columns: new[] { "Status", "SubscribedAt" },
                descending: new[] { false, true })
                .Annotation("SqlServer:Include", new[] { "Email", "PreferredLang" });

            migrationBuilder.CreateIndex(
                name: "IX_OrderProgress_Order",
                table: "OrderProgress",
                columns: new[] { "OrderId", "HappenedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_Orders_Member",
                table: "Orders",
                columns: new[] { "MemberId", "CreatedAt" },
                descending: new[] { false, true });

            migrationBuilder.CreateIndex(
                name: "UX_PageI18n_Lang_Slug",
                table: "PageI18n",
                columns: new[] { "Lang", "Slug" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Project_List",
                table: "Project",
                columns: new[] { "IsDeleted", "IsPublished", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_QuoteAttachment_Quote",
                table: "QuoteAttachment",
                column: "QuoteRequestId");

            migrationBuilder.CreateIndex(
                name: "IX_Quote_Status",
                table: "QuoteRequest",
                columns: new[] { "Status", "SubmittedAt" },
                descending: new[] { false, true });

            migrationBuilder.CreateIndex(
                name: "UX_Redirect_FromPath",
                table: "Redirect",
                column: "FromPath",
                unique: true)
                .Annotation("SqlServer:Include", new[] { "ToPath", "StatusCode", "IsActive" });

            migrationBuilder.CreateIndex(
                name: "UX_SolutionI18n_Lang_Slug",
                table: "SolutionI18n",
                columns: new[] { "Lang", "Slug" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SolutionItem_Solution",
                table: "SolutionItem",
                columns: new[] { "SolutionId", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_SupplierNotice_List",
                table: "SupplierNotice",
                columns: new[] { "IsDeleted", "IsPublished", "NoticeDate" },
                descending: new[] { false, false, true });

            migrationBuilder.CreateIndex(
                name: "UX_Vlog_MainFeature",
                table: "Vlog",
                column: "IsMainFeature",
                unique: true,
                filter: "[IsMainFeature] = 1 AND [IsDeleted] = 0");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AdminUser");

            migrationBuilder.DropTable(
                name: "AuditLog");

            migrationBuilder.DropTable(
                name: "CategoryI18n");

            migrationBuilder.DropTable(
                name: "CertificationI18n");

            migrationBuilder.DropTable(
                name: "ClientLogo");

            migrationBuilder.DropTable(
                name: "ContactMessage");

            migrationBuilder.DropTable(
                name: "EmailLog");

            migrationBuilder.DropTable(
                name: "FacilityItemI18n");

            migrationBuilder.DropTable(
                name: "FaqI18n");

            migrationBuilder.DropTable(
                name: "HomeBannerI18n");

            migrationBuilder.DropTable(
                name: "IndustryTrendI18n");

            migrationBuilder.DropTable(
                name: "JobPostingI18n");

            migrationBuilder.DropTable(
                name: "MemberToken");

            migrationBuilder.DropTable(
                name: "NewsI18n");

            migrationBuilder.DropTable(
                name: "NewsletterSubscriber");

            migrationBuilder.DropTable(
                name: "OrderProgress");

            migrationBuilder.DropTable(
                name: "PageI18n");

            migrationBuilder.DropTable(
                name: "ProjectI18n");

            migrationBuilder.DropTable(
                name: "QuoteAttachment");

            migrationBuilder.DropTable(
                name: "Redirect");

            migrationBuilder.DropTable(
                name: "RolePermission");

            migrationBuilder.DropTable(
                name: "SiteSetting");

            migrationBuilder.DropTable(
                name: "SolutionI18n");

            migrationBuilder.DropTable(
                name: "SolutionItemI18n");

            migrationBuilder.DropTable(
                name: "SupplierDownloadI18n");

            migrationBuilder.DropTable(
                name: "SupplierNoticeI18n");

            migrationBuilder.DropTable(
                name: "SupplierSpecI18n");

            migrationBuilder.DropTable(
                name: "VlogI18n");

            migrationBuilder.DropTable(
                name: "Certification");

            migrationBuilder.DropTable(
                name: "FacilityItem");

            migrationBuilder.DropTable(
                name: "Faq");

            migrationBuilder.DropTable(
                name: "HomeBanner");

            migrationBuilder.DropTable(
                name: "IndustryTrend");

            migrationBuilder.DropTable(
                name: "JobPosting");

            migrationBuilder.DropTable(
                name: "News");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Page");

            migrationBuilder.DropTable(
                name: "Project");

            migrationBuilder.DropTable(
                name: "Role");

            migrationBuilder.DropTable(
                name: "SolutionItem");

            migrationBuilder.DropTable(
                name: "SupplierDownload");

            migrationBuilder.DropTable(
                name: "SupplierNotice");

            migrationBuilder.DropTable(
                name: "SupplierSpec");

            migrationBuilder.DropTable(
                name: "Vlog");

            migrationBuilder.DropTable(
                name: "QuoteRequest");

            migrationBuilder.DropTable(
                name: "Category");

            migrationBuilder.DropTable(
                name: "Member");

            migrationBuilder.DropTable(
                name: "Solution");
        }
    }
}
