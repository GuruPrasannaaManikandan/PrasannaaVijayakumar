// Typed JS already present
if (typeof Typed !== 'undefined') {
    if (document.querySelector(".multiple-text")) {
        var typed1 = new Typed(".multiple-text", {
            strings: ["Frontend", "Backend"],
            typeSpeed: 100,
            backSpeed: 200,
            backDelay: 1000,
            loop: true
        });
    }
    if (document.querySelector(".multiple")) {
        var typed2 = new Typed(".multiple", {
            strings: ["Youtuber.", "Blogger."],
            typeSpeed: 100,
            backSpeed: 200,
            backDelay: 1000,
            loop: true
        });
    }
}

// Mobile Nav Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    // --- ADDED: Toggle body overflow when nav is shown/hidden ---
    document.body.classList.toggle('no-scroll');
});

// --- ADDED: Close nav when a link is clicked (for better UX on mobile) ---
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
        // Enforce perfect vertical centering of the section inside the scrollable frame
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if(targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        if (navLinks.classList.contains('show')) {
            navLinks.classList.remove('show');
            document.body.classList.remove('no-scroll');
        }
    });
});

// --- ADDED: Scroll Spy for Active Navigation Link ---
const sections = document.querySelectorAll('section');
const navLinksAnchors = document.querySelectorAll('.details a');
const scrollWrapper = document.querySelector('.content-wrapper');

scrollWrapper.addEventListener('scroll', () => {
    let current = 'home'; // default to home

    sections.forEach(section => {
        // Find the relative offset top of the section inside the scrollWrapper
        const sectionTop = section.offsetTop;
        
        // Use scrollWrapper.scrollTop to track the scroll position
        if (scrollWrapper.scrollTop >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    navLinksAnchors.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === `#${current}`) {
            a.classList.add('active');
        }
    });
});
// --- END SCROLL SPY ---

// --- START: UNIVERSE BACKGROUND CANVAS SCRIPT ---

// Get the canvas element and its 2D rendering context
const canvas = document.getElementById('universeCanvas');
const ctx = canvas.getContext('2d');

let animationFrameId; // To store the requestAnimationFrame ID for stopping animation

// Function to resize canvas to full window dimensions
// This is crucial for responsiveness and needs to re-initialize elements
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars.length = 0; // Clear existing stars before re-initializing
    initStars();      // Re-initialize stars for new canvas dimensions
    initMilkyWay();   // Re-initialize Milky Way for new canvas dimensions
}

// Star properties
const stars = [];
const numStars = 1000; // Number of stars for a dense field
const starSpeed = 0.5; // Base speed for stars

// Star constructor function
function Star() {
    this.x = Math.random() * canvas.width; // Random initial X position
    this.y = Math.random() * canvas.height; // Random initial Y position
    this.size = Math.random() * 2 + 0.5; // Random size between 0.5 and 2.5 pixels
    this.speed = Math.random() * starSpeed * 0.5 + 0.1; // Random speed, slightly slower for distant feel
    this.opacity = Math.random(); // Initial random opacity for twinkling effect
    // Direction for opacity change (twinkling)
    this.opacityDirection = Math.random() > 0.5 ? 0.005 : -0.005;

    // Method to draw a single star
    this.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false); // Draw a circle
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`; // White color with varying opacity
        ctx.fill();
    };

    // Method to update a star's position and opacity
    this.update = function() {
        this.x -= this.speed; // Move stars from right to left
        // If star moves off-screen to the left, reset its position to the right
        if (this.x < 0) {
            this.x = canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speed = Math.random() * starSpeed * 0.5 + 0.1;
            this.opacity = Math.random(); // Reset opacity on new star
        }

        // Twinkling effect: change opacity and reverse direction if limits are hit
        this.opacity += this.opacityDirection;
        if (this.opacity > 1 || this.opacity < 0.1) {
            this.opacityDirection *= -1;
        }
    };
}

// Initialize all star objects
function initStars() {
    for (let i = 0; i < numStars; i++) {
        stars.push(new Star());
    }
}

// Milky Way properties - Represents the galaxy band
let milkyWay; // A single Milky Way band object

// MilkyWay constructor function
function MilkyWay(x, y, width, height, angle, color1, color2, rotationSpeed) {
    this.x = x; // Center X position
    this.y = y; // Center Y position
    this.width = width; // Width of the elliptical band
    this.height = height; // Height of the elliptical band
    this.angle = angle; // Fixed initial angle (e.g., PI/4 for 45 degrees)
    this.color1 = color1; // Inner gradient color
    this.color2 = color2; // Outer gradient color
    this.opacity = 0.15; // Subtle overall opacity for the band
    this.pulseDirection = 0.001; // Direction and speed for opacity pulsing
    this.rotation = Math.random() * Math.PI * 2; // Initial random rotation for dynamic start
    this.rotationSpeed = rotationSpeed; // Speed of continuous rotation

    // Method to draw the Milky Way band
    this.draw = function() {
        ctx.save(); // Save current canvas state
        ctx.translate(this.x, this.y); // Move origin to Milky Way's center
        // Apply both the fixed angle and the continuous rotation
        ctx.rotate(this.angle + this.rotation);

        // Create an elliptical radial gradient for the Milky Way band
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.width / 2);
        gradient.addColorStop(0, this.color1); // Inner color
        gradient.addColorStop(0.5, this.color2); // Middle color
        gradient.addColorStop(1, 'rgba(0,0,0,0)'); // Transparent edges
        ctx.fillStyle = gradient; // Set fill style to the gradient

        ctx.globalAlpha = this.opacity; // Apply overall opacity for pulsing
        ctx.beginPath();
        // Draw an ellipse (x, y, radiusX, radiusY, rotation, startAngle, endAngle)
        ctx.ellipse(0, 0, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
        ctx.filter = 'blur(30px)'; // Apply blur for a soft, gaseous look
        ctx.fill(); // Fill the ellipse
        ctx.filter = 'none'; // Reset filter to not affect other drawings
        ctx.globalAlpha = 1; // Reset global alpha to 1

        ctx.restore(); // Restore previous canvas state
    };

    // Method to update Milky Way's properties
    this.update = function() {
        // Subtle pulsing effect for opacity
        this.opacity += this.pulseDirection;
        if (this.opacity > 0.2 || this.opacity < 0.1) {
            this.pulseDirection *= -1; // Reverse opacity direction
        }
        // Very slow horizontal movement for continuous background effect
        this.x -= 0.1;
        // If Milky Way moves off-screen, reset its position to the right
        if (this.x + this.width / 2 < 0) {
            this.x = canvas.width + this.width / 2;
            this.y = Math.random() * canvas.height * 0.6 + canvas.height * 0.2; // Random vertical reset
        }
        this.rotation += this.rotationSpeed; // Update continuous rotation
    };
}

// Initialize the Milky Way band object
function initMilkyWay() {
    milkyWay = new MilkyWay(
        canvas.width * 0.5, // Start roughly in the middle of the canvas width
        canvas.height * 0.5, // Vertical center
        canvas.width * 1.5, // Width much larger than canvas to span across and allow movement
        canvas.height * 0.4, // Height of the band (adjust for desired thickness)
        Math.PI / 4, // 45 degree angle for the band
        'rgba(150, 100, 250, 0.1)', // Inner purple/blue glow color
        'rgba(50, 20, 100, 0.05)',   // Outer darker purple color
        0.0001 // Rotation speed for the Milky Way
    );
}

// Main animation loop
function animate() {
    animationFrameId = requestAnimationFrame(animate); // Request the next animation frame

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas for the new frame

    // Update and draw the Milky Way band first
    if (milkyWay) {
        milkyWay.update();
        milkyWay.draw();
    }
    // Then update and draw each star
    stars.forEach(star => {
        star.update();
        star.draw();
    });
}

// --- Event Listeners ---
// Listen for window resize events to adjust canvas size and re-initialize elements
window.addEventListener('resize', resizeCanvas);

// Start the animation and initialize elements when the window finishes loading
window.onload = function() {
    resizeCanvas(); // Initial canvas resize
    initStars();    // Initialize all stars
    initMilkyWay(); // Initialize the Milky Way
    animate();      // Start the animation loop
};

// Optional: Clean up animation frame on page unload to prevent memory leaks
window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(animationFrameId);
});

// --- END: UNIVERSE BACKGROUND CANVAS SCRIPT ---

// --- ADDED: Contact Form Mailto Logic ---
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the default form submission page reload

        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const subject = document.getElementById('contact-subject').value;
        const message = document.getElementById('contact-message').value;

        // Construct a clean, perfectly formatted email body
        const mailBody = `Contact Request via Portfolio\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
        
        // URL encode the parameters so spaces and paragraphs correctly format in the email client
        const encodedSubject = encodeURIComponent(subject || `New Contact from ${name}`);
        const encodedBody = encodeURIComponent(mailBody);

        // Natively trigger the default mail client pop-up
        window.location.href = `mailto:prasannaavijayakumar2006@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;
    });
}
