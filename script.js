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
    const heroH1 = document.querySelector('.hero h1');
    if (heroH1) {
        if (typeof SplitType !== 'undefined') {
            heroTitle = new SplitType('.hero h1', { types: 'lines, words' });
            gsap.set('.hero h1', { opacity: 1 }); // Reveal parent wrapper, since split words are hidden
            if (heroTitle && heroTitle.words && heroTitle.words.length > 0) {
                gsap.set(heroTitle.words, { y: 100, opacity: 0 });
            }
        } else {
            // Fallback if SplitType doesn't load: keep it shifted and transparent, timeline will animate it
            gsap.set('.hero h1', { y: 30, opacity: 0 });
        }
    }
    
    if (document.querySelector('.hero-eyebrow, .hero-desc, .hero-btns')) {
        gsap.set('.hero-eyebrow, .hero-desc, .hero-btns', { y: 30, opacity: 0 });
    }
    if (document.querySelector('.hero-media img')) {
        gsap.set('.hero-media img', { scale: 1.15 });
    }

    const startIntroAnimation = () => {
        const tl = gsap.timeline();

        if (preloader) {
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
              });
        }
          
        // 2. Hero Image Scale
        if (document.querySelector('.hero-media img')) {
            tl.to('.hero-media img', { scale: 1, duration: 2, ease: "expo.out" }, preloader ? "-=0.6" : "<");
        }
          
        // 3. Hero Text Reveal (using words if SplitType worked, otherwise fallback)
        if (heroTitle && heroTitle.words && heroTitle.words.length > 0) {
            tl.to(heroTitle.words, {
                y: 0,
                opacity: 1,
                duration: 1.2,
                stagger: 0.04,
                ease: "expo.out"
            }, preloader ? "-=1.5" : "-=1.8");
        } else if (document.querySelector('.hero h1')) {
            tl.to('.hero h1', {
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: "expo.out"
            }, preloader ? "-=1.5" : "-=1.8");
        }
        
        if (document.querySelector('.hero-eyebrow, .hero-desc, .hero-btns')) {
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
            }, preloader ? "-=1.2" : "-=1.5");
        }
          
        // Force layout refresh for mobile devices
        setTimeout(() => {
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
        }, 1500);
    };

    // Run intro animation immediately once DOM is parsed
    startIntroAnimation();

    // Refresh GSAP scroll coordinates once all images load
    window.addEventListener('load', () => {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    });

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
    if (document.querySelector(".why-item, .proj") && window.innerWidth > 1024) {
        let proxy = { skew: 0 },
            skewSetter = gsap.quickSetter(".why-item, .proj", "skewY", "deg"),
            clamp = gsap.utils.clamp(-5, 5);

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

    /* --- Blogs Details Database & Modal Logic --- */
    const blogArticles = {
        "0": {
            tag: "Hydrogeology",
            date: "June 12, 2026",
            title: "The Science of Finding Water: How Geophysical Surveys Work",
            img: "img/about-aerial.png",
            content: `
                <p>Locating a high-yield water resource is not a matter of guesswork. While traditional dowsing has been used historically, modern groundwater exploration relies on sophisticated geophysical surveys to map the subsurface and identify water-bearing rock layers (aquifers).</p>
                <h3>What is a Geophysical Survey?</h3>
                <p>A geophysical survey is a non-invasive scientific method that measures the physical properties of the earth beneath our feet. For borehole drilling, the primary method used is the <strong>Electrical Resistivity Test</strong>. Because water is an excellent conductor of electricity, saturated geological formations have much lower electrical resistance compared to dry, solid rock. By injecting controlled electrical currents into the ground via steel electrodes and measuring the potential difference, our geophysicists can map resistivity changes at various depths.</p>
                <blockquote>"By using advanced 2D resistivity imaging, we can construct a vertical cross-section of the ground, pinpointing aquifers with up to 95% accuracy before a single meter is drilled."</blockquote>
                <h3>How It Works: Step-by-Step</h3>
                <p>1. <strong>Site Analysis:</strong> Our team reviews local geological maps, hydrogeological reports, and satellite imagery to understand the regional structures.</p>
                <p>2. <strong>Field Profiling:</strong> We lay out a survey line and insert metal electrodes into the ground. These are connected to a digital resistivity meter.</p>
                <p>3. <strong>Data Logging:</strong> The resistivity meter sends electrical current profiles into the ground at increments, profiling depths of up to 200 meters or more.</p>
                <p>4. <strong>3D Inversion & Modeling:</strong> The gathered data is processed using specialized software to generate models showing clay layers, sand formations, dry bedrock, and water-saturated fractures.</p>
                <h3>Maximizing Borehole Success</h3>
                <p>Conducting a proper survey dramatically reduces the risk of drilling a dry well. It ensures that the borehole is positioned in the spot with the highest yield potential and determines the exact depth required to secure a reliable, long-term water supply.</p>
            `
        },
        "1": {
            tag: "Engineering",
            date: "May 28, 2026",
            title: "Understanding Borehole Casing: Why Quality Materials Matter",
            img: "img/service-accessories.png",
            content: `
                <p>Once a borehole has been successfully drilled to its target depth, the engineering work is only half complete. To transform a raw, mud-filled hole into a permanent, clean water source, it must be properly cased and completed. Skimping on casing quality is one of the most common causes of premature borehole failure in Zimbabwe.</p>
                <h3>What is Borehole Casing?</h3>
                <p>Casing is a lining of high-strength PVC or steel pipe that is inserted into the drilled hole. Its primary purposes are to prevent the surrounding soil and loose rock from collapsing into the well, and to isolate the clean aquifer from shallow, contaminated groundwater.</p>
                <h3>Key Components of a Quality Well Completion</h3>
                <p><strong>1. Class 9 or Class 12 PVC Casing:</strong> We use thick-walled, food-grade PVC casings designed specifically for water wells. Standard thin PVC pipes will buckle under the immense pressure of shifting soil or during pump installation.</p>
                <p><strong>2. Gravel Packing:</strong> The space between the outer drilled wall and the inner PVC casing is filled with clean, graded silica gravel (pea gravel). This acts as a natural pre-filter, keeping sand and fine sediment out of your well while allowing water to flow smoothly inside.</p>
                <p><strong>3. Sanitary Seals (Grouting):</strong> The top 6 to 10 meters of the borehole are sealed with concrete grout. This sanitary seal prevents dirty surface water, organic matter, and contaminants from running down the outside of the casing and polluting the deep groundwater reservoir.</p>
                <blockquote>"A borehole built with sub-standard casing might function for a few months, but shifting earth or root systems will eventually crush it, leading to pump damage and costly re-drilling."</blockquote>
                <h3>Protecting Your Investment</h3>
                <p>Investing in high-quality materials and strict engineering standards during the well completion stage ensures your borehole will remain structural and provide crystal-clear water for decades.</p>
            `
        },
        "2": {
            tag: "Technology",
            date: "April 15, 2026",
            title: "Solar-Powered Water Systems: The Future of Agriculture",
            img: "img/service-it.png",
            content: `
                <p>For decades, agricultural operations and off-grid communities in Zimbabwe relied on expensive diesel generators to run their water pumps. Today, the rapid advancement and falling costs of solar energy have made solar-powered borehole systems the gold standard for reliable, eco-friendly, and cost-effective water supply.</p>
                <h3>The Power of Solar Telemetry</h3>
                <p>Modern solar water systems are far more than just a pump connected to a solar panel. Advanced solar controllers manage power variations dynamically. When the sun is weak in the morning or during cloud cover, the controller adjusts the pump's frequency to keep drawing water without overloading the system. This maximizes daily water yields without relying on storage batteries, which are expensive and prone to theft.</p>
                <h3>Why Solar is Transforming Agriculture</h3>
                <p><strong>Zero Fuel Costs:</strong> Unlike diesel generators that require continuous fuel purchases and expensive maintenance, solar systems harness free sunlight. The initial setup pays for itself within the first 12 to 18 months of operation.</p>
                <p><strong>Automated & Smart Control:</strong> Modern solar systems can be integrated with smart pressure switches and telemetry panels. The pump will automatically shut off when your reservoirs are full or if the water level in the borehole drops below a safe limit, protecting the pump from running dry.</p>
                <blockquote>"Solar-powered drip irrigation allows smallholders and commercial farms to cultivate high-value crops year-round, securing food supplies and generating reliable income regardless of rainfall patterns."</blockquote>
                <h3>Long-Term Sustainability</h3>
                <p>By transitioning to solar-powered systems, farm operations and residential estates significantly reduce their carbon footprint while gaining absolute independence from electrical grid instability and rising fuel costs.</p>
            `
        }
    };

    const blogLinks = document.querySelectorAll('.blog-link');
    const blogModal = document.getElementById('blogModal');
    const blogModalImg = document.getElementById('blogModalImg');
    const blogModalTag = document.getElementById('blogModalTag');
    const blogModalDate = document.getElementById('blogModalDate');
    const blogModalTitle = document.getElementById('blogModalTitle');
    const blogModalText = document.getElementById('blogModalText');
    const blogCloseBtn = document.getElementById('blogCloseBtn');

    if (blogModal && blogLinks.length) {
        blogLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const index = link.getAttribute('data-index');
                const article = blogArticles[index];

                if (article) {
                    blogModalImg.setAttribute('src', article.img);
                    blogModalImg.setAttribute('alt', article.title);
                    blogModalTag.innerText = article.tag;
                    blogModalDate.innerText = article.date;
                    blogModalTitle.innerText = article.title;
                    blogModalText.innerHTML = article.content;

                    blogModal.classList.add('open');
                    document.body.classList.add('modal-open');
                    if (typeof lenis !== 'undefined' && lenis) lenis.stop(); // Stop smooth scroll
                }
            });
        });

        const closeBlogModal = () => {
            blogModal.classList.remove('open');
            document.body.classList.remove('modal-open');
            if (typeof lenis !== 'undefined' && lenis) lenis.start(); // Resume smooth scroll
        };

        blogCloseBtn.addEventListener('click', closeBlogModal);
        blogModal.addEventListener('click', (e) => {
            if (e.target === blogModal) {
                closeBlogModal();
            }
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && blogModal.classList.contains('open')) {
                closeBlogModal();
            }
        });
    }

    // URL Deep-linking Support for Blogs Modal
    const urlParams = new URLSearchParams(window.location.search);
    const readParam = urlParams.get('read');
    if (readParam !== null && blogModal) {
        const article = blogArticles[readParam];
        if (article) {
            blogModalImg.setAttribute('src', article.img);
            blogModalImg.setAttribute('alt', article.title);
            blogModalTag.innerText = article.tag;
            blogModalDate.innerText = article.date;
            blogModalTitle.innerText = article.title;
            blogModalText.innerHTML = article.content;

            setTimeout(() => {
                blogModal.classList.add('open');
                document.body.classList.add('modal-open');
                if (typeof lenis !== 'undefined' && lenis) lenis.stop(); // Stop smooth scroll
            }, 300);
        }
    }

});
