<script lang="ts">
	import Phaser, { Game, Scene } from 'phaser';
	import { IsoPlugin, IsoPhysics } from '$lib/iso';
	import CubeSprite from '$assets/sprites/isometric_pixel_1.png';
	import TileSprite from '$assets/sprites/tile.png';

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

			this.isoPhysics.projector.origin.setTo(0.5, 0.3);

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

			for (var xx = 0; xx < 512; xx += 38) {
				for (var yy = 0; yy < 512; yy += 38) {
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
				}
			}
		}

		spawnCubes() {
			let cube;
			for (let xx = 256; xx > 0; xx -= 64) {
				for (let yy = 256; yy > 0; yy -= 64) {
					// Add a cube which is way above the ground
					cube = this.add.isoSprite(xx, yy, 600, 'cube', this.isoGroup);
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
						this.isoZ += 5;
					});

					cube.on('pointerout', function () {
						this.clearTint();
						this.isoZ -= 5;
					});
				}
			}
		}
	}

	let config = {
		type: Phaser.AUTO,
		width: 800,
		height: 600,
		pixelArt: true,
		scene: IsoCollision,
	};

	new Game(config);
</script>
