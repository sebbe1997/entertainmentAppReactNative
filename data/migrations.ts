import { SQLiteDatabase } from 'expo-sqlite';

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  
  const versionResult = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  );
  let currentDbVersion = versionResult?.user_version ?? 0;

  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  if (currentDbVersion === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE IF NOT EXISTS entertainments (
        id INTEGER PRIMARY KEY NOT NULL,
        Title TEXT NOT NULL,
        description TEXT NOT NULL,
        rating INTEGER NOT NULL
      );
    `);

    // Insert sample data
    await db.runAsync(
      'INSERT INTO entertainments (Title, description, rating) VALUES (?, ?, ?)',
      'test 1',
      'test desc',
      4
    );
    await db.runAsync(
      'INSERT INTO entertainments (Title, description, rating) VALUES (?, ?, ?)',
      'test 2',
      'test 2 desc',
      5
    );

    currentDbVersion = 1;
  }
  console.log(`Migrated database from version ${currentDbVersion} to ${DATABASE_VERSION}`);
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
