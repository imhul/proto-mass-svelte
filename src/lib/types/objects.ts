export interface ICube {
	body: {
		collideWorldBounds: boolean;
		bounce: {
			set: (arg0: number, arg1: number, arg2: number) => void;
		};
		velocity: {
			setTo: (arg0: number, arg1: number, arg2: number) => void;
			z: number;
		};
	};
	setInteractive: () => void;
	on: (
		arg0: string,
		arg1: {
			(): void;
			(): void;
		},
	) => void;
}
