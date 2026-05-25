using GrantTrack.Dto.NotificationsDtos;
using GrantTrack.Service.Interfaces; // Verify if it's INotificationService or INotificationServices
using GrantTrack.Service.NotificationServices;
using Microsoft.AspNetCore.Mvc;

namespace GrantTrack.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationController : ControllerBase
{
    private readonly INotificationServices _notificationService;
    private readonly ILogger<NotificationController> _logger;

    public NotificationController(INotificationServices notificationService, ILogger<NotificationController> logger)
    {
        _notificationService = notificationService;
        _logger = logger;
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserNotifications(int userId)
    {
        try
        {
            var notifications = await _notificationService.GetUserNotificationsAsync(userId);
            return Ok(notifications);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error fetching notifications for user {userId}");
            return StatusCode(500, new { message = "Cannot fetch notifications", error = ex.Message });
        }
    }

    [HttpGet("unread-count/{userId}")]
    public async Task<IActionResult> GetUnreadCount(int userId)
    {
        try
        {
            var count = await _notificationService.GetUnreadCountAsync(userId);
            return Ok(new { unreadCount = count });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error getting count for user {userId}");
            return StatusCode(500, new { message = "Cannot get count", error = ex.Message });
        }
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendNotification([FromBody] NotificationsCreateDto createDto)
    {
        if (createDto == null) return BadRequest("Data is empty macha!");

        try
        {
            await _notificationService.SendNotificationAsync(createDto);
            return Ok(new { message = "Notification sent and pushed successfully!" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error: {ex.Message}");
        }
    }
}