let scrollPosition = 0;

async function connectToBeacon() {
    try {
        console.log("Scanning for Bluetooth Beacons...");
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['battery_service'] // Replace with your beacon's service UUID if known
        });

        const server = await device.gatt.connect();
        console.log("Connected to beacon:", device.name);

        device.addEventListener('advertisementreceived', (event) => {
            let rssi = event.rssi; // Signal strength (lower means farther)
            console.log("Beacon RSSI:", rssi);

            if (rssi > -60) { // Strong signal, move up
                scrollPosition -= 20;
            } else if (rssi < -75) { // Weak signal, move down
                scrollPosition += 10;
            }

            document.getElementById("content").style.transform = `translateY(${scrollPosition}px)`;
        });

    } catch (error) {
        console.error("Bluetooth error:", error);
    }
}

document.getElementById("connectButton").addEventListener("click", connectToBeacon);
