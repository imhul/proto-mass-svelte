<script lang="ts">
	import { onMount } from 'svelte';
	import Phaser from 'phaser';
	import { goto } from '$app/navigation';
	// types
	import type { ICube } from '$lib/types/objects';
	// store
	import user from '$store/auth';
	// components
	import { Scene, Container, TileSprite } from 'svelte-phaser';
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

	export let game: Phaser.Game;
	export let h = 0;
	export let w = 0;

	$: !$user.isLoggedIn && goto('/');
	let tile1PositionX = 0;
	let tile2PositionX = 0;
	let tile3PositionX = 0;
	const MIN_WIDTH_FOR_ZOOM = 1500;
	const GROWTH_MAX = 20;
	const GROWTH_COOF = 11;
	$: totalCubes = 0;
	$: timeout = GROWTH_COOF * 1000 * (totalCubes <= 1 ? 1 : totalCubes);

	const step = () => {
		tile1PositionX += 0.1;
		tile2PositionX += 0.15;
		tile3PositionX += 0.2;
	};

	onMount(() => {
		if (!game) return;
		game.events.on('step', step);

		return () => {
			if (!game) return;
			game.events.off('step', step);
		};
	});

	const cameraControls = (scene: Phaser.Scene) => {
		const camera = scene.cameras.main;
		// const cursors = scene.input.keyboard.createCursorKeys(); // for ←↑→↓ keys only
		const controls = new Phaser.Cameras.Controls.SmoothedKeyControl({
			camera: camera,
			left: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A), // cursors.left,
			right: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D), // cursors.right,
			up: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W), // cursors.up,
			down: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S), // cursors.down,
			zoomIn: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
			zoomOut: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
			zoomSpeed: 0.02,
			acceleration: 0.1,
			drag: 0.0001,
			maxSpeed: 1.05,
			minZoom: 1,
			maxZoom: 2.8,
		});

		controls.start();
		camera.setBounds(0, 0, w, h);
		camera.setZoom(w > MIN_WIDTH_FOR_ZOOM ? 1.5 : 1);

		scene.update = function (_, delta) {
			// console.info("zoom: ", scene.cameras.main.zoom)
			controls.update(delta);
		};
	};

	const spawnTiles = (scene: Phaser.Scene) => {
		let tile;
		let i = 0;
		const offsetX = 150;
		const offsetY = 150;
		const mapCells = 30;
		const mapStep = 27;
		const mapSizeX = mapStep * mapCells + offsetX;
		const mapSizeY = mapStep * mapCells + offsetY;

		const tiles = [];

		for (var xx = offsetX; xx < mapSizeX; xx += mapStep) {
			for (var yy = offsetY; yy < mapSizeY; yy += mapStep) {
				i++;

				tile = scene.add.isoSprite(
					xx,
					yy,
					0,
					'tile-' + getMap.flat(Infinity)[i - 1],
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

				tiles.push(tile);
			}
		}

		// console.info("tiles: ", tiles);
	};

	const createCube = (scene: Phaser.Scene) => {
		totalCubes += 1;
		let cube: ICube;
		let currentCube: ICube | null;

		// Add a cube which is way above the ground
		cube = scene.add.isoSprite(810, 810, 600, 'cube', scene.isoGroup);
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

	const preload = (scene: Phaser.Scene) => {
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
		scene.load.image('stars-1', '/images/parallax_1.png');
		scene.load.image('stars-2', '/images/parallax_2.png');
		scene.load.image('stars-3', '/images/parallax_3.png');
		scene.load.image('starship', '/images/parallax_starship_1.png');
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
	};

	const create = (scene: Phaser.Scene) => {
		scene.isoGroup = scene.add.group();

		// Apply some gravity on cubes
		scene.isoPhysics.world.gravity.setTo(0, 0, -500);
		scene.isoPhysics.projector.origin.setTo(0.5, 0);

		// Add first cube to scene
		cameraControls(scene);
		spawnTiles(scene);
		spawnCubes(scene);
	};
</script>

<Scene
	key="main"
	mapAdd="{{ isoPlugin: 'iso', isoPhysics: 'isoPhysics' }}"
	physics="{{ default: 'arcade' }}"
	preload="{preload}"
	create="{create}"
	active="{$user.isLoggedIn}"
>
	<TileSprite
		x="{0}"
		y="{0}"
		width="{w}"
		height="{h}"
		originX="{0}"
		originY="{0}"
		texture="stars-1"
		tilePositionX="{tile1PositionX}"
	/>
	<TileSprite
		x="{0}"
		y="{0}"
		width="{w}"
		height="{h}"
		originX="{0}"
		originY="{0}"
		texture="stars-2"
		tilePositionX="{tile2PositionX}"
	/>
	<TileSprite
		x="{0}"
		y="{0}"
		width="{w}"
		height="{h}"
		originX="{0}"
		originY="{0}"
		texture="stars-3"
		tilePositionX="{tile3PositionX}"
	/>
	<TileSprite
		x="{50}"
		y="{0}"
		width="{w}"
		height="{h}"
		originX="{0}"
		originY="{0}"
		texture="starship"
		tilePositionX="{tile1PositionX}"
	/>
</Scene>
