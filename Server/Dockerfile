FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the React dev server port
EXPOSE 5000

# Start the development server
CMD ["npm", "run", "start"]
