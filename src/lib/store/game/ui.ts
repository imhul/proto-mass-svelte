import { writable } from 'svelte/store';
import type { InitialGameState } from '$types/ui';

const initState: InitialGameState = {
	loadingPercent: 0,
	isGameInit: false,
	isGameLoaded: false,
	isGameStarted: false,
	isGamePaused: false,
	isGameOver: false,
	isGameMenuOpen: false,
	isGameWin: false,
};

export const gameUI = writable<InitialGameState>(initState);
