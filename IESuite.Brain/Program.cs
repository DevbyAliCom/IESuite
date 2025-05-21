using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace IESuite.Brain
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var configuration = builder.Configuration;
           
            builder.AddServiceDefaults();
            builder.Services.AddHealthChecks();
            builder.Services.AddHttpClient<IChatClient, ChatClient>();
            builder.Services.AddSingleton<OpenAI.OpenAIClient>(sp =>
            {
                //var configuration = sp.GetRequiredService<IConfiguration>();
                var apiKey = configuration["OpenAI-ApiKey"];
                if (string.IsNullOrEmpty(apiKey))
                {
                    var errorMessage = "OpenAI API key ('OpenAI-ApiKey') not found in configuration. Ensure it is set in appsettings.json, user secrets, or environment variables.";
                    var logger = sp.GetRequiredService<ILogger<Program>>();
                    logger.LogCritical(errorMessage);
                    throw new InvalidOperationException(errorMessage);
                }
                return new OpenAI.OpenAIClient(apiKey);
            });

            builder.Services.AddScoped<IChatClient, ChatClient>(sp =>
            {
                var openAIClient = sp.GetRequiredService<OpenAI.OpenAIClient>();
                var logger = sp.GetRequiredService<ILogger<ChatClient>>();
                // var configuration = sp.GetRequiredService<IConfiguration>();
                var apiKey = configuration["OpenAI-ApiKey"];
                var model = configuration["OpenAI-Model"] ?? "gpt-4o"; // Default to "gpt-4o" if not specified
                var sdkChatClient = openAIClient.GetChatClient(model);
                return new Brain.ChatClient(sdkChatClient, logger); // Explicitly namespace if needed
            });
            
            
            var app = builder.Build();
            
            app.MapGet("/api/brain/ping", () => Results.Ok("Pong from IESuite.Brain!"));

            app.MapPost("/api/brain/chat", async (string payload, IChatClient chatClient) =>
            {
                try
                {
                    var response =  chatClient.SendMessageAsync(payload);
                    return Results.Ok(new { Reply = response });
                }
                catch (Exception ex)
                {
                    // Log the exception
                    return Results.Problem($"An error occurred: {ex.Message}");
                }
            });
            
            app.Run();
        }
    }
}