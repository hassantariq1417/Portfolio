/* ============================================
   HASSAN TARIQ – PORTFOLIO SCRIPTS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // NAVBAR – Scroll Effect & Active Highlight
    // ==========================================
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.navbar__links a');
    const sections = document.querySelectorAll('section[id]');
    const navToggle = document.querySelector('.navbar__toggle');
    const navMenu = document.querySelector('.navbar__links');

    // Sticky navbar on scroll
    const handleScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);

        // Active section highlight
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    };

    // Throttle scroll handler to once per frame for 120fps
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                handleScroll();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });
    handleScroll();

    // Mobile menu toggle
    navToggle?.addEventListener('click', () => {
        navToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
        document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle?.classList.remove('open');
            navMenu?.classList.remove('open');
            document.body.style.overflow = '';
        });
    });


    // ==========================================
    // PORTFOLIO – Filtering
    // ==========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.dataset.filter;

            projectCards.forEach(card => {
                const tags = card.dataset.tags || '';
                const show = category === 'all' || tags.includes(category);

                if (show) {
                    card.style.display = '';
                    requestAnimationFrame(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    });
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => { card.style.display = 'none'; }, 300);
                }
            });
        });
    });


    // ==========================================
    // PROJECT MODAL
    // ==========================================
    const modalOverlay = document.getElementById('projectModal');
    const modalClose = document.querySelector('.modal__close');
    const modalImage = document.querySelector('.modal__image');
    const modalTitle = document.querySelector('.modal__body h2');
    const modalIndustry = document.getElementById('modalIndustry');
    const modalRole = document.getElementById('modalRole');
    const modalTools = document.getElementById('modalTools');
    const modalOverview = document.getElementById('modalOverview');

    const projectData = {
        'luxury-real-estate': {
            title: 'Luxury Real Estate Showcase',
            industry: 'Real Estate',
            role: 'Photographer & Visual Strategist',
            tools: 'Lightroom, Photoshop, Premiere Pro',
            overview: 'A comprehensive visual campaign for a premium residential development featuring cinematic photography, drone footage, and social media content that elevated property value perception and drove 3x more inquiries.',
            video: 'videos/Luxury Real Estate Showcase.mp4',
            results: [
                { value: '3x', label: 'More Inquiries' },
                { value: '45%', label: 'Faster Sales' },
                { value: '200K+', label: 'Views' }
            ]
        },
        'salon-rebrand': {
            title: 'Salon Brand Transformation',
            industry: 'Beauty & Salon',
            role: 'Content Creator & Digital Marketer',
            tools: 'Adobe Premiere Pro, Photoshop & Meta Business Suite',
            overview: 'Complete brand makeover for a luxury salon, including social media content strategy, styled shoots, and targeted Meta ad campaigns that boosted bookings and brand awareness.',
            video: 'videos/Al-Rehman Hair Salon.mp4',
            results: [
                { value: '150%', label: 'Booking Increase' },
                { value: '5K+', label: 'New Followers' },
                { value: '8x', label: 'ROAS' }
            ]
        },
        'motion-graphics': {
            title: 'Motion Graphics',
            industry: 'Multi-Industry',
            role: 'Motion Designer & Visual Effects Artist',
            tools: 'After Effects, Premiere Pro, Photoshop',
            overview: 'Created dynamic motion graphics and animated visual content for brands across multiple industries, including logo animations, promotional videos, and social media content with eye-catching effects.',
            video: ['videos/Motion Graphics 1.mp4', 'videos/Motion Graphics 2.mp4'],
            results: [
                { value: '50+', label: 'Projects Delivered' },
                { value: '2M+', label: 'Total Views' },
                { value: '100%', label: 'Client Satisfaction' }
            ]
        },
        'pakistani-stars': {
            title: 'Pakistani Stars',
            industry: 'Entertainment & Celebrities',
            role: 'Content Creator & Videographer',
            tools: 'Premiere Pro, After Effects, Photoshop',
            overview: 'Produced exclusive video content for Pakistani celebrities, including behind-the-scenes footage, social media campaigns, and promotional material that drove massive engagement.',
            video: 'videos/Pakistani Stars.mp4',
            results: [
                { value: '5M+', label: 'Total Views' },
                { value: '50K+', label: 'New Followers' },
                { value: '10+', label: 'Stars Featured' }
            ]
        },
        'personal-branding': {
            title: 'Personal Brand Build',
            industry: 'Personal Brands',
            role: 'Visual Identity Strategist',
            tools: 'Photoshop, Lightroom, Canva',
            overview: 'Crafted a cohesive visual identity and content strategy for a personal brand, elevating their digital presence across LinkedIn, Instagram, and a professional portfolio.',
            results: [
                { value: '10x', label: 'Profile Views' },
                { value: '25K+', label: 'Impressions/Month' },
                { value: '300%', label: 'Engagement Growth' }
            ]
        },
        'meta-ads-campaign': {
            title: 'High-Performance Meta Ads',
            industry: 'Digital Marketing',
            role: 'Media Buyer & Strategist',
            tools: 'Meta Business Suite, Photoshop, Canva',
            overview: 'Designed and managed high-ROI Meta ad campaigns across multiple industries, with custom creative production, precise audience targeting, and continuous optimization for maximum conversions.',
            results: [
                { value: '12x', label: 'Average ROAS' },
                { value: '$50K+', label: 'Revenue Generated' },
                { value: '2.1%', label: 'CTR Average' }
            ]
        },
        'real-estate-video': {
            title: 'Cinematic Property Tours',
            industry: 'Real Estate',
            role: 'Videographer & Editor',
            tools: 'Premiere Pro, After Effects, DaVinci Resolve',
            overview: 'Produced cinematic walk-through videos for luxury properties using stabilized gimbal shots, drone aerials, and professional color grading that elevated property marketing.',
            results: [
                { value: '65%', label: 'More Viewings' },
                { value: '15+', label: 'Videos Produced' },
                { value: '1M+', label: 'Total Views' }
            ]
        },
        'beauty-reels': {
            title: 'Viral Beauty Reels',
            industry: 'Beauty & Salon',
            role: 'Content Creator & Editor',
            tools: 'Premiere Pro, After Effects, Canva',
            overview: 'Created a series of short-form video content for beauty salons that went viral on Instagram Reels, dramatically increasing brand visibility and appointment bookings.',
            results: [
                { value: '2M+', label: 'Total Views' },
                { value: '15K+', label: 'Saves' },
                { value: '200%', label: 'Booking Surge' }
            ]
        },
        'social-media-suite': {
            title: 'Social Media Content Suite',
            industry: 'Multi-Industry',
            role: 'Graphic Designer & Strategist',
            tools: 'Photoshop, Canva, Illustrator',
            overview: 'Designed comprehensive social media content suites for multiple brands, including post templates, story designs, highlight covers, and carousel graphics with a cohesive visual identity.',
            results: [
                { value: '50+', label: 'Brands Served' },
                { value: '1,000+', label: 'Posts Designed' },
                { value: '95%', label: 'Client Retention' }
            ]
        }
    };

    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            const key = card.dataset.project;
            const data = projectData[key];
            if (!data || !modalOverlay) return;

            modalTitle.textContent = data.title;
            modalIndustry.textContent = data.industry;
            modalRole.textContent = data.role;
            modalTools.textContent = data.tools;
            modalOverview.textContent = data.overview;

            // Populate modal media (video or image)
            modalImage.classList.remove('modal__image--multi');
            if (data.video) {
                const videos = Array.isArray(data.video) ? data.video : [data.video];
                modalImage.classList.add('modal__image--multi');
                modalImage.innerHTML = videos.map(v =>
                    `<video src="${v}" controls playsinline></video>`
                ).join('');
                // Autoplay the first video
                const firstVid = modalImage.querySelector('video');
                if (firstVid) firstVid.play();
            } else {
                modalImage.innerHTML = '<span>Project Full Image</span>';
            }

            // Populate results
            const resultsContainer = document.querySelector('.modal__results');
            if (resultsContainer) {
                resultsContainer.innerHTML = data.results.map(r => `
          <div class="modal__result-item">
            <div class="value">${r.value}</div>
            <div class="label">${r.label}</div>
          </div>
        `).join('');
            }

            modalOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    modalClose?.addEventListener('click', closeModal);
    modalOverlay?.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    function closeModal() {
        // Pause and reset all videos in the modal
        modalImage?.querySelectorAll('video').forEach(v => {
            v.pause();
            v.currentTime = 0;
        });
        modalImage?.classList.remove('modal__image--multi');
        modalOverlay?.classList.remove('open');
        document.body.style.overflow = '';
    }


    // ==========================================
    // TESTIMONIALS CAROUSEL
    // ==========================================
    const track = document.querySelector('.testimonials__track');
    const dots = document.querySelectorAll('.testimonials__dot');
    let currentSlide = 0;
    const totalSlides = dots.length;

    function goToSlide(index) {
        currentSlide = index;
        if (track) {
            track.style.transform = `translateX(-${index * 100}%)`;
        }
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => goToSlide(i));
    });

    // Auto-advance every 5 seconds
    setInterval(() => {
        goToSlide((currentSlide + 1) % totalSlides);
    }, 5000);


    // ==========================================
    // CONTACT FORM – Validation
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    contactForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        const name = contactForm.querySelector('#name');
        const email = contactForm.querySelector('#email');
        const message = contactForm.querySelector('#message');

        // Reset
        [name, email, message].forEach(el => el.classList.remove('error'));
        formStatus.className = 'form-status';
        formStatus.style.display = 'none';

        // Validate name
        if (!name.value.trim()) {
            name.classList.add('error');
            isValid = false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            email.classList.add('error');
            isValid = false;
        }

        // Validate message
        if (!message.value.trim() || message.value.trim().length < 10) {
            message.classList.add('error');
            isValid = false;
        }

        if (isValid) {
            // Simulate form submission
            formStatus.className = 'form-status success';
            formStatus.textContent = '✓ Message sent successfully! I\'ll get back to you within 24 hours.';
            formStatus.style.display = 'block';
            contactForm.reset();

            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        } else {
            formStatus.className = 'form-status error-status';
            formStatus.textContent = 'Please fill in all fields correctly.';
            formStatus.style.display = 'block';
        }
    });


    // ==========================================
    // SCROLL REVEAL ANIMATIONS
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px 0px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // ==========================================
    // SMOOTH SCROLL for all anchor links
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});
