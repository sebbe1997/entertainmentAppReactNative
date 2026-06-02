import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Entertainment } from '../types/entertainment';
/*
ALTER TABLE table_name ADD new_column_name column_definition; table_name. The name of the table to modify.

*/
export function useEntertainments() {
    const db = useSQLiteContext();
    const [entertainments, setEntertainments] = useState<Entertainment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadEntertainments();
    }, []);

    // add a limit in the query to avoid loading everything at once
    const loadEntertainments = async () => {
        try {
            setIsLoading(true);
            const result = await db.getAllAsync<Entertainment>('SELECT * FROM entertainments');
            
            if (result.length === 0) {
                console.log('No entertainments found in the database.');
            }
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

    const GetEntertainmentById = async (eid: number) => {

        try {
            const id = parseInt(eid.toString()); // parse eid to ensure it's a number
           const data = await db.getFirstAsync(
                'SELECT * FROM entertainments WHERE id = ?',
                id
            );
            return data as Entertainment; // do more null checks and type checking before returning.
        } catch (error) {
            console.error(`Error fetching entertainment by ID:${eid}`, error);
        }
    };
    

    return { GetEntertainmentById, entertainments, isLoading, error, addEntertainment, refetch: loadEntertainments };
}