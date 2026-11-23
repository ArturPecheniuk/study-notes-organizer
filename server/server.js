// Практична робота №14. Варіант 16 «Органайзер конспектів»
// Найпростіший сервер на вбудованому модулі http (без зовнішніх залежностей, крок 3).
// Сервер одночасно:
//   1) віддає JSON-дані конспектів через власний ендпоінт /api/notes (замість JSONPlaceholder з практикуму 9);
//   2) роздає статичні файли застосунку (index.html, css, script.js) з кореня проєкту (крок 7).
// Фронтенд і API працюють на одному порту (один origin), тому CORS налаштовувати не потрібно.
// Запуск: у теці server виконати  npm start  (або  node server.js), відкрити http://localhost:3000

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Корінь клієнтської частини — тека проєкту на рівень вище за server/
const PUBLIC_DIR = path.join(__dirname, '..');

// Крок 4. Локальні дані: 8 конспектів у JSON-файлі (поля subject, title, text + id)
const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'notes.json'), 'utf-8'));

// Типи вмісту для статичних файлів (Content-Type за розширенням)
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Надсилає відповідь у форматі JSON з потрібним статус-кодом і правильним Content-Type
function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
}

// Кроки 5–6, 10. Обробка запитів до API конспектів
function handleApi(req, res, url) {
    if (req.method !== 'GET') {
        sendJson(res, 405, { error: 'Метод не підтримується, використовуйте GET' });
        return;
    }

    // Крок 5. GET /api/notes — усі конспекти
    // Крок 6. GET /api/notes?subject=Фізика — фільтр за предметом через query-параметр (варіант 16)
    if (url.pathname === '/api/notes') {
        const subject = url.searchParams.get('subject');
        if (subject === null) {
            sendJson(res, 200, notes);
            return;
        }
        const filtered = notes.filter(note => note.subject === subject);
        if (filtered.length === 0) {
            // Крок 10. Предмета немає — 404 з JSON-повідомленням, а не порожня відповідь з кодом 200
            sendJson(res, 404, { error: `Конспектів з предмета «${subject}» не знайдено` });
            return;
        }
        sendJson(res, 200, filtered);
        return;
    }

    // Додатково: GET /api/notes/:id — один конспект за id (або 404)
    const match = url.pathname.match(/^\/api\/notes\/([^/]+)$/);
    if (match) {
        const note = notes.find(n => String(n.id) === match[1]);
        if (!note) {
            sendJson(res, 404, { error: `Конспект з id ${match[1]} не знайдено` });
            return;
        }
        sendJson(res, 200, note);
        return;
    }

    // Крок 10. Неіснуючий шлях API — 404 з JSON-повідомленням
    sendJson(res, 404, { error: 'Ендпоінт не знайдено' });
}

// Крок 7. Роздача статичних файлів застосунку з кореня проєкту
function serveStatic(req, res, url) {
    const urlPath = url.pathname === '/' ? '/index.html' : url.pathname;
    const filePath = path.normalize(path.join(PUBLIC_DIR, urlPath));

    // Захист: не віддаємо файли поза текою проєкту, приховані файли (.git тощо) і код самого сервера
    const relative = path.relative(PUBLIC_DIR, filePath);
    const blocked = relative.startsWith('..') ||
        relative.split(path.sep).some(part => part.startsWith('.')) ||
        relative.split(path.sep)[0] === 'server';
    if (blocked) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Доступ заборонено');
        return;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Файл не знайдено');
            return;
        }
        const type = MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': type });
        res.end(content);
    });
}

// Обробник викликається на кожен запит: req — дані запиту, res — формування відповіді
const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    url.pathname = decodeURIComponent(url.pathname);
    console.log(`${req.method} ${req.url}`);

    if (url.pathname.startsWith('/api/')) {
        handleApi(req, res, url);
    } else {
        serveStatic(req, res, url);
    }
});

// Крок 8. Запуск сервера
server.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
});
