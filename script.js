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


// Sprite Sheet Penguin Animation
function createSpritePenguin() {
    const heroName = document.getElementById('hero-name');
    if (!heroName) return;

    // Create container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.zIndex = '9999';
    container.style.pointerEvents = 'none';
    
    // Initial position relative to the hero name
    const h1Rect = heroName.getBoundingClientRect();
    const startY = h1Rect.top + window.scrollY - 30; // slightly above text
    container.style.top = startY + 'px';
    
    // Calculate total distance to walk
    const startX = h1Rect.left - 40;
    const targetX = h1Rect.right + 10;
    let x = startX;
    container.style.left = x + 'px';

    // The Sprite Element
    const sprite = document.createElement('div');
    sprite.className = 'pixel-penguin walking';
    
    container.appendChild(sprite);
    document.body.appendChild(container);

    let isWalking = true;
    
    function animate() {
        if (!isWalking) return;

        if (x < targetX) {
            x += 1.2; // Walk speed
            container.style.left = x + 'px';
            requestAnimationFrame(animate);
        } else {
            // Reached the end of the name
            isWalking = false;
            
            // 1. Stop animation (stops on frame 1)
            sprite.classList.remove('walking');
            
            // 2. Turn back (flip horizontally)
            setTimeout(() => {
                sprite.style.transform = 'scale(-3.5, 3.5)'; // Keep the 3.5x scale
                
                // 3. Disappear
                setTimeout(() => {
                    container.style.transition = 'opacity 1s ease-out';
                    container.style.opacity = '0';
                    setTimeout(() => container.remove(), 1000);
                }, 1000);
            }, 800);
        }
    }

    // Start running the translation animation
    requestAnimationFrame(animate);
}

// Launch
setTimeout(createSpritePenguin, 1500);
