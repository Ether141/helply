# syntax=docker/dockerfile:1

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY Helply.MessagingContracts/Helply.MessagingContracts.csproj Helply.MessagingContracts/
COPY Helply.Worker/Helply.Worker.csproj Helply.Worker/

RUN dotnet restore Helply.Worker/Helply.Worker.csproj

COPY . .

RUN dotnet publish Helply.Worker/Helply.Worker.csproj -c Release -o /app/publish /p:UseAppHost=false


FROM mcr.microsoft.com/dotnet/runtime:10.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish ./

ENTRYPOINT ["dotnet", "Helply.Worker.dll"]
