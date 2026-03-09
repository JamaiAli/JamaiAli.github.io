document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');

    btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });

    // Close mobile menu when a link is clicked
    const mobileLinks = menu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.add('hidden');
        });
    });

    // Smooth scroll for anchor links (if not supported natively)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Simple reveal animation on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply animation config to cards
    document.querySelectorAll('.cyber-card').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `all 0.6s ease-out ${index * 0.1}s`;
        observer.observe(el);
    });
});

// Cyber Hexagon Background Animation
const canvas = document.getElementById('bg-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let hexagons = [];

    // Hexagon settings
    const hexRadius = 30; // Size of hexagons
    const hexHeight = hexRadius * Math.sqrt(3);
    const hexWidth = hexRadius * 2;

    // Cyber Theme Colors
    const baseColor = 'rgba(0, 255, 65, 0.03)';   // Very faint green grid
    const pulseColor = 'rgba(0, 255, 65, 0.4)';   // Brighter green when pulsing

    function initCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    class Hexagon {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            // Pulsing variables
            this.isPulsing = false;
            this.pulseIntensity = 0;
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
            // Chance to start pulsing randomly
            this.pulseProbability = Math.random() * 0.001;
        }

        update() {
            if (this.isPulsing) {
                this.pulseIntensity -= this.pulseSpeed;
                if (this.pulseIntensity <= 0) {
                    this.pulseIntensity = 0;
                    this.isPulsing = false;
                }
            } else {
                if (Math.random() < this.pulseProbability) {
                    this.isPulsing = true;
                    this.pulseIntensity = Math.random() * 0.8 + 0.2; // Max intensity between 0.2 and 1.0
                }
            }
        }

        draw() {
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                // Angle in radians (60 degrees per step)
                const angle_deg = 60 * i - 30;
                const angle_rad = Math.PI / 180 * angle_deg;
                const px = this.x + hexRadius * Math.cos(angle_rad);
                const py = this.y + hexRadius * Math.sin(angle_rad);
                if (i === 0) {
                    ctx.moveTo(px, py);
                } else {
                    ctx.lineTo(px, py);
                }
            }
            ctx.closePath();

            // Draw grid outline
            ctx.strokeStyle = baseColor;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Fill if pulsing
            if (this.pulseIntensity > 0) {
                ctx.fillStyle = `rgba(0, 255, 65, ${this.pulseIntensity * 0.3})`; // Max opacity 0.3
                ctx.fill();
            }
        }
    }

    function initHexagons() {
        hexagons = [];
        // Calculate rows and columns to cover screen
        const cols = Math.ceil(width / (hexWidth * 0.75)) + 1;
        const rows = Math.ceil(height / hexHeight) + 1;

        for (let row = -1; row < rows; row++) {
            for (let col = -1; col < cols; col++) {
                // Offset every other column vertically
                let x = col * hexWidth * 0.75;
                let y = row * hexHeight;
                if (col % 2 !== 0) {
                    y += hexHeight / 2;
                }
                hexagons.push(new Hexagon(x, y));
            }
        }
    }

    function animate() {
        // Clear with slight trailing effect or complete clear
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < hexagons.length; i++) {
            hexagons[i].update();
            hexagons[i].draw();
        }
        requestAnimationFrame(animate);
    }

    // Interactive mouse pulse effect
    canvas.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        hexagons.forEach(hex => {
            const dx = hex.x - mouseX;
            const dy = hex.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // If near mouse, ignite the pulse
            if (dist < hexRadius * 2 && !hex.isPulsing) {
                hex.isPulsing = true;
                hex.pulseIntensity = 1.0;
            }
        });
    });

    // Initialize and handle resize
    initCanvas();
    initHexagons();
    animate();

    window.addEventListener('resize', () => {
        initCanvas();
        initHexagons();
    });
}
