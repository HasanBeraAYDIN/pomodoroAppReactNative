import * as SQLite from 'expo-sqlite';

// Modern yöntemde veritabanı senkron olarak açılır
const db = SQLite.openDatabaseSync('pomodoroApp.db');

export const initDB = () => {
    try {
        // Tablo oluşturma işlemi (execSync kullanılır)
        db.execSync(
            `CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_name TEXT NOT NULL,
        duration INTEGER NOT NULL,
        date TEXT NOT NULL,
        distractionCount INTEGER 
      );`
        );
        console.log("Database initialized successfully.");
    } catch (error) {
        console.error("Database initialization error:", error);
    }
};

export const addSession = async (categoryName, duration, distractionCount) => {
    try {
        const date = new Date().toISOString();
        // Veri ekleme işlemi (runAsync kullanılır)
        const result = await db.runAsync(
            'INSERT INTO sessions (category_name, duration, date, distractionCount) VALUES (?, ?, ?, ?)',
            [categoryName, duration, date, distractionCount]
        );
        console.log('Session added, ID:', result.lastInsertRowId);
    } catch (error) {
        console.error('Session add error', error);
    }
};

// Callback desteği ile verileri çekme
export const getSessions = async (callback) => {
    try {
        // Tüm verileri çekme işlemi (getAllAsync kullanılır)
        const allRows = await db.getAllAsync('SELECT * FROM sessions ORDER BY id DESC');

        // Eğer bir callback fonksiyonu gönderildiyse veriyi ona yolla
        if (callback) {
            callback(allRows);
        }
        return allRows;
    } catch (error) {
        console.error('Getting Session Failed', error);
    }
};

export const resetDB = async () => {
    try {
        await db.execAsync('DROP TABLE IF EXISTS sessions');
        console.log('💥 Tablo tamamen silindi.');
        initDB(); // Tabloyu tekrar oluştur
    } catch (error) {
        console.error('❌ Sıfırlama hatası:', error);
    }
};