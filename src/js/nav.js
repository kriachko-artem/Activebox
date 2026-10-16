// Мобільне меню (шапка не фіксована — прокручується разом зі сторінкою)

export function initNav() {
    const burger = document.querySelector('.burger');
    const nav = document.getElementById('site-nav');
    if (!burger || !nav) return;

    const setOpen = (open) => {
        burger.setAttribute('aria-expanded', String(open));
        nav.classList.toggle('is-open', open);
    };

    burger.addEventListener('click', () => {
        setOpen(burger.getAttribute('aria-expanded') !== 'true');
    });

    nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => setOpen(false));
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setOpen(false);
    });

    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !burger.contains(e.target)) setOpen(false);
    });
}
