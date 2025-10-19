# Uway Backend

Express.js backend service for the [Uway app](https://github.com/Fuggel/Uway) providing REST API endpoints for location services, real-time traffic data, and WebSocket communication for live warnings.

## Architecture

<img src="architecture.png" alt="Architecture" style="border-radius: 8px;" />

## Features

-   **JWT Authentication**: RevenueCat subscription validation and token generation
-   **Location Services**: Speed cameras, speed limits, and traffic incidents
-   **Search Integration**: Mapbox-powered location search and suggestions
-   **Gas Station Data**: Real-time fuel prices and station information
-   **Route Optimization**: Turn-by-turn directions with customizable exclusions
-   **Real-time Warnings**: WebSocket-based incident and speed camera alerts
-   **Rate Limiting**: API protection and usage control

## Tech Stack

-   **Express.js** with TypeScript
-   **Socket.IO** for WebSocket communication
-   **JWT** for authentication
-   **Turf.js** for geospatial calculations

## Quick Setup

```bash
# Install dependencies
npm install

# Copy environment template and adjust as needed
cp .env.example .env

# Start development server
npm run dev
```

## Development Commands

| Command         | Description              |
| --------------- | ------------------------ |
| `npm install`   | Install dependencies     |
| `npm run dev`   | Start development server |
| `npm run build` | Build TypeScript         |
| `npm start`     | Start production server  |

## API Endpoints

### Get JWT

Generates a JWT after verifying the user's subscription status via RevenueCat.

-   **Method**: `GET`
-   **URL**: `https://uway-backend-3kp6.onrender.com/api/get-token?rcUserId=rcUserId`
-   **Parameters**:
    -   `rcUserId`: The RevenueCat user ID to validate subscription status.
-   **Response**:
    -   Returns a JWT token if the subscription is active.

### Get Speed Cameras

Retrieve speed camera locations based on the provided coordinates.

-   **Method**: `GET`
-   **URL**: `https://uway-backend-3kp6.onrender.com/api/speed-cameras?lon=lon&lat=lat`
-   **Parameters**:
    -   `lon`: Longitude of the user's location.
    -   `lat`: Latitude of the user's location.
-   **Response**:
    -   Returns a FeatureCollection JSON containing a list of speed camera locations within the specified coordinates.

### Get Speed Limits

Retrieve speed limits based on the provided coordinates.

-   **Method**: `GET`
-   **URL**: `https://uway-backend-3kp6.onrender.com/api/speed-limits?lon=lon&lat=lat`
-   **Parameters**:
    -   `lon`: Longitude of the user's location.
    -   `lat`: Latitude of the user's location.
-   **Response**:

    -   Returns a FeatureCollection JSON containing a list of speed limit locations within the specified coordinates.

### Get Search Suggestions

Retrieve location search suggestions based on user input.

-   **Method**: `GET`
-   **URL**: `https://uway-backend-3kp6.onrender.com/api/search-suggestions?query=QUERY&sessionToken=TOKEN&lon=lon&lat=lat`
-   **Parameters**:
    -   `query`: The Mapbox ID of the location.
    -   `sessionToken`: A unique session token for the request.
    -   `lon`: Longitude of the user's location.
    -   `lat`: Latitude of the user's location.
-   **Response**:
    -   Returns a list of suggested locations based on the search query and coordinates.

### Get Search Locations

Retrieve detailed location information based on a Mapbox ID.

-   **Method**: `GET`
-   **URL**: `https://uway-backend-3kp6.onrender.com/api/search-locations?mapboxId=ID&sessionToken=TOKEN`
-   **Parameters**:
    -   `mapboxId`: The Mapbox ID of the location.
    -   `sessionToken`: A unique session token for the request.
-   **Response**:

    -   Returns detailed location information corresponding to the Mapbox ID.

### Get Incidents

Retrieve real-time traffic incidents based on the provided coordinates.

-   **Method**: `GET`
-   **URL**: `https://uway-backend-3kp6.onrender.com/api/incidents?lon=lon&lat=lat`
-   **Parameters**:
    -   `lon`: Longitude of the user's location.
    -   `lat`: Latitude of the user's location.
-   **Response**:
    -   Returns a FeatureCollection JSON containing a list of traffic incidents within the specified area.

### Get Gas Stations

Retrieve nearby gas stations based on the provided coordinates.

-   **Method**: `GET`
-   **URL**: `https://uway-backend-3kp6.onrender.com/api/gas-stations?lon=lon&lat=lat`
-   **Parameters**:
    -   `lon`: Longitude of the user's location.
    -   `lat`: Latitude of the user's location.
-   **Response**:
    -   Returns a FeatureCollection JSON containing a list of gas stations within the specified radius.

### Get Directions

Retrieve route directions based on the provided start and destination coordinates.

-   **Method**: `GET`
-   **URL**: `https://uway-backend-3kp6.onrender.com/api/directions?profile=profileType&startCoordinates=lon,lat&destinationCoordinates=lon,lat&excludeTypes=type`
-   **Parameters**:
    -   `profile`: The type of routing profile (e.g., `driving`, `walking`, `cycling`).
    -   `startCoordinates`: Longitude and latitude of the starting point.
    -   `destinationCoordinates`: Longitude and latitude of the destination.
    -   `excludeTypes` (optional): Road types to exclude from routing (e.g., `toll`, `highway`).
-   **Response**:
    -   Returns a FeatureCollection JSON with the route details, including waypoints and step-by-step directions.

## WebSocket

### Warning Manager

Enables real-time alerts for incidents and speed cameras based on the user's live location.

#### Emit: `user-location`

Send periodically (e.g., every 2 seconds) while navigation is active.

-   **Payload**:

    ```ts
    {
        eventType: "incident" | "speed-camera";
        lon: number;
        lat: number;
        heading: number;
        speed: number;
        userId: string;
        eventWarningType: string | null;
    }
    ```

-   **Example**:

    ```ts
    {
        eventType: "speed-camera",
        lon: 13.405,
        lat: 52.52,
        heading: 170,
        speed: 65,
        userId: "XYZ123",
        eventWarningType: null
    }
    ```

Send one user-location event periodically per event type (incident, speed-camera).

#### Listen: `warning-manager`

The backend responds with a warning when the user is near a relevant event.

-   **Response Payload**:

    ```ts
    {
        warningType: "incident" | "speed-camera";
        warningState: "early" | "late";
        eventWarningType: string;
        textToSpeech: string;
        text: string;
    }
    ```

-   **Example**:

    ```ts
    {
        warningType: "speed-camera",
        warningState: "early",
        eventWarningType: "fixed",
        textToSpeech: "Fixed speed camera in 300 meters.",
        text: "Fixed speed camera in 300 m."
    }
    ```

Use this to trigger TTS announcements and/or local notifications in the mobile app.
