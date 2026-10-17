// Модальне вікно із заявкою. Дані йдуть на Netlify Function /api/lead,
// яка вже пересилає їх у Telegram (токен бота зберігається на сервері).
// Після успішної відправки форма плавно зникає і з'являється вікно
// підтвердження, яке закривається лише кнопкою «Гаразд».

const ENDPOINT = '/api/lead';

const RULES = {
    name: (v) => (v.length >= 2 ? '' : "Ім'я має містити мінімум 2 символи"),
    education: (v) => (v ? '' : 'Будь ласка, вкажіть вашу освіту'),
    instagram: (v) => (v ? '' : 'Будь ласка, введіть ваш Instagram логін'),
    tariff: (v) => (v ? '' : 'Будь ласка, оберіть тариф'),
};

export function initForm() {
    const modal = document.getElementById('form-modal');
    const form = document.getElementById('course-form');
    const successModal = document.getElementById('success-modal');
    if (!modal || !form || !successModal) return;

    const status = form.querySelector('.form__status');
    const submit = form.querySelector('[type="submit"]');

    const setError = (field, message) => {
        const input = form.elements[field];
        const error = form.querySelector(`[data-error-for="${field}"]`);
        input.classList.toggle('is-invalid', Boolean(message));
        input.setAttribute('aria-invalid', String(Boolean(message)));
        error.textContent = message;
    };

    const reset = () => {
        form.reset();
        Object.keys(RULES).forEach((field) => setError(field, ''));
        status.hidden = true;
        submit.disabled = false;
        submit.textContent = 'Відправити';
    };

    const lockScroll = (locked) => {
        document.documentElement.style.overflow = locked ? 'hidden' : '';
    };

    const open = (tariff) => {
        reset();
        if (tariff) form.elements.tariff.value = tariff;
        modal.showModal();
        lockScroll(true);
    };

    const close = () => closeAnimated(modal).then(() => lockScroll(false));

    const showSuccess = async () => {
        await closeAnimated(modal, { keepBackdrop: true });
        reset();
        successModal.showModal();
        lockScroll(true);
    };

    // Esc у формі — теж плавне закриття
    modal.addEventListener('cancel', (e) => {
        e.preventDefault();
        close();
    });
    modal.addEventListener('close', () => {
        if (!successModal.open) lockScroll(false);
    });

    const closeSuccess = () => closeAnimated(successModal).then(() => lockScroll(false));

    // Вікно підтвердження не закривається клавішею Esc — лише кнопкою «Гаразд»
    successModal.addEventListener('cancel', (e) => e.preventDefault());
    successModal.querySelector('[data-success-ok]').addEventListener('click', closeSuccess);
    successModal.addEventListener('close', () => {
        if (!modal.open) lockScroll(false);
    });

    document.querySelectorAll('[data-open-form]').forEach((button) => {
        button.addEventListener('click', () => open(button.dataset.openForm));
    });

    modal.querySelectorAll('[data-close-modal]').forEach((button) => {
        button.addEventListener('click', close);
    });

    // Клік по затемненню навколо вікна
    modal.addEventListener('click', (e) => {
        if (e.target === modal) close();
    });

    form.querySelectorAll('input, select').forEach((input) => {
        const clear = () => {
            if (RULES[input.name]) setError(input.name, '');
        };
        input.addEventListener('input', clear);
        input.addEventListener('change', clear);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = Object.fromEntries(
            [...new FormData(form)].map(([key, value]) => [key, String(value).trim()]),
        );

        let firstInvalid = null;
        Object.entries(RULES).forEach(([field, rule]) => {
            const message = rule(data[field] || '');
            setError(field, message);
            if (message && !firstInvalid) firstInvalid = form.elements[field];
        });
        if (firstInvalid) {
            firstInvalid.focus();
            return;
        }

        status.hidden = true;
        submit.disabled = true;
        submit.textContent = 'Відправляємо…';

        try {
            const response = await fetch(ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const result = await response.json().catch(() => ({}));
                throw new Error(result.error || `http_${response.status}`);
            }

            await showSuccess();
        } catch (error) {
            console.error('Не вдалося відправити заявку:', error);
            const code = error instanceof TypeError ? 'network' : error.message;
            status.textContent = `Не вдалося відправити заявку. Перевірте інтернет і спробуйте ще раз. (код: ${code})`;
            status.hidden = false;
            submit.disabled = false;
            submit.textContent = 'Відправити';
        }
    });
}

// Закриває <dialog> після анімації зникнення (класи .is-closing у CSS)
function closeAnimated(dialog, { keepBackdrop = false } = {}) {
    return new Promise((resolve) => {
        if (!dialog.open) {
            resolve();
            return;
        }

        const finish = () => {
            clearTimeout(fallback);
            dialog.removeEventListener('animationend', onEnd);
            dialog.classList.remove('is-closing', 'keep-backdrop');
            dialog.close();
            resolve();
        };
        const onEnd = (e) => {
            if (e.target === dialog) finish();
        };
        // Якщо анімація не спрацює (вимкнена в системі тощо) — закриваємо все одно
        const fallback = setTimeout(finish, 450);

        dialog.addEventListener('animationend', onEnd);
        dialog.classList.toggle('keep-backdrop', keepBackdrop);
        dialog.classList.add('is-closing');
    });
}
