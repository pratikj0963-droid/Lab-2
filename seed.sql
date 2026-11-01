CREATE TABLE IF NOT EXISTS book (
    id INTEGER PRIMARY KEY,
    title TEXT,
    author TEXT,
    price INTEGER,
    pages INTEGER
);

INSERT OR IGNORE INTO book VALUES (1, 'Atomic Habits', 'James Clear', 450, 320);
INSERT OR IGNORE INTO book VALUES (2, 'Deep Work', 'Cal Newport', 399, 304);
INSERT OR IGNORE INTO book VALUES (3, 'The Alchemist', 'Paulo Coelho', 299, 208);
INSERT OR IGNORE INTO book VALUES (4, 'Ikigai', 'Hector Garcia', 350, 208);
INSERT OR IGNORE INTO book VALUES (5, 'Clean Code', 'Robert Martin', 650, 464);
INSERT OR IGNORE INTO book VALUES (6, 'The Pragmatic Programmer', 'Andrew Hunt', 799, 352);
INSERT OR IGNORE INTO book VALUES (7, 'Python Crash Course', 'Eric Matthes', 699, 544);
INSERT OR IGNORE INTO book VALUES (8, 'Introduction to Algorithms', 'Thomas Cormen', 999, 1312);
INSERT OR IGNORE INTO book VALUES (9, 'The Psychology of Money', 'Morgan Housel', 399, 256);
INSERT OR IGNORE INTO book VALUES (10, 'Think and Grow Rich', 'Napoleon Hill', 249, 238);
