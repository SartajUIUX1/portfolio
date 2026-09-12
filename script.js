/**
 * SARTAJ AHMED PORTFOLIO — INTERACTIVITY & ANIMATIONS
 * GSAP ScrollTrigger Stacking, Mouse Hover Movement, Novasite Hero Slider
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initMonofVision();
  initNovasiteHeroSlider();
  initInfiniteMarquees();
  initGsapProjectStacking();
  initProjectFilterTabs();
  initCinemaflowServices();
  initMilestonesRoadmap();
  initMonofTestimonials();
  initSiteWideMouseMovement();
  initFaqAccordion();
  initContactForm();
});

/* ----------------------------------------------------
   1. Navbar Scroll Effect & Active Section Tracking
   ---------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  const navbarWrapper = document.querySelector('.navbar-wrapper');
  const sections = document.querySelectorAll('section[id], #home');
  const navLinks = document.querySelectorAll('.nav-menu-link');
  const visionSec = document.getElementById('vision');

  function updateNavbar() {
    // Check if we are past the vision intro
    if (visionSec) {
      const threshold = visionSec.offsetTop + (visionSec.offsetHeight * 0.85);
      if (window.scrollY >= threshold) {
        navbarWrapper.classList.add('visible');
      } else {
        navbarWrapper.classList.remove('visible');
      }
    } else if (navbarWrapper) {
      navbarWrapper.classList.add('visible');
    }

    if (navbar) {
      if (window.scrollY > 40) {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.borderColor = 'rgba(255, 255, 255, 0.18)';
      } else {
        navbar.style.background = 'rgba(13, 13, 13, 0.85)';
        navbar.style.borderColor = 'rgba(255, 255, 255, 0.12)';
      }
    }

    let current = '';
    const scrollPos = window.scrollY + 350;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${current}` || (current === 'vision' && href === '#home') || (current === '' && href === '#home')) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // Smooth scroll for Home and Vision anchor links
  document.querySelectorAll('a[href="#home"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (visionSec) {
        const targetY = visionSec.offsetTop + (visionSec.offsetHeight * 0.90);
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    });
  });

  document.querySelectorAll('a[href="#vision"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

/* ----------------------------------------------------
   2. Mobile Hamburger Menu Drawer
   ---------------------------------------------------- */
function initMobileMenu() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const drawerLinks = document.querySelectorAll('.mobile-nav-links a, .mobile-nav-drawer .nav-button');

  if (!hamburgerBtn || !mobileDrawer) return;

  function toggleMenu() {
    const isOpen = hamburgerBtn.classList.toggle('active');
    mobileDrawer.classList.toggle('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  hamburgerBtn.addEventListener('click', toggleMenu);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileDrawer.classList.contains('open')) {
        toggleMenu();
      }
    });
  });
}

/* ----------------------------------------------------
   2.5 Monof Vision Statements & Expanding Website Hero
   ---------------------------------------------------- */
function initMonofVision() {
  const section = document.getElementById('vision');
  if (!section) return;

  const statements = Array.from(document.querySelectorAll('.vision-statement'));
  const dotPills = Array.from(document.querySelectorAll('.vision-dot-pill'));
  const heroScaleFrame = document.getElementById('heroScaleFrame');
  const navbarWrapper = document.querySelector('.navbar-wrapper');
  const scrollBadge = document.getElementById('visionScrollBadge');
  const progressTrack = document.getElementById('visionProgressTrack');

  if (statements.length === 0) return;

  // Split each statement text into masked characters for Mono-F typography stagger
  const stmtChars = [];
  statements.forEach((stmt, sIdx) => {
    const rawText = stmt.textContent.trim();
    stmt.innerHTML = '';
    const chars = [];

    for (let i = 0; i < rawText.length; i++) {
      const ch = rawText[i];
      if (ch === ' ') {
        const space = document.createElement('span');
        space.className = 'char-space';
        space.innerHTML = '&nbsp;';
        stmt.appendChild(space);
      } else {
        const mask = document.createElement('span');
        mask.className = 'char-mask';
        const inner = document.createElement('span');
        inner.className = 'char-inner';
        inner.textContent = ch;
        mask.appendChild(inner);
        stmt.appendChild(mask);
        chars.push(inner);
      }
    }
    stmtChars.push(chars);

    // Ensure statement 0 is immediately visible on load
    stmt.style.opacity = '1';
    stmt.style.visibility = 'visible';
  });

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // Basic fallback if GSAP not loaded
    stmtChars.forEach((chars, i) => {
      chars.forEach(c => {
        c.style.transform = i === 0 ? 'translateY(0)' : 'translateY(100%)';
        c.style.opacity = i === 0 ? '1' : '0';
      });
    });
    return;
  }

  // Initial States:
  // Statement 0 starts 100% visible on screen immediately
  gsap.set(stmtChars[0], { yPercent: 0, opacity: 1 });

  // Statements 1 to 4 start hidden below inside masks
  for (let i = 1; i < stmtChars.length; i++) {
    gsap.set(stmtChars[i], { yPercent: 100, opacity: 0 });
  }

  // Expanding hero section starts hidden in center
  if (heroScaleFrame) {
    gsap.set(heroScaleFrame, {
      opacity: 0,
      scale: 0.35,
      borderRadius: '28px'
    });
  }

  // Master scrubbed timeline tied directly to scroll
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.8,
      onUpdate: (self) => {
        const p = self.progress;

        // Step indicator dots update based on progress
        let activeStep = 0;
        if (p > 0.72) activeStep = 4;
        else if (p > 0.54) activeStep = 3;
        else if (p > 0.36) activeStep = 2;
        else if (p > 0.18) activeStep = 1;

        dotPills.forEach((pill, idx) => {
          pill.classList.toggle('active', idx === activeStep);
        });

        // Navbar & Hero interactivity: only when hero section reaches full screen
        if (p >= 0.86) {
          if (navbarWrapper) navbarWrapper.classList.add('visible');
          if (heroScaleFrame) heroScaleFrame.classList.add('interactive');
        } else {
          if (navbarWrapper) navbarWrapper.classList.remove('visible');
          if (heroScaleFrame) heroScaleFrame.classList.remove('interactive');
        }
      }
    }
  });

  // Statement 0 ("Built Different"): holds -> slides up
  tl.to(stmtChars[0], {
    yPercent: -100,
    opacity: 0,
    stagger: 0.015,
    duration: 0.8,
    ease: 'power2.inOut'
  }, 1.0);

  // Statement 1 ("Design with purpose"): slides in -> holds -> slides up
  tl.to(stmtChars[1], {
    yPercent: 0,
    opacity: 1,
    stagger: 0.015,
    duration: 0.8,
    ease: 'power2.out'
  }, 1.4);
  tl.to(stmtChars[1], {
    yPercent: -100,
    opacity: 0,
    stagger: 0.015,
    duration: 0.8,
    ease: 'power2.inOut'
  }, 3.0);

  // Statement 2 ("Code with passion"): slides in -> holds -> slides up
  tl.to(stmtChars[2], {
    yPercent: 0,
    opacity: 1,
    stagger: 0.015,
    duration: 0.8,
    ease: 'power2.out'
  }, 3.4);
  tl.to(stmtChars[2], {
    yPercent: -100,
    opacity: 0,
    stagger: 0.015,
    duration: 0.8,
    ease: 'power2.inOut'
  }, 5.0);

  // Statement 3 ("Create with vision"): slides in -> holds -> slides up
  tl.to(stmtChars[3], {
    yPercent: 0,
    opacity: 1,
    stagger: 0.015,
    duration: 0.8,
    ease: 'power2.out'
  }, 5.4);
  tl.to(stmtChars[3], {
    yPercent: -100,
    opacity: 0,
    stagger: 0.015,
    duration: 0.8,
    ease: 'power2.inOut'
  }, 7.0);

  // Statement 4 ("Innovate always"): slides in -> holds -> slides up
  tl.to(stmtChars[4], {
    yPercent: 0,
    opacity: 1,
    stagger: 0.015,
    duration: 0.8,
    ease: 'power2.out'
  }, 7.4);
  tl.to(stmtChars[4], {
    yPercent: -100,
    opacity: 0,
    stagger: 0.015,
    duration: 0.8,
    ease: 'power2.inOut'
  }, 9.0);

  // Expanding Website Hero Section (Starts small in center -> expands to 100vw x 100vh full screen)
  if (heroScaleFrame) {
    // Phase 1: Emerges from center as sleek floating preview card
    tl.to(heroScaleFrame, {
      opacity: 1,
      scale: () => (window.innerWidth <= 768 ? 0.72 : 0.40),
      borderRadius: '24px',
      duration: 1.3,
      ease: 'power2.out'
    }, 9.4);

    // Phase 2: Expands smoothly from card to 100% full screen
    tl.to(heroScaleFrame, {
      scale: 1.0,
      borderRadius: '0px',
      duration: 1.6,
      ease: 'power2.inOut'
    }, 10.7);

    // Fade vision scroll badge & progress track as hero takes over screen
    const uiElements = [scrollBadge, progressTrack].filter(Boolean);
    if (uiElements.length > 0) {
      tl.to(uiElements, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      }, 10.9);
    }

    // Final hold cushion at full screen so the user comfortably lands in the hero section
    tl.to({}, { duration: 0.8 }, 12.3);
  }
}

/* ----------------------------------------------------
   3. Novasite Hero Dual-Slider with 3 Progress Lines
   ---------------------------------------------------- */
function initNovasiteHeroSlider() {
  const bgSlides = document.querySelectorAll('.hero-v1-slide-item');
  const cardSlides = document.querySelectorAll('.hero-v2-slide-item');
  const lineBlocks = document.querySelectorAll('.countable-line-grid .line-block');
  const innerLines = document.querySelectorAll('.countable-line-grid .inner-line');
  const sliderV2Wrap = document.querySelector('.slider-v2-wrapper');

  if (!bgSlides.length || !cardSlides.length) return;

  const totalSlides = bgSlides.length;
  const slideDuration = 4000;
  let currentSlide = 0;
  let startTime = performance.now();
  let animFrameId = null;

  function setSlide(index) {
    currentSlide = index;

    bgSlides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentSlide);
    });

    cardSlides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentSlide);
    });

    innerLines.forEach((line, idx) => {
      if (idx < currentSlide) {
        line.style.width = '100%';
      } else if (idx > currentSlide) {
        line.style.width = '0%';
      }
    });

    startTime = performance.now();
  }

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / slideDuration, 1);

    if (innerLines[currentSlide]) {
      innerLines[currentSlide].style.width = `${progress * 100}%`;
    }

    if (progress >= 1) {
      const nextSlide = (currentSlide + 1) % totalSlides;
      setSlide(nextSlide);
    }

    animFrameId = requestAnimationFrame(tick);
  }

  lineBlocks.forEach((block, idx) => {
    block.addEventListener('click', () => {
      cancelAnimationFrame(animFrameId);
      setSlide(idx);
      animFrameId = requestAnimationFrame(tick);
    });
  });

  if (sliderV2Wrap) {
    sliderV2Wrap.style.cursor = 'pointer';
    sliderV2Wrap.addEventListener('click', () => {
      cancelAnimationFrame(animFrameId);
      setSlide((currentSlide + 1) % totalSlides);
      animFrameId = requestAnimationFrame(tick);
    });
  }

  setSlide(0);
  animFrameId = requestAnimationFrame(tick);
}

/* ----------------------------------------------------
   4. Infinite Marquee Cloning
   ---------------------------------------------------- */
function initInfiniteMarquees() {
  const tracks = document.querySelectorAll('.sponser-logo-wrap, .footer-bottom-text-wrapper');

  tracks.forEach(track => {
    const children = Array.from(track.children);
    children.forEach(item => {
      const clone = item.cloneNode(true);
      track.appendChild(clone);
    });
  });
}

/* ----------------------------------------------------
   5. GSAP ScrollTrigger Project Card Stacking Animation
      (Maxx Template Home-3 Inspired)
   ---------------------------------------------------- */
let projectTriggers = [];

function initGsapProjectStacking() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Clear any existing project ScrollTriggers
  projectTriggers.forEach(t => t.kill());
  projectTriggers = [];

  const cards = gsap.utils.toArray('.work-stack-card:not(.filter-hidden)');
  if (cards.length <= 1) return;

  cards.forEach((card, i) => {
    if (i < cards.length - 1) {
      const nextCard = cards[i + 1];

      const trigger = ScrollTrigger.create({
        trigger: nextCard,
        start: 'top 80%',
        end: 'top 20%',
        scrub: true,
        onUpdate: self => {
          const progress = self.progress;
          // Scale previous card down subtly from 1 to 0.93
          const scale = 1 - progress * 0.07;
          // Subtly dim opacity of previous card
          const opacity = 1 - progress * 0.25;
          gsap.set(card, {
            scale: scale,
            opacity: opacity,
            transformOrigin: 'top center',
            force3D: true
          });
        }
      });

      projectTriggers.push(trigger);
    }
  });

  ScrollTrigger.refresh();
}

/* ----------------------------------------------------
   6. Portfolio Category Filter Tabs (4 Projects Limit on Homepage)
   ---------------------------------------------------- */
function initProjectFilterTabs() {
  const tabBtns = document.querySelectorAll('.filter-tab-btn');
  const cards = document.querySelectorAll('.work-stack-card');
  const viewAllBtn = document.getElementById('viewAllProjectsBtn');
  const viewAllBtnText = document.getElementById('viewAllBtnText');

  if (!tabBtns.length || !cards.length) return;

  function applyCategoryFilter(filter, isClick = false) {
    tabBtns.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-filter') === filter);
    });

    const visibleCardIds = new Set();

    if (filter === 'all') {
      // Show all 4 featured development websites (2 Webflow + 2 WordPress)
      cards.forEach(c => visibleCardIds.add(c.id));
    } else {
      // Filter by selected category (webflow or wordpress)
      const matching = Array.from(cards).filter(c => c.getAttribute('data-category') === filter);
      matching.forEach(c => visibleCardIds.add(c.id));
    }

    cards.forEach(card => {
      if (visibleCardIds.has(card.id)) {
        card.classList.remove('filter-hidden');
        card.style.display = 'block';
        if (isClick && typeof gsap !== 'undefined') {
          gsap.set(card, { scale: 1, opacity: 1, clearProps: 'transform' });
          gsap.fromTo(card, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' });
        }
      } else {
        card.classList.add('filter-hidden');
        card.style.display = 'none';
      }
    });

    // Update bottom View All Projects CTA button
    if (viewAllBtn && viewAllBtnText) {
      if (filter === 'all') {
        viewAllBtn.href = 'projects.html?category=all';
        viewAllBtnText.textContent = 'Explore All Projects (Webflow, WordPress, Figma)';
      } else if (filter === 'webflow') {
        viewAllBtn.href = 'projects.html?category=webflow';
        viewAllBtnText.textContent = 'Explore All Webflow Projects (14)';
      } else if (filter === 'wordpress') {
        viewAllBtn.href = 'projects.html?category=wordpress';
        viewAllBtnText.textContent = 'Explore All WordPress Projects (25)';
      }
    }

    // If user clicked while scrolled down deep in #work, smoothly scroll up
    if (isClick) {
      const workSection = document.getElementById('work');
      if (workSection) {
        const rect = workSection.getBoundingClientRect();
        if (rect.top < -60) {
          window.scrollTo({
            top: window.pageYOffset + rect.top - 80,
            behavior: 'smooth'
          });
        }
      }
    }

    // Re-initialize GSAP stacking on the currently visible 5 cards
    setTimeout(() => {
      initGsapProjectStacking();
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }, 100);
  }

  // Handle Tab Clicks
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      applyCategoryFilter(filter, true);
    });
  });

  // Apply initial 5-card filter on page load
  applyCategoryFilter('all', false);
}

/* ----------------------------------------------------
   6b. Cinemaflow Services Accordion (Hover & Click)
   ---------------------------------------------------- */
function initCinemaflowServices() {
  const serviceItems = document.querySelectorAll('.cinema-service-item');
  if (!serviceItems.length) return;

  serviceItems.forEach(item => {
    // Mouseenter activates the hovered service row
    item.addEventListener('mouseenter', () => {
      serviceItems.forEach(i => i.classList.remove('is-active'));
      item.classList.add('is-active');
    });

    // Click / touch event for mobile responsiveness
    item.addEventListener('click', () => {
      const wasActive = item.classList.contains('is-active');
      serviceItems.forEach(i => i.classList.remove('is-active'));
      if (!wasActive) {
        item.classList.add('is-active');
      } else {
        item.classList.add('is-active');
      }
    });
  });
}

/* ----------------------------------------------------
   6c. Milestones Roadmap Pinned Scroll & Vertical Card Deck Animation
   ---------------------------------------------------- */
function initMilestonesRoadmap() {
  const section = document.getElementById('process');
  const cards = Array.from(document.querySelectorAll('.roadmap-cards-deck .roadmap-card'));
  const dots = Array.from(document.querySelectorAll('.roadmap-dots-wrap .roadmap-dot'));
  const controls = document.querySelector('.roadmap-controls');
  const prevBtn = document.getElementById('roadmapPrevBtn');
  const nextBtn = document.getElementById('roadmapNextBtn');

  if (!section || cards.length === 0) return;

  const totalCards = cards.length;
  // activeIndex = -1 represents the initial state where ONLY heading and paragraph are visible
  let activeIndex = -1;

  // Update card display and controls based on active index (-1 for none, 0..4 for cards)
  function setProcessCardIndex(index, animate = true) {
    if (index < -1) index = -1;
    if (index >= totalCards) index = totalCards - 1;
    activeIndex = index;

    const isMobile = window.innerWidth <= 768;
    const angleStep = isMobile ? 2.5 : 3.8;
    const xStep = isMobile ? 12 : 22;
    const yStep = isMobile ? 2 : 4;
    const enterX = isMobile ? 45 : 70;

    if (activeIndex === -1) {
      // INITIAL STATE: ONLY heading & paragraph are visible. All cards waiting off-screen right/bottom!
      cards.forEach((card, idx) => {
        card.classList.remove('is-active', 'is-tilted');
        card.classList.add('upcoming');
        if (typeof gsap !== 'undefined' && animate) {
          gsap.to(card, {
            x: enterX,
            y: 35,
            rotation: 4,
            scale: 0.94,
            opacity: 0,
            zIndex: idx,
            duration: 0.45,
            ease: 'power3.out',
            overwrite: 'auto'
          });
        } else {
          card.style.transform = `translate3d(${enterX}px, 35px, 0) scale(0.94) rotate(4deg)`;
          card.style.opacity = '0';
          card.style.zIndex = `${idx}`;
        }
      });

      // Inactive dots & dimmed controls
      dots.forEach((dot) => dot.classList.remove('is-active'));
      if (controls) {
        controls.style.opacity = '0.35';
        controls.style.pointerEvents = 'none';
      }
    } else {
      // A specific card (0 to 4) is active!
      if (controls) {
        controls.style.opacity = '1';
        controls.style.pointerEvents = 'auto';
      }

      // Update dots indicator
      dots.forEach((dot, dIdx) => {
        dot.classList.toggle('is-active', dIdx === activeIndex);
      });

      // Update cards: Active sits on top, previous cards stay underneath tilted to the left
      cards.forEach((card, idx) => {
        card.classList.remove('is-active', 'is-tilted', 'upcoming');

        if (idx === activeIndex) {
          // Active Card centered on top of stack
          card.classList.add('is-active');
          const topZ = 30 + idx;

          if (typeof gsap !== 'undefined' && animate) {
            gsap.to(card, {
              x: 0,
              y: 0,
              rotation: 0,
              scale: 1.0,
              opacity: 1,
              zIndex: topZ,
              duration: 0.55,
              ease: 'power3.out',
              overwrite: 'auto'
            });
          } else {
            card.style.transform = 'translate3d(0, 0, 0) scale(1) rotate(0deg)';
            card.style.opacity = '1';
            card.style.zIndex = `${topZ}`;
          }
        } else if (idx < activeIndex) {
          // Past Card: Stays beneath, fanned out & tilted to the left!
          card.classList.add('is-tilted');
          const diff = activeIndex - idx;
          const rot = -(diff * angleStep);
          const xOffset = -(diff * xStep);
          const yOffset = -(diff * yStep);
          const scaleVal = Math.max(0.88, 1 - diff * 0.03);
          const opacityVal = Math.max(0.48, 1 - diff * 0.12);
          const stackZ = 20 + idx; // Lower than active, but higher than older cards

          if (typeof gsap !== 'undefined' && animate) {
            gsap.to(card, {
              x: xOffset,
              y: yOffset,
              rotation: rot,
              scale: scaleVal,
              opacity: opacityVal,
              zIndex: stackZ,
              duration: 0.55,
              ease: 'power3.out',
              overwrite: 'auto'
            });
          } else {
            card.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0) scale(${scaleVal}) rotate(${rot}deg)`;
            card.style.opacity = `${opacityVal}`;
            card.style.zIndex = `${stackZ}`;
          }
        } else {
          // Upcoming Card waiting on right/bottom
          card.classList.add('upcoming');
          if (typeof gsap !== 'undefined' && animate) {
            gsap.to(card, {
              x: enterX,
              y: 35,
              rotation: 4,
              scale: 0.94,
              opacity: 0,
              zIndex: idx,
              duration: 0.45,
              ease: 'power3.out',
              overwrite: 'auto'
            });
          } else {
            card.style.transform = `translate3d(${enterX}px, 35px, 0) scale(0.94) rotate(4deg)`;
            card.style.opacity = '0';
            card.style.zIndex = `${idx}`;
          }
        }
      });
    }
  }

  // Scroll-based progress handler (0.0 to 1.0)
  // Initially at 0: Heading and paragraph are visible.
  // As you scroll down: Card 0 enters, then 1, 2, 3, 4 stack on top with left tilt underneath.
  // After Card 4 completes, scrolling unpins naturally to the next section (#testimonials).
  function handleProcessScrollProgress(progress) {
    const clamped = Math.min(1, Math.max(0, progress));
    let targetIndex = -1;

    if (clamped < 0.10) {
      targetIndex = -1; // Heading and paragraph ONLY
    } else if (clamped < 0.28) {
      targetIndex = 0;  // Card 01: Discovery
    } else if (clamped < 0.46) {
      targetIndex = 1;  // Card 02: Research & UX Strategy
    } else if (clamped < 0.64) {
      targetIndex = 2;  // Card 03: Wireframing & UI Design
    } else if (clamped < 0.82) {
      targetIndex = 3;  // Card 04: Development
    } else {
      targetIndex = 4;  // Card 05: Launch & Support
    }

    if (targetIndex !== activeIndex) {
      setProcessCardIndex(targetIndex, true);
    }
  }

  // Initial setup: start at state -1 (heading + paragraph only, no cards yet)
  setProcessCardIndex(-1, false);

  // GSAP ScrollTrigger Integration for pinned progression
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3,
      onUpdate: (self) => {
        handleProcessScrollProgress(self.progress);
      }
    });
  }

  // Window scroll fallback listener
  window.addEventListener('scroll', () => {
    const rect = section.getBoundingClientRect();
    const scrollDist = section.offsetHeight - window.innerHeight;
    if (scrollDist <= 0) return;

    const currentScroll = -rect.top;
    const progress = Math.min(1, Math.max(0, currentScroll / scrollDist));
    handleProcessScrollProgress(progress);
  }, { passive: true });

  // Helper to smoothly scroll to corresponding card step
  function scrollToStep(targetIdx) {
    const scrollDist = section.offsetHeight - window.innerHeight;
    if (scrollDist > 0) {
      const sectionTop = window.pageYOffset + section.getBoundingClientRect().top;
      const progressTargets = [0.19, 0.37, 0.55, 0.73, 0.91];
      const targetProg = progressTargets[Math.max(0, Math.min(4, targetIdx))];
      const targetScroll = sectionTop + targetProg * scrollDist;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    } else {
      setProcessCardIndex(targetIdx, true);
    }
  }

  // Direct Click on Tilted Cards to bring them to top
  cards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      if (card.classList.contains('is-tilted')) {
        scrollToStep(idx);
      }
    });
  });

  // Interactive Click on Dots
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      scrollToStep(idx);
    });
  });

  // Interactive Arrow Navigation Buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (activeIndex <= 0) {
        scrollToStep(0);
      } else {
        scrollToStep(activeIndex - 1);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (activeIndex < 0) {
        scrollToStep(0);
      } else {
        scrollToStep(Math.min(totalCards - 1, activeIndex + 1));
      }
    });
  }

  // Luxury Interactive Cursor Spotlight inside Cards - Brand Red Signature
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const spotlight = card.querySelector('.card-glow-spotlight');
      if (spotlight) {
        spotlight.style.background = `radial-gradient(circle 220px at ${x}px ${y}px, rgba(255, 42, 42, 0.18) 0%, transparent 80%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      const spotlight = card.querySelector('.card-glow-spotlight');
      if (spotlight) {
        spotlight.style.background = '';
      }
    });
  });
}

/* ----------------------------------------------------
   7. Monof-Style Testimonials (Sticky Reveal & Card Deck)
   ---------------------------------------------------- */
function initMonofTestimonials() {
  const section = document.getElementById('testimonials');
  const stage = document.getElementById('monofTestiStage');
  const cards = Array.from(document.querySelectorAll('.monof-card'));
  const numberReel = document.getElementById('monofNumberReel');
  const dots = Array.from(document.querySelectorAll('.monof-dot-btn'));
  const prevBtn = document.getElementById('monofPrevBtn');
  const nextBtn = document.getElementById('monofNextBtn');

  if (!section || cards.length === 0) return;

  let activeIndex = 0;
  const totalCards = cards.length; // 7

  // Update card display based on active index
  function setCardIndex(index, animate = true) {
    if (index < 0) index = 0;
    if (index >= totalCards) index = totalCards - 1;
    activeIndex = index;

    cards.forEach((card, idx) => {
      card.classList.remove('active', 'past', 'upcoming');

      if (idx === activeIndex) {
        card.classList.add('active');
        if (typeof gsap !== 'undefined' && animate) {
          gsap.to(card, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            duration: 0.5,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        } else {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0) scale(1) rotateX(0deg)';
        }
      } else if (idx < activeIndex) {
        card.classList.add('past');
        if (typeof gsap !== 'undefined' && animate) {
          gsap.to(card, {
            opacity: 0,
            y: -65,
            scale: 0.92,
            rotationX: 10,
            duration: 0.45,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(-65px) scale(0.92) rotateX(10deg)';
        }
      } else {
        card.classList.add('upcoming');
        const isNext = (idx === activeIndex + 1);
        if (typeof gsap !== 'undefined' && animate) {
          gsap.to(card, {
            opacity: isNext ? 0.18 : 0,
            y: isNext ? 35 : 60,
            scale: isNext ? 0.95 : 0.9,
            rotationX: isNext ? -5 : -10,
            duration: 0.45,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        } else {
          card.style.opacity = isNext ? '0.18' : '0';
          card.style.transform = isNext ? 'translateY(35px) scale(0.95) rotateX(-5deg)' : 'translateY(60px) scale(0.9) rotateX(-10deg)';
        }
      }
    });

    // Update number reel (each digit is 42px high)
    if (numberReel) {
      if (typeof gsap !== 'undefined' && animate) {
        gsap.to(numberReel, {
          y: -activeIndex * 42,
          duration: 0.45,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      } else {
        numberReel.style.transform = `translateY(-${activeIndex * 42}px)`;
      }
    }

    // Update dots
    dots.forEach((dot, dIdx) => {
      dot.classList.toggle('active', dIdx === activeIndex);
    });
  }

  // Scroll-based progress handler (0.0 to 1.0)
  function handleScrollProgress(progress) {
    const clamped = Math.min(1, Math.max(0, progress));
    const rawIndex = clamped * (totalCards - 1);
    const computedIndex = Math.min(totalCards - 1, Math.round(rawIndex));

    if (computedIndex !== activeIndex) {
      setCardIndex(computedIndex, true);
    }
  }

  // Initial setup of card 0
  setCardIndex(0, false);

  // GSAP ScrollTrigger integration
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3,
      onUpdate: (self) => {
        handleScrollProgress(self.progress);
      }
    });
  }

  // Window scroll fallback listener
  window.addEventListener('scroll', () => {
    const rect = section.getBoundingClientRect();
    const scrollDist = section.offsetHeight - window.innerHeight;
    if (scrollDist <= 0) return;

    const currentScroll = -rect.top;
    const progress = Math.min(1, Math.max(0, currentScroll / scrollDist));
    handleScrollProgress(progress);
  }, { passive: true });

  // Click handler for Dots
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      setCardIndex(idx, true);
      const scrollDist = section.offsetHeight - window.innerHeight;
      const targetRatio = idx / (totalCards - 1);
      const targetScroll = section.offsetTop + targetRatio * scrollDist;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    });
  });

  // Prev / Next button navigation
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const target = Math.max(0, activeIndex - 1);
      setCardIndex(target, true);
      const scrollDist = section.offsetHeight - window.innerHeight;
      const targetRatio = target / (totalCards - 1);
      window.scrollTo({ top: section.offsetTop + targetRatio * scrollDist, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const target = Math.min(totalCards - 1, activeIndex + 1);
      setCardIndex(target, true);
      const scrollDist = section.offsetHeight - window.innerHeight;
      const targetRatio = target / (totalCards - 1);
      window.scrollTo({ top: section.offsetTop + targetRatio * scrollDist, behavior: 'smooth' });
    });
  }
}

/* ----------------------------------------------------
   8. Site-Wide Mouse Hover Movement Animations
   ---------------------------------------------------- */
function initSiteWideMouseMovement() {
  // A. Magnetic Center Badge on Project Cards
  const workCards = document.querySelectorAll('.work-stack-card');

  workCards.forEach(card => {
    const badge = card.querySelector('.magnetic-center-badge');
    if (!badge) return;

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Smooth translation tracking cursor within card
      if (typeof gsap !== 'undefined') {
        gsap.to(badge, {
          x: x * 0.45,
          y: y * 0.45,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        badge.style.transform = `translate(calc(-50% + ${x * 0.45}px), calc(-50% + ${y * 0.45}px))`;
      }
    });

    card.addEventListener('mouseleave', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(badge, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)'
        });
      } else {
        badge.style.transform = 'translate(-50%, -50%)';
      }
    });
  });

  // B. Magnetic Pull on Buttons, Tabs & Pills
  const magneticEls = document.querySelectorAll('.nav-button, .magnetic-btn, .filter-tab-btn, .social-pill-link, .direct-badge-link');

  magneticEls.forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      if (typeof gsap !== 'undefined') {
        gsap.to(el, {
          x: x * 0.35,
          y: y * 0.35,
          duration: 0.25,
          ease: 'power2.out'
        });
      }
    });

    el.addEventListener('mouseleave', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.4)'
        });
      }
    });
  });

  // C. Subtle 3D Tilt Perspective on Modern Cards
  const tiltCards = document.querySelectorAll('.service-modern-card, .feedback-card, .process-step-card, .monof-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      if (typeof gsap !== 'undefined') {
        gsap.to(card, {
          rotationX: rotateX,
          rotationY: rotateY,
          transformPerspective: 1000,
          duration: 0.3,
          ease: 'power1.out'
        });
      }
    });

    card.addEventListener('mouseleave', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(card, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.5,
          ease: 'power2.out'
        });
      }
    });
  });
}

/* ----------------------------------------------------
   8. FAQ Accordion Toggle
   ---------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-accordion-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-item-trigger');
    const icon = item.querySelector('.faq-item-icon');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other accordions
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          const otherIcon = other.querySelector('.faq-item-icon');
          if (otherIcon) otherIcon.textContent = '+';
        }
      });

      // Toggle current
      item.classList.toggle('open', !isOpen);
      if (icon) {
        icon.textContent = !isOpen ? '−' : '+';
      }
    });
  });
}

/* ----------------------------------------------------
   9. Contact Form Handling
   ---------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('mainContactForm');
  const statusBox = document.getElementById('contactFormStatus');

  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name = document.getElementById('contactName')?.value.trim();
    const email = document.getElementById('contactEmail')?.value.trim();
    const help = document.getElementById('contactHelp')?.value.trim();
    const budget = document.getElementById('contactBudget')?.value;
    const message = document.getElementById('contactMessage')?.value.trim();

    if (!name || !email) {
      if (statusBox) {
        statusBox.className = 'form-status-box';
        statusBox.style.display = 'block';
        statusBox.style.background = 'rgba(255, 42, 42, 0.15)';
        statusBox.style.border = '1px solid rgba(255, 42, 42, 0.3)';
        statusBox.style.color = '#ff4242';
        statusBox.style.padding = '12px 18px';
        statusBox.style.borderRadius = '8px';
        statusBox.style.marginTop = '16px';
        statusBox.textContent = 'Please provide your name and a valid email address.';
      }
      return;
    }

    const submitBtn = form.querySelector('.contact-submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending Message...</span>';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      if (statusBox) {
        statusBox.className = 'form-status-box success';
        statusBox.style.display = 'block';
        statusBox.style.background = 'rgba(40, 200, 100, 0.15)';
        statusBox.style.border = '1px solid rgba(40, 200, 100, 0.3)';
        statusBox.style.color = '#4ade80';
        statusBox.style.padding = '12px 18px';
        statusBox.style.borderRadius = '8px';
        statusBox.style.marginTop = '16px';
        statusBox.textContent = `Thank you, ${name}! Your inquiry regarding "${help || 'your project'}" has been received. Sartaj will get in touch shortly.`;
      }
      form.reset();

      setTimeout(() => {
        if (statusBox) statusBox.style.display = 'none';
      }, 6000);
    }, 900);
  });
}
