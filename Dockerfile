# Étape 1 : Build de l'application
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2 : Image de production avec http-server
FROM node:20-alpine

WORKDIR /app

# Installation globale de http-server
RUN npm install -g http-server

# Copier les fichiers statiques générés
COPY --from=build /app/dist .

# Exposer le port
EXPOSE 3000

# Lancer le serveur
CMD ["http-server", "-p", "3000"]