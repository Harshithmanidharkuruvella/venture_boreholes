/* ===================================
   VENTURE BOREHOLE - AWWWARDS TIER ANIMATIONS
   =================================== */

// Register GSAP plugins safely
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Initialize Smooth Scrolling (Lenis) safely
let lenis;
if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    // Integrate Lenis with GSAP ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    }
}

document.addEventListener('DOMContentLoaded', () => {

    /* --- Preloader & Animation Sequence --- */
    const preloader = document.getElementById('preloader');
    
    // Split text for hero safely
    let heroTitle;
    if (typeof SplitType !== 'undefined') {
        heroTitle = new SplitType('.hero h1', { types: 'lines, words' });
        gsap.set('.hero h1', { opacity: 1 }); // Reveal parent wrapper, since split words are hidden
        if (heroTitle && heroTitle.words) {
            gsap.set(heroTitle.words, { y: 100, opacity: 0 });
        }
    } else {
        // Fallback if SplitType doesn't load: keep it shifted and transparent, timeline will animate it
        gsap.set('.hero h1', { y: 30, opacity: 0 });
    }
    
    gsap.set('.hero-eyebrow, .hero-desc, .hero-btns', { y: 30, opacity: 0 });
    gsap.set('.hero-media img', { scale: 1.15 });

    const startIntroAnimation = () => {
        const tl = gsap.timeline();

        // 1. Preloader fade out
        tl.to('.preloader-logo', { opacity: 0, duration: 0.5, ease: "power2.inOut" }, "+=0.2")
          .to('.preloader-bar', { width: 0, opacity: 0, duration: 0.4, ease: "power2.inOut" })
          .to(preloader, { 
              yPercent: -100, 
              duration: 1, 
              ease: "expo.inOut",
              onComplete: () => {
                  preloader.style.display = 'none';
              }
          })
          
          // 2. Hero Image Scale
          .to('.hero-media img', { scale: 1, duration: 2, ease: "expo.out" }, "-=0.6");
          
          // 3. Hero Text Reveal (using words if SplitType worked, otherwise fallback)
          if (heroTitle && heroTitle.words) {
              tl.to(heroTitle.words, {
                  y: 0,
                  opacity: 1,
                  duration: 1.2,
                  stagger: 0.04,
                  ease: "expo.out"
              }, "-=1.5");
          } else {
              tl.to('.hero h1', {
                  y: 0,
                  opacity: 1,
                  duration: 1.2,
                  ease: "expo.out"
              }, "-=1.5");
          }
          
          tl.to(['.hero-eyebrow', '.hero-desc', '.hero-btns'], {
              y: 0,
              opacity: 1,
              duration: 1,
              stagger: 0.1,
              ease: "expo.out",
              onComplete: () => {
                  if (typeof ScrollTrigger !== 'undefined') {
                      ScrollTrigger.refresh();
                  }
              }
          }, "-=1.2");
          
          // Force layout refresh for mobile devices
          setTimeout(() => {
              if (typeof ScrollTrigger !== 'undefined') {
                  ScrollTrigger.refresh();
              }
          }, 1500);
    };

    if (document.readyState === 'complete') {
        startIntroAnimation();
    } else {
        window.addEventListener('load', startIntroAnimation);
    }

    /* --- Global Text Splitting for Scroll Reveals --- */
    if (typeof SplitType !== 'undefined' && window.innerWidth > 768) {
        const splitHeaders = document.querySelectorAll('.sec-heading');
        splitHeaders.forEach(header => {
            const split = new SplitType(header, { types: 'lines, words' });
            if (split && split.words) {
                gsap.fromTo(split.words, 
                    { y: 50, opacity: 0 },
                    {
                        scrollTrigger: {
                            trigger: header,
                            start: "top 85%",
                        },
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        stagger: 0.02,
                        ease: "expo.out"
                    }
                );
            }
        });
    } else {
        // Fallback for mobile viewports or if SplitType is undefined
        const splitHeaders = document.querySelectorAll('.sec-heading');
        splitHeaders.forEach(header => {
            gsap.fromTo(header,
                { y: 30, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: header,
                        start: "top 85%",
                    },
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "expo.out"
                }
            );
        });
    }

    /* --- Parallax Images --- */
    const parallaxImages = document.querySelectorAll('.about-img img, .cta-media img');
    parallaxImages.forEach(img => {
        gsap.fromTo(img, 
            { yPercent: -10 },
            {
                yPercent: 10,
                ease: "none",
                scrollTrigger: {
                    trigger: img.parentElement,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            }
        );
    });

    /* --- Standard Scroll Reveals (Fade Up) --- */
    const fadeElements = gsap.utils.toArray('.reveal');
    fadeElements.forEach(el => {
        gsap.fromTo(el, 
            { y: 40, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                },
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: "expo.out"
            }
        );
    });

    /* --- Number Counter Animation --- */
    const stats = document.querySelectorAll('.stat-num');
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'), 10);
        const suffix = stat.getAttribute('data-suffix') || '';
        
        gsap.fromTo(stat, 
            { innerHTML: 0 }, 
            {
                innerHTML: target,
                duration: 2.5,
                ease: "power3.out",
                snap: { innerHTML: 1 },
                scrollTrigger: {
                    trigger: stat.parentElement,
                    start: "top 85%",
                },
                onUpdate: function() {
                    stat.innerHTML = Math.round(this.targets()[0].innerHTML) + suffix;
                }
            }
        );
    });

    /* --- Magnetic Buttons --- */
    const magneticItems = document.querySelectorAll('.btn, .nav-cta-btn');
    
    magneticItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const position = item.getBoundingClientRect();
            const x = e.clientX - position.left - position.width / 2;
            const y = e.clientY - position.top - position.height / 2;

            gsap.to(item, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.4,
                ease: "power2.out"
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });

    /* --- Services Hover Image Effect (Optional micro-interaction) --- */
    const services = document.querySelectorAll('.svc');
    services.forEach(svc => {
        svc.addEventListener('mouseenter', () => {
            gsap.to(svc.querySelector('.svc-icon'), { y: -5, duration: 0.3, ease: "power2.out" });
        });
        svc.addEventListener('mouseleave', () => {
            gsap.to(svc.querySelector('.svc-icon'), { y: 0, duration: 0.3, ease: "power2.out" });
        });
    });

    /* --- Navigation --- */
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navShade = document.getElementById('navShade');
    const navLinks = navMenu.querySelectorAll('a');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            if (window.scrollY <= 10) {
                navbar.classList.remove('scrolled');
            }
        }
    }, { passive: true });

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('open');
        navShade.classList.toggle('active');
        
        if (navMenu.classList.contains('open')) {
            if (typeof lenis !== 'undefined' && lenis) lenis.stop(); // Stop smooth scroll
            navbar.classList.add('scrolled');
        } else {
            if (typeof lenis !== 'undefined' && lenis) lenis.start();
            if (window.scrollY <= 10) navbar.classList.remove('scrolled');
        }
    }

    hamburger.addEventListener('click', toggleMenu);
    navShade.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if(link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                
                if (navMenu.classList.contains('open')) {
                    toggleMenu();
                }

                // Use lenis to scroll smoothly if available, fallback to native smooth scroll
                if (typeof lenis !== 'undefined' && lenis) {
                    lenis.scrollTo(targetId, {
                        offset: -80,
                        duration: 1.2,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                    });
                } else {
                    const targetEl = document.querySelector(targetId);
                    if (targetEl) {
                        const offset = 80;
                        const bodyRect = document.body.getBoundingClientRect().top;
                        const elementRect = targetEl.getBoundingClientRect().top;
                        const elementPosition = elementRect - bodyRect;
                        const offsetPosition = elementPosition - offset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            }
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    /* --- Back to Top --- */
    const toTopBtn = document.getElementById('toTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 800) {
            toTopBtn.classList.add('visible');
        } else {
            toTopBtn.classList.remove('visible');
        }
    }, { passive: true });

    toTopBtn.addEventListener('click', () => {
        if (typeof lenis !== 'undefined' && lenis) {
            lenis.scrollTo(0, {
                duration: 1.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });

    /* --- Advanced Scroll Velocity Skew --- */
    let proxy = { skew: 0 },
        skewSetter = gsap.quickSetter(".why-item, .proj", "skewY", "deg"),
        clamp = gsap.utils.clamp(-5, 5);

    if (window.innerWidth > 1024) {
        ScrollTrigger.create({
            onUpdate: (self) => {
                let skew = clamp(self.getVelocity() / -300);
                if (Math.abs(skew) > Math.abs(proxy.skew)) {
                    proxy.skew = skew;
                    gsap.to(proxy, { skew: 0, duration: 0.8, ease: "power3", overwrite: true, onUpdate: () => skewSetter(proxy.skew) });
                }
            }
        });

        gsap.set(".why-item, .proj", { transformOrigin: "right center", force3D: true });
    }

    /* --- Marquee Animation --- */
    gsap.to(".marquee-inner", {
        xPercent: -50,
        ease: "none",
        duration: 20,
        repeat: -1
    });

    /* --- Image Mask Reveals --- */
    const imageMasks = document.querySelectorAll('.reveal-mask');
    imageMasks.forEach(mask => {
        gsap.to(mask, {
            scaleX: 0,
            duration: 1.5,
            ease: "expo.out",
            scrollTrigger: {
                trigger: mask.parentElement,
                start: "top 80%"
            }
        });
    });



    /* --- Services Details Database & Modal Logic --- */
    const serviceDetails = {
        "0": {
            title: "Borehole <em>Drilling</em>",
            tagline: "Depths up to 500m",
            description: "Utilizing state-of-the-art, high-pressure hydraulic rigs, Venture Drilling provides customized drilling solutions to reach depths of up to 500 meters, regardless of challenging geological conditions. Our drilling services cover everything from residential and commercial borehole installation to larger-scale community projects. Each project is executed with precision, ensuring a safe and reliable water source tailored to our clients’ unique environmental and operational requirements.",
            features: ["Residential & Commercial Rigs", "Depths up to 500 Meters", "High-Pressure Hydraulic Systems", "Complete Casing & Development"],
            whatsappText: "I want to get a quotation for Borehole Drilling"
        },
        "1": {
            title: "Blasthole <em>Drilling</em>",
            tagline: "Mining Operations",
            description: "Our blasthole drilling services support mining operations by facilitating effective rock drilling and explosive placement for mining preparations. We use modern, high-efficiency equipment to maximize productivity while maintaining the highest safety standards in challenging mining environments.",
            features: ["Precision Mining Drilling", "Optimized Pattern Design", "High Productivity Rigs", "Meticulous Safety Compliance"],
            whatsappText: "I want to get a quotation for Blasthole Drilling"
        },
        "2": {
            title: "Construction <em>Support</em>",
            tagline: "Pumps & Reservoirs",
            description: "Venture Drilling provides comprehensive support for borehole-related infrastructure, including the supply and installation of high-quality pumps, reservoirs, and small irrigation systems. We ensure that each project is fully equipped to serve its intended purpose. Our construction support services extend to community training, equipping local teams with the knowledge needed to manage and maintain their water infrastructure effectively, enhancing project sustainability and community impact.",
            features: ["High-Quality Pump Installation", "Reservoirs & Tanks Setup", "Small Irrigation Systems", "Community Maintenance Training"],
            whatsappText: "I want to get a quotation for Construction Support"
        },
        "3": {
            title: "Geophysical <em>Surveys</em>",
            tagline: "Exploration",
            description: "We employ advanced geophysical survey techniques to accurately map subterranean water resources. Our scientific approach ensures optimal borehole placement, reducing drilling risks and maximizing yield. Whether for a small residential well or a large agricultural project, our surveys provide the critical data needed for successful drilling operations.",
            features: ["Hydrogeological Mapping", "Subterranean Resource Scans", "Borehole Site Selection", "Comprehensive Yield Prognosis"],
            whatsappText: "I want to get a quotation for Geophysical Surveys"
        },
        "4": {
            title: "Consultancy <em>& Dev</em>",
            tagline: "Business Growth",
            description: "Our consultancy services provide expert guidance on water infrastructure projects, from initial feasibility studies to project management and business development. We help organizations, NGOs, and mining companies optimize their water strategies, ensuring sustainable and economically viable solutions tailored to their specific needs.",
            features: ["Water Feasibility Studies", "Project Planning & Design", "Strategy Optimization", "Economic Viability Auditing"],
            whatsappText: "I want to get a quotation for Consultancy & Business Development"
        },
        "5": {
            title: "IT <em>Projects</em>",
            tagline: "Tech Solutions",
            description: "Modern water infrastructure demands smart technology. Our IT Projects division specializes in implementing advanced telemetry and monitoring systems for boreholes and reservoirs. We provide real-time data on water levels, pump performance, and system health, empowering you to manage resources efficiently and prevent costly downtime.",
            features: ["Real-time Telemetry Systems", "Reservoir Level Monitoring", "Smart Pump Control Panels", "Downtime Prevention Systems"],
            whatsappText: "I want to get a quotation for IT Projects"
        }
    };
    const svcRows = document.querySelectorAll('.svc-row');

    // Modal click handling
    const serviceModal = document.getElementById('serviceModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalTagline = document.getElementById('modalTagline');
    const modalText = document.getElementById('modalText');
    const modalFeaturesList = document.getElementById('modalFeaturesList');
    const modalCtaBtn = document.getElementById('modalCtaBtn');
    const modalCloseBtn = document.getElementById('modalCloseBtn');

    if (serviceModal && svcRows.length) {
        svcRows.forEach(row => {
            row.addEventListener('click', (e) => {
                e.preventDefault();
                const index = row.getAttribute('data-index');
                const data = serviceDetails[index];
                
                if (data) {
                    modalTitle.innerHTML = data.title;
                    modalTagline.innerText = data.tagline;
                    modalText.innerHTML = data.description;
                    
                    // Render features
                    modalFeaturesList.innerHTML = '';
                    data.features.forEach(feat => {
                        const item = document.createElement('div');
                        item.className = 'service-modal-feature-item';
                        item.innerHTML = `<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> ${feat}`;
                        modalFeaturesList.appendChild(item);
                    });
                    
                    // Update CTA link
                    modalCtaBtn.setAttribute('href', `https://wa.me/263719662345?text=${encodeURIComponent(data.whatsappText)}`);
                    
                    // Show modal
                    serviceModal.classList.add('open');
                    document.body.classList.add('modal-open');
                    if (typeof lenis !== 'undefined' && lenis) lenis.stop(); // Stop smooth scroll
                }
            });
        });

        // Close modal handlers
        const closeModal = () => {
            serviceModal.classList.remove('open');
            document.body.classList.remove('modal-open');
            if (typeof lenis !== 'undefined' && lenis) lenis.start(); // Resume smooth scroll
        };

        modalCloseBtn.addEventListener('click', closeModal);
        serviceModal.addEventListener('click', (e) => {
            if (e.target === serviceModal) {
                closeModal();
            }
        });
        
        // Escape key to close
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && serviceModal.classList.contains('open')) {
                closeModal();
            }
        });
    }

});
