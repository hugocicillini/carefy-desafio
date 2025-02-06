# Usando uma imagem do Node.js
FROM node:20-alpine

# Definindo o diretório de trabalho
WORKDIR /app

# Copiar os arquivos de dependência
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante dos arquivos do projeto
COPY . .

# Expõe a porta que o aplicativo vai rodar
EXPOSE 5000

# Comando para rodar a aplicação
CMD ["npm", "run", "dev"]
