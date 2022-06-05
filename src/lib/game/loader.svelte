<script lang="ts">
	import { browser } from '$app/env';
	import { onMount } from 'svelte';
	import type Phaser from 'phaser';
	// import type Phaser from 'phaser';
	import { goto } from '$app/navigation';
	// store
	import user from '$store/auth';
	// components
	import { Game, Camera, Scene, TileSprite } from 'svelte-phaser';
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
	const camStep = 10;
	const GROWTH_MAX = 20;
	const GROWTH_COOF = 11;
	$: totalCubes = 0;
	$: timeout = GROWTH_COOF * 1000 * (totalCubes <= 1 ? 1 : totalCubes);

	const onKeypress = (e: KeyboardEvent) => {
		// if (e.key) console.info(e);
		// console.info("key: ", e.key);
		switch (e.key) {
			case 'w':
				y += camStep;
			case 's':
				y -= camStep;
			case 'a':
				x -= camStep;
			case 'd':
				x += camStep;
			default:
				break;
		}
	};

	const step = () => {
		tilePositionX += 0.1;
	};

	// $: console.info('tilePositionX: ', tilePositionX)

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
					tile.setTint(0x86bfda);
					tile.isoZ += 5;
				});

				tile.on('pointerout', function () {
					tile.clearTint();
					tile.isoZ -= 5;
				});
			}
		}
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

		// 	// Make the camera follow the player.
		const camera = scene.cameras.main;
		// currentCube && camera.startFollow(currentCube);

		cube.on('pointerdown', function () {
			if (currentCube) {
				currentCube = null;
				this.clearTint();
				camera.stopFollow();
			} else {
				currentCube = this;
				this.setTint(0x86bfda);
				camera.startFollow(this);
			}
		});

		// cube.on('pointerout', function () {
		// 	// currentCube = null;
		// 	// this.clearTint();
		// });

		// Set up our controls.
		// scene.cursors = scene.input.keyboard.createCursorKeys();
		const cursorKeys = scene.input.keyboard.createCursorKeys();

		var keys = scene.input.keyboard.addKeys({
			up: 'up',
			down: 'down',
			left: 'left',
			right: 'right',
		});

		// scene.game.input.keyboard.addKeyCapture([
		// 	Phaser.Keyboard.LEFT,
		// 	Phaser.Keyboard.RIGHT,
		// 	Phaser.Keyboard.UP,
		// 	Phaser.Keyboard.DOWN,
		// 	Phaser.Keyboard.SPACEBAR,
		// ]);

		// var space = scene.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		// if (currentCube) {
		// 	space.onDown.add(function () {
		// 		currentCube.body.velocity.z = 300;
		// 	}, scene);

		// }

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
				spawnTiles(scene);
				spawnCubes(scene);
			}}"
			active="{$user.isLoggedIn}"
		>
			<Camera x="{x}" y="{y}" width="{w}" height="{h}" />
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
