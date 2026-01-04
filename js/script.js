// Inicializar AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
    easing: 'ease-in-out'
});

// Navbar scroll effect
const navbar = document.getElementById('mainNav');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Highlight active nav link
    let current = '';
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Smooth scroll para links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Fechar menu mobile
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    toggle: false
                });
                bsCollapse.hide();
            }
        }
    });
});

/** Efeito Parallax no Hero
const heroBackground = document.querySelector('.hero-background');

if (heroBackground) {
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const heroSection = document.querySelector('.hero-section');
        
        if (scrollPosition < heroSection.offsetHeight) {
            heroBackground.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
        }
    });
} **/ 

// Efeito Parallax no CTA
const ctaBackground = document.querySelector('.cta-background');

if (ctaBackground) {
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const ctaSection = document.querySelector('.cta-section');
        const ctaSectionTop = ctaSection.offsetTop;
        const ctaSectionHeight = ctaSection.offsetHeight;
        
        if (scrollPosition >= ctaSectionTop - window.innerHeight && scrollPosition <= ctaSectionTop + ctaSectionHeight) {
            const relativeScroll = scrollPosition - ctaSectionTop;
            ctaBackground.style.backgroundPosition = `center ${relativeScroll * 0.4}px`;
        }
    });
}

// Contador animado para estatísticas
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + '+';
        }
    }, 16);
}

// Contador animado profissional
function animateCounter(element, target, suffix = '', duration = 2000) {
    let start = 0;
    const stepTime = 16;
    const increment = target / (duration / stepTime);

    const timer = setInterval(() => {
        start += increment;

        if (start >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + suffix;
        }
    }, stepTime);
}

// Observer das estatísticas
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const stats = entry.target.querySelectorAll('.stat h4');

        stats.forEach(stat => {
            if (stat.classList.contains('animated')) return;

            const target = parseInt(stat.dataset.target, 10);
            const suffix = stat.dataset.suffix || '';

            stat.classList.add('animated');
            stat.textContent = '0' + suffix;

            setTimeout(() => {
                animateCounter(stat, target, suffix);
            }, 200);
        });

        statsObserver.unobserve(entry.target);
    });
}, { threshold: 0.5 });

const aboutStats = document.querySelector('.about-stats');
if (aboutStats) {
    statsObserver.observe(aboutStats);
}


// Tracking de cliques
document.querySelectorAll('a[href*="wa.me"]').forEach(button => {
    button.addEventListener('click', function() {
        console.log('WhatsApp clicked:', this.textContent.trim());
    });
});

console.log('✨ Barbearia Premium - Website carregado com sucesso!');



