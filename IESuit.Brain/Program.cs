using IESuit.Brain;
using IESuit.Brain.Services;
using Microsoft.AspNetCore.SignalR;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policyBuilder =>
    {
        string urlConfigKey = "services:nervenode:nervenodehttp:0"; 
        var allowedOrigin = builder.Configuration[urlConfigKey];
        if (!string.IsNullOrEmpty(allowedOrigin))
        {
            var originUri = new Uri(allowedOrigin);
            var formattedOrigin = $"{originUri.Scheme}://{originUri.Authority}";
            policyBuilder.WithOrigins(formattedOrigin)
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials(); // ESSENTIAL FOR SIGNALR
            Console.WriteLine($"CORS (Brain/SignalR Hub): Allowing origin: {formattedOrigin}");
        }
        else
        {
            Console.WriteLine($"CORS (Brain/SignalR Hub): nervechat URL for CORS not found ('{urlConfigKey}'). Fronted calls will fail.");
        }
    });
});

builder.AddServiceDefaults();
builder.Services.AddHealthChecks();
builder.Configuration.AddAzureKeyVaultSecrets(connectionName: "key-vault");
builder.Services.AddSignalR()
    .AddNamedAzureSignalR("signalr");

builder.Services.AddSingleton<OpenAI.OpenAIClient>(sp =>
{
    var configuration = sp.GetRequiredService<IConfiguration>();
    var apiKey = configuration["openai:key"];

    if (string.IsNullOrEmpty(apiKey))
    {
        var logger = sp.GetRequiredService<ILogger<Program>>();
        var errorMessage = "OpenAI API key ('Openai:key') not found in configuration.";
        logger.LogCritical(errorMessage);
        throw new InvalidOperationException(errorMessage);
    }

    return new OpenAI.OpenAIClient(apiKey);
});


builder.Services.AddScoped<IChatStreamService, ChatStreamService>(sp =>
{
    var sdkOpenAiClient = sp.GetRequiredService<OpenAI.OpenAIClient>();
    var logger = sp.GetRequiredService<ILogger<ChatStreamService>>();
    return new ChatStreamService(sdkOpenAiClient, logger);
});


var app = builder.Build();

// app.MapPost("/api/pingbrain", async (
//     UserMessage incoming,
//     IChatStreamService chatStreamService) =>
// {
//     var response = await chatStreamService.SendMessageAsync(incoming.Content);
//
//     return Results.Ok(new UserMessage
//     {
//         Sender = "brain",
//         Content = response,
//         SentTime = DateTime.UtcNow
//     });
// }).WithName("GetChatService");

    
app.UseRouting();    
app.UseHttpsRedirection();
app.UseCors();             
app.UseAuthorization(); 
app.MapHub<ChatReceptor>("/receptor");

  app.Run();
