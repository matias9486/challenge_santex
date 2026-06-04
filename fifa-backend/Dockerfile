FROM node:22-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH"

RUN corepack enable

WORKDIR /usr/src/app

# Copiamos los archivos de dependencias Y TAMBIÉN el archivo de configuración del workspace
COPY package*.json pnpm-lock.yaml* pnpm-workspace.yaml* ./

# Ahora pnpm install va a leer tu lista de 'allowBuilds' instalando todo lo necesario
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

# Copiamos el resto del código
COPY . .

EXPOSE 3000

CMD ["pnpm", "run", "start:dev"]