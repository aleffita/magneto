# Estágio 1: Base para desenvolvimento e produção
FROM node:20-alpine AS base

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de manifesto de pacotes
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Expõe a porta que o Vite usará
EXPOSE 5173

# Comando padrão para iniciar o servidor de desenvolvimento
CMD ["npm", "run", "dev"]
