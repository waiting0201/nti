using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Nti.Api.Common;
using Nti.Api.Data;
using Nti.Api.Models.Entities;
using System.Net;
using System.Net.Mail;

namespace Nti.Api.Services;

/// <summary>SMTP 寄信 + EmailLog。Scoped——它要寫 <see cref="AppDbContext"/>。</summary>
public sealed class EmailService(
    IConfiguration cfg,
    AppDbContext db,
    ILogger<EmailService> logger) : IEmailService
{
    /// <summary>重寄時保留原本的 EmailLog，另寫一筆新的——重寄次數本身就是稽核資訊。</summary>
    public async Task<bool?> ResendAsync(long emailLogId, CancellationToken cancellationToken = default)
    {
        var original = await db.EmailLog.AsNoTracking().FirstOrDefaultAsync(x => x.Id == emailLogId, cancellationToken);
        if (original is null) return null;

        return await SendAsync(original.MailType, original.ToAddress, original.Subject,
            $"<p>（重寄）</p>", original.RelatedEntity, original.RelatedId, cancellationToken);
    }

    public async Task<bool> SendAsync(
        string  mailType,
        string  toAddress,
        string  subject,
        string  htmlBody,
        string? relatedEntity = null,
        int?    relatedId     = null,
        CancellationToken cancellationToken = default)
    {
        string? error = null;

        try
        {
            var host = cfg["Smtp:Host"] ?? throw new InvalidOperationException("Smtp:Host is required.");
            var from = cfg["Smtp:From"] ?? throw new InvalidOperationException("Smtp:From is required.");
            var port = int.TryParse(cfg["Smtp:Port"], out var p) ? p : 587;

            using var client = new SmtpClient(host, port)
            {
                EnableSsl   = true,
                Credentials = new NetworkCredential(cfg["Smtp:User"], cfg["Smtp:Password"]),
            };

            using var message = new MailMessage(from, toAddress, subject, htmlBody) { IsBodyHtml = true };
            await client.SendMailAsync(message, cancellationToken);
        }
        catch (Exception ex)
        {
            // 收件者信箱格式錯、SMTP 認證失敗、對方伺服器拒收……都不該讓表單提交失敗。
            // 日誌不寫完整 email（docs/10 §9.10），細節在 EmailLog 裡。
            error = ex.Message.Length > 1000 ? ex.Message[..1000] : ex.Message;
            logger.LogError(ex, "寄信失敗：mailType={MailType} relatedEntity={Entity} relatedId={Id}",
                mailType, relatedEntity, relatedId);
        }

        db.EmailLog.Add(new EmailLog
        {
            MailType      = mailType,
            ToAddress     = toAddress,
            Subject       = subject,
            RelatedEntity = relatedEntity,
            RelatedId     = relatedId,
            Status        = error is null ? "Sent" : "Failed",
            ErrorMessage  = error,
            SentAt        = Clock.UtcNow,
        });
        await db.SaveChangesAsync(cancellationToken);

        return error is null;
    }
}
