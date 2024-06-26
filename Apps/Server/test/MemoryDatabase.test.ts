import MemoryDatabase from '../src/models/databases/MemoryDatabase';

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

    test('set() should add items of various types and ensure they are retrievable', async () => {
        await db.set('stringKey', 'stringValue');
        await db.set('numberKey', 123);
        await db.set('objectKey', { name: 'test' });
    
        const stringItem = await db.get('stringKey');
        const numberItem = await db.get('numberKey');
        const objectItem = await db.get('objectKey');
    
        expect(stringItem).toBe('stringValue');
        expect(numberItem).toBe(123);
        expect(objectItem).toEqual({ name: 'test' });
    });
    

    test('delete() should remove the specified item', async () => {
        await db.set('key', 'value');
        const result1 = await db.has('key');
        expect(result1).toBe(true);

        await db.delete('key');
        const result2 = await db.has('key');
        expect(result2).toBe(false);
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

    test('size() should return the number of items', async () => {
        await db.set('key1', 'value1');
        await db.set('key2', 'value2');
        const size = await db.size();
        expect(size).toBe(2);
    });
});
