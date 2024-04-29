import { MemoryDatabase } from '../src/models/databases/MemoryDatabase';

describe('MemoryDatabase', () => {
    let db: MemoryDatabase<any>;

    beforeEach(() => {
        db = new MemoryDatabase<any>();
    });

    test('has() should return false when the item does not exist', async () => {
        const result = await db.has('nonexistent');
        expect(result).toBe(false);
    });

    test('set() should add an item, and has() should find it', async () => {
        await db.set('key', 'value');
        const result = await db.has('key');
        expect(result).toBe(true);
    });

    test('get() should retrieve the correct item', async () => {
        await db.set('key', 'value');
        const item = await db.get('key');
        expect(item).toBe('value');
    });

    test('delete() should remove the specified item', async () => {
        await db.set('key', 'value');
        await db.delete('key');
        const result = await db.has('key');
        expect(result).toBe(false);
    });

    test('get() should return null when the item does not exist', async () => {
        const item = await db.get('nonexistent');
        expect(item).toBeNull();
    });

    test('getAll() should return all items', async () => {
        await db.set('key1', 'value1');
        await db.set('key2', 'value2');
        const items = await db.getAll();
        expect(items).toEqual(['value1', 'value2']);
    });

    test('size() should return the number of items', async () => {
        await db.set('key1', 'value1');
        await db.set('key2', 'value2');
        const size = await db.size();
        expect(size).toBe(2);
    });
});
