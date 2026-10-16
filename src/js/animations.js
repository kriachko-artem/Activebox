// Анімації на GSAP + ScrollTrigger.
//
// Правила, щоб анімації не спричиняли стрибків розмітки:
//  - анімуємо лише transform і opacity (вони не змінюють розміри блоків);
//  - ScrollTrigger ігнорує зміну висоти вікна на мобільних (ignoreMobileResize),
//    тож поява/зникнення панелі браузера не перераховує анімації;
//  - для тих, хто вимкнув анімації в системі (prefers-reduced-motion),
//    все показується одразу без руху.

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

ScrollTrigger.config({ ignoreMobileResize: true });

export function initAnimations() {
    const intro = document.querySelectorAll('.hero [data-intro]');
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(intro, { opacity: 1 });
    });

    mm.add('(prefers-reduced-motion: no-preference)', () => {
        heroIntro(intro);
        heroParallax();
        splitTitles();
        reveals();
        staggerLists();
        aboutSection();
        skulls();
        reviews();
        programTimeline();
        tariffs();
    });

    // Шрифти й картинки можуть трохи змінити позиції — перераховуємо тригери
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    window.addEventListener('load', () => ScrollTrigger.refresh());
}

function heroIntro(intro) {
    const title = document.querySelector('.hero__title');
    const photo = document.querySelector('.hero__photo img');
    const bottom = document.querySelector('.hero__bottom');

    gsap.set(intro, { opacity: 1 });

    const lines = title.querySelectorAll(':scope > span');
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from(photo, { scale: 1.15, opacity: 0, duration: 1.6, ease: 'power2.out' }, 0)
        .from(lines, { yPercent: 110, opacity: 0, duration: 0.9, stagger: 0.12 }, 0.2)
        .from(bottom.children, { y: 30, opacity: 0, duration: 0.8, stagger: 0.12 }, 0.6);
}

function heroParallax() {
    gsap.to('.hero__photo img', {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
        },
    });

    gsap.to('.hero__inner', {
        y: -60,
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'center center',
            end: 'bottom top',
            scrub: true,
        },
    });
}

// Заголовки з'являються по словах
function splitTitles() {
    document.querySelectorAll('[data-split]').forEach((title) => {
        SplitText.create(title, {
            type: 'words',
            mask: 'words',
            autoSplit: true,
            onSplit: (self) =>
                gsap.from(self.words, {
                    yPercent: 100,
                    duration: 0.8,
                    ease: 'power3.out',
                    stagger: 0.06,
                    scrollTrigger: { trigger: title, start: 'top 85%', once: true },
                }),
        });
    });
}

function reveals() {
    gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, {
            y: 40,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
    });
}

function staggerLists() {
    gsap.utils.toArray('[data-stagger]').forEach((list) => {
        gsap.from(list.children, {
            y: 30,
            opacity: 0,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.1,
            scrollTrigger: { trigger: list, start: 'top 85%', once: true },
        });
    });
}

function aboutSection() {
    gsap.fromTo(
        '.about .section-photo img',
        { yPercent: -6, scale: 1.12 },
        {
            yPercent: 6,
            scale: 1.12,
            ease: 'none',
            scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true },
        },
    );
}

// Черепи повільно «пливуть» назустріч один одному
function skulls() {
    gsap.utils.toArray('.section--skull').forEach((section) => {
        const scrub = { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true };
        gsap.fromTo(section.querySelector('.skulls__top'), { y: -40 }, { y: 60, ease: 'none', scrollTrigger: scrub });
        gsap.fromTo(section.querySelector('.skulls__bottom'), { y: 60 }, { y: -40, ease: 'none', scrollTrigger: { ...scrub } });
    });

    const needs = document.querySelector('.needs');
    if (needs) {
        const scrub = { trigger: needs, start: 'top bottom', end: 'bottom top', scrub: true };
        gsap.fromTo('.needs__skull--top', { x: -40, rotate: -6, scaleX: -1 }, { x: 20, rotate: 0, scaleX: -1, ease: 'none', scrollTrigger: scrub });
        gsap.fromTo('.needs__skull--bottom', { x: 40, rotate: 6 }, { x: -20, rotate: 0, ease: 'none', scrollTrigger: { ...scrub } });
    }
}

// Відгуки з'являються як повідомлення в чаті
function reviews() {
    gsap.utils.toArray('.review').forEach((review, i) => {
        gsap.from(review, {
            x: i % 2 === 0 ? 40 : -40,
            y: 20,
            scale: 0.92,
            opacity: 0,
            duration: 0.7,
            ease: 'back.out(1.4)',
            transformOrigin: i % 2 === 0 ? 'right bottom' : 'left bottom',
            scrollTrigger: { trigger: review, start: 'top 90%', once: true },
        });
    });
}

// Лінія таймлайну заповнюється під час прокрутки, тижні підсвічуються
function programTimeline() {
    const weeks = document.querySelector('.weeks');
    if (!weeks) return;

    const progress = document.createElement('span');
    progress.className = 'weeks__progress';
    progress.setAttribute('aria-hidden', 'true');
    weeks.prepend(progress);

    gsap.to(progress, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: weeks, start: 'top 60%', end: 'bottom 60%', scrub: true },
    });

    gsap.utils.toArray('.week').forEach((week) => {
        ScrollTrigger.create({
            trigger: week,
            start: 'top 60%',
            onEnter: () => week.classList.add('is-active'),
            onLeaveBack: () => week.classList.remove('is-active'),
        });

        const tl = gsap.timeline({
            scrollTrigger: { trigger: week, start: 'top 82%', once: true },
            defaults: { ease: 'power3.out' },
        });
        tl.from(week.querySelector('.week__num'), { scale: 0.4, opacity: 0, duration: 0.7, ease: 'back.out(2)' })
            .from(week.querySelector('.week__title'), { x: -30, opacity: 0, duration: 0.7 }, 0)
            .from(week.querySelector('.week__format'), { y: 24, opacity: 0, duration: 0.6 }, 0.15)
            .from(week.querySelectorAll('.week__topics > li, .week__exam'), { y: 24, opacity: 0, duration: 0.6, stagger: 0.1 }, 0.25);
    });
}

function tariffs() {
    gsap.from('.tariff', {
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: { trigger: '.tariffs__grid', start: 'top 85%', once: true },
    });

    gsap.set('.tariffs__bg', { xPercent: -50, x: 0 });
    gsap.fromTo(
        '.tariffs__bg',
        { y: -60, rotate: -4 },
        {
            y: 120,
            rotate: 4,
            ease: 'none',
            scrollTrigger: { trigger: '.tariffs', start: 'top bottom', end: 'bottom top', scrub: true },
        },
    );
}
