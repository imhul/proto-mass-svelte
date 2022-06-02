<script lang="ts">
	import { Game, Scene } from 'svelte-phaser';
	import { IsoPlugin, IsoPhysics } from '$lib/iso';
	// assets
	import CubeSprite from '$assets/sprites/isometric_pixel_1.png';
	import TileSprite from '$assets/sprites/tile.png';

	export let w: number;
	export let h: number;

	const GROWTH_COOF = 11;
	$: totalCubes = 0;
	$: timeout = GROWTH_COOF * 1000 * (totalCubes <= 1 ? 1 : totalCubes);

	class IsoCollision extends Scene {
		constructor() {
			const sceneConfig = {
				key: 'IsoCollision',
				mapAdd: { isoPlugin: 'iso', isoPhysics: 'isoPhysics' },
			};

			super(sceneConfig);
		}

		preload() {
			this.load.image('tile', TileSprite);
			this.load.image('cube', CubeSprite);
			this.load.scenePlugin({
				key: 'IsoPlugin',
				url: IsoPlugin,
				sceneKey: 'iso',
			});

			this.load.scenePlugin({
				key: 'IsoPhysics',
				url: IsoPhysics,
				sceneKey: 'isoPhysics',
			});
		}

		create() {
			this.isoGroup = this.add.group();

			// Apply some gravity on our cubes
			this.isoPhysics.world.gravity.setTo(0, 0, -500);

			this.isoPhysics.projector.origin.setTo(0.5, 0);

			// Add some first cubes to our scene
			this.spawnTiles();
			this.spawnCubes();
		}

		update() {
			// Collide cubes against each other
			this.isoPhysics.world.collide(this.isoGroup);

			// Moooore cuuuubes
			if (this.input.activePointer.justDown) {
				this.spawnCubes();
			}
		}

		spawnTiles() {
			var tile;

			for (var xx = 0; xx < 1024; xx += 38) {
				for (var yy = 0; yy < 1024; yy += 38) {
					tile = this.add.isoSprite(xx, yy, 0, 'tile', this.isoGroup);
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
		}

		createCube() {
			totalCubes += 1;
			let cube;

			// Add a cube which is way above the ground
			cube = this.add.isoSprite(256, 256, 440, 'cube', this.isoGroup);
			// cube.isoZ += 10;
			// Enable the physics body on this cube
			this.isoPhysics.world.enable(cube);

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
		}

		spawnCubes() {
			const timer = setTimeout(() => {
				this.createCube();
				this.spawnCubes();
				totalCubes > 9 && clearTimeout(timer);
			}, timeout);
		}
	}

	let config = {
		type: Phaser.AUTO,
		width: w,
		height: h,
		pixelArt: true,
		scene: IsoCollision,
	};

	new Game(config);
</script>
