# Uway Backend

Backend for Uway.

## Endpoints

### Get Speed Cameras

Generates a JWT token after verifying the user's subscription status via RevenueCat.

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
-   **URL**: `https://uway-backend-3kp6.onrender.com/api/directions?profile=profileType&startCoordinates=lon,lat&destinationCoordinates=lon,lat&excludeTypes=type&waypoint=lon,lat`
-   **Parameters**:
    -   `profile`: The type of routing profile (e.g., `driving`, `walking`, `cycling`).
    -   `startCoordinates`: Longitude and latitude of the starting point.
    -   `destinationCoordinates`: Longitude and latitude of the destination.
    -   `excludeTypes` (optional): Road types to exclude from routing (e.g., `toll`, `highway`).
    -   `waypoint` (optional): An intermediate point along the route.
-   **Response**:
    -   Returns a FeatureCollection JSON with the route details, including waypoints and step-by-step directions.
