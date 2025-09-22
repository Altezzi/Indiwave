FROM node:18-alpine

# Install git for cloning repositories
RUN apk add --no-cache git

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy Prisma schema first (needed for postinstall)
COPY prisma ./prisma

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application (with build-time environment variables)
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
