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
- **Deployment**: Google Kubernetes Engine (GKE), Docker
- **CI/CD**: GitHub Actions

## Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account
- Cloudinary account
- Mapbox account
- Google Cloud Platform account (for GKE deployment)

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

## Kubernetes Deployment

Explorage is configured to run on Kubernetes with the following components:

- **Deployment**: Manages pod replicas and updates
- **Service**: Exposes the application to external traffic
- **HorizontalPodAutoscaler**: Automatically scales pods based on CPU usage
- **Secrets**: Manages sensitive environment variables

### Local Kubernetes Testing (Minikube)

1. Start Minikube
   ```bash
   minikube start
   ```

2. Create the namespace
   ```bash
   kubectl create namespace explorage
   ```

3. Apply Kubernetes manifests
   ```bash
   kubectl apply -f kubernetes/secret.yaml
   kubectl apply -f kubernetes/deployment.yaml
   kubectl apply -f kubernetes/service.yaml
   kubectl apply -f kubernetes/hpa.yaml
   ```

### Google Kubernetes Engine Deployment

The application is set up for automatic deployment to Google Kubernetes Engine through GitHub Actions CI/CD pipeline.

#### Prerequisites for GKE Deployment

1. Create a GKE cluster in your Google Cloud Project
2. Create a service account with the following roles:
   - Kubernetes Engine Developer
   - Storage Admin

3. Download the service account key JSON file

4. Add the following secrets to your GitHub repository:
   - `GKE_PROJECT`: Your Google Cloud Project ID
   - `GKE_SA_KEY`: The content of your service account key JSON file

## CI/CD Pipeline

This project includes a streamlined GitHub Actions CI/CD pipeline that:
- Runs tests on Node.js 20.x
- Builds and pushes Docker images to Google Container Registry
- Automatically deploys to Google Kubernetes Engine

### GitHub Actions Workflow

The CI/CD process follows these steps in a single job:

2. **Build & Push**: Build the Docker image and push it to Google Container Registry
3. **Deploy**: Apply the Kubernetes manifests to the GKE cluster

The simplified workflow:
- Combines all steps into a single job to reduce build time
- Only deploys when pushing to the main branch
- Uses conditional steps for deployment stages

### Required GitHub Secrets

Add these secrets to your GitHub repository:
- `GKE_PROJECT`: Your Google Cloud Project ID
- `GKE_SA_KEY`: Your Google Cloud Service Account key (JSON format)

## Deployment Options

### Google Kubernetes Engine (GKE) - Current

The application is deployed to Google Kubernetes Engine for scalability and reliability:

1. **Managed Environment**: GKE handles Kubernetes control plane management
2. **Auto-scaling**: Horizontal Pod Autoscaler adjusts replica count based on load
3. **High Availability**: Multiple replicas ensure application uptime
4. **Automated Updates**: CI/CD pipeline ensures seamless deployments



## Health Monitoring

The application includes a health endpoint at `/health` that returns the status, timestamp, and uptime of the service. This endpoint is used by Kubernetes for:

- **Liveness Probe**: Verifies the application is running and responsive
- **Readiness Probe**: Confirms the application is ready to handle requests

The health endpoint response format:
```json
{
  "status": "OK",
  "timestamp": "2023-09-24T12:34:56.789Z", 
  "uptime": 3600
}
```

## Project Structure