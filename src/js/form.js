// Модальне вікно із заявкою. Дані йдуть на Netlify Function /api/lead,
// яка вже пересилає їх у Telegram (токен бота зберігається на сервері).

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
    if (!modal || !form) return;

    const success = modal.querySelector('.modal__success');
    const status = form.querySelector('.form__status');
    const submit = form.querySelector('[type="submit"]');
    let closeTimer;

    const setError = (field, message) => {
        const input = form.elements[field];
        const error = form.querySelector(`[data-error-for="${field}"]`);
        input.classList.toggle('is-invalid', Boolean(message));
        input.setAttribute('aria-invalid', String(Boolean(message)));
        error.textContent = message;
    };

    const reset = () => {
        clearTimeout(closeTimer);
        form.reset();
        Object.keys(RULES).forEach((field) => setError(field, ''));
        status.hidden = true;
        form.hidden = false;
        success.hidden = true;
        submit.disabled = false;
        submit.textContent = 'Відправити';
    };

    const open = (tariff) => {
        reset();
        if (tariff) form.elements.tariff.value = tariff;
        modal.showModal();
        document.documentElement.style.overflow = 'hidden';
    };

    const close = () => modal.close();

    modal.addEventListener('close', () => {
        document.documentElement.style.overflow = '';
        clearTimeout(closeTimer);
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
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            form.hidden = true;
            success.hidden = false;
            closeTimer = setTimeout(close, 4000);
        } catch (error) {
            console.error('Не вдалося відправити заявку:', error);
            status.textContent = 'Не вдалося відправити заявку. Перевірте інтернет і спробуйте ще раз.';
            status.hidden = false;
            submit.disabled = false;
            submit.textContent = 'Відправити';
        }
    });
}
