const express = require('express');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

let db;

// Validate book IDs
function getBookId(value) {
    const id = Number(value);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
}

// Validate book information
function validBook(book) {
    return book &&
        typeof book.title === 'string' &&
        book.title.trim().length > 0 &&
        typeof book.author === 'string' &&
        book.author.trim().length > 0 &&
        Number.isInteger(book.price) &&
        book.price >= 0 &&
        Number.isInteger(book.pages) &&
        book.pages > 0;
}

// Home route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to BDF Lab 2',
        student: 'Pratik Jadhav',
        rollNumber: '252U1R5055',
        section: 'S-10',
        project: 'SQLite Book Management CRUD API'
    });
});

// GET all books
app.get('/books/', async (req, res) => {
    const books = await db.all('SELECT * FROM book');
    res.status(200).json(books);
});

// GET one book
app.get('/books/:bookId/', async (req, res) => {
    const id = getBookId(req.params.bookId);

    if (!id) {
        return res.status(400).json({
            error: 'Invalid book ID'
        });
    }

    const book = await db.get(
        'SELECT * FROM book WHERE id = ?',
        [id]
    );

    if (!book) {
        return res.status(404).json({
            error: 'Book not found'
        });
    }

    res.status(200).json(book);
});

// POST add new book
app.post('/books/', async (req, res) => {
    if (!validBook(req.body)) {
        return res.status(400).json({
            error: 'Invalid book details'
        });
    }

    const { title, author, price, pages } = req.body;

    const result = await db.run(
        'INSERT INTO book (title, author, price, pages) VALUES (?, ?, ?, ?)',
        [title.trim(), author.trim(), price, pages]
    );

    const book = await db.get(
        'SELECT * FROM book WHERE id = ?',
        [result.lastID]
    );

    res.status(201).json(book);
});

// PUT update existing book
app.put('/books/:bookId/', async (req, res) => {
    const id = getBookId(req.params.bookId);

    if (!id) {
        return res.status(400).json({
            error: 'Invalid book ID'
        });
    }

    if (!validBook(req.body)) {
        return res.status(400).json({
            error: 'Invalid book details'
        });
    }

    const { title, author, price, pages } = req.body;

    const result = await db.run(
        'UPDATE book SET title = ?, author = ?, price = ?, pages = ? WHERE id = ?',
        [title.trim(), author.trim(), price, pages, id]
    );

    if (result.changes === 0) {
        return res.status(404).json({
            error: 'Book not found'
        });
    }

    const updatedBook = await db.get(
        'SELECT * FROM book WHERE id = ?',
        [id]
    );

    res.status(200).json(updatedBook);
});

// DELETE existing book
app.delete('/books/:bookId/', async (req, res) => {
    const id = getBookId(req.params.bookId);

    if (!id) {
        return res.status(400).json({
            error: 'Invalid book ID'
        });
    }

    const result = await db.run(
        'DELETE FROM book WHERE id = ?',
        [id]
    );

    if (result.changes === 0) {
        return res.status(404).json({
            error: 'Book not found'
        });
    }

    res.status(200).json({
        message: 'Book deleted successfully'
    });
});

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found'
    });
});

// Handle server errors
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        error: 'Internal server error'
    });
});

// Initialize SQLite and start server
async function initializeDBAndServer() {
    try {
        db = await open({
            filename: path.join(__dirname, 'books.db'),
            driver: sqlite3.Database
        });

        await db.exec(`
            CREATE TABLE IF NOT EXISTS book (
                id INTEGER PRIMARY KEY,
                title TEXT,
                author TEXT,
                price INTEGER,
                pages INTEGER
            )
        `);

        app.listen(PORT, '0.0.0.0', () => {
            console.log('BDF Lab 2 running on port ' + PORT);
            console.log('SQLite database connected successfully');
        });

    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
}

initializeDBAndServer();
