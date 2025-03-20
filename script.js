let scrollPosition = 0;
let lastPosition = null;

async function trackMovement() {
    if (!navigator.geolocation) {
        console.error("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            console.log("Current Position:", latitude, longitude);

            if (lastPosition) {
                let distance = getDistanceFromLatLonInMeters(
                    lastPosition.latitude,
                    lastPosition.longitude,
                    latitude,
                    longitude
                );

                console.log("Moved:", distance, "meters");

                if (distance > 2) {
                    scrollPosition -= 10; // Move up if walking forward
                } else if (distance < -2) {
                    scrollPosition += 10; // Move down if moving backward
                }

                document.getElementById("content").style.transition = "transform 0.3s ease-out";
                document.getElementById("content").style.transform = `translateY(${scrollPosition}px)`;
            }

            lastPosition = { latitude, longitude };
        },
        (error) => {
            console.error("Geolocation error:", error);
        },
        { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
    );
}

// Function to calculate distance between two GPS points
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

// Disable scrolling via touch
document.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });

// Start tracking when the button is clicked
document.getElementById("connectButton").addEventListener("click", trackMovement);
