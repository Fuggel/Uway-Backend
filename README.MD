# NavSync Backend

NavSync Backend is serving the NavSync app, enabling users to access and report speed cameras.

## Endpoints

### Get Speed Cameras

Retrieve speed camera locations based on the provided coordinates.

-   **Method**: `GET`
-   **URL**: `https://navsync-backend.onrender.com/api/speed-cameras?coordinates=lng,lat`
-   **Parameters**:
    -   `lng`: Longitude of the coordinates.
    -   `lat`: Latitude of the coordinates.
-   **Response**:
    -   Returns a **FeatureCollection** JSON containing a list of speed camera locations within the specified coordinates.

### Report Speed Camera

Submit a new speed camera location report.

-   **Method**: `POST`
-   **URL**: `https://navsync-backend.onrender.com/api/report-speed-camera`
-   **Body**:
    -   `deviceId`: **String** - Unique ID of the device reporting the speed camera.
    -   `coordinates`: **Array** - An array containing `lng` (Longitude) and `lat` (Latitude).
    -   `direction`: **String** - Heading direction for the speed camera.
    -   `type`: **Enum** - Type of speed camera, either `mobile` or `stationary`.
-   **Response**:
    -   Returns a feature object for the reported speed camera.

## Tech Stack

-   TypeScript
-   Express.js
