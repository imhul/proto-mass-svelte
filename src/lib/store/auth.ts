import { writable } from 'svelte/store';

const initState = {
	userId: '',
	userAva: '',
	userEmail: '',
	isLoggedIn: true,
	userSave: {},
	userPrefs: {},
};

const user = writable(initState);

export default user;
