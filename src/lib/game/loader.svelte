<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	// store
	import user from '$store/auth';
	// components
	import { Game, Camera, Scene, Tilemap, TileLayer } from 'svelte-phaser';
	import { IsoPlugin, IsoPhysics } from '$lib/iso';
	// import Collisions from '$game/collisions.svelte';
	// assets
	import CubeSprite from '$assets/sprites/isometric_pixel_1.png';
	import TileSprite from '$assets/sprites/tile.png';


	$: !$user.isLoggedIn && goto('/');

	$: h = 600;
	$: w = 800;
	$: x = 0;
	$: y = 0;


	let game: Phaser.Game|undefined;
	let sceneInst: Phaser.Scene|undefined;
	const camStep = 10;
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
		console.info('step');
		// if (sceneInst) {
		// 	sceneInst.isoPhysics.world.collide(sceneInst.isoGroup);
		// }
		// tilePositionX -= 1;
	};

	onMount(() => {
		if (!game) return;
		game.events.on('step', step)

		return () => {
			if (!game) return;
			game.events.off('step', step)
		}
	})

	const spawnTiles = (scene) => {
		let tile;

		for (var xx = 0; xx < 1024; xx += 38) {
			for (var yy = 0; yy < 1024; yy += 38) {
				tile = scene.add.isoSprite(xx, yy, 0, 'tile', scene.isoGroup);
				tile.setInteractive();

				tile.on('pointerover', function () {
					this.setTint(0x86bfda);
					this.isoZ += 5;
				});

				tile.on('pointerout', function () {
					this.clearTint();
					this.isoZ -= 5;
				});

				// tile.on('pointerdown', function () {
				// 	this.spawnCubes();
				// });
			}
		}
	};

	const createCube = (scene) => {
		console.info("scene: ", scene);
		totalCubes += 1;
		let cube;

		// Add a cube which is way above the ground
		cube = scene.add.isoSprite(256, 256, 440, 'cube', scene.isoGroup);
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
	};

	const spawnCubes = (scene) => {
		const timer = setTimeout(() => {
			createCube(scene);
			spawnCubes(scene);
			totalCubes > 9 && clearTimeout(timer);
		}, timeout);
	};
</script>

<svelte:window bind:innerHeight="{h}" bind:innerWidth="{w}" on:keypress="{onKeypress}" />

<Game bind:instance={game} width="{w}" height="{h}" backgroundColor="#ddd">
	<Scene
		bind:instance={sceneInst}
		key="main"
		mapAdd={{isoPlugin: 'iso', isoPhysics: 'isoPhysics'}}
		physics={{ default: "arcade" }}
		preload="{(scene) => {
			scene.load.tilemapTiledJSON('proto', '/maps/proto.json');
			scene.load.image('tile', TileSprite);
			scene.load.image('cube', CubeSprite);
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
		<Camera {x} {y} width="{w}" height="{h}">
			<!-- <Tilemap key="proto" tilesets="{[{ key: 'proto', name: 'proto' }]}">
				<Collisions h="{h}" w="{w}" />
				<TileLayer id="proto" tilesets="{['proto']}" />
				<TileLayer
					id="ground"
					tilesets={['castle-tileset']} />
			</Tilemap> -->
		</Camera>
	</Scene>
</Game>
