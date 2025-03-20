let scrollPosition = 0;
let lastRSSI = null;

window.onload = scanForBeacon;

async function scanForBeacon() {
    try {
        console.log("Scanning for Bluetooth Beacons...");
        
        const scan = await navigator.bluetooth.requestLEScan({
            acceptAllAdvertisements: true
        });

        navigator.bluetooth.addEventListener('advertisementreceived', (event) => {
            let rssi = event.rssi;
            console.log("Beacon RSSI:", rssi);

            if (lastRSSI !== null) {
                let change = rssi - lastRSSI;

                // Adjust based on movement sensitivity
                if (change > 2) { 
                    scrollPosition -= 10; // Move up when signal strengthens
                } else if (change < -2) {
                    scrollPosition += 10; // Move down when signal weakens
                }

                // Smooth scrolling effect
                document.getElementById("content").style.transition = "transform 0.3s ease-out";
                document.getElementById("content").style.transform = `translateY(${scrollPosition}px)`;
            }

            lastRSSI = rssi; // Store last RSSI to compare movement

        });

    } catch (error) {
        console.error("Bluetooth error:", error);
    }
}

// Disable scrolling via touch
document.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });

document.getElementById("connectButton").addEventListener("click", scanForBeacon);
