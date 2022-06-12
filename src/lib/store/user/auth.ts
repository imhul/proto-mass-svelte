import { writable } from 'svelte/store';

export interface Auth {
		userId: string;
		userAva: string;
		userEmail: string;
		isLoggedIn: boolean;
		userSave: {
			id: string;
			colony: {
				id: string;
				name: string;
				level: number;
			};
			objects: unknown[];
			map: unknown[];
			units: unknown[];
			taskList: unknown[];
		};
		settings: {
			volume: number;
			isFullscreen: boolean;
			complexity: 'easy' | 'normal' | 'hard';
			theme: 'dark' | 'light' | 'oldschool';
			zoom: number;
			gameHours: number;
		};
}

const initState: Auth = {
	userId: '',
	userAva: '',
	userEmail: '',
	isLoggedIn: true,
	userSave: {
        id: '',
        colony: {
            id: '',
            name: 'Autopia',
            level: 0,
        },
        objects: [],
        map: [],
        units: [],
        taskList: [],
    },
	settings: {
        volume: 0.5,
        isFullscreen: false,
        complexity: 'normal', // easy, normal, hard
        theme: 'dark', // dark, light, oldschool
        zoom: 100,
        gameHours: 0,
    },
};

const user = writable<Auth>(initState);

export default user;
