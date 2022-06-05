<script lang="ts">
	import { browser } from '$app/env';
	import { onMount } from 'svelte';
	import Phaser from 'phaser';
	import { goto } from '$app/navigation';
	// store
	import user from '$store/auth';
	// components
	import { Game, Scene, TileSprite } from 'svelte-phaser';
	import { IsoPlugin, IsoPhysics } from '$lib/iso';
	// utils
	import { getMap } from '$utils/getMap';
	// assets
	import CubeSprite from '$assets/sprites/cube/isometric_pixel_0123.png';
	import Tile0 from '$assets/sprites/cube/isometric_pixel_0054.png';
	import Tile1 from '$assets/sprites/cube/isometric_pixel_0207.png';
	import Tile2 from '$assets/sprites/cube/isometric_pixel_0208.png';
	import Tile3 from '$assets/sprites/cube/isometric_pixel_0209.png';
	import Tile4 from '$assets/sprites/cube/isometric_pixel_0210.png';
	import Tile5 from '$assets/sprites/cube/isometric_pixel_0211.png';
	import Tile6 from '$assets/sprites/cube/isometric_pixel_0212.png';
	import Tile7 from '$assets/sprites/cube/isometric_pixel_0063.png';
	import Tile8 from '$assets/sprites/cube/isometric_pixel_0063.png';

	interface ICube {
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

	$: !$user.isLoggedIn && goto('/');

	$: h = 600;
	$: w = 800;
	$: x = 0;
	$: y = 0;

	let game: Phaser.Game | undefined;
	let tilePositionX = 0;
	const GROWTH_MAX = 20;
	const GROWTH_COOF = 11;
	$: totalCubes = 0;
	$: timeout = GROWTH_COOF * 1000 * (totalCubes <= 1 ? 1 : totalCubes);

	const onKeypress = (e: KeyboardEvent) => {
		console.info('key: ', e.key);
	};

	const step = () => {
		tilePositionX += 0.1;
	};

	onMount(() => {
		if (!game) return;
		game.events.on('step', step);

		return () => {
			if (!game) return;
			game.events.off('step', step);
		};
	});

	const spawnTiles = (scene: Phaser.Scene) => {
		let tile: any;
		let i = 0;

		for (var xx = 0; xx < 780; xx += 26) {
			for (var yy = 0; yy < 780; yy += 26) {
				i++;

				// console.info('type: ', getMap[i][j]);
				tile = scene.add.isoSprite(
					xx,
					yy,
					0,
					'tile-' + getMap.flat(Infinity)[i],
					scene.isoGroup,
				);
				tile.isoZ -= 30;
				tile.setInteractive();

				tile.on('pointerover', function () {
					this.setTint(0x86bfda);
					this.isoZ += 5;
				});

				tile.on('pointerout', function () {
					this.clearTint();
					this.isoZ -= 5;
				});
			}
		}
	};

	const cameraControls = (scene: Phaser.Scene) => {
		const camera = scene.cameras.main;
		const cursors = scene.input.keyboard.createCursorKeys();
		const controls = new Phaser.Cameras.Controls.SmoothedKeyControl({
			camera: camera,
			left: cursors.left,
			right: cursors.right,
			up: cursors.up,
			down: cursors.down,
			zoomIn: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
			zoomOut: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
			zoomSpeed: 0.02,
			acceleration: 0.06,
			drag: 0.0005,
			maxSpeed: 1.0,
		});

		controls.start();

		camera.setBounds(0, 0, 1024, 1024);
		camera.setZoom(1.2);

		scene.update = function (time, delta) {
			controls.update(delta);
		};
	};

	const createCube = (scene: Phaser.Scene) => {
		console.info('createCube run!');
		totalCubes += 1;
		let cube: ICube;
		let currentCube: ICube | null;

		// Add a cube which is way above the ground
		cube = scene.add.isoSprite(780, 780, 600, 'cube', scene.isoGroup);
		// Enable the physics body on this cube
		scene.isoPhysics.world.enable(cube);

		// Collide with the world bounds so it doesn't go falling forever or fly off the screen!
		cube.body.collideWorldBounds = true;

		// Add a full bounce on the x and y axes, and a bit on the z axis.
		cube.body.bounce.set(1, 1, 0.2);

		// Send the cubes off in random x and y directions! Wheee!
		const randomX = Math.trunc(Math.random() * 400 - 50);
		const randomY = Math.trunc(Math.random() * 400 - 50);
		cube.body.velocity.setTo(randomX, randomY, 0);
		cube.setInteractive();

		// Make the camera follow the player.
		const camera = scene.cameras.main;

		cube.on('pointerdown', function () {
			if (currentCube) {
				currentCube = null;
				this.clearTint();
				camera.stopFollow(); // Make the camera stop follow the player.
			} else {
				currentCube = this;
				this.setTint(0x86bfda);
				camera.startFollow(this); // Make the camera follow the player.
			}
		});

		spawnCubes(scene);
	};

	const spawnCubes = (scene: Phaser.Scene) => {
		const timer = setTimeout(() => {
			createCube(scene);
			totalCubes === GROWTH_MAX && clearTimeout(timer);
		}, timeout);
	};
</script>

<svelte:window bind:innerHeight="{h}" bind:innerWidth="{w}" on:keypress="{onKeypress}" />

<!-- {#if browser} -->
<Game bind:instance="{game}" width="{w}" height="{h}" backgroundColor="#000">
	{#if game}
		<Scene
			key="main"
			mapAdd="{{ isoPlugin: 'iso', isoPhysics: 'isoPhysics' }}"
			physics="{{ default: 'arcade' }}"
			preload="{(scene) => {
				scene.load.image('tile-0', Tile0);
				scene.load.image('tile-1', Tile1);
				scene.load.image('tile-2', Tile2);
				scene.load.image('tile-3', Tile3);
				scene.load.image('tile-4', Tile4);
				scene.load.image('tile-5', Tile5);
				scene.load.image('tile-6', Tile6);
				scene.load.image('tile-7', Tile7);
				scene.load.image('tile-8', Tile8);
				scene.load.image('cube', CubeSprite);
				scene.load.image('stars1', '/images/parallax_1.png');
				scene.load.scenePlugin({
					key: 'IsoPlugin',
					url: IsoPlugin,
					sceneKey: 'iso',
				});
				scene.load.scenePlugin({
					key: 'IsoPhysics',
					url: IsoPhysics,
					sceneKey: 'isoPhysics',
				});
			}}"
			create="{(scene) => {
				scene.isoGroup = scene.add.group();

				// Apply some gravity on cubes
				scene.isoPhysics.world.gravity.setTo(0, 0, -500);
				scene.isoPhysics.projector.origin.setTo(0.5, 0);

				// Add first cube to scene
				cameraControls(scene);
				spawnTiles(scene);
				spawnCubes(scene);
			}}"
			active="{$user.isLoggedIn}"
		>
			<TileSprite
				x="{0}"
				y="{0}"
				width="{w}"
				height="{h}"
				originX="{0}"
				originY="{0}"
				texture="stars1"
				tilePositionX="{tilePositionX}"
			/>
		</Scene>
	{/if}
</Game>
<!-- {/if} -->
