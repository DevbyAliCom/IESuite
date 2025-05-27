# IESuite.Brain Implant Demo

This repository contains the accompanying code for the article **"Aspire in Action: Implanting the Brain,"** which demonstrates how to integrate a central AI core into a modular .NET Aspire application, enabling real-time AI streaming.

---

## **About This Project**

This project showcases a sophisticated approach to building intelligent, real-time distributed applications using .NET Aspire. It features the integration of:

* **`IESuite.Brain`**: Our central AI unit (a .NET service) responsible for managing AI interactions and streaming responses.
* **`IESuite.Neural` (`nervenode`)**: Our Next.js client application, acting as the user's "nerve node" interface to the Brain. It currently features **Synapse Talk**, a real-time chat demo.
* **Real-Time AI Streaming**: Powered by SignalR, ensuring instantaneous communication between the Brain and the Neural client.
* **Robust Orchestration**: Leverages .NET Aspire to seamlessly manage service discovery, environment variables, and crucial configurations like CORS in a distributed environment.
* **Modular Architecture**: Built upon a hybrid Clean Architecture/Vertical Slices model, ensuring clarity, maintainability, and scalability.

This demo provides a practical example of how to combine modern AI capabilities with established architectural best practices and efficient orchestration.

## **Accompanying Article**

For a detailed explanation of the architecture, design decisions, and step-by-step implementation, please read the full article:

"Aspire in Action: Implanting the Brain" on Limkedim

---

## **Getting Started**

To run this application locally, ensure you have the following prerequisites installed:

* [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) or later
* [Node.js (LTS version recommended)](https://nodejs.org/en/download)
* [npm (comes with Node.js)](https://www.npmjs.com/get-npm)
* [Git](https://git-scm.com/downloads)
* (Optional, but recommended for full Aspire experience) Podman or [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### **1. Clone the Repository**

```bash
git clone https://github.com/DevbyAliCom/IESuite.git 
cd IESuite                                        
```
### **2. Run the Application**

Navigate to the `IESuite.AppHost` project directory and run the application using the .NET CLI:

```bash
cd IESuite.AppHost
dotnet run
```
This command will:
* Start the .NET Aspire Dashboard.
* Orchestrate and launch the `IESuite.Brain` (.NET service) and `IESuite.Neural` (`nervenode` Next.js app).
* Configure necessary environment variables and network connections.
