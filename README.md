# Explorage

Explorage is a full-featured accommodation booking platform that allows users to explore, list, and book unique places to stay. Similar to Airbnb, the platform enables property owners to list their spaces while travelers can discover and book these accommodations.



## Features

- **User Authentication**: Secure signup, login, and logout functionality
- **Property Listings**: Browse, search, and filter accommodation listings
- **Interactive Maps**: Geolocation features to find properties using Mapbox
- **Review System**: Leave and read reviews for properties
- **Image Upload**: Support for multiple property images using Cloudinary
- **Responsive Design**: Mobile-friendly interface that works on all devices
- **User Profiles**: Manage your listings and bookings

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js with Local Strategy
- **Frontend**: EJS templates, Bootstrap 5, CSS3
- **Maps**: Mapbox API
- **Image Storage**: Cloudinary
- **Session Management**: express-session with MongoDB store
- **Deployment**: Render

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Cloudinary account
- Mapbox account

## Installation

### Option 1: Local Development

1. Clone the repository
   ```
   git clone https://github.com/yourusername/explorage.git
   cd explorage
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret
   MAP_TOKEN=your_mapbox_token
   ATLASDB_URL=your_mongodb_atlas_connection_string
   SECRET=your_session_secret
   ```

4. Start the development server
   ```
   npm run dev
   ```

5. Visit `http://localhost:8080` in your browser

### Option 2: Docker Development

1. Clone the repository
   ```
   git clone https://github.com/yourusername/explorage.git
   cd explorage
   ```

2. Create a `.env` file with your environment variables

3. Build and run with Docker Compose
   ```
   docker-compose up --build
   ```

4. Visit `http://localhost:8080` in your browser

### Option 3: Production Docker

1. Build the Docker image
   ```
   docker build -t explorage .
   ```

2. Run the container
   ```
   docker run -p 8080:8080 --env-file .env explorage
   ```

## Docker

### Building the Image
```bash
docker build -t explorage .
```

### Running with Docker Compose
```bash
docker-compose up --build
```

### Running the Container
```bash
docker run -p 8080:8080 --env-file .env explorage
```

## CI/CD Pipeline

This project includes a GitHub Actions CI/CD pipeline that:
- Runs tests on multiple Node.js versions
- Builds and pushes Docker images to Docker Hub
- Automatically deploys to Render

### Setup GitHub Secrets
Add these secrets to your GitHub repository:
- `DOCKER_USERNAME`: Your Docker Hub username
- `DOCKER_PASSWORD`: Your Docker Hub password/token
- `RENDER_SERVICE_ID`: Your Render service ID
- `RENDER_API_KEY`: Your Render API key

## Deployment

### Render (Current)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the service:
   - **Build Command**: `npm install`
   - **Start Command**: `node app.js`
   - **Node Version**: 18.x or higher

4. Add the following environment variables:
   - `NODE_ENV`: production
   - `CLOUD_NAME`: your_cloudinary_cloud_name
   - `CLOUD_API_KEY`: your_cloudinary_api_key
   - `CLOUD_API_SECRET`: your_cloudinary_api_secret
   - `MAP_TOKEN`: your_mapbox_token
   - `ATLASDB_URL`: your_mongodb_atlas_connection_string
   - `SECRET`: your_session_secret

5. Deploy your application

### Alternative Platforms

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions on deploying to:
- Railway
- DigitalOcean App Platform
- AWS ECS
- Google Cloud Run

## MongoDB Atlas Setup

1. Create a cluster on MongoDB Atlas
2. Create a database user with read/write privileges
3. Whitelist all IP addresses (0.0.0.0/0) or just Render's IPs
4. Get your connection string and add it to the `.env` file

## Project Structure 