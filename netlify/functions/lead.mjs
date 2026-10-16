// Приймає заявку з форми на сайті та пересилає її в Telegram.
// Токен бота і ID каналу задаються у Netlify: Site configuration → Environment variables
//   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID

const TARIFFS = ['Самостійний', 'З підтримкою', 'За руку'];

const json = (body, status = 200) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });

const clean = (value, max) => String(value ?? '').trim().slice(0, max);

const escapeHtml = (value) =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export default async (req) => {
    if (req.method !== 'POST') {
        return json({ ok: false, error: 'method_not_allowed' }, 405);
    }

    let data;
    try {
        data = await req.json();
    } catch {
        return json({ ok: false, error: 'bad_request' }, 400);
    }

    // Приховане поле-пастка: людина його не бачить, а бот заповнює
    if (clean(data.website, 200)) {
        return json({ ok: true });
    }

    const name = clean(data.name, 100);
    const education = clean(data.education, 200);
    const instagram = clean(data.instagram, 100);
    const tariff = clean(data.tariff, 50);

    if (name.length < 2 || !education || !instagram || !TARIFFS.includes(tariff)) {
        return json({ ok: false, error: 'validation' }, 422);
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
        console.error('TELEGRAM_BOT_TOKEN або TELEGRAM_CHAT_ID не задані');
        return json({ ok: false, error: 'not_configured' }, 500);
    }

    const text = [
        '🆕 <b>Нова заявка на курс!</b>',
        '',
        `👤 Ім'я: ${escapeHtml(name)}`,
        `📚 Освіта: ${escapeHtml(education)}`,
        `📸 Instagram: ${escapeHtml(instagram)}`,
        `📋 Тариф: ${escapeHtml(tariff)}`,
    ].join('\n');

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    });

    if (!response.ok) {
        const details = await response.text();
        console.error('Telegram API error', response.status, details);
        let description = '';
        try {
            description = JSON.parse(details).description || '';
        } catch {}
        return json({ ok: false, error: `telegram_${response.status}`, description }, 502);
    }

    return json({ ok: true });
};

export const config = { path: '/api/lead' };
