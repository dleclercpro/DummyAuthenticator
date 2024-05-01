import RedisDatabase from '../src/models/databases/RedisDatabase';
import { DatabaseOptions } from '../src/models/databases/Database';

const OPTIONS: DatabaseOptions = {
    host: 'localhost',
    port: 6379,
    name: 'auth-test'
};



describe('RedisDatabase', () => {
    const db: RedisDatabase = new RedisDatabase(OPTIONS);

    beforeAll(async () => {
        await db.start();
    });

    afterAll(async () => {
        await db.stop();
    });

    // Clean up test database after each test
    afterEach(async () => {
        await db.deleteAll();
    });

    test('has() should return false when the key does not exist', async () => {
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
        expect(items.sort()).toEqual(['value1', 'value2'].sort());
    });

    test('deleteAll() should clear all items', async () => {
        await db.set('key1', 'value1');
        await db.set('key2', 'value2');
        await db.deleteAll();
        const size = await db.getAll();
        expect(size).toEqual([]);
    });
});
