using System.ClientModel;
using Microsoft.AspNetCore.SignalR;
using OpenAI.Chat;

namespace IESuit.Brain.Services;

public class ChatReceptor(
    IChatStreamService chatStreamService,ILogger<ChatReceptor> logger ) : Hub
{
    private readonly OpenAI.Chat.ChatClient _sDkOpenAChatClient = chatStreamService.GetRawChatClient();
    
    private readonly ILogger<ChatReceptor> _logger = logger ?? throw new ArgumentNullException(nameof(logger));

    private static readonly List<UserMessage> MessageHistory = new();

    public async Task PostMessage(string content)
    {
        var senderId = Context.ConnectionId;
        var userMessage = new UserMessage
        {
            Sender = Context.ConnectionId,
            Content = content,
            SentTime = DateTime.UtcNow
        };
        using var cts = new CancellationTokenSource();
        //echo user
        await Clients.Client(Context.ConnectionId)
            .SendAsync("ReceiveMessage",  userMessage.Content, DateTime.UtcNow, cancellationToken: cts.Token);

        var completionUpdates = _sDkOpenAChatClient.CompleteChatStreamingAsync(userMessage.Content);
        await foreach (var update in completionUpdates.WithCancellation(cts.Token))
        {
            if (update.ContentUpdate.Count > 0)
            {
                var chunkText = update.ContentUpdate[0].Text;
                
                var connectionId = Context.ConnectionId;

                await Clients.Client(connectionId)
                    .SendAsync("ReceiveMessage", "brain", chunkText, DateTime.UtcNow, cancellationToken: cts.Token);
        
            }
        }
        await Clients.Client(Context.ConnectionId)
             .SendAsync("ReceiveMessage", "brain", "StreamEnd", DateTime.UtcNow, cancellationToken: cts.Token);
      

        // Store history
        MessageHistory.Add(userMessage);
    }
    
    public async Task RetrieveMessageHistory() =>
        await Clients.Caller.SendAsync("MessageHistory", MessageHistory);
}

public class UserMessage
{
    public string Sender { get; set; } =string.Empty;
    public string Content { get; set; } =string.Empty;
    public DateTime SentTime { get; set; } =DateTime.UtcNow;
};
