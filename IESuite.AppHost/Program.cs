
 var builder = DistributedApplication.CreateBuilder(args);

var keyVault = builder.AddConnectionString("key-vault");
 
var signalr =builder.AddConnectionString("signalr");

var nervechat = builder
    .AddNpmApp("nervenode", "../IESuite.Neural/nervenode", "dev") 
    .WithHttpEndpoint(name: "nervenodehttp", env: "PORT"); 

var brain = builder.AddProject<Projects.IESuit_Brain>("brain") 
    .WithHttpEndpoint(name: "brainapi") 
    .WithReference(keyVault)
    .WithReference(signalr)
    .WaitFor(signalr)
    .WithReference(nervechat); 

nervechat.WithEnvironment("NEXT_PUBLIC_BRAIN_HUB_URL", brain.GetEndpoint("brainapi"));
 
builder.Build().Run();


