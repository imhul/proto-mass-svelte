import { writable } from 'svelte/store';
import type { Message } from '$types/ui';

export const messages = writable<Message[]>([]);
