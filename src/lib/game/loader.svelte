<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	// store
	import user from '$store/auth';
	// components
	import { Game, Camera, Scene, Tilemap, TileLayer, TileSprite } from 'svelte-phaser';
	import { IsoPlugin, IsoPhysics } from '$lib/iso';
	// assets
	import { getMap } from '$utils/getMap';
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

	$: !$user.isLoggedIn && goto('/');

	$: h = 600;
	$: w = 800;
	$: x = 0;
	$: y = 0;

	let game: Phaser.Game | undefined;
	let sceneInst: Phaser.Scene | undefined;
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
		// console.info('step');
		// if (sceneInst) {
		// 	sceneInst.isoPhysics.world.collide(sceneInst.isoGroup);
		// }
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
		let tile;
		let i = 0;

		for (var xx = 0; xx < 780; xx += 26) {

			for (var yy = 0; yy < 780; yy += 26) {	
				i++;

				// console.info('type: ', getMap[i][j]);
				tile = scene.add.isoSprite(xx, yy, 0, 'tile-' + getMap.flat(Infinity)[i], scene.isoGroup);
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

	const createCube = (scene: Phaser.Scene) => {
		console.info('createCube: ', createCube);
		totalCubes += 1;
		let cube;

		// Add a cube which is way above the ground
		cube = scene.add.isoSprite(256, 256, 600, 'cube', scene.isoGroup);
		// cube.isoZ += 10;
		// Enable the physics body on this cube
		scene.isoPhysics.world.enable(cube);

		// Collide with the world bounds so it doesn't go falling forever or fly off the screen!
		cube.body.collideWorldBounds = true;

		// Add a full bounce on the x and y axes, and a bit on the z axis.
		cube.body.bounce.set(1, 1, 0.2);

		// Send the cubes off in random x and y directions! Wheee!
		const randomX = Math.trunc(Math.random() * 100 - 50);
		const randomY = Math.trunc(Math.random() * 100 - 50);
		cube.body.velocity.setTo(randomX, randomY, 0);
		cube.setInteractive();

		cube.on('pointerover', function () {
			this.setTint(0x86bfda);
		});

		cube.on('pointerout', function () {
			this.clearTint();
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

<Game bind:instance="{game}" width="{w}" height="{h}" backgroundColor="#000">
	{#if game}
		<Scene
			bind:instance="{sceneInst}"
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

				// Apply some gravity on our cubes
				scene.isoPhysics.world.gravity.setTo(0, 0, -500);
				scene.isoPhysics.projector.origin.setTo(0.5, 0);

				// Add some first cubes to our scene
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
