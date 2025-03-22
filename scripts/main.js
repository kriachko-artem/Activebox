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
    const successMessage = document.getElementById('successMessage');

    // Відкриття модального вікна
    openFormBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Блокуємо прокрутку
        // Скидаємо стан форми та повідомлення
        form.reset();
        form.style.display = 'block';
        successMessage.style.display = 'none';
    });

    // Закриття модального вікна
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Відновлюємо прокрутку
        // Скидаємо стан форми та повідомлення
        form.reset();
        form.style.display = 'block';
        successMessage.style.display = 'none';
    });

    // Закриття модального вікна при кліку поза ним
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            // Скидаємо стан форми та повідомлення
            form.reset();
            form.style.display = 'block';
            successMessage.style.display = 'none';
        }
    });

    // Валідація форми
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const education = document.getElementById('education').value;
        const instagram = document.getElementById('instagram').value;
        const tariff = document.getElementById('tariff').value;

        // Валідація імені
        if (name.length < 2) {
            showError('name', 'Ім\'я має містити мінімум 2 символи');
            return;
        }

        // Валідація освіти
        if (!education) {
            showError('education', 'Будь ласка, вкажіть вашу освіту');
            return;
        }

        // Валідація Instagram
        if (!instagram) {
            showError('instagram', 'Будь ласка, введіть ваш Instagram логін');
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
            education,
            instagram,
            tariff
        };

        // Відправка даних в Telegram
        sendToTelegram(formData).then(() => {
            // Приховуємо форму
            form.style.display = 'none';
            // Показуємо повідомлення про успіх
            successMessage.style.display = 'block';
            
            // Автоматично закриваємо модальне вікно через 3 секунди
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
                // Скидаємо стан форми та повідомлення
                form.reset();
                form.style.display = 'block';
                successMessage.style.display = 'none';
            }, 3000);
        });
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
