
namespace IESuit.Brain.Services;

public interface IChatStreamService
{
    Task<string> SendMessageAsync(string message);
    OpenAI.Chat.ChatClient GetRawChatClient();
    
}

public class ChatStreamService(
    OpenAI.OpenAIClient sDkOpenAiClient ,
    ILogger<ChatStreamService> logger) : IChatStreamService
{
    internal readonly OpenAI.Chat.ChatClient SDkOpenAChatClient = sDkOpenAiClient.GetChatClient("gpt-4o"); 
    
    private readonly ILogger<ChatStreamService> _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    public OpenAI.Chat.ChatClient GetRawChatClient() => SDkOpenAChatClient;
    public async Task<string> SendMessageAsync(string message)
    {
        try
        {
            _logger.LogInformation("Sending message to OpenAI chat model.");
            var response = await SDkOpenAChatClient.CompleteChatAsync(message);
            _logger.LogInformation("Received response from OpenAI.");
            return  $"[ASSISTANT]: {response.Value.Content[0].Text}";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending message via ChatClient.");
            throw;
        }
    }
    
}