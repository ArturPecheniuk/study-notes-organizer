// Практична робота №6. Варіант 16 «Органайзер конспектів»

// Крок 3. Перевірка, що файл підключено до сторінки
console.log('script.js підключено');

// Крок 4. Дані варіанта: масив конспектів
const notes = [
    { subject: 'Вища математика', pages: 12, examSoon: true },
    { subject: 'Вища математика', pages: 8, examSoon: true },
    { subject: 'Програмування', pages: 15, examSoon: false },
    { subject: 'Програмування', pages: 10, examSoon: false },
    { subject: 'Програмування', pages: 6, examSoon: false },
    { subject: 'Фізика', pages: 9, examSoon: true },
    { subject: 'Англійська мова', pages: 5, examSoon: false },
    { subject: 'Історія України', pages: 11, examSoon: false },
    { subject: 'Історія України', pages: 7, examSoon: false }
];

// Список предметів (ті самі 5 предметів, що й на сторінці)
const subjects = ['Вища математика', 'Програмування', 'Фізика', 'Англійська мова', 'Історія України'];

// Скільки днів залишилося до іспитів
const daysUntilExam = 5;

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