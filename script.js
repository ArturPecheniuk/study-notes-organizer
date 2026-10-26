// Практична робота №6. Варіант 16 «Органайзер конспектів»

// Практикум 10, кроки 1 і 10. Обрано Vue 3: він підключається одним тегом <script> без Babel,
// а шаблони пишуться майже як звичайний HTML, тому існуючу розмітку легко перенести в компоненти.

// Крок 3. Перевірка, що файл підключено до сторінки
console.log('script.js підключено');

// Практикум 9, крок 3. Адреса API (JSONPlaceholder, мок-дані: title — тема, body — текст конспекту)
const API_URL = 'https://jsonplaceholder.typicode.com/posts?userId=2';

// Назва секції, у яку потрапляють конспекти з сервера
const SERVER_SUBJECT = 'Конспекти з сервера';

// Практикум 7, крок 2 (у практикумі 10 вимкнено): статичних карток-заглушок у HTML більше немає,
// картки створює компонент Vue, тому видаляти вручну нічого не потрібно
// const placeholders = document.querySelectorAll('.note-card');
// placeholders.forEach(placeholder => placeholder.remove());

// Крок 4. Дані варіанта: масив конспектів
const notes = [
    { topic: 'Інтеграли', subject: 'Вища математика', pages: 12, examSoon: true },
    { topic: 'Похідні', subject: 'Вища математика', pages: 8, examSoon: true },
    { topic: 'Основи C#', subject: 'Програмування', pages: 15, examSoon: false },
    { topic: 'Масиви та цикли', subject: 'Програмування', pages: 10, examSoon: false },
    { topic: 'Класи та об’єкти', subject: 'Програмування', pages: 6, examSoon: false },
    { topic: 'Кінематика', subject: 'Фізика', pages: 9, examSoon: true },
    { topic: 'Часи групи Perfect', subject: 'Англійська мова', pages: 5, examSoon: false },
    { topic: 'Київська Русь', subject: 'Історія України', pages: 11, examSoon: false },
    { topic: 'Козацька доба', subject: 'Історія України', pages: 7, examSoon: false }
];

// Список предметів (ті самі 5 предметів, що й на сторінці)
const subjects = ['Вища математика', 'Програмування', 'Фізика', 'Англійська мова', 'Історія України'];

// Скільки днів залишилося до іспитів
const daysUntilExam = 5;

// Практикум 7, крок 3 (у практикумі 10 вимкнено): контейнер тепер керується Vue
// const listContainer = document.querySelector('#notes-list');

// Крок 5. Функція рахує циклом for кількість конспектів по кожному предмету
// і виводить підсумок у консоль
function countNotesBySubject(notesList, subjectList) {
    console.log('--- Кількість конспектів по предметах ---');
    console.log(`Усього конспектів: ${notesList.length}`);

    for (let i = 0; i < subjectList.length; i++) {
        let count = 0;
        for (let j = 0; j < notesList.length; j++) {
            if (notesList[j].subject === subjectList[i]) {
                count++;
            }
        }
        console.log(`${subjectList[i]}: ${count}`);
    }
}

// Крок 6. Функція позначає предмети, з яких скоро іспит (examSoon === true)
function markExamSubjects(notesList, subjectList) {
    console.log('--- Предмети, з яких скоро іспит ---');

    for (const subject of subjectList) {
        let examSoon = false;
        for (const note of notesList) {
            if (note.subject === subject && note.examSoon === true) {
                examSoon = true;
            }
        }

        if (examSoon === true) {
            console.log(`${subject}: СКОРО ІСПИТ!`);
        } else {
            console.log(`${subject}: іспиту найближчим часом немає`);
        }
    }
}

// Крок 7. Стрілкова функція: скільки сторінок на день треба вивчати,
// щоб встигнути прочитати конспект до іспиту (округлення вгору)
const pagesPerDay = (pages, daysLeft) => Math.ceil(pages / daysLeft);

// Виклик функцій
countNotesBySubject(notes, subjects);
markExamSubjects(notes, subjects);

console.log(`--- План підготовки (до іспиту ${daysUntilExam} днів) ---`);
for (const note of notes) {
    if (note.examSoon === true) {
        console.log(`${note.subject}, конспект на ${note.pages} стор.: ${pagesPerDay(note.pages, daysUntilExam)} стор. на день`);
    }
}


// ===== Практикум 10, крок 7. Ручний DOM-код практикумів 7–9 ВИМКНЕНО =====
// Функцію renderNotes (createElement + append), ручні обробники форми, делегування change
// і завантаження з API через querySelector замінено Vue-застосунком нижче:
//   renderNotes            → компонент NoteSummary + v-for у шаблоні
//   форма (submit, input)  → v-model, @submit.prevent, метод addNote, validateTopic
//   чекбокс (делегування)  → подія toggleExam компонента
//   loadData + showLoading → метод loadData і реактивні isLoading, apiError
// Код залишено закоментованим для порівняння «до / після».
/*
// ===== Практикум 7. Маніпуляція DOM =====

// Крок 4. Функція рендеру: проходить масив конспектів циклом for...of,
// для кожного конспекту створює картку article і додає її всередину
// контейнера #notes-list — у сітку відповідного предмета
function renderNotes(notesList) {
    // Практикум 8. Перед повторним рендером прибираємо старі картки,
    // щоб після додавання нового конспекту вони не дублювалися
    listContainer.querySelectorAll('.note-card').forEach(oldCard => oldCard.remove());

    for (const note of notesList) {
        // Крок 5. Створюємо картку та вкладені елементи h3 (тема) і p (предмет)
        const card = document.createElement('article');
        card.classList.add('note-card');

        const title = document.createElement('h3');
        title.textContent = note.topic;

        const subject = document.createElement('p');
        subject.textContent = note.subject;

        // Практикум 8. Чекбокс «Іспит найближчим часом» усередині картки
        const examLabel = document.createElement('label');
        examLabel.classList.add('exam-toggle');

        const examCheckbox = document.createElement('input');
        examCheckbox.type = 'checkbox';
        examCheckbox.classList.add('exam-checkbox');
        examCheckbox.checked = note.examSoon;

        examLabel.append(examCheckbox, 'Іспит найближчим часом');

        card.append(title, subject);

        // Практикум 9. Якщо в конспекту є текст (конспекти з API), виводимо його окремим абзацом
        if (note.text) {
            const text = document.createElement('p');
            text.classList.add('note-text');
            text.textContent = note.text;
            card.append(text);
        }

        card.append(examLabel);

        // Практикум 8. Номер конспекту в масиві, щоб знайти його при кліку на чекбокс
        card.dataset.index = notesList.indexOf(note);

        // Крок 6. Атрибут data-subject і умовний клас exam-soon
        card.dataset.subject = note.subject;
        if (note.examSoon === true) {
            card.classList.add('exam-soon');
        }

        // Крок 7. Додаємо картку в контейнер — у сітку свого предмета
        const subjectGrid = listContainer.querySelector(`.notes-grid[data-subject="${note.subject}"]`);
        subjectGrid.append(card);
    }
}

// Крок 8. Викликаємо рендер з реальним масивом даних
renderNotes(notes);

// Крок 9. Оновлюємо вміст наявного елемента-підсумку p#notes-count
// (у практикумі 8 оформлено як функцію, бо підсумок оновлюється і після додавання конспекту)
const notesCount = document.querySelector('#notes-count');

function updateNotesCount() {
    notesCount.textContent = `Усього конспектів: ${notes.length}`;
}

updateNotesCount();


// ===== Практикум 8. Обробка подій, форми, клієнтська валідація =====

// Крок 2. Вибираємо форму та її поля
const form = document.querySelector('#note-form');
const subjectSelect = document.querySelector('#note-subject');
const topicInput = document.querySelector('#note-topic');
const pagesInput = document.querySelector('#note-pages');

// Кроки 2–7. Обробник події submit: додає новий конспект у масив
// і одразу перемальовує список без перезавантаження сторінки
form.addEventListener('submit', event => {
    // Крок 3. Скасовуємо стандартне перезавантаження сторінки
    event.preventDefault();

    // Крок 4. Зчитуємо значення полів (кількість сторінок перетворюємо на число)
    const subject = subjectSelect.value;
    const topic = topicInput.value.trim();
    const pages = Number(pagesInput.value);

    // Крок 5. Створюємо об'єкт тієї самої форми, що й у масиві notes, і додаємо його
    const newNote = { topic: topic, subject: subject, pages: pages, examSoon: false };
    notes.push(newNote);

    // Крок 6. Перемальовуємо список і оновлюємо підсумок
    renderNotes(notes);
    updateNotesCount();
    console.log(`Додано конспект «${topic}» (${subject}), усього: ${notes.length}`);

    // Крок 7. Очищаємо форму
    form.reset();
});

// Крок 8. Додаткова валідація на подію input: тема має містити щонайменше 3 символи
// (пробіли на початку й у кінці не враховуються)
topicInput.addEventListener('input', () => {
    if (topicInput.value !== '' && topicInput.value.trim().length < 3) {
        topicInput.setCustomValidity('Тема має містити щонайменше 3 символи');
    } else {
        topicInput.setCustomValidity('');
    }
});

// Крок 9. Делегування події change: один обробник на весь контейнер #notes-list
// реагує на чекбокс «Іспит найближчим часом» у будь-якій картці (навіть доданій пізніше)
listContainer.addEventListener('change', event => {
    if (event.target.classList.contains('exam-checkbox')) {
        const card = event.target.closest('.note-card');
        const note = notes[Number(card.dataset.index)];

        note.examSoon = event.target.checked;
        card.classList.toggle('exam-soon', note.examSoon);

        console.log(`«${note.topic}»: скоро іспит — ${note.examSoon}`);
    }
});


// ===== Практикум 9. Клієнт для API (fetch, async/await) =====

// Елементи секції «Конспекти з сервера»
const reloadButton = document.querySelector('#reload-button');
const loadingMessage = document.querySelector('#loading-message');
const apiError = document.querySelector('#api-error');

// Крок 7. Показує або ховає стан завантаження: текст «Завантаження…» і заблокована кнопка
function showLoading(isLoading) {
    loadingMessage.hidden = !isLoading;
    reloadButton.disabled = isLoading;
}

// Крок 8. Показує користувачу зрозуміле повідомлення про помилку (або ховає його)
function showError(message) {
    apiError.textContent = message;
    apiError.hidden = message === '';
}

// Кроки 2–8. Завантажує конспекти з JSONPlaceholder API:
// https://jsonplaceholder.typicode.com/posts?userId=2
// і додає їх у масив notes, щоб вивести тією самою функцією renderNotes з практикуму 7
async function loadData() {
    showError('');
    showLoading(true);

    try {
        // Крок 3. Надсилаємо запит і чекаємо на відповідь сервера
        const response = await fetch(API_URL);

        // Крок 4. fetch не вважає 404/500 помилкою, тому перевіряємо статус вручну
        if (!response.ok) {
            throw new Error(`Сервер відповів кодом ${response.status}`);
        }

        // Крок 5. Розбираємо тіло відповіді як JSON
        const data = await response.json();
        console.log('Відповідь API:', data);

        // Прибираємо конспекти, завантажені раніше, щоб кнопка «Оновити» їх не дублювала
        for (let i = notes.length - 1; i >= 0; i--) {
            if (notes[i].fromServer === true) {
                notes.splice(i, 1);
            }
        }

        // Крок 6. Зіставляємо поля API з формою об'єкта конспекту і додаємо в масив
        for (const post of data) {
            notes.push({
                topic: post.title,
                subject: SERVER_SUBJECT,
                pages: 1,
                examSoon: false,
                text: post.body,
                fromServer: true
            });
        }

        renderNotes(notes);
        updateNotesCount();
        console.log(`Завантажено з сервера: ${data.length} конспектів`);
    } catch (error) {
        // Крок 8. Користувачу — зрозуміле повідомлення, розробнику — деталі в консолі
        showError('Конспекти тимчасово недоступні. Перевірте з’єднання та натисніть «Оновити».');
        console.error('Помилка завантаження конспектів:', error);
    } finally {
        // Крок 7. Ховаємо стан завантаження незалежно від результату
        showLoading(false);
    }
}

// Крок 10. Кнопка «Оновити» повторює запит без перезавантаження сторінки
reloadButton.addEventListener('click', () => {
    loadData();
});

// Завантажуємо конспекти з сервера одразу після відкриття сторінки
loadData();
*/


// ===== Практикум 10. Vue 3: компонентний підхід =====
// (у практикумі 11 до застосунку додано збереження даних, редагування, видалення і фільтр)

const { createApp } = Vue;


// ===== Практикум 11. Локальне збереження даних =====

// Крок 1. Модель даних одного конспекту (варіант 16):
// {
//     id: 1,                          — унікальний ідентифікатор (число)
//     subject: 'Вища математика',     — предмет
//     title: 'Інтеграли',             — тема конспекту
//     text: 'Конспект лекції ...',    — текст конспекту
//     date: '2026-10-26',             — дата створення / останньої зміни (РРРР-ММ-ДД)
//     pages: 12,                      — кількість сторінок (з практикумів 6–10)
//     examSoon: true,                 — позначка «Іспит найближчим часом» (практикум 8)
//     learned: false                  — позначка «вивчено» (практикум 10)
// }

// Ключ, під яким конспекти зберігаються в localStorage
const STORAGE_KEY = 'studyNotes';

// Конспекти, з якими застосунок стартує при самому першому запуску (коли збережених даних ще немає)
const DEFAULT_NOTES = [
    { id: 1, subject: 'Вища математика', title: 'Інтеграли', text: 'Конспект лекції про визначені інтеграли та їх обчислення.', date: '2026-09-08', pages: 12, examSoon: true, learned: false },
    { id: 2, subject: 'Вища математика', title: 'Похідні', text: 'Правила диференціювання та похідні складних функцій.', date: '2026-09-15', pages: 8, examSoon: true, learned: false },
    { id: 3, subject: 'Програмування', title: 'Основи C#', text: 'Базові типи даних, масиви та структури управління.', date: '2026-09-09', pages: 15, examSoon: false, learned: true },
    { id: 4, subject: 'Програмування', title: 'Масиви та цикли', text: 'Одновимірні й двовимірні масиви, цикли for і foreach.', date: '2026-09-16', pages: 10, examSoon: false, learned: false },
    { id: 5, subject: 'Програмування', title: 'Класи та об’єкти', text: 'Поля, методи, конструктори та модифікатори доступу.', date: '2026-09-23', pages: 6, examSoon: false, learned: false },
    { id: 6, subject: 'Фізика', title: 'Кінематика', text: 'Рівномірний та рівноприскорений рух матеріальної точки.', date: '2026-09-10', pages: 9, examSoon: true, learned: false },
    { id: 7, subject: 'Англійська мова', title: 'Часи групи Perfect', text: 'Правила використання Present, Past та Future Perfect.', date: '2026-09-11', pages: 5, examSoon: false, learned: true },
    { id: 8, subject: 'Історія України', title: 'Київська Русь', text: 'Утворення держави, перші князі та їхня внутрішня політика.', date: '2026-09-12', pages: 11, examSoon: false, learned: false },
    { id: 9, subject: 'Історія України', title: 'Козацька доба', text: 'Запорозька Січ, гетьманство та Національно-визвольна війна.', date: '2026-09-19', pages: 7, examSoon: false, learned: false }
];

// Крок 2. Зберігає масив конспектів у localStorage.
// (Після переходу на IndexedDB (кроки 5–12) ця пара функцій використовується лише для міграції)
// localStorage вміє зберігати лише рядки, тому масив перетворюємо на JSON-рядок
function saveToLocalStorage(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// Крок 2. Читає масив конспектів з localStorage.
// Повертає null, якщо даних ще немає (перший запуск), і порожній масив, якщо дані пошкоджені.
// JSON.parse кидає помилку на зіпсованому рядку, тому виклик загорнуто в try/catch
function loadFromLocalStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        console.error('Пошкоджені дані в localStorage:', error);
        return [];
    }
}

// Сьогоднішня дата у форматі РРРР-ММ-ДД
function today() {
    return new Date().toISOString().slice(0, 10);
}


// ===== Практикум 11, кроки 5–12. IndexedDB =====

// Крок 5. Схема бази: база StudyNotesDB, версія 1, одне сховище "notes" з ключем id
const DB_NAME = 'StudyNotesDB';
const DB_VERSION = 1;
const STORE_NAME = 'notes';

// Ключ прапорця в localStorage: міграцію (або перше заповнення) вже виконано
const MIGRATED_KEY = 'migratedToIndexedDB';

// Крок 6. Відкриває базу даних і повертає Promise.
// onupgradeneeded спрацьовує лише тоді, коли бази ще немає або її версія нижча —
// тільки тут можна створити object store. Перевірка contains не дає створити його вдруге
function openDB() {
    return new Promise((resolve, reject) => {
        if (!window.indexedDB) {
            reject(new Error('Браузер не підтримує IndexedDB'));
            return;
        }
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Крок 7. Create: додає конспект у сховище (транзакція readwrite).
// put() створює новий запис або перезаписує наявний з тим самим id.
// { ...item } — копія звичайним об'єктом, бо реактивний об'єкт Vue (Proxy) IndexedDB зберегти не може
async function addItem(item) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put({ ...item });
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

// Крок 7. Update: оновлює наявний конспект — той самий put з тим самим id, без дубліката
async function updateItem(item) {
    return addItem(item);
}

// Крок 7. Read: повертає всі конспекти зі сховища (транзакція readonly)
async function getAllItems() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const request = tx.objectStore(STORE_NAME).getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Крок 7. Delete: видаляє конспект за id (транзакція readwrite)
async function deleteItem(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

// Крок 8. Одноразова міграція з localStorage в IndexedDB.
// Виконується, лише якщо прапорця ще немає і сховище порожнє:
// переносить конспекти з localStorage (а при самому першому запуску — стартові конспекти)
// і ставить прапорець migratedToIndexedDB=true, щоб не повторювати перенесення
async function migrateFromLocalStorage() {
    if (localStorage.getItem(MIGRATED_KEY) === 'true') {
        console.log('Міграцію вже виконано раніше — пропускаємо');
        return;
    }
    const existing = await getAllItems();
    if (existing.length === 0) {
        const saved = loadFromLocalStorage();
        if (saved && saved.length > 0) {
            for (const note of saved) {
                await addItem(note);
            }
            console.log(`Міграція: перенесено ${saved.length} конспектів з localStorage в IndexedDB`);
        } else {
            for (const note of DEFAULT_NOTES) {
                await addItem(note);
            }
            console.log(`Перший запуск: у IndexedDB записано ${DEFAULT_NOTES.length} стартових конспектів`);
        }
    }
    localStorage.setItem(MIGRATED_KEY, 'true');
}


// ===== Компонент картки конспекту =====

// Компонент NoteSummary (практикум 10) — картка одного конспекту.
// Отримує всі дані через props і не звертається до глобальних змінних;
// про дії користувача повідомляє батьківський компонент подіями
// (назви подій у kebab-case, бо шаблон записано прямо в HTML, а HTML не розрізняє великі й малі літери)
const NoteSummary = {
    props: {
        id: { type: [Number, String], required: true },
        subject: { type: String, required: true },
        topic: { type: String, required: true },
        pages: { type: Number, default: null },
        text: { type: String, default: '' },
        date: { type: String, default: '' },
        examSoon: { type: Boolean, default: false },
        learned: { type: Boolean, default: false },
        editable: { type: Boolean, default: true }
    },
    emits: ['toggle-learned', 'toggle-exam', 'edit-note', 'delete-note'],
    computed: {
        // Дата у звичному форматі ДД.ММ.РРРР
        formattedDate() {
            if (!this.date) return '';
            const [year, month, day] = this.date.split('-');
            return `${day}.${month}.${year}`;
        }
    },
    template: `
        <article class="note-card" :class="{ 'exam-soon': examSoon, learned: learned }" :data-subject="subject">
            <h3>{{ topic }}</h3>
            <p>{{ subject }}<span v-if="pages"> · {{ pages }} стор.</span></p>
            <p v-if="formattedDate" class="note-date">{{ formattedDate }}</p>
            <p v-if="text" class="note-text">{{ text }}</p>
            <label class="exam-toggle">
                <input type="checkbox" class="exam-checkbox" :checked="examSoon" @change="$emit('toggle-exam', id)">
                Іспит найближчим часом
            </label>
            <button type="button" class="learned-button" @click="$emit('toggle-learned', id)">
                {{ learned ? '✓ Вивчено' : 'Позначити як вивчене' }}
            </button>
            <div v-if="editable" class="card-actions">
                <button type="button" class="edit-button" @click="$emit('edit-note', id)">Редагувати</button>
                <button type="button" class="delete-button" @click="$emit('delete-note', id)">Видалити</button>
            </div>
        </article>`
};


// ===== Кореневий застосунок =====

const app = createApp({
    components: { NoteSummary },

    data() {
        return {
            notes: [],           // власні конспекти (крок 9: завжди результат getAllItems з IndexedDB)
            serverNotes: [],     // конспекти з API (практикум 9, не зберігаються)
            subjects: [
                { id: 'math', name: 'Вища математика', color: 'color-math' },
                { id: 'programming', name: 'Програмування', color: 'color-prog' },
                { id: 'physics', name: 'Фізика', color: 'color-phys' },
                { id: 'english', name: 'Англійська мова', color: 'color-eng' },
                { id: 'history', name: 'Історія України', color: 'color-hist' },
                { id: 'server-notes', name: SERVER_SUBJECT, color: 'color-server', fromServer: true }
            ],
            subjectFilter: '',   // фільтр за предметом ('' — усі предмети)
            editingId: null,     // id конспекту, який зараз редагується (null — режим додавання)
            newSubject: '',      // поля форми (v-model)
            newTitle: '',
            newPages: '',
            newText: '',
            isLoading: false,    // стан завантаження з API
            apiError: '',        // повідомлення про помилку API
            dbError: ''          // крок 11: повідомлення, якщо IndexedDB недоступна
        };
    },

    computed: {
        // Усі конспекти на сторінці: власні + завантажені з сервера
        allNotes() {
            return [...this.notes, ...this.serverNotes];
        },
        // Фільтр за предметом застосовується на клієнті до масиву, отриманого з getAllItems
        filteredNotes() {
            if (this.subjectFilter === '') {
                return this.allNotes;
            }
            return this.notes.filter(note => note.subject === this.subjectFilter);
        },
        // Секції, які показуються з урахуванням фільтра
        visibleSubjects() {
            if (this.subjectFilter === '') {
                return this.subjects;
            }
            return this.subjects.filter(subject => subject.name === this.subjectFilter);
        },
        // Похідне значення (практикум 10): кількість вивчених конспектів
        learnedCount() {
            return this.allNotes.filter(note => note.learned).length;
        },
        // Предмети для випадних списків (без секції «Конспекти з сервера»)
        studySubjects() {
            return this.subjects.filter(subject => !subject.fromServer);
        }
    },

    methods: {
        // Конспекти одного предмета — для v-for у секції цього предмета
        notesOf(subjectName) {
            return this.filteredNotes.filter(note => note.subject === subjectName);
        },

        // Шукає конспект за id серед власних і серверних
        findNote(id) {
            return this.allNotes.find(note => note.id === id);
        },

        // Крок 9. Перечитує конспекти з IndexedDB — викликається після кожної CRUD-операції
        async reloadNotes() {
            this.notes = await getAllItems();
            console.log(`Прочитано з IndexedDB: ${this.notes.length} конспектів`);
        },

        // Крок 11. Повідомлення користувачу, якщо операція з базою не вдалася
        handleDbError(error) {
            this.dbError = 'Не вдалося зберегти дані: локальна база IndexedDB недоступна. Можливо, браузер працює в режимі приватного перегляду.';
            console.error('Помилка IndexedDB:', error);
        },

        // Подія варіанта 16 з практикуму 10: перемикає позначку «вивчено» (Update)
        async toggleLearned(id) {
            const note = this.findNote(id);
            note.learned = !note.learned;
            console.log(`«${note.title}»: вивчено — ${note.learned}`);
            if (note.fromServer) return;
            try {
                await updateItem(note);
                await this.reloadNotes();
            } catch (error) {
                this.handleDbError(error);
            }
        },

        // Позначка «Іспит найближчим часом» з практикуму 8 (Update)
        async toggleExam(id) {
            const note = this.findNote(id);
            note.examSoon = !note.examSoon;
            if (note.fromServer) return;
            try {
                await updateItem(note);
                await this.reloadNotes();
            } catch (error) {
                this.handleDbError(error);
            }
        },

        // Форма: додавання нового конспекту (Create) або збереження змін у наявному (Update)
        async saveNote() {
            try {
                if (this.editingId === null) {
                    const note = {
                        id: Date.now(),
                        subject: this.newSubject,
                        title: this.newTitle,
                        text: this.newText,
                        date: today(),
                        pages: this.newPages,
                        examSoon: false,
                        learned: false
                    };
                    await addItem(note);
                    console.log(`Додано в IndexedDB: «${note.title}» (${note.subject})`);
                } else {
                    // Той самий id — put перезаписує наявний запис, дубліката не буде
                    const note = this.notes.find(n => n.id === this.editingId);
                    await updateItem({
                        ...note,
                        subject: this.newSubject,
                        title: this.newTitle,
                        text: this.newText,
                        pages: this.newPages,
                        date: today()
                    });
                    console.log(`Оновлено в IndexedDB: «${this.newTitle}» (id ${note.id})`);
                }
                await this.reloadNotes();
                this.resetForm();
            } catch (error) {
                this.handleDbError(error);
            }
        },

        // Кнопка «Редагувати» на картці: заповнює форму даними конспекту
        startEdit(id) {
            const note = this.notes.find(n => n.id === id);
            this.editingId = id;
            this.newSubject = note.subject;
            this.newTitle = note.title;
            this.newPages = note.pages;
            this.newText = note.text;
            document.querySelector('#add-note').scrollIntoView({ behavior: 'smooth' });
        },

        // Кнопка «Видалити» на картці (Delete)
        async deleteNote(id) {
            const note = this.notes.find(n => n.id === id);
            try {
                await deleteItem(id);
                console.log(`Видалено з IndexedDB: «${note.title}» (id ${id})`);
                if (this.editingId === id) this.resetForm();
                await this.reloadNotes();
            } catch (error) {
                this.handleDbError(error);
            }
        },

        // Очищає форму і повертає її в режим додавання
        resetForm() {
            this.editingId = null;
            this.newSubject = '';
            this.newTitle = '';
            this.newPages = '';
            this.newText = '';
        },

        // Додаткова валідація теми з практикуму 8 (власне повідомлення)
        validateTopic(event) {
            const input = event.target;
            if (input.value !== '' && input.value.trim().length < 3) {
                input.setCustomValidity('Тема має містити щонайменше 3 символи');
            } else {
                input.setCustomValidity('');
            }
        },

        // Завантаження конспектів з JSONPlaceholder API (практикум 9):
        // https://jsonplaceholder.typicode.com/posts?userId=2
        async loadData() {
            this.apiError = '';
            this.isLoading = true;
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`Сервер відповів кодом ${response.status}`);
                }
                const data = await response.json();
                console.log('Відповідь API:', data);
                this.serverNotes = data.map(post => ({
                    id: `server-${post.id}`,
                    subject: SERVER_SUBJECT,
                    title: post.title,
                    text: post.body,
                    date: '',
                    pages: null,
                    examSoon: false,
                    learned: false,
                    fromServer: true
                }));
                console.log(`Завантажено з сервера: ${data.length} конспектів`);
            } catch (error) {
                this.apiError = 'Конспекти тимчасово недоступні. Перевірте з’єднання та натисніть «Оновити».';
                console.error('Помилка завантаження конспектів:', error);
            } finally {
                this.isLoading = false;
            }
        }
    },

    // Під час запуску: відкриваємо IndexedDB, за потреби переносимо дані з localStorage,
    // читаємо конспекти з бази (крок 9), а потім завантажуємо конспекти з сервера
    async mounted() {
        try {
            await migrateFromLocalStorage();
            await this.reloadNotes();
        } catch (error) {
            // Крок 11. IndexedDB недоступна — показуємо зрозуміле повідомлення, сторінка працює далі
            this.dbError = 'Не вдалося відкрити локальну базу даних. Можливо, браузер працює в режимі приватного перегляду — збережені конспекти недоступні.';
            console.error('Помилка відкриття IndexedDB:', error);
        }
        this.loadData();
    }
});

app.mount('#app');
