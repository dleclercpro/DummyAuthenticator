import { Listener, createObserver } from '../Observer';

interface SetEvent<V> {
    prevValue: V | null,
    value: V,
}

interface DeleteEvent<V> {
    prevValue: V | null,
}



export interface IKeyValueDatabase<R> {
    has(id: string): Promise<boolean>;
    get(id: string): Promise<R | null>;
    add(id: string, record: R): Promise<void>;
    remove(id: string): Promise<void>;

    onSet: (listener: Listener<SetEvent<R>>) => void;
    onDelete: (listener: Listener<DeleteEvent<R>>) => void;
}



export class MemoryDatabase<R> implements IKeyValueDatabase<R> {
    protected db = new Map<string, R>();

    protected onSetObserver = createObserver<SetEvent<R>>();
    protected onDeleteObserver = createObserver<DeleteEvent<R>>();

    public async start() {

    }

    public async stop() {
        
    }

    public async has(id: string) {
        return this.db.has(id);
    }

    public async get(id: string) {
        return this.db.get(id) ?? null;
    }

    public async add(id: string, value: R) {
        const prevValue = this.db.get(id) ?? null;

        this.db.set(id, value);

        this.onSetObserver.publish({ prevValue, value });
    }

    public async remove(id: string) {
        const prevValue = this.db.get(id) ?? null;

        if (prevValue) {
            this.db.delete(id);

            this.onDeleteObserver.publish({ prevValue });
        }
    }

    public async size() {
        const values = await this.getAll();

        return values.length;
    }

    public async getAll() {
        return Object.values(this.db);
    }

    public onSet(listener: Listener<SetEvent<R>>) {
        return this.onSetObserver.subscribe(listener);
    }

    public onDelete(listener: Listener<DeleteEvent<R>>) {
        return this.onDeleteObserver.subscribe(listener);
    }
}