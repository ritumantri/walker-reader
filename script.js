document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Draw the solid top layer
    ctx.fillStyle = "black";  // Change color as needed
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    let lastSpeed = 0;
    
    function erase(x, y, size) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    if (window.DeviceMotionEvent) {
        window.addEventListener("devicemotion", (event) => {
            const acc = event.accelerationIncludingGravity;
            if (acc) {
                let speed = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
                let brushSize = Math.min(50, Math.max(5, speed * 5)); // Scale brush size
                
                if (speed > 1) { // Threshold to prevent unwanted erasure
                    let x = Math.random() * canvas.width;
                    let y = Math.random() * canvas.height;
                    erase(x, y, brushSize);
                }
                
                lastSpeed = speed;
            }
        });
    }
    
    if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", (event) => {
            let tiltX = event.beta;  // Front-back tilt
            let tiltY = event.gamma; // Left-right tilt
            
            let x = (tiltY / 90) * canvas.width; // Map tilt to screen
            let y = (tiltX / 180) * canvas.height;
            
            erase(x, y, Math.max(5, lastSpeed * 5));
        });
    }
});
