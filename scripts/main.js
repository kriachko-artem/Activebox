window.onload = function () {

    const burger = document.querySelector('.burger');
    const navlinks = document.querySelector('.navlinks')
    burger.onclick = ()=> {
        burger.classList.toggle('opened');
        navlinks.classList.toggle('opened');
    }
    navlinks.querySelectorAll('a').forEach(link => {
        link.onclick = () => {
            if (navlinks.classList.contains('opened')) {
                navlinks.classList.toggle('opened');
            }
        };
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                const offset = 100; // Відступ у пікселях
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: "smooth" });
            }
        });
    });

    // Код для модального вікна
    const modal = document.getElementById('formModal');
    const openFormBtn = document.querySelector('.open-form-btn');
    const closeModalBtn = document.querySelector('.close-modal');
    const form = document.getElementById('courseForm');

    // Відкриття модального вікна
    openFormBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Блокуємо прокрутку
    });

    // Закриття модального вікна
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Відновлюємо прокрутку
    });

    // Закриття модального вікна при кліку поза ним
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // Валідація форми
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const telegram = document.getElementById('telegram').value;
        const tariff = document.getElementById('tariff').value;

        // Валідація імені
        if (name.length < 2) {
            showError('name', 'Ім\'я має містити мінімум 2 символи');
            return;
        }

        // Валідація телефону
        const phoneRegex = /^\+?[\d\s-()]{10,}$/;
        if (!phoneRegex.test(phone)) {
            showError('phone', 'Введіть коректний номер телефону');
            return;
        }

        // Валідація Telegram
        if (!telegram.startsWith('@')) {
            showError('telegram', 'Telegram логін має починатися з @');
            return;
        }

        // Валідація тарифу
        if (!tariff) {
            showError('tariff', 'Будь ласка, оберіть тариф');
            return;
        }

        // Якщо всі поля валідні, відправляємо дані
        const formData = {
            name,
            phone,
            telegram,
            tariff
        };

        // Відправка даних в Telegram
        sendToTelegram(formData);

        // Закриваємо модальне вікно
        modal.style.display = 'none';
        document.body.style.overflow = '';
        
        // Очищаємо форму
        form.reset();
    });

    // Функція для показу помилок
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorSpan = field.nextElementSibling;
        errorSpan.textContent = message;
        errorSpan.style.display = 'block';
        field.classList.add('error');
    }

    // Приховуємо помилки при введенні
    form.querySelectorAll('input, select').forEach(field => {
        field.addEventListener('input', () => {
            const errorSpan = field.nextElementSibling;
            errorSpan.style.display = 'none';
            field.classList.remove('error');
        });
    });
}
