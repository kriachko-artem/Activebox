// Константи для Telegram
const BOT_TOKEN = '7557277782:AAGPsapE6HUKGlLwHudcm2aecOh79uXKQnI';
const CHANNEL_ID = '-1002587896102';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

// Функція для відправки даних в Telegram
async function sendToTelegram(formData) {
    try {
        const message = `
🆕 Нова заявка на курс!

👤 Ім'я: ${formData.name}
📚 Освіта: ${formData.education}
📸 Instagram: ${formData.instagram}
📋 Тариф: ${formData.tariff}
        `.trim();

        const response = await fetch(TELEGRAM_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHANNEL_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });

        if (!response.ok) {
            throw new Error('Помилка відправки даних');
        }

        return true;
    } catch (error) {
        console.error('Помилка при відправці в Telegram:', error);
        return false;
    }
}

// Експортуємо функцію для використання в main.js
window.sendToTelegram = sendToTelegram; 