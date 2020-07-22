#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs


FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs
WORKDIR /src
COPY ["audio-player.csproj", ""]
RUN dotnet restore "./audio-player.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "audio-player.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "audio-player.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
CMD ASPNETCORE_URLS=http://*:$PORT dotnet audio-player.dll