# Step 1: Build Stage
FROM node:20 AS builder

# Set the working directory inside the container
WORKDIR /my-app

# Copy the package.json and package-lock.json (or yarn.lock) for dependencies
COPY package.json package-lock.json ./

# Install dependencies (including dev dependencies)
RUN npm install

# Copy the entire project to the container
COPY . .

# Build the Next.js project (including Tailwind CSS processing)
RUN npm run build

# Step 2: Production Stage
FROM node:20-slim

# Set the working directory inside the container
WORKDIR /my-app

# Copy only the necessary files from the build stage
COPY --from=builder /my-app/.next /my-app/.next
COPY --from=builder /my-app/public /my-app/public
COPY --from=builder /my-app/package.json /my-app/package.json
COPY --from=builder /my-app/package-lock.json /my-app/package-lock.json

# Install production dependencies
RUN npm install --only=production

# Expose the port that Next.js will run on
EXPOSE 3000

# Start the Next.js app in production mode
CMD ["npm", "start"]
