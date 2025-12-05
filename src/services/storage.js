const STORAGE_KEY = 'anxiety-tracker-events';

export const storageService = {
    getEvents: () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Failed to parse events', e);
            return [];
        }
    },

    logEvent: (type) => {
        // type: 'emotional' | 'background'
        const events = storageService.getEvents();
        const newEvent = {
            id: crypto.randomUUID(),
            type,
            timestamp: new Date().toISOString(),
        };
        const updatedEvents = [...events, newEvent];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents));
        return newEvent;
    },

    clearEvents: () => {
        localStorage.removeItem(STORAGE_KEY);
    }
};
