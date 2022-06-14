export interface ButtonUIAction {
	id: string;
	title: string;
	url?: string;
	callback?: () => void;
}

export interface Message {
	id: string;
	type?: 'default' | 'danger' | 'success' | 'warn' | 'info';
	title?: string;
	message?: string;
	actions?: ButtonUIAction[];
	expiring?: boolean;
	aside: 'left' | 'right';
	archived?: boolean;
	fixed?: boolean;
}

export interface InitialGameState {
	loadingPercent: number;
	isGameInit: boolean;
	isGameLoaded: boolean;
	isGameStarted: boolean;
	isGamePaused: boolean;
	isGameOver: boolean;
	isGameMenuOpen: boolean;
	isGameWin: boolean;
}
