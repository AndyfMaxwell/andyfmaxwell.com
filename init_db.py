import sqlite3

conn = sqlite3.connect('database.db')
c = conn.cursor()

c.execute(
    '''
    CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        image TEXT,
        published_at INT DEFAULT CURRENT_TIMESTAMP
        );
    '''
)
c.execute(
    '''
    CREATE TABLE IF NOT EXISTS subscribers (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL
        );
    '''
)