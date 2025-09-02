FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
# copy all project (also with node_modules if it not in gitignore)
COPY . .
ENV PORT=5000
EXPOSE 5000
CMD ["node", "server.js"]  
