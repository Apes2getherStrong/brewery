# Use .NET SDK image for building the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ENV ASPNETCORE_ENVIRONMENT=Development
WORKDIR /app

# Copy only the csproj file and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy the rest of the application and publish it
COPY . ./
RUN dotnet publish -c Release -o /app/out

# Use the runtime image to run the app
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
COPY --from=build /app/out .

# Set entry point for the application
ENTRYPOINT ["dotnet", "brewery-backend.dll"]
