// Практична робота №6. Варіант 16 «Органайзер конспектів»

// Крок 3. Перевірка, що файл підключено до сторінки
console.log('script.js підключено');

// Практикум 7, крок 2. Видаляємо статичні картки-заглушки з практикуму 2
// (у HTML вони лишаються як орієнтир структури, а на сторінці їх замінять картки з масиву)
const placeholders = document.querySelectorAll('.note-card');
placeholders.forEach(placeholder => placeholder.remove());

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

// Практикум 7, крок 3. Контейнер, всередині якого з'являться картки конспектів
const listContainer = document.querySelector('#notes-list');

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


// ===== Практикум 7. Маніпуляція DOM =====

// Крок 4. Функція рендеру: проходить масив конспектів циклом for...of,
// для кожного конспекту створює картку article і додає її всередину
// контейнера #notes-list — у сітку відповідного предмета
function renderNotes(notesList) {
    for (const note of notesList) {
        // Крок 5. Створюємо картку та вкладені елементи h3 (тема) і p (предмет)
        const card = document.createElement('article');
        card.classList.add('note-card');

        const title = document.createElement('h3');
        title.textContent = note.topic;

        const subject = document.createElement('p');
        subject.textContent = note.subject;

        card.append(title, subject);

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
const notesCount = document.querySelector('#notes-count');
notesCount.textContent = `Усього конспектів: ${notes.length}`;
