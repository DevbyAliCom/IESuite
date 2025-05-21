// namespace IESuite.AppHost;
//
// public class ClientAppResource(string name) : ContainerResource(name)
// {
//     internal const string HttpEndpointName = "client-http";
// }
//
// public static class  ClientAppExtentions
// {
//     public static IResourceBuilder<ClientAppResource> AddClientApp(
//         this IDistributedApplicationBuilder builder,
//         string name, int? httpPort = 34733)
//     {
//         var resource=new ClientAppResource(name);
//         return  builder.AddResource(resource).WithImage("clientapp:v1")
//             .WithHttpEndpoint(targetPort: 3000,port:httpPort, name:ClientAppResource.HttpEndpointName);
//        
//      }
// }