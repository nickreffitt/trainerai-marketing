FROM node:22.16.0-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built Next.js application
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3010
ENV HOSTNAME="0.0.0.0"

# Expose port
EXPOSE 3010

# Start the Next.js server
CMD ["node", "server.js"]
