document.addEventListener('DOMContentLoaded', () => {
    
    /* ========================
       LOADING SCREEN
       ======================== */
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.visibility = 'hidden';
            // Trigger intersection observer after load
            document.querySelectorAll('.hidden-fade-up, .hidden-fade-left, .hidden-fade-right').forEach(el => {
                observer.observe(el);
            });
        }, 800);
    }, 1500);

    /* ========================
       CUSTOM CURSOR GLOW
       ======================== */
    const cursorGlow = document.getElementById('cursor-glow');
    let cursorX = 0, cursorY = 0, glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
    });

    // Smooth cursor follow using requestAnimationFrame
    function animateCursor() {
        glowX += (cursorX - glowX) * 0.12;
        glowY += (cursorY - glowY) * 0.12;
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    /* ========================
       SCROLL PROGRESS BAR
       ======================== */
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const totalScroll = document.documentElement.scrollTop;
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scroll = `${totalScroll / windowHeight * 100}%`;
        scrollProgress.style.width = scroll;
    });

    /* ========================
       THEME SWITCHER
       ======================== */
    const themeToggle = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    const themeIcon = themeToggle.querySelector('i');
    
    // Default to dark mode if not set
    let currentTheme = localStorage.getItem('theme') || 'dark';
    htmlEl.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlEl.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
        updateThemeIcon(currentTheme);
        showToast(`Switched to ${currentTheme} mode`, 'fa-palette');
    });

    function updateThemeIcon(theme) {
        themeIcon.style.transform = 'rotate(180deg) scale(0)';
        setTimeout(() => {
            if(theme === 'dark') {
                themeIcon.className = 'fas fa-sun';
            } else {
                themeIcon.className = 'fas fa-moon';
            }
            themeIcon.style.transform = 'rotate(0deg) scale(1)';
        }, 200);
    }

    /* ========================
       NAVBAR & MOBILE MENU
       ======================== */
    const navbar = document.getElementById('navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        if(window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        hamburger.classList.toggle('toggle');
        if (navLinks.classList.contains('nav-active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('nav-active');
            hamburger.classList.remove('toggle');
            document.body.style.overflow = '';
        });
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                window.scrollTo({
                    top: target.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Back to top
    const backToTop = document.getElementById('back-to-top');
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ========================
       SCROLL SPY — Active Nav Link
       ======================== */
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 120;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-links a[href="#${id}"]`);
            
            if (link) {
                if (scrollPos >= top && scrollPos < top + height) {
                    links.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    /* ========================
       INTERSECTION OBSERVER (Scroll Animations)
       ======================== */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('show-element');
                observer.unobserve(entry.target);
                
                // Trigger counters if they are inside
                if(entry.target.classList.contains('about-stats')) {
                    startCounters();
                }
            }
        });
    }, observerOptions);

    /* ========================
       TYPING ANIMATION (with delete effect)
       ======================== */
    const texts = ["Enterprise Apps", "Scalable Systems", "REST APIs", "Modern Web Apps"];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingElement = document.querySelector(".typing-text");

    function typeWriter() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentText.length) {
            // Pause at end of word
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 400;
        }

        setTimeout(typeWriter, typeSpeed);
    }

    typeWriter();

    /* ========================
       ANIMATED COUNTERS
       ======================== */
    function startCounters() {
        const counters = document.querySelectorAll('.counter');
        const duration = 1500; // ms

        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const startTime = performance.now();

            function updateCount(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease-out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(eased * target);

                counter.innerText = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = target + "+";
                }
            }

            requestAnimationFrame(updateCount);
        });
    }

    /* ========================
       3D TILT EFFECT
       ======================== */
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    /* ========================
       PROJECT FILTERING
       ======================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            projects.forEach((project, index) => {
                if(filterValue === 'all' || project.classList.contains(filterValue)) {
                    // Stagger the entrance
                    setTimeout(() => {
                        project.style.display = 'flex';
                        requestAnimationFrame(() => {
                            project.style.opacity = '1';
                            project.style.transform = 'translateY(0)';
                        });
                    }, index * 80);
                } else {
                    project.style.opacity = '0';
                    project.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        project.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    /* ========================
       COPY EMAIL WITH TOAST
       ======================== */
    const copyEmailBtn = document.getElementById('copy-email');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const email = document.getElementById('email-text').innerText;
            navigator.clipboard.writeText(email).then(() => {
                const icon = copyEmailBtn.querySelector('i');
                icon.className = 'fas fa-check';
                icon.style.color = 'var(--accent-cyan)';
                
                showToast('Email copied to clipboard!', 'fa-check-circle');
                
                setTimeout(() => {
                    icon.className = 'far fa-copy';
                    icon.style.color = 'var(--text-secondary)';
                }, 2000);
            });
        });
    }

    /* ========================
       TOAST NOTIFICATION
       ======================== */
    function showToast(message, icon = 'fa-info-circle') {
        // Remove any existing toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
        document.body.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                toast.classList.add('show');
            });
        });

        // Auto-hide
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 2500);
    }

    /* ========================
       MAGNETIC BUTTON EFFECT
       ======================== */
    const magneticElements = document.querySelectorAll('.magnetic');

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
            el.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });

        el.addEventListener('mouseenter', () => {
            el.style.transition = 'transform 0.1s ease';
        });
    });

});
