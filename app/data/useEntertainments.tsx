import { useSQLiteContext } from 'expo-sqlite';
import { Entertainment } from '../types/entertainment';
import { useState, useEffect } from 'react';

export function useEntertainments() {
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
            setError(err instanceof Error ? err.message : 'Failed to load entertainments');
            console.error('Error loading entertainments:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const addEntertainment = async (entertainment: Omit<Entertainment, 'id'>) => {
        try {
            await db.runAsync(
                'INSERT INTO entertainments (Title, description, rating) VALUES (?, ?, ?)',
                entertainment.Title,
                entertainment.description,
                entertainment.rating
            );
            await loadEntertainments();
        } catch (err) {
            console.error('Error adding entertainment:', err);
            throw err;
        }
    };

    return { entertainments, isLoading, error, addEntertainment, refetch: loadEntertainments };
}