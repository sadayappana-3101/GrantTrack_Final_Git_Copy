using System.Text;
using AutoMapper;
using GrantTrack.Application.Mapping;
using GrantTrack.Domain.Entities;
using GrantTrack.Repository;
using GrantTrack.Repository.DisbursementRepositories;
using GrantTrack.Repository.ApplicationRepositories;
using GrantTrack.Repository.Interface;
using GrantTrack.Repository.ProgramRepository;
using GrantTrack.Service;
using GrantTrack.Service.ApplicationServices;
using GrantTrack.Service.AuthServices;
using GrantTrack.Service.DisbursementServices;
using GrantTrack.Service.Interfaces;
using GrantTrack.Service.ProgramServices;
using GrantTrack.Utility;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using DotNetEnv;
using GrantTrack.Service.RecommendationService;
using GrantTrack.Service.ReviewFilterService;
using GrantTrack.Service.ReviewService;
using GrantTrack.Repository.ReviewRepository;
using GrantTrack.Repository.RecommendationRepository;
using GrantTrack.Repository.DecisionRepositories;
using GrantTrack.Service.DecisionServices;
using GrantTrack.Repository.AuditLogRepoistories;
using GrantTrack.Repository.ComplianceCheckRepository;
using GrantTrack.Service.ComplianceCheckServices;
using GrantTrack.Repository.NotificationRepository;
using GrantTrack.Service.NotificationServices;
using GrantTrack.Dto.NotificationsDtos;
using GrantTrack.Repository.DocumentRepository;
using GrantTrack.Service.DocumentServices;
using GrantTrack.Service.ApproverServices;
using GrantTrack.Service.AdminApplicationServices;
using GrantTrack.Service.FinanceServices;
using GrantTrack.Service.ComplianceListServices;
using GrantTrack.Repository.GrantReportRepository;
using GrantTrack.Service.GrantReportServices;


Env.Load();
var DefaultConnection = Environment.GetEnvironmentVariable("DefaultConnection");
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowApi", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
builder.Services.AddControllers().AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true;
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter(
                namingPolicy: null,
                allowIntegerValues: true));
    });
builder.Services.AddDbContext<GrantTrackDbContext>(options => options.UseSqlServer(
DefaultConnection));
builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<MappingProfile>();
});
builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
builder.Services.AddScoped<IRecommendationRepository, RecommendationRepository>();
builder.Services.AddScoped<IRecommendationService, RecommendationService>();
builder.Services.AddScoped<IReviewFilterService, ReviewFilterService>();
builder.Services.AddScoped<IDisbursementRepository, DisbursementRepository>();
builder.Services.AddScoped<IDisbursementService, DisbursementService>();
builder.Services.AddScoped<IProgramService, ProgramService>();
builder.Services.AddScoped<IProgramRepository, ProgramRepository>();
builder.Services.AddScoped<IDecisionService, DecisionService>();
builder.Services.AddScoped<IDecisionRepository, DecisionRepository>();
builder.Services.AddScoped<IAuditLogRepository, AuditLogRepository>();
builder.Services.AddScoped<IApplicationRepository, ApplicationRepository>();
builder.Services.AddScoped<IApplicationService, ApplicationService>();
builder.Services.AddSingleton<IEventPublisher, InMemoryEventPublisher>();
builder.Services.AddScoped<IComplianceCheckService, ComplianceCheckService>();
builder.Services.AddScoped<IComplianceCheckRepository, ComplianceCheckRepository>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
builder.Services.AddScoped<INotificationServices, NotificationService>();
builder.Services.AddScoped<IDocumentRepository, DocumentRepository>();
builder.Services.AddScoped<IDocumentService, DocumentService>();
builder.Services.AddScoped<IApproverService, ApproverService>();
builder.Services.AddScoped<IAdminApplicationService, AdminApplicationService>();
builder.Services.AddScoped<IFinanceService, FinanceService>();
builder.Services.AddScoped<IComplianceListService, ComplianceListService>();
builder.Services.AddScoped<IGrantReportRepository, GrantReportRepository>();
builder.Services.AddScoped<IGrantReportService, GrantReportService>();
builder.Services.AddSignalR();

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authentication using Bearer scheme"
    }); 
    options.AddSecurityRequirement(doc => new OpenApiSecurityRequirement
    {
        {new OpenApiSecuritySchemeReference("Bearer",doc),new List<string>()}
    });
});

var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"];
builder.Services.AddAuthentication("Bearer").AddJwtBearer(options =>
{
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateAudience = true,
        ValidateIssuer = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});
var app = builder.Build();
app.UseSwagger();
app.UseSwaggerUI();
app.MapHub<NotificationHub>("/notificationHub");
app.UseCors("AllowApi");
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
