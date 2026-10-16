// Стабільна висота першого екрана.
//
// Вбудований браузер Telegram (і деякі інші) змінює висоту вікна, коли
// ховає або показує свою панель під час прокрутки. Через це vh/svh/dvh
// перераховуються, і сторінка стрибає. Тому висоту беремо один раз і
// оновлюємо лише тоді, коли змінюється ширина (поворот телефона, зміна
// розміру вікна на комп'ютері), а не висота.

export function initScreenHeight() {
    const root = document.documentElement;
    let lastWidth = 0;

    const update = () => {
        const width = window.innerWidth;
        if (width === lastWidth) return;
        lastWidth = width;
        root.style.setProperty('--screen-h', `${window.innerHeight}px`);
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', () => {
        // Після повороту розміри вікна оновлюються не одразу
        lastWidth = 0;
        setTimeout(update, 250);
    });
}
