# SQLite & React Native Development Guide

## Summary of This Project

This document summarizes the key learnings from implementing SQLite database functionality in a React Native Expo app. It covers common pitfalls, solutions, and best practices.

---

## SQLite in React Native (Expo)

### Installation

```bash
npx expo install expo-sqlite
```

### Configuration (app.json)

```json
{
  "expo": {
    "plugins": [
      [
        "expo-sqlite",
        {
          "enableFTS": true,
          "useSQLCipher": true,
          "android": {
            "enableFTS": false,
            "useSQLCipher": false
          },
          "ios": {
            "customBuildFlags": ["-DSQLITE_ENABLE_DBSTAT_VTAB=1 -DSQLITE_ENABLE_SNAPSHOT=1"]
          }
        }
      ]
    ]
  }
}
```

**Important:** Plugin configuration must be wrapped in square brackets `[plugin, config]`, not as separate items.

---

## Architecture: SQLiteProvider + useSQLiteContext

### The Correct Pattern

Do NOT try to open databases directly in utility functions. Use the provider pattern:

✅ **Correct:**
```tsx
// app/_layout.tsx (Root)
import { SQLiteProvider } from 'expo-sqlite';
import { migrateDbIfNeeded } from './data/migrations';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="app.db" onInit={migrateDbIfNeeded}>
      <Stack>
        {/* Your app structure */}
      </Stack>
    </SQLiteProvider>
  );
}
```

```tsx
// app/data/useFetchData.tsx (Hook)
import { useSQLiteContext } from 'expo-sqlite';

export function useGetData() {
  const db = useSQLiteContext();
  
  const loadData = async () => {
    const result = await db.getAllAsync('SELECT * FROM table');
    return result;
  };
  
  return { loadData };
}
```

❌ **Incorrect (causes directory errors):**
```tsx
// Don't do this in standalone functions
const db = await SQLite.openDatabaseAsync("app.db");
```

**Why?** `SQLiteProvider` handles directory initialization properly. Direct calls corrupt the path on Expo Go.

---

## Common SQLite Issues & Solutions

### Issue 1: "Path points to a file, but must point to a directory"

**Cause:** SQLite directory cache corrupted on device (common with Expo Go)

**Solution:**
1. **Clear Expo Go app data:**
   - Android: Settings → Apps → Expo Go → Storage → Clear Cache
   - iOS: Settings → General → iPhone Storage → Expo Go → Offload App (reinstall)
2. **Restart Expo Go and rebuild:**
   ```bash
   npx expo start
   ```

3. **Alternative (temporary):** Use in-memory database for testing:
   ```tsx
   <SQLiteProvider databaseName=":memory:" onInit={migrateDbIfNeeded}>
   ```

### Issue 2: "Plugin is an unexpected object" in app.json

**Cause:** Incorrect plugin configuration syntax

**Wrong:**
```json
"plugins": [
  "expo-sqlite",
  { "enableFTS": true }
]
```

**Correct:**
```json
"plugins": [
  [
    "expo-sqlite",
    { "enableFTS": true }
  ]
]
```

### Issue 3: "ExpoSQLite.ensureDatabasePathExistsAsync has been rejected"

**Cause:** Using deprecated async function for directory setup

**Solution:** Use `SQLiteProvider` with `onInit` callback instead (it handles this automatically).

---

## TypeScript Issues with SQLite

### Issue 1: "Argument of type 'String' is not assignable to parameter of type 'SQLiteBindValue'"

**Cause:** Using `String` (wrapper object) instead of `string` (primitive)

```tsx
// ❌ Wrong
interface User {
  name: String;    // Wrapper object
  age: Number;     // Wrapper object
}

// ✅ Correct
interface User {
  name: string;    // Primitive
  age: number;     // Primitive
}
```

**All interface properties should use lowercase primitives:**
```tsx
export interface Entertainment {
  id: string           // ✅
  title: string        // ✅
  rating: number       // ✅
  description: string  // ✅ (must be required, not optional)
}
```

### Issue 2: Optional fields causing SQLite binding errors

**Problem:** Optional fields (`field?: string`) become `string | undefined`, which SQLite can't bind.

**Solution:** Either make required or provide defaults:

```tsx
// ❌ Causes errors
interface Data {
  name: string;
  description?: string;  // undefined not allowed in SQL
}

// ✅ Make required
interface Data {
  name: string;
  description: string;   // Always has a value
}

// ✅ Or provide default when inserting
await db.runAsync(
  'INSERT INTO data (name, description) VALUES (?, ?)',
  item.name,
  item.description || 'No description'
);
```

### Issue 3: Parameter binding with variadic arguments

**Correct syntax for `runAsync`:**
```tsx
// ✅ Variadic arguments (separate args)
await db.runAsync(
  'INSERT INTO users (name, age) VALUES (?, ?)',
  'John',
  30
);

// ❌ Array syntax (doesn't work with runAsync)
await db.runAsync(
  'INSERT INTO users (name, age) VALUES (?, ?)',
  ['John', 30]  // Wrong!
);

// ✅ Array works with prepareAsync + executeAsync
const stmt = await db.prepareAsync('INSERT INTO users (name, age) VALUES (?, ?)');
await stmt.executeAsync(['John', 30]);
```

---

## Database Migrations Pattern

Create a `migrations.ts` file at the root of your data folder:

```typescript
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
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL
      );
    `);

    currentDbVersion = 1;
  }

  // Add more migrations here as DATABASE_VERSION increases

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
```

**Key points:**
- WAL (Write-Ahead Logging) improves performance
- Use `user_version` to track schema version
- Call this in `SQLiteProvider`'s `onInit` prop

---

## Best Practices: Database Hooks

Create reusable hooks that encapsulate database logic:

```typescript
export function useGetEntertainments() {
  const db = useSQLiteContext();
  const [entertainments, setEntertainments] = useState<Entertainment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEntertainments();
  }, []);

  const loadEntertainments = async () => {
    try {
      setIsLoading(true);
      const result = await db.getAllAsync<Entertainment>('SELECT * FROM entertainments');
      setEntertainments(result || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addEntertainment = async (item: Omit<Entertainment, 'id'>) => {
    try {
      await db.runAsync(
        'INSERT INTO entertainments (Title, description, rating) VALUES (?, ?, ?)',
        item.Title,
        item.description,
        item.rating
      );
      await loadEntertainments(); // Refresh
    } catch (err) {
      console.error('Error adding:', err);
      throw err;
    }
  };

  return { entertainments, isLoading, error, addEntertainment, refetch: loadEntertainments };
}
```

**Benefits:**
- Loading states included
- Error handling built-in
- Separation of concerns
- Reusable across components

---

## React Native Development Tips

### 1. Component State Management

Use `useState` for local state, custom hooks for shared logic:

```tsx
// ❌ Avoid prop drilling
function Parent() {
  const [data, setData] = useState([]);
  return <Child data={data} setData={setData} />;
}

// ✅ Use custom hooks instead
function useMyData() {
  const [data, setData] = useState([]);
  return { data, setData };
}

function Parent() {
  const { data } = useMyData();
  return <Child />;
}

function Child() {
  const { data } = useMyData(); // Same hook instance!
}
```

### 2. useEffect Dependencies

Always include all external variables in dependency array:

```tsx
// ✅ Correct
useEffect(() => {
  loadData(id);
}, [id]); // Re-runs when id changes

// ❌ Bug: Infinite loop
useEffect(() => {
  loadData(id); // Uses id but doesn't list it
}, []);

// ❌ Bug: Stale closure
useEffect(() => {
  const timer = setTimeout(() => console.log(count), 1000);
  return () => clearTimeout(timer);
}, []); // count is always 0!
```

### 3. Navigation with Parameters

Expo Router makes navigation clean:

```tsx
import { useRouter } from 'expo-router';

function List() {
  const router = useRouter();
  
  return (
    <Pressable onPress={() => router.navigate({
      pathname: '/details',
      params: { id: item.id.toString() }
    })}>
      <Text>{item.name}</Text>
    </Pressable>
  );
}

// In details.tsx
import { useLocalSearchParams } from 'expo-router';

export default function Details() {
  const { id } = useLocalSearchParams();
  return <Text>Item ID: {id}</Text>;
}
```

### 4. Styling Performance

Use `StyleSheet.create()` at module level for optimization:

```tsx
// ✅ Efficient
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  text: { fontSize: 16, color: '#000' }
});

function MyComponent() {
  return <View style={styles.container}>...</View>;
}

// ❌ Recreates on every render (slower)
function MyComponent() {
  return <View style={{ flex: 1, padding: 16 }}>...</View>;
}
```

### 5. FlatList vs ScrollView

```tsx
// ❌ Bad for large lists (renders all items)
<ScrollView>
  {items.map(item => <Item key={item.id} item={item} />)}
</ScrollView>

// ✅ Good for large lists (virtual scrolling)
<FlatList
  data={items}
  renderItem={({ item }) => <Item item={item} />}
  keyExtractor={item => item.id}
/>
```

---

## TypeScript Tips for React Native

### 1. Type Your Props

```tsx
interface ItemProps {
  id: string;
  title: string;
  onPress: (id: string) => void;
}

function Item({ id, title, onPress }: ItemProps) {
  return (
    <Pressable onPress={() => onPress(id)}>
      <Text>{title}</Text>
    </Pressable>
  );
}
```

### 2. Type Async Functions

```tsx
// ✅ Explicit return types
async function fetchData(): Promise<User[]> {
  const result = await db.getAllAsync<User>('SELECT * FROM users');
  return result || [];
}

// ❌ Implicit (less clear)
async function fetchData() {
  return await db.getAllAsync('SELECT * FROM users');
}
```

### 3. Type React Hooks

```tsx
import { useState, useCallback } from 'react';

// ✅ Explicit types
const [items, setItems] = useState<Item[]>([]);
const [loading, setLoading] = useState<boolean>(false);

// ❌ Let TypeScript infer (might infer wrong types)
const [items, setItems] = useState([]); // type: never[]
```

---

## Debugging Tips

### 1. Console Logging

```tsx
// SQLite queries
console.log('Query result:', result);

// State changes
console.log('State updated:', { items, loading, error });

// Navigation
console.log('Navigating to:', { pathname, params });
```

### 2. Expo CLI Tips

```bash
# Start with verbose logging
npx expo start --verbose

# Clear cache and rebuild
npx expo start -c

# Test on specific platform
npx expo start --ios
npx expo start --android
```

### 3. Check Device Logs

```bash
# Android
adb logcat | grep "ExpoGo\|ReactNative"

# iOS (in Xcode)
# Use Debug Area at bottom of Xcode
```

---

## Common Gotchas

### 1. Forgetting await on async operations
```tsx
// ❌ Bug: doesn't wait for database
loadData();
useData(); // data might not be loaded yet!

// ✅ Correct: use useEffect
useEffect(() => {
  loadData();
}, []);
```

### 2. Mutating state directly
```tsx
// ❌ React won't detect changes
items[0].name = 'New Name';
setItems(items);

// ✅ Create new array
setItems([
  { ...items[0], name: 'New Name' },
  ...items.slice(1)
]);
```

### 3. SQL injection vulnerabilities
```tsx
// ❌ Never concatenate user input
await db.runAsync(`SELECT * FROM users WHERE id = ${userId}`);

// ✅ Always use parameter binding
await db.runAsync('SELECT * FROM users WHERE id = ?', userId);
```

---

## Resources

- [Expo SQLite Documentation](https://docs.expo.dev/versions/latest/sdk/sqlite)
- [React Native Docs](https://reactnative.dev/)
- [Expo Router Navigation](https://docs.expo.dev/routing/introduction)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## Checklist for SQLite Setup

- [ ] Install `expo-sqlite` with `npx expo install expo-sqlite`
- [ ] Add plugin to `app.json` with correct syntax (wrapped in square brackets)
- [ ] Create `SQLiteProvider` in root layout (`_layout.tsx`)
- [ ] Create `migrations.ts` file with `migrateDbIfNeeded` function
- [ ] Create custom hooks using `useSQLiteContext()`
- [ ] Use lowercase `string`, `number` types in interfaces
- [ ] Make required fields non-optional to avoid SQLite binding errors
- [ ] Use parameter binding (`?`) for all user input
- [ ] Test in components wrapped by `SQLiteProvider`
- [ ] Handle loading and error states in UI
- [ ] Clear device cache if path errors occur

---

## Quick Reference: Common Queries

```typescript
// Create table
await db.execAsync(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Insert
await db.runAsync(
  'INSERT INTO items (name) VALUES (?)',
  'Item name'
);

// Select all
const items = await db.getAllAsync('SELECT * FROM items');

// Select one
const item = await db.getFirstAsync('SELECT * FROM items WHERE id = ?', itemId);

// Update
await db.runAsync(
  'UPDATE items SET name = ? WHERE id = ?',
  'New name',
  itemId
);

// Delete
await db.runAsync('DELETE FROM items WHERE id = ?', itemId);

// Count
const result = await db.getFirstAsync<{ count: number }>(
  'SELECT COUNT(*) as count FROM items'
);
```

---

**Last Updated:** January 24, 2026
