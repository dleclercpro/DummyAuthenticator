// Listener: a function that takes an event and does something with it
export type Listener<Event> = (event: Event) => void;

// Observer: encapsulated space in which a list of subscribers exists,
// to/from which listeners can be added/removed
export interface Observer<Event> {
    subscribe: (listener: Listener<Event>) => () => void,
    publish: (event: Event) => void,
}

export const createObserver = <Event> (): Observer<Event> => {
    let listeners: Listener<Event>[] = [];

    // Remove given listener from list
    const unsubscribe = (listener: Listener<Event>) => {
        listeners = listeners.filter(l => l !== listener);
    };

    // Add new listener to list
    const subscribe = (listener: Listener<Event>) => {
        listeners.push(listener);

        // Return function to remove subscriber that was just added
        return () => unsubscribe(listener);
    };

    // Notify all listeners of event
    const publish = (event: Event) => {
        listeners.forEach(l => l(event));
    };

    return { subscribe, publish };
}