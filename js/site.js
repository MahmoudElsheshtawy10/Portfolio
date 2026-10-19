/**
 * MAHMOUD ADEL — BACKEND .NET DEVELOPER PORTFOLIO
 * Core Client-Side Logic & Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* ========================================================
       1. LOADING SCREEN
       ======================================================== */
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.visibility = 'hidden';
                    loader.setAttribute('aria-hidden', 'true');
                    initScrollObserver();
                }, 500);
            }, 600);
        });

        // Fallback dismissal in case load event is delayed
        setTimeout(() => {
            if (loader.style.visibility !== 'hidden') {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.visibility = 'hidden';
                    loader.setAttribute('aria-hidden', 'true');
                    initScrollObserver();
                }, 500);
            }
        }, 2000);
    } else {
        initScrollObserver();
    }

    /* ========================================================
       2. CURSOR GLOW EFFECT (Desktop Only)
       ======================================================== */
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
        let cursorX = window.innerWidth / 2;
        let cursorY = window.innerHeight / 2;
        let glowX = cursorX;
        let glowY = cursorY;

        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
        }, { passive: true });

        function animateCursor() {
            glowX += (cursorX - glowX) * 0.12;
            glowY += (cursorY - glowY) * 0.12;
            cursorGlow.style.left = `${glowX}px`;
            cursorGlow.style.top = `${glowY}px`;
            requestAnimationFrame(animateCursor);
        }
        requestAnimationFrame(animateCursor);
    } else if (cursorGlow) {
        cursorGlow.style.display = 'none';
    }

    /* ========================================================
       3. SCROLL PROGRESS BAR
       ======================================================== */
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (windowHeight > 0) {
                const scrollPercent = (totalScroll / windowHeight) * 100;
                scrollProgress.style.width = `${scrollPercent}%`;
            }
        }, { passive: true });
    }

    /* ========================================================
       4. THEME SWITCHER (Dark/Light with Persistence)
       ======================================================== */
    const themeToggle = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    // Default to dark theme for engineering aesthetic, preserve user preference if saved
    let savedTheme = localStorage.getItem('theme') || 'dark';
    htmlEl.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            htmlEl.setAttribute('data-theme', currentTheme);
            localStorage.setItem('theme', currentTheme);
            updateThemeIcon(currentTheme);
            showToast(`Switched to ${currentTheme} theme`, 'fa-circle-half-stroke');
        });
    }

    function updateThemeIcon(theme) {
        if (!themeToggle) return;
        const icon = themeToggle.querySelector('i');
        if (!icon) return;

        icon.style.transform = 'rotate(180deg) scale(0)';
        setTimeout(() => {
            if (theme === 'dark') {
                icon.className = 'fas fa-sun';
                themeToggle.setAttribute('title', 'Switch to light theme');
            } else {
                icon.className = 'fas fa-moon';
                themeToggle.setAttribute('title', 'Switch to dark theme');
            }
            icon.style.transform = 'rotate(0deg) scale(1)';
        }, 180);
    }

    /* ========================================================
       5. NAVBAR & MOBILE MENU
       ======================================================== */
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const navItems = document.querySelectorAll('.nav-item');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isActive = navMenu.classList.toggle('nav-active');
            hamburger.classList.toggle('toggle');
            hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navMenu.classList.remove('nav-active');
                hamburger.classList.remove('toggle');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // Smooth scroll for nav anchor links with navbar offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 70;
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - navHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Back to top button
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ========================================================
       6. SCROLL SPY (Active Nav Link Highlighter)
       ======================================================== */
    const trackedSections = document.querySelectorAll('section[id]');
    function updateActiveNav() {
        const scrollPosition = window.scrollY + 120;

        trackedSections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-links a[href="#${id}"]`);

            if (correspondingLink) {
                if (scrollPosition >= top && scrollPosition < top + height) {
                    navItems.forEach(link => link.classList.remove('active'));
                    correspondingLink.classList.add('active');
                }
            }
        });
    }
    window.addEventListener('scroll', updateActiveNav, { passive: true });

    /* ========================================================
       7. INTERSECTION OBSERVER (Fade-in Animations)
       ======================================================== */
    function initScrollObserver() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('show-element');
                        obs.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -40px 0px'
            });

            document.querySelectorAll('.hidden-fade-up, .hidden-fade-left, .hidden-fade-right').forEach(el => {
                observer.observe(el);
            });
        } else {
            // Fallback for older browsers
            document.querySelectorAll('.hidden-fade-up, .hidden-fade-left, .hidden-fade-right').forEach(el => {
                el.classList.add('show-element');
            });
        }
    }

    /* ========================================================
       8. TYPEWRITER EFFECT (Backend Engineering Focus)
       ======================================================== */
    const typeTexts = [
        "Secure Enterprise .NET Apps",
        "Scalable RESTful Web APIs",
        "Clean Architecture & Domain Logic",
        "Reliable SQL Server Data Systems"
    ];
    let typeIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingElement = document.querySelector(".typing-text");

    if (typingElement) {
        function runTypewriter() {
            const currentString = typeTexts[typeIndex];

            if (isDeleting) {
                typingElement.textContent = currentString.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentString.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 40 : 85;

            if (!isDeleting && charIndex === currentString.length) {
                typeSpeed = 2200; // Pause when word complete
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                typeIndex = (typeIndex + 1) % typeTexts.length;
                typeSpeed = 400; // Pause before typing new word
            }

            setTimeout(runTypewriter, typeSpeed);
        }
        runTypewriter();
    }

    /* ========================================================
       9. PROJECT FILTERING
       ======================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach((card, idx) => {
                const matches = filterValue === 'all' || card.classList.contains(filterValue);
                if (matches) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, idx * 60);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });

    /* ========================================================
       10. TECHNICAL CASE STUDY MODAL DATA & CONTROLLER
       ======================================================== */
    const caseStudiesData = {
        'modal-inventory': {
            badge: 'Enterprise ERP Case Study',
            title: 'Smart Inventory System — Backend Architecture',
            tabs: {
                overview: `
                    <h4>Business Problem &amp; System Purpose</h4>
                    <p>
                        Enterprise retail and distribution operations often suffer from inventory discrepancies, stockouts of high-demand items, and financial write-offs due to expired products sitting unnoticed in warehouses.
                    </p>
                    <p>
                        The <strong>Smart Inventory System</strong> provides full lifecycle management across suppliers, purchase orders, hierarchical multi-tier warehouse storage, customer sales, and automated replenishment.
                    </p>
                    <div class="modal-grid-2">
                        <div class="modal-spec-card">
                            <h5>Core Implemented Modules</h5>
                            <p>Products &amp; Categories (Soft-delete support), Suppliers, Customers, Purchase Orders, Warehouse Locations, Batch Tracking, Inventory Transactions, Sales Invoices, and Smart Reordering.</p>
                        </div>
                        <div class="modal-spec-card">
                            <h5>Security &amp; Multilingual UI</h5>
                            <p>Role-based access control with ASP.NET Identity, permission-based authorization claims (<code>[HasPermission]</code>), active session tracking, and full Arabic/English bilingual support with RTL/LTR switching.</p>
                        </div>
                    </div>
                `,
                architecture: `
                    <h4>Architectural Design &amp; Database Topology</h4>
                    <p>
                        Built using <strong>ASP.NET Core MVC</strong>, <strong>Entity Framework Core (Code-First)</strong>, and <strong>Microsoft SQL Server</strong> with strict relational integrity constraints and transaction isolation.
                    </p>
                    <div class="modal-spec-card" style="margin-bottom: 16px;">
                        <h5>Hierarchical Warehouse Topology</h5>
                        <p>Storage is organized hierarchically to pinpoint exact batch locations: <code>Branch &rarr; Zone &rarr; Rack &rarr; Shelf &rarr; Batch</code>.</p>
                    </div>
                    <div class="modal-code-block">
// Database Relationship Overview
Branch (1) &mdash;&mdash;&lt; (N) Zone (1) &mdash;&mdash;&lt; (N) Rack (1) &mdash;&mdash;&lt; (N) Shelf (1) &mdash;&mdash;&lt; (N) Batch
Product (1) &mdash;&mdash;&lt; (N) Batch &mdash;&mdash;&lt; (N) InventoryTransaction
Supplier (1) &mdash;&mdash;&lt; (N) PurchaseOrder (1) &mdash;&mdash;&lt; (N) PurchaseOrderItem
Customer (1) &mdash;&mdash;&lt; (N) SalesInvoice (1) &mdash;&mdash;&lt; (N) SalesInvoiceItem
                    </div>
                `,
                challenges: `
                    <h4>Technical Challenges &amp; Implemented Solutions</h4>
                    <div class="modal-spec-card" style="margin-bottom: 14px;">
                        <h5>1. First-Expiry-First-Out (FEFO) Stock Deduction</h5>
                        <p>When sales invoices are processed, stock is automatically allocated and deducted from batches with the earliest expiry dates rather than simple FIFO. This prevents perishable goods from degrading in storage.</p>
                    </div>
                    <div class="modal-spec-card" style="margin-bottom: 14px;">
                        <h5>2. Automated Smart Reorder Calculation</h5>
                        <p>Replenishment thresholds are evaluated dynamically across active inventory: when <code>CurrentStock &le; ReorderLevel</code>, the suggested order quantity is computed via: <code>Suggested = (ReorderLevel * 2) - CurrentStock</code>, generating ready-to-dispatch purchase order drafts.</p>
                    </div>
                    <div class="modal-spec-card">
                        <h5>3. Transactional Consistency &amp; CSV Reporting</h5>
                        <p>Purchase receipt automatically increments physical stock, creates batch records, and logs audit transactions within a single atomic database transaction. Export features allow on-demand CSV extracts for accounting audits.</p>
                    </div>
                `
            },
            sourceUrl: 'https://github.com/MahmoudElsheshtawy10/Smart-Inventory-System',
            liveUrl: null
        },
        'modal-cinema': {
            badge: 'Clean Architecture & Web API Case Study',
            title: 'Galaxy Cinema — Booking & Showtime Architecture',
            tabs: {
                overview: `
                    <h4>Business Problem &amp; Architecture Goals</h4>
                    <p>
                        High-traffic cinema ticketing platforms face severe concurrency risks during peak booking windows (e.g. blockbuster premiere launches) where multiple patrons attempt to reserve the same seats simultaneously.
                    </p>
                    <p>
                        The <strong>Galaxy Cinema System</strong> is structured using <strong>Clean Architecture</strong> with a decoupled Web API, Domain layer, and Infrastructure persistence, designed to guarantee booking isolation and smooth showtime scheduling.
                    </p>
                    <div class="modal-grid-2">
                        <div class="modal-spec-card">
                            <h5>Core Controllers &amp; Hubs</h5>
                            <p>BookingsController, ShowtimesController, PaymentsController, StaffController, and real-time SignalR hubs for instantaneous seat state broadcast.</p>
                        </div>
                        <div class="modal-spec-card">
                            <h5>Multi-Format Hall Configurations</h5>
                            <p>Dynamic auditorium schemas supporting Standard, VIP, Dolby Atmos, and 4DX seat layouts with tiered ticket pricing.</p>
                        </div>
                    </div>
                `,
                architecture: `
                    <h4>Layered Clean Architecture</h4>
                    <p>Strict separation of concerns prevents business logic leakage into presentation or database drivers:</p>
                    <div class="modal-code-block">
Solution: CinemaSystem.slnx
├── CinemaSystem.Domain         // Entities (Movie, Showtime, Hall, Seat, Booking)
├── CinemaSystem.Application    // Commands, Queries, DTOs, Business Rules
├── CinemaSystem.Infrastructure // EF Core DbContext, SQL Server, Repositories
└── CinemaSystem.API            // Controllers, Middleware, SignalR Hubs
                    </div>
                `,
                challenges: `
                    <h4>Key Technical Challenges Solved</h4>
                    <div class="modal-spec-card" style="margin-bottom: 14px;">
                        <h5>1. Concurrency Conflict Prevention</h5>
                        <p>Engineered transactional state transitions (Available &rarr; ReservedPending &rarr; Confirmed) with lease timeouts, preventing double-selling while a user completes payment.</p>
                    </div>
                    <div class="modal-spec-card">
                        <h5>2. Booking State Machine &amp; Payment Verification</h5>
                        <p>PaymentsController verifies gateway confirmation before transitioning reservation status to confirmed and generating ticket tokens.</p>
                    </div>
                `
            },
            sourceUrl: 'https://github.com/MahmoudElsheshtawy10/cinema-system',
            liveUrl: null
        },
        'modal-hightech': {
            badge: 'E-Commerce Platform Case Study',
            title: 'HighTech B2B Mobile Accessories Platform',
            tabs: {
                overview: `
                    <h4>Business Problem &amp; Platform Context</h4>
                    <p>
                        Developed in collaboration with Z-Tone Technology, <strong>HighTech Platform</strong> (<a href="https://hightech-b2b.com" target="_blank" rel="noopener noreferrer" class="inline-link">hightech-b2b.com</a>) is an enterprise B2B wholesale platform for mobile accessories in Egypt.
                    </p>
                    <p>
                        Traditional wholesale ordering relies on fragmented phone calls and messaging. HighTech automates product discovery, merchant wholesale onboarding, and order fulfillment.
                    </p>
                    <div class="modal-grid-2">
                        <div class="modal-spec-card">
                            <h5>Verified Technology Stack</h5>
                            <p>ASP.NET Core MVC, Entity Framework Core, Microsoft SQL Server, ASP.NET Identity, Bootstrap, deployed to Render.</p>
                        </div>
                        <div class="modal-spec-card">
                            <h5>B2B Wholesale Features</h5>
                            <p>Merchant account onboarding, multi-brand catalog (cables, chargers, audio), tiered order calculations, and admin fulfillment console.</p>
                        </div>
                    </div>
                `,
                architecture: `
                    <h4>E-Commerce Data Pipeline &amp; Deployment</h4>
                    <p>Relational database architecture designed to handle high product variance and fluctuating wholesale prices:</p>
                    <div class="modal-code-block">
// Relational Entities &amp; Line Items
Product (Id, Name, BrandId, Sku, WholesalePrice, StockQuantity)
Category (Id, Name, ParentCategoryId)
Brand (Id, Name, LogoUrl)
Order (Id, MerchantId, Status, TotalAmount, CreatedAt)
OrderItem (Id, OrderId, ProductId, UnitPrice, Quantity, Subtotal)
                    </div>
                    <p style="margin-top: 14px;">
                        The web application is containerized and hosted on the <strong>Render</strong> cloud platform, leveraging environment variables for connection strings and sensitive keys.
                    </p>
                `,
                challenges: `
                    <h4>Technical Challenges Solved</h4>
                    <div class="modal-spec-card" style="margin-bottom: 14px;">
                        <h5>1. Inventory Overselling Prevention</h5>
                        <p>Implemented real-time stock validation during the checkout pipeline to ensure rapid bulk merchant orders do not deplete inventory below zero.</p>
                    </div>
                    <div class="modal-spec-card">
                        <h5>2. Role-Based Merchant Onboarding</h5>
                        <p>Segmented public consumer views from registered wholesale merchants using ASP.NET Identity roles and claims-based authorizations.</p>
                    </div>
                `
            },
            sourceUrl: 'https://github.com/MahmoudElsheshtawy10',
            liveUrl: 'https://hightech-b2b.com'
        }
    };

    const modalBackdrop = document.getElementById('case-study-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalBadge = document.getElementById('modal-project-badge');
    const modalTitle = document.getElementById('modal-title');
    const modalContentArea = document.getElementById('modal-content-area');
    const modalFooterActions = document.getElementById('modal-footer-actions');
    const modalTabButtons = document.querySelectorAll('.modal-tab-btn');

    let currentProjectKey = 'modal-inventory';

    function openModal(projectKey) {
        const data = caseStudiesData[projectKey];
        if (!data || !modalBackdrop) return;

        currentProjectKey = projectKey;
        modalBadge.textContent = data.badge;
        modalTitle.textContent = data.title;

        // Reset tabs
        modalTabButtons.forEach((btn, idx) => {
            btn.classList.toggle('active', idx === 0);
            btn.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
        });

        // Set initial tab content
        modalContentArea.innerHTML = data.tabs.overview;

        // Populate footer buttons
        modalFooterActions.innerHTML = '';
        if (data.sourceUrl) {
            const srcBtn = document.createElement('a');
            srcBtn.href = data.sourceUrl;
            srcBtn.target = '_blank';
            srcBtn.rel = 'noopener noreferrer';
            srcBtn.className = 'btn btn-outline btn-sm';
            srcBtn.innerHTML = '<i class="fab fa-github"></i> View GitHub Repository';
            modalFooterActions.appendChild(srcBtn);
        }
        if (data.liveUrl) {
            const liveBtn = document.createElement('a');
            liveBtn.href = data.liveUrl;
            liveBtn.target = '_blank';
            liveBtn.rel = 'noopener noreferrer';
            liveBtn.className = 'btn btn-primary btn-sm';
            liveBtn.innerHTML = '<i class="fas fa-arrow-up-right-from-square"></i> Visit Live Platform';
            modalFooterActions.appendChild(liveBtn);
        }

        const closeBtnBottom = document.createElement('button');
        closeBtnBottom.className = 'btn btn-ghost btn-sm';
        closeBtnBottom.textContent = 'Close';
        closeBtnBottom.addEventListener('click', closeModal);
        modalFooterActions.appendChild(closeBtnBottom);

        modalBackdrop.classList.add('open');
        modalBackdrop.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modalBackdrop) return;
        modalBackdrop.classList.remove('open');
        modalBackdrop.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Modal Trigger Listeners
    document.querySelectorAll('[data-open-modal]').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const projectKey = trigger.getAttribute('data-open-modal');
            openModal(projectKey);
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) {
                closeModal();
            }
        });
    }

    // Modal Tab Navigation
    modalTabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modalTabButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            const tabKey = btn.getAttribute('data-tab').replace('tab-', '');
            const currentData = caseStudiesData[currentProjectKey];
            if (currentData && currentData.tabs[tabKey]) {
                modalContentArea.innerHTML = currentData.tabs[tabKey];
            }
        });
    });

    // Close on Escape Key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('open')) {
            closeModal();
        }
    });

    /* ========================================================
       11. COPY EMAIL TO CLIPBOARD WITH FEEDBACK
       ======================================================== */
    const copyEmailBtn = document.getElementById('copy-email');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const emailElement = document.getElementById('email-text');
            const email = emailElement ? emailElement.innerText.trim() : 'mahmoudadeldev26@gmail.com';

            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(email).then(() => {
                    handleCopySuccess();
                }).catch(() => {
                    fallbackCopyText(email);
                });
            } else {
                fallbackCopyText(email);
            }
        });
    }

    function fallbackCopyText(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            handleCopySuccess();
        } catch (err) {
            showToast('Email: mahmoudadeldev26@gmail.com', 'fa-envelope');
        }
        document.body.removeChild(textArea);
    }

    function handleCopySuccess() {
        const icon = copyEmailBtn.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-check';
            icon.style.color = 'var(--accent-success)';
        }

        showToast('Email copied to clipboard: mahmoudadeldev26@gmail.com', 'fa-check-circle');

        setTimeout(() => {
            if (icon) {
                icon.className = 'far fa-copy';
                icon.style.color = '';
            }
        }, 2200);
    }

    /* ========================================================
       12. TOAST NOTIFICATION UTILITY
       ======================================================== */
    function showToast(message, iconClass = 'fa-info-circle') {
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fas ${iconClass}"></i> <span>${message}</span>`;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                toast.classList.add('show');
            });
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    /* ========================================================
       13. 3D CARD TILT EFFECT (Subtle & Restrained)
       ======================================================== */
    const tiltCards = document.querySelectorAll('.tilt-card');
    if (window.matchMedia('(pointer: fine)').matches) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            });
        });
    }

    /* ========================================================
       14. DYNAMIC CURRENT YEAR
       ======================================================== */
    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

});
