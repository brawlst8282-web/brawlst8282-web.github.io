document.addEventListener('DOMContentLoaded', () => {

    
    const body = document.body;
    const links = document.querySelectorAll('.sidebar-link');
    const pages = document.querySelectorAll('.page');

    window.toggleSidebar = function () {
        if (window.innerWidth <= 768) {
            body.classList.toggle('sidebar-open');
            body.classList.remove('sidebar-collapsed');
        } else {
            body.classList.toggle('sidebar-collapsed');
        }
    };

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            links.forEach(l => l.classList.remove('active'));
            pages.forEach(p => p.classList.remove('active'));

            this.classList.add('active');
            const pageId = 'page-' + this.dataset.page;
            const page = document.getElementById(pageId);
            if (page) page.classList.add('active');

            if (window.innerWidth <= 768) {
                body.classList.remove('sidebar-open');
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            body.classList.remove('sidebar-open');
        }
    });


    
    const hourHand    = document.getElementById('hour-hand');
    const minuteHand  = document.getElementById('minute-hand');
    const secondHand  = document.getElementById('second-hand');
    const clockDigital = document.getElementById('clock-digital');
    const headerTime  = document.getElementById('header-time');

    
    function getMoscowTime() {
        const now = new Date();
        const parts = new Intl.DateTimeFormat('ru-RU', {
            timeZone: 'Europe/Moscow',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).formatToParts(now);

        const get = t => parts.find(p => p.type === t)?.value || '00';
        return {
            h: parseInt(get('hour'), 10),
            m: parseInt(get('minute'), 10),
            s: parseInt(get('second'), 10)
        };
    }

    let prevSec = -1;

    function updateClock() {
        const { h, m, s } = getMoscowTime();

        
        const secDeg  = s * 6;
        const minDeg  = m * 6 + s * 0.1;
        const hourDeg = (h % 12) * 30 + m * 0.5;

        if (hourHand)   hourHand.style.transform   = `rotate(${hourDeg}deg)`;
        if (minuteHand) minuteHand.style.transform = `rotate(${minDeg}deg)`;

        
        if (secondHand && s !== prevSec) {
            secondHand.style.transform = `rotate(${secDeg}deg)`;
            prevSec = s;
        }

        const pad = n => String(n).padStart(2, '0');
        const digital = `${pad(h)}:${pad(m)}:${pad(s)}`;

        if (clockDigital) clockDigital.textContent = digital;
        if (headerTime)   headerTime.textContent   = `MSK ${digital}`;
    }

    updateClock();
    setInterval(updateClock, 250); // обновления и тд хаххааха


    
    const lightbox    = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const galleryImgs = document.querySelectorAll('.gallery img');

    galleryImgs.forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('open');
            body.style.overflow = 'hidden';
        });
    });

    window.closeLightbox = function () {
        lightbox.classList.remove('open');
        body.style.overflow = '';
    };

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });


    
    const statNums = document.querySelectorAll('.stat-num');
    let countersStarted = false;

    function animateCounters() {
        if (countersStarted) return;
        countersStarted = true;

        statNums.forEach(el => {
            const target = parseInt(el.dataset.target, 10) || 0;
            let current = 0;
            const step = Math.max(1, Math.ceil(target / 60));
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                el.textContent = current;
            }, 25);
        });
    }

    
    setTimeout(animateCounters, 400);


    
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        const overlay = document.querySelector('.header');
        if (overlay) {
            overlay.style.backgroundPosition = `0 ${y * 0.3}px`;
        }
    }, { passive: true });


    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card, .stat, .contact-card, .gallery img').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });


    

});