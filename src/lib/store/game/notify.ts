import { writable } from 'svelte/store';
import type { Message } from '$types/ui';

const initState: Message[] = [];

function createMessages() {
    const { subscribe, set, update } = writable<Message[]>(initState);

    return {
        subscribe,
        set,
        update,
        fixation: (id: string) =>
            update((boards: Message[]) => {
                const current = boards.filter((board: Message) => board.id === id)[0];
                const filtered = boards.filter((board: Message) => board.id !== id);
                current.fixed = !current.fixed;
                return [...filtered, current];
            }),
        add: (board: Message) =>
            update((boards: Message[]) => {
                boards.push(board);
                return boards;
            }),
        reset: () => set(initState),
        delete: (id: string, type: string) =>
            update((boards: Message[]) => {
                const toTrash = () => {
                    const current = boards.find((board) => board.id === id);
                    const filtered = boards.filter((board) => board.parent !== current.parent);
                    return filtered;
                };

                const toArchive = () => {
                    boards.forEach((board: Message) => {
                        if (board.id === id) board.archived = true;
                    });
                    return boards;
                };

                return type === 'archive' ? toArchive() : toTrash();
            })
    };
}

export const messages = createMessages();
