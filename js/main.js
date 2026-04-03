/* ============================================
   MAIN.JS - Birthday Website Magic ✨
   Handles all animations, interactions, and 
   gallery rendering
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initEnvelope();
    initParticles();
    initScrollReveal();
    initGallery();
    initLightbox();
    initCounters();
    createConfetti();
    createIntroSparkles();
    initCountdown();
    initMusic();
    initQuiz();
});

/* ============================================
   ENVELOPE INTRO → LOVE POPUP → MAIN SITE
   ============================================ */
function initEnvelope() {
    const envelope = document.getElementById('envelope-intro');
    const lovePopup = document.getElementById('love-popup');
    const mainContent = document.getElementById('main-content');

    if (!envelope) return;

    envelope.addEventListener('click', () => {
        envelope.classList.add('opened');
        
        setTimeout(() => {
            envelope.style.display = 'none';
            // Show Love Popup instead of main content directly
            if (lovePopup) {
                lovePopup.classList.remove('hidden');
                initLovePopup();
            } else {
                showMainContent();
            }
        }, 800);
    });
}

function showMainContent() {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.classList.remove('hidden');
        mainContent.style.animation = 'fadeInUp 1s ease-out';
        initTypewriter();
        
        // Try auto-play music
        setTimeout(() => {
            const music = document.getElementById('bg-music');
            if (music) {
                music.play().catch(() => {});
                const toggle = document.getElementById('music-toggle');
                if (toggle) toggle.classList.add('playing');
            }
        }, 1500);

        // Launch fireworks if it's birthday (April 4)
        const now = new Date();
        if (now.getMonth() === 3 && now.getDate() === 4) {
            initFireworks();
        }
    }
}

/* ============================================
   "DO YOU LOVE ME?" POPUP - UNCATCHABLE NO!
   ============================================ */
function initLovePopup() {
    const yesBtn = document.getElementById('love-yes-btn');
    const noBtn = document.getElementById('love-no-btn');
    const lovePopup = document.getElementById('love-popup');
    const message = document.getElementById('love-popup-message');

    if (!yesBtn || !noBtn) return;

    let noAttempts = 0;
    const funnyMessages = [
        "Haha! Button bhaag gaya! 😂",
        "Fiza, yeh button tumse darr gaya!",
        "No ka option hi nahi hai, sirf YES! 💕",
        "Button ne bola: mujhe mat dabao! 🤣",
        "Pyaar se koi bach nahi sakta! ❤️",
        "Bas Yes daba do, Fiza! 😜",
        "Yeh button Basit ki taraf se block hai 😏",
        "Kitni baar try karogi? Sirf YES hai! 💖",
    ];

    // Make the No button run away on hover and click
    noBtn.addEventListener('mouseover', () => {
        moveNoButton(noBtn);
        noAttempts++;
        if (noAttempts <= funnyMessages.length) {
            showFunnyMessage(message, funnyMessages[(noAttempts - 1) % funnyMessages.length]);
        }
    });

    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        moveNoButton(noBtn);
        noAttempts++;
        showFunnyMessage(message, funnyMessages[(noAttempts - 1) % funnyMessages.length]);
    });

    // Touch support for mobile
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveNoButton(noBtn);
        noAttempts++;
        showFunnyMessage(message, funnyMessages[(noAttempts - 1) % funnyMessages.length]);
    });

    // Yes button - success!
    yesBtn.addEventListener('click', () => {
        message.textContent = 'Main jaanta tha, Fiza! Main bhi tumse bohot pyaar karta hoon! 💖✨';
        message.classList.add('show');
        
        // Grow the yes button
        yesBtn.style.transform = 'scale(1.3)';
        yesBtn.textContent = '❤️ I LOVE YOU FIZA! ❤️';
        noBtn.style.display = 'none';

        // Heart explosion
        createHeartExplosion();

        // Transition to main site
        setTimeout(() => {
            lovePopup.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            lovePopup.style.opacity = '0';
            lovePopup.style.transform = 'scale(1.2)';
            
            setTimeout(() => {
                lovePopup.style.display = 'none';
                showMainContent();
            }, 800);
        }, 2000);
    });
}

function moveNoButton(btn) {
    const parent = btn.closest('.love-popup-card');
    const parentRect = parent.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    
    const maxX = parentRect.width - btnRect.width - 20;
    const maxY = parentRect.height - btnRect.height - 20;
    
    let newX = Math.random() * maxX - maxX / 2;
    let newY = Math.random() * maxY - maxY / 2;
    
    // Make sure it moves significantly
    if (Math.abs(newX) < 50) newX = (Math.random() > 0.5 ? 1 : -1) * (80 + Math.random() * 60);
    if (Math.abs(newY) < 30) newY = (Math.random() > 0.5 ? 1 : -1) * (40 + Math.random() * 40);

    // Clamp within card bounds
    newX = Math.max(-maxX/2, Math.min(maxX/2, newX));
    newY = Math.max(-maxY/2, Math.min(maxY/2, newY));

    btn.style.position = 'relative';
    btn.style.transform = `translate(${newX}px, ${newY}px)`;
    btn.style.transition = 'transform 0.15s ease-out';
}

function showFunnyMessage(el, text) {
    el.textContent = text;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 1500);
}

function createHeartExplosion() {
    const hearts = ['❤️', '💕', '💖', '💗', '💘', '💝', '🌹', '✨'];
    const container = document.getElementById('love-popup');
    
    for (let i = 0; i < 40; i++) {
        const heart = document.createElement('div');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.cssText = `
            position: fixed;
            font-size: ${Math.random() * 30 + 20}px;
            left: 50%;
            top: 50%;
            pointer-events: none;
            z-index: 99999;
            animation: heartExplode ${Math.random() * 1.5 + 1}s ease-out forwards;
            --tx: ${(Math.random() - 0.5) * 600}px;
            --ty: ${(Math.random() - 0.5) * 600}px;
            --rot: ${Math.random() * 720 - 360}deg;
        `;
        container.appendChild(heart);
    }

    // Add keyframes
    if (!document.getElementById('heart-explode-style')) {
        const style = document.createElement('style');
        style.id = 'heart-explode-style';
        style.textContent = `
            @keyframes heartExplode {
                0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                50% { opacity: 1; }
                100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) rotate(var(--rot)) scale(1.5); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

/* ============================================
   SPARKLES ON INTRO
   ============================================ */
function createIntroSparkles() {
    const container = document.getElementById('intro-sparkles');
    if (!container) return;

    const sparkleChars = ['✨', '⭐', '💫', '🌟', '✧', '✦'];
    
    for (let i = 0; i < 30; i++) {
        const sparkle = document.createElement('span');
        sparkle.textContent = sparkleChars[Math.floor(Math.random() * sparkleChars.length)];
        sparkle.style.cssText = `
            position: absolute;
            font-size: ${Math.random() * 20 + 10}px;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: sparkleFloat ${Math.random() * 4 + 3}s ease-in-out infinite;
            animation-delay: ${Math.random() * 3}s;
            opacity: ${Math.random() * 0.5 + 0.2};
        `;
        container.appendChild(sparkle);
    }

    if (!document.getElementById('sparkle-style')) {
        const style = document.createElement('style');
        style.id = 'sparkle-style';
        style.textContent = `
            @keyframes sparkleFloat {
                0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
                50% { transform: translateY(-20px) scale(1.3); opacity: 0.8; }
            }
        `;
        document.head.appendChild(style);
    }
}

/* ============================================
   PARTICLE SYSTEM (Hearts & Sparkles)
   ============================================ */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() { this.reset(); }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = Math.random() * -0.5 - 0.2;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.color = this.getRandomColor();
            this.life = Math.random() * 200 + 100;
            this.maxLife = this.life;
        }

        getRandomColor() {
            const colors = ['255, 107, 157', '255, 215, 0', '168, 85, 247', '255, 158, 198', '192, 132, 252'];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life--;
            if (this.life <= 0 || this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
                this.reset();
                this.y = canvas.height + 10;
            }
        }

        draw() {
            const fade = this.life / this.maxLife;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.opacity * fade})`;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.opacity * fade * 0.3})`;
            ctx.fill();
        }
    }

    const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        animationId = requestAnimationFrame(animate);
    }

    animate();
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) cancelAnimationFrame(animationId);
        else animate();
    });
}

/* ============================================
   TYPEWRITER EFFECT
   ============================================ */
function initTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el || el.textContent.length > 0) return;

    const text = 'Happy Birthday, Fiza!';
    let i = 0;

    function type() {
        if (i < text.length) {
            el.textContent += text.charAt(i);
            i++;
            setTimeout(type, 80);
        }
    }

    setTimeout(type, 500);
}

/* ============================================
   SCROLL REVEAL ANIMATION
   ============================================ */
function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal-on-scroll:not(.revealed)');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => observer.observe(el));
}

/* ============================================
   GALLERY - Load from Cloudinary
   ============================================ */
let allGalleryItems = [];
let currentFilter = 'all';

async function initGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;

    const [images, videos] = await Promise.all([fetchGalleryMedia(), fetchVideoMedia()]);

    allGalleryItems = [
        ...images.map(img => ({ ...img, mediaType: 'photos' })),
        ...videos.map(vid => ({ ...vid, mediaType: 'videos' }))
    ];

    allGalleryItems.sort((a, b) => new Date(b.created) - new Date(a.created));
    renderGallery();
    initFilterButtons();
}

function renderGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;

    const filtered = currentFilter === 'all' 
        ? allGalleryItems 
        : allGalleryItems.filter(item => item.mediaType === currentFilter);

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="gallery-placeholder glass-card">
                <div class="placeholder-icon">📷</div>
                <p>Upload your beautiful memories through the admin panel</p>
                <p class="placeholder-hint">Go to <strong>/admin.html</strong> to get started</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = '';
    filtered.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = `gallery-item ${item.type === 'video' ? 'video-item' : ''} reveal-on-scroll`;
        div.setAttribute('data-index', index);
        div.style.animationDelay = `${index * 0.1}s`;

        if (item.type === 'video') {
            div.innerHTML = `<img src="${item.thumbnail}" alt="Video memory" loading="lazy"><div class="gallery-overlay"><span>🎬 Play</span></div>`;
        } else {
            div.innerHTML = `<img src="${item.thumbnail}" alt="Beautiful memory" loading="lazy"><div class="gallery-overlay"><span>❤️</span></div>`;
        }

        div.addEventListener('click', () => openLightbox(index, filtered));
        grid.appendChild(div);
    });
    initScrollReveal();
}

function initFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            renderGallery();
        });
    });
}

/* ============================================
   LIGHTBOX
   ============================================ */
let lightboxItems = [];
let lightboxIndex = 0;

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    if (!lightbox) return;

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => navigateLightbox(-1));
    nextBtn.addEventListener('click', () => navigateLightbox(1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });
}

function openLightbox(index, items) {
    const lightbox = document.getElementById('lightbox');
    lightboxItems = items;
    lightboxIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const video = document.getElementById('lightbox-video');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    if (video) { video.pause(); video.style.display = 'none'; }
}

function navigateLightbox(direction) {
    lightboxIndex += direction;
    if (lightboxIndex < 0) lightboxIndex = lightboxItems.length - 1;
    if (lightboxIndex >= lightboxItems.length) lightboxIndex = 0;
    updateLightboxContent();
}

function updateLightboxContent() {
    const img = document.getElementById('lightbox-img');
    const video = document.getElementById('lightbox-video');
    const counter = document.getElementById('lightbox-counter');
    const item = lightboxItems[lightboxIndex];
    if (!item) return;

    if (item.type === 'video') {
        img.style.display = 'none';
        video.style.display = 'block';
        video.src = item.url;
        video.load();
    } else {
        video.style.display = 'none';
        video.pause && video.pause();
        img.style.display = 'block';
        img.src = item.url;
    }
    counter.textContent = `${lightboxIndex + 1} / ${lightboxItems.length}`;
}

/* ============================================
   ANIMATED COUNTERS
   ============================================ */
function initCounters() {
    const counters = document.querySelectorAll('.counter-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2500;
    const start = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        if (target >= 1000000) el.textContent = '∞';
        else if (target >= 1000) el.textContent = current.toLocaleString();
        else el.textContent = current;

        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target >= 1000000 ? '∞' : target.toLocaleString();
    }
    requestAnimationFrame(update);
}

/* ============================================
   CONFETTI
   ============================================ */
function createConfetti() {
    const container = document.getElementById('confetti-container');
    if (!container) return;

    const colors = ['#ff6b9d', '#ffd700', '#a855f7', '#ff9ec6', '#c084fc', '#ffe066', '#fd79a8'];
    const shapes = ['circle', 'square', 'triangle'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        let borderRadius = '0', clipPath = 'none';
        if (shape === 'circle') borderRadius = '50%';
        else if (shape === 'triangle') clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';

        confetti.style.cssText = `
            left: ${Math.random() * 100}%;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: ${color};
            border-radius: ${borderRadius};
            clip-path: ${clipPath};
            animation-delay: ${Math.random() * 5}s;
            animation-duration: ${Math.random() * 3 + 4}s;
        `;
        container.appendChild(confetti);
    }
}

/* ============================================
   BIRTHDAY COUNTDOWN (April 4)
   ============================================ */
function initCountdown() {
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minutesEl = document.getElementById('cd-minutes');
    const secondsEl = document.getElementById('cd-seconds');
    const timerEl = document.getElementById('countdown-timer');
    const bannerEl = document.getElementById('birthday-live-banner');

    if (!daysEl) return;

    function getNextBirthday() {
        const now = new Date();
        const year = now.getFullYear();
        let birthday = new Date(year, 3, 4, 0, 0, 0); // April 4 (month is 0-indexed)
        
        // If birthday has passed this year, use next year
        if (now > new Date(year, 3, 4, 23, 59, 59)) {
            birthday = new Date(year + 1, 3, 4, 0, 0, 0);
        }
        return birthday;
    }

    function update() {
        const now = new Date();
        const birthday = getNextBirthday();
        
        // Check if today is the birthday
        if (now.getMonth() === 3 && now.getDate() === 4) {
            daysEl.textContent = '🎂';
            hoursEl.textContent = '🎉';
            minutesEl.textContent = '🥳';
            secondsEl.textContent = '💖';
            if (bannerEl) bannerEl.classList.remove('hidden');
            return;
        }
        
        const diff = birthday - now;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
}

/* ============================================
   FIREWORKS (Birthday celebration!)
   ============================================ */
function initFireworks() {
    const canvas = document.getElementById('fireworks-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    const fireworks = [];
    const particles = [];
    const colors = ['#ff6b9d', '#ffd700', '#a855f7', '#ff9ec6', '#c084fc', '#ffe066', '#fd79a8', '#10b981', '#f43f5e'];

    class Firework {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.targetY = Math.random() * canvas.height * 0.4 + 50;
            this.speed = Math.random() * 3 + 4;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.alive = true;
        }

        update() {
            this.y -= this.speed;
            if (this.y <= this.targetY) {
                this.explode();
                this.alive = false;
            }
        }

        explode() {
            const count = Math.floor(Math.random() * 30 + 20);
            for (let i = 0; i < count; i++) {
                const angle = (Math.PI * 2 / count) * i;
                const speed = Math.random() * 4 + 2;
                particles.push({
                    x: this.x,
                    y: this.y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    color: this.color,
                    life: 80 + Math.random() * 40,
                    maxLife: 120,
                    size: Math.random() * 2 + 1
                });
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    function animate() {
        ctx.fillStyle = 'rgba(13, 0, 21, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Random new fireworks
        if (Math.random() < 0.04) {
            fireworks.push(new Firework());
        }

        // Update fireworks
        for (let i = fireworks.length - 1; i >= 0; i--) {
            fireworks[i].update();
            fireworks[i].draw();
            if (!fireworks[i].alive) fireworks.splice(i, 1);
        }

        // Update particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05; // gravity
            p.life--;

            const alpha = p.life / p.maxLife;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
            ctx.fill();

            if (p.life <= 0) particles.splice(i, 1);
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/* ============================================
   MUSIC PLAYER
   ============================================ */
function initMusic() {
    const toggle = document.getElementById('music-toggle');
    const music = document.getElementById('bg-music');
    if (!toggle || !music) return;

    let isPlaying = false;

    toggle.addEventListener('click', () => {
        if (isPlaying) {
            music.pause();
            toggle.classList.remove('playing');
            toggle.querySelector('.music-label').textContent = 'Music';
        } else {
            music.play().then(() => {
                toggle.classList.add('playing');
                toggle.querySelector('.music-label').textContent = 'Playing';
            }).catch(() => {});
        }
        isPlaying = !isPlaying;
    });
}

/* ============================================
   FUN QUIZ
   ============================================ */
function initQuiz() {
    const questionEl = document.getElementById('quiz-question');
    const optionsEl = document.getElementById('quiz-options');
    const resultEl = document.getElementById('quiz-result');
    const nextBtn = document.getElementById('quiz-next');
    const scoreEl = document.getElementById('quiz-score');
    const countEl = document.getElementById('quiz-count');

    if (!questionEl || !optionsEl) return;

    const questions = [
        {
            q: "Basit tumse kab se pyaar karta hai?",
            options: ["Kal se 🤔", "Pehli nazar se! 💘", "Shaadi ke baad 😅", "Abhi tak soch raha hai 🤣"],
            correct: 1,
            response: "Pehli nazar se! Jab se Fiza ko dekha, dil Basit ka ho gaya! 💖"
        },
        {
            q: "Basit ko Fiza mein sabse zyada kya pasand hai?",
            options: ["Sirf chehra 😂", "Cooking skills 🍳", "SAB KUCH! Sar se pair tak! 💕", "WhatsApp pe online rehna 📱"],
            correct: 2,
            response: "Sab kuch! Fiza ka har ada, har baat, har muskurahat — perfection! ✨"
        },
        {
            q: "Fiza Basit ke liye kya hai?",
            options: ["Biwi 💍", "Best friend 👯", "Sab kuch — dil, jaan, duniya! 🌍❤️", "Alarm clock ⏰"],
            correct: 2,
            response: "Fiza sirf biwi nahi — Basit ki jaan hai, dhadkan hai, puri duniya hai! 💖"
        },
        {
            q: "Basit Fiza ke bina kya hai?",
            options: ["Bilkul incomplete 😢", "Vaise bhi theek hai 😅", "Free aadmi 🤣", "Chand bina raat! 🌙"],
            correct: 0,
            response: "Bilkul incomplete! Fiza ke bina Basit kuch nahi — tum meri zindagi ho! ❤️"
        },
        {
            q: "Kya Basit kabhi Fiza se mohabbat karna band karega?",
            options: ["Shayad 🤔", "KABHI NAHI! Qayamat tak! 💖", "Jab WiFi band ho 📶", "Next update mein 😂"],
            correct: 1,
            response: "KABHI NAHI! Basit ka pyaar Fiza ke liye hamesha rahega — duniya ke end tak! ∞❤️"
        },
        {
            q: "Fiza ka birthday kab hai?",
            options: ["4 April! 🎂", "14 February 💘", "25 December 🎄", "Har din birthday hai! 🎉"],
            correct: 0,
            response: "4 April ko duniya ki sabse khoobsurat insaan paida hui thi! 🎂💖"
        },
        {
            q: "Basit aur Fiza ka pyaar kaisa hai?",
            options: ["Normal sa 😐", "Thoda thoda 😅", "Duniya ka sabse khoobsurat pyaar! 💑", "Complicated 🤔"],
            correct: 2,
            response: "Duniya ka sabse perfect couple! Basit ❤️ Fiza = Forever! 💑"
        }
    ];

    let currentQ = 0;
    let score = 0;

    function loadQuestion() {
        const q = questions[currentQ];
        questionEl.textContent = q.q;
        optionsEl.innerHTML = '';
        resultEl.classList.add('hidden');
        nextBtn.classList.add('hidden');

        q.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.textContent = opt;
            if (i === q.correct) btn.setAttribute('data-correct', 'true');
            btn.addEventListener('click', () => handleAnswer(btn, i, q));
            optionsEl.appendChild(btn);
        });

        countEl.textContent = `Question ${currentQ + 1}/${questions.length}`;
    }

    function handleAnswer(btn, index, q) {
        const options = optionsEl.querySelectorAll('.quiz-option');
        options.forEach(o => o.style.pointerEvents = 'none');

        if (index === q.correct) {
            btn.classList.add('correct');
            score++;
            scoreEl.textContent = `Score: ${score}`;
            resultEl.textContent = q.response;
            resultEl.style.color = '#34d399';
        } else {
            btn.classList.add('wrong');
            options[q.correct].classList.add('correct');
            resultEl.textContent = `Sahi jawab: ${q.options[q.correct]} — ${q.response}`;
            resultEl.style.color = '#fca5a5';
        }

        resultEl.classList.remove('hidden');

        if (currentQ < questions.length - 1) {
            nextBtn.classList.remove('hidden');
        } else {
            setTimeout(() => {
                if (score === questions.length) {
                    resultEl.textContent = `🏆 ${score}/${questions.length}! Fiza, tum toh expert ho! Basit ko pura jaanti ho! 💕`;
                } else if (score >= questions.length - 2) {
                    resultEl.textContent = `🏆 ${score}/${questions.length}! Bohot acha! Fiza aur Basit ka connection hai hi itna strong! ❤️`;
                } else {
                    resultEl.textContent = `🏆 ${score}/${questions.length}! Koi baat nahi, Basit ka pyaar toh hamesha tumhara hai! 💖`;
                }
                resultEl.style.color = '#ffd700';
            }, 1500);
        }
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentQ++;
            loadQuestion();
        });
    }

    loadQuestion();
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});
