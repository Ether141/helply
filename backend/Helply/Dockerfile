# syntax=docker/dockerfile:1

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY Helply.sln ./
COPY Helply/Helply.csproj Helply/
COPY Helply.MessagingContracts/Helply.MessagingContracts.csproj Helply.MessagingContracts/
COPY Helply.Worker/Helply.Worker.csproj Helply.Worker/

RUN dotnet restore Helply.sln

COPY . .

RUN dotnet publish Helply/Helply.csproj -c Release -o /app/publish /p:UseAppHost=false


FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=build /app/publish ./

ENTRYPOINT ["dotnet", "Helply.dll"]
