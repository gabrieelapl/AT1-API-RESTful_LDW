# backend/Dockerfile
# 1. Define a imagem de origem base 
FROM node:24-alpine

# 2. Configura o diretorio global do pnpm fora do volume /app para evitar conflitos
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# 3. Define diretório de trabalho interno do container
WORKDIR /app

# 4. Instalar o pnpm globalmente para gerenciar as dependências
RUN npm install -g pnpm

# Desativa a restrição de scripts de build do pnpm 11
RUN pnpm config set strict-dep-builds false

# 5. Copia apenas o manifesto de dependências
COPY package.json ./

# 6. Instalar as dependências do projeto
RUN pnpm install

# 7. Copia todo o restante do código
COPY . .

# 8. Expõe a porta padrão LDW
EXPOSE 3000

# 9. Comando para inicializar a aplicação
CMD ["pnpm", "dev"]