# Stage 1: Install dependencies
FROM node:18-alpine AS deps

# Set working directory
WORKDIR /app

# Install dependencies only when needed
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Build the app
FROM node:18-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set env for build
ENV NEXT_PUBLIC_API_URL=http://217.65.146.240:5000

# Build the Next.js app
RUN npm run build

# Stage 3: Run the app
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy built files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV PORT=8000
EXPOSE 8000
CMD ["npm", "start"]

# Use official Node.js LTS image as base