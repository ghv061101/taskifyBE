FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy dependency files from backend
COPY Backend/package*.json ./

# Install production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy backend source code
COPY Backend/ .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /usr/src/app
USER nextjs

# Set environment for production
ENV PORT=10000
ENV NODE_ENV=production

EXPOSE 10000
CMD ["npm", "start"]
