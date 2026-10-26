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

const { createApp } = Vue;

// Кроки 4–6. Компонент NoteSummary — картка одного конспекту.
// Отримує всі дані через props і не звертається до глобальних змінних;
// про клік повідомляє батьківський компонент подіями toggle-learned та toggle-exam
// (назви подій у kebab-case, бо шаблон записано прямо в HTML, а HTML не розрізняє великі й малі літери)
const NoteSummary = {
    props: {
        id: { type: [Number, String], required: true },
        subject: { type: String, required: true },
        topic: { type: String, required: true },
        pages: { type: Number, default: null },
        text: { type: String, default: '' },
        examSoon: { type: Boolean, default: false },
        learned: { type: Boolean, default: false }
    },
    emits: ['toggle-learned', 'toggle-exam'],
    template: `
        <article class="note-card" :class="{ 'exam-soon': examSoon, learned: learned }" :data-subject="subject">
            <h3>{{ topic }}</h3>
            <p>{{ subject }}<span v-if="pages"> · {{ pages }} стор.</span></p>
            <p v-if="text" class="note-text">{{ text }}</p>
            <label class="exam-toggle">
                <input type="checkbox" class="exam-checkbox" :checked="examSoon" @change="$emit('toggle-exam', id)">
                Іспит найближчим часом
            </label>
            <button type="button" class="learned-button" @click="$emit('toggle-learned', id)">
                {{ learned ? '✓ Вивчено' : 'Позначити як вивчене' }}
            </button>
        </article>`
};

// Кореневий застосунок: зберігає реактивний стан і обробляє події від карток
const app = createApp({
    components: { NoteSummary },

    // Крок 3. Масив конспектів тепер живе в реактивному стані data(), а не в зовнішній змінній
    data() {
        return {
            notes: [
                { id: 1, topic: 'Інтеграли', subject: 'Вища математика', pages: 12, examSoon: true, learned: false },
                { id: 2, topic: 'Похідні', subject: 'Вища математика', pages: 8, examSoon: true, learned: false },
                { id: 3, topic: 'Основи C#', subject: 'Програмування', pages: 15, examSoon: false, learned: true },
                { id: 4, topic: 'Масиви та цикли', subject: 'Програмування', pages: 10, examSoon: false, learned: false },
                { id: 5, topic: 'Класи та об’єкти', subject: 'Програмування', pages: 6, examSoon: false, learned: false },
                { id: 6, topic: 'Кінематика', subject: 'Фізика', pages: 9, examSoon: true, learned: false },
                { id: 7, topic: 'Часи групи Perfect', subject: 'Англійська мова', pages: 5, examSoon: false, learned: true },
                { id: 8, topic: 'Київська Русь', subject: 'Історія України', pages: 11, examSoon: false, learned: false },
                { id: 9, topic: 'Козацька доба', subject: 'Історія України', pages: 7, examSoon: false, learned: false }
            ],
            subjects: [
                { id: 'math', name: 'Вища математика', color: 'color-math' },
                { id: 'programming', name: 'Програмування', color: 'color-prog' },
                { id: 'physics', name: 'Фізика', color: 'color-phys' },
                { id: 'english', name: 'Англійська мова', color: 'color-eng' },
                { id: 'history', name: 'Історія України', color: 'color-hist' },
                { id: 'server-notes', name: SERVER_SUBJECT, color: 'color-server', fromServer: true }
            ],
            nextId: 10,          // id для нових конспектів із форми
            newSubject: '',      // поля форми (v-model)
            newTopic: '',
            newPages: '',
            isLoading: false,    // стан завантаження з API
            apiError: ''         // повідомлення про помилку API
        };
    },

    computed: {
        // Похідне значення: кількість вивчених конспектів перераховується автоматично
        learnedCount() {
            return this.notes.filter(note => note.learned).length;
        },
        // Предмети для випадного списку форми (без секції «Конспекти з сервера»)
        studySubjects() {
            return this.subjects.filter(subject => !subject.fromServer);
        }
    },

    methods: {
        // Конспекти одного предмета — для v-for у секції цього предмета
        notesOf(subjectName) {
            return this.notes.filter(note => note.subject === subjectName);
        },

        // Крок 6. Подія варіанта 16: картка передає toggleLearned(id),
        // батьківський компонент перемикає позначку «вивчено» в масиві — Vue сам перемальовує картку
        toggleLearned(id) {
            const note = this.notes.find(n => n.id === id);
            note.learned = !note.learned;
            console.log(`«${note.topic}»: вивчено — ${note.learned}`);
        },

        // Позначка «Іспит найближчим часом» (з практикуму 8)
        toggleExam(id) {
            const note = this.notes.find(n => n.id === id);
            note.examSoon = !note.examSoon;
        },

        // Форма з практикуму 8: @submit.prevent уже скасовує перезавантаження сторінки
        addNote(event) {
            this.notes.push({
                id: this.nextId++,
                topic: this.newTopic,
                subject: this.newSubject,
                pages: this.newPages,
                examSoon: false,
                learned: false
            });
            console.log(`Додано конспект «${this.newTopic}» (${this.newSubject}), усього: ${this.notes.length}`);
            this.newSubject = '';
            this.newTopic = '';
            this.newPages = '';
            event.target.reset();
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

                // Прибираємо раніше завантажені конспекти й додаємо нові
                const ownNotes = this.notes.filter(note => !note.fromServer);
                const serverNotes = data.map(post => ({
                    id: `server-${post.id}`,
                    topic: post.title,
                    subject: SERVER_SUBJECT,
                    pages: null,
                    text: post.body,
                    examSoon: false,
                    learned: false,
                    fromServer: true
                }));
                this.notes = [...ownNotes, ...serverNotes];
                console.log(`Завантажено з сервера: ${data.length} конспектів`);
            } catch (error) {
                this.apiError = 'Конспекти тимчасово недоступні. Перевірте з’єднання та натисніть «Оновити».';
                console.error('Помилка завантаження конспектів:', error);
            } finally {
                this.isLoading = false;
            }
        }
    },

    // Після появи застосунку на сторінці одразу завантажуємо конспекти з сервера
    mounted() {
        this.loadData();
    }
});

app.mount('#app');
