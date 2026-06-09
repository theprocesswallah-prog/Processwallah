// ==========================================================================
// INITIALIZING DYNAMIC HUD METRICS & ELEMENTS
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    startBootSequence();
    initBackgroundCanvas();
    updateSystemTime();
    setupMobileNav();
    setupScrollReveal();
    setupActiveNavTracking();
    
    setInterval(updateSystemTime, 1000);
    setInterval(updateRandomData, 3000);
});

// ==========================================================================
// BOOT LOADER SEQUENCER
// ==========================================================================
function startBootSequence() {
    const loader = document.getElementById("loader");
    const loaderFill = document.getElementById("loader-fill");
    const loaderText = document.getElementById("loader-text");
    const loaderConsole = document.getElementById("loader-console");
    
    const consoleLogs = [
        "PW_OS v2.6.4 Loaded Successfully",
        "Loading manufacturing nodes...",
        "Connecting to central physical interface...",
        "BOM database modules synchronized",
        "Quality assurance system sensors online",
        "Initializing factory command center dashboards..."
    ];
    
    let progress = 0;
    let logIndex = 0;
    
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 8) + 4;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                loader.style.opacity = "0";
                loader.style.visibility = "hidden";
            }, 400);
        }
        
        loaderFill.style.width = progress + "%";
        
        if (progress % 20 < 5 && logIndex < consoleLogs.length) {
            const line = document.createElement("div");
            line.textContent = `> ${consoleLogs[logIndex]}`;
            loaderConsole.appendChild(line);
            loaderConsole.scrollTop = loaderConsole.scrollHeight;
            logIndex++;
        }
        
        loaderText.textContent = `CONNECTING NODE INFRASTRUCTURE: ${progress}%`;
    }, 100);
}

// ==========================================================================
// HUD CANVAS: NODE PROCESS FLOW GRAPHICS
// ==========================================================================
function initBackgroundCanvas() {
    const canvas = document.getElementById("flowCanvas");
    const ctx = canvas.getContext("2d");
    
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    
    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
    
    // Node objects mapping process control streams
    class NodeParticle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2 + 1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(0, 212, 255, 0.4)";
            ctx.fill();
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
    }
    
    const particles = Array.from({ length: 45 }, () => new NodeParticle());
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        // Render flow connection vectors
        ctx.strokeStyle = "rgba(0, 212, 255, 0.05)";
        ctx.lineWidth = 1;
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.hypot(dx, dy);
                
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ==========================================================================
// HUD CLOCK & REAL-TIME INTERACTION ELEMENTS
// ==========================================================================
function updateSystemTime() {
    const clockElement = document.getElementById("systemClock");
    if (clockElement) {
        const now = new Date();
        const hrs = String(now.getUTCHours()).padStart(2, "0");
        const mins = String(now.getUTCMinutes()).padStart(2, "0");
        const secs = String(now.getUTCSeconds()).padStart(2, "0");
        clockElement.textContent = `${hrs}:${mins}:${secs} UTC`;
    }
}

function updateRandomData() {
    const dataFlow = document.getElementById("randomDataFlow");
    if (dataFlow) {
        const val = (Math.random() * (1500 - 800) + 800).toFixed(1);
        dataFlow.textContent = `${val} KB/S`;
    }
}

// ==========================================================================
// MOBILE MENU CONTROLLER
// ==========================================================================
function setupMobileNav() {
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
        
        // Auto-close menu on anchor link select
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
            });
        });
    }
}

// ==========================================================================
// SYSTEM METRIC INTERACTIVE RUNTIME COUNTERS (Why Processwallah)
// ==========================================================================
function startStatsCounter(element) {
    const target = parseInt(element.getAttribute("data-target"));
    const duration = 2000; // Counter sweep speed in MS
    let start = 0;
    const stepTime = Math.abs(Math.floor(duration / target));
    
    const timer = setInterval(() => {
        start += 1;
        element.textContent = start;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, stepTime);
}

// ==========================================================================
// SCROLL PERFORMANCE REVEAL WRAPPERS & TRACKERS
// ==========================================================================
function setupScrollReveal() {
    const revealedElements = document.querySelectorAll(".scroll-reveal");
    const statsTriggered = new Set();
    
    const observerOptions = {
        root: null,
        threshold: 0.15
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                
                // If resolving "Why Processwallah" stat segment, run system counters
                if (entry.target.classList.contains("why-section")) {
                    const stats = entry.target.querySelectorAll(".stat-number");
                    stats.forEach(stat => {
                        if (!statsTriggered.has(stat)) {
                            statsTriggered.add(stat);
                            startStatsCounter(stat);
                        }
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    revealedElements.forEach(el => observer.observe(el));
}

// ==========================================================================
// VISUAL SCROLL POSITION DETECTOR (Active Navigation Link Highlighting)
// ==========================================================================
function setupActiveNavTracking() {
    const sections = document.querySelectorAll("section");
    const navItems = document.querySelectorAll(".nav-item");
    
    window.addEventListener("scroll", () => {
        let currentSection = "";
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                currentSection = section.getAttribute("id");
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove("active");
            if (item.getAttribute("href") === `#${currentSection}`) {
                item.classList.add("active");
            }
        });
    });
}
