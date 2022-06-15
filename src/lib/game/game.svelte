<script lang="ts">
    import { onMount } from 'svelte';
    import Phaser from 'phaser';
    import { goto } from '$app/navigation';
    // types
    import type { ICube } from '$types/objects';
    // store
    import user from '$store/user/auth';
    import { unit, units } from '$store/game/unit';
    import { messages } from '$store/game/notify';
    // components
    import { Scene, TileSprite } from 'svelte-phaser';
    import { IsoPlugin, IsoPhysics, IsoSprite } from '$lib/iso';
    // utils
    import { getTileByType } from '$utils/getTileByType';
    import { getMap } from '$utils/getMap';
    import { v5 as uuidv5 } from 'uuid';
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
    const GROWTH_COOF = 1;
    const idLength = new Array(16);
    const hover = 0x86bfda;
    const tilesArray = [Tile0, Tile1, Tile2, Tile3, Tile4, Tile5, Tile6, Tile7, Tile8];
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
            maxZoom: 2.8
        });

        controls.start();
        camera.setBounds(0, 0, w, h);
        camera.setZoom(w > MIN_WIDTH_FOR_ZOOM ? 1.5 : 1);

        scene.update = function (_, delta) {
            controls.update(delta);
        };
    };

    const spawnTiles = (scene: Phaser.Scene) => {
        let tile: IsoSprite;
        let i = 0;
        const offsetX = 150;
        const offsetY = 150;
        const mapCells = 30;
        const mapStep = 27;
        const mapSizeX = mapStep * mapCells + offsetX;
        const mapSizeY = mapStep * mapCells + offsetY;

        const tiles: IsoSprite[] = [];

        for (var xx = offsetX; xx < mapSizeX; xx += mapStep) {
            for (var yy = offsetY; yy < mapSizeY; yy += mapStep) {
                i++;
                const tileId = getMap.flat(Infinity)[i - 1];
                tile = scene.add.isoSprite(xx, yy, 0, 'tile-' + tileId, scene.isoGroup);
                tile.name = 'ground-' + tileId;
                tile.gameData = getTileByType(tileId);
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

                tile.on('pointerdown', function () {
                    console.info('tile: ', this.texture.key);
                    messages.add({
                        id: 'tile-' + this.name + '-' + (i -= 1),
                        title: 'Name: ' + this.name,
                        aside: 'right',
                        img: tilesArray[tileId],
                        message: `x: ${this._isoPosition.x}, y: ${this._isoPosition.y}`
                    });
                });

                tiles.push(tile);
            }
        }
    };

    const roam = (cube: ICube) => {
        const timeoutDir = Math.abs(Math.trunc(Math.random() * 2000 - 50));
        const isPause = Math.random() > 0.5;
        setTimeout(() => {
            const randomX = Math.trunc(Math.random() * 100 - 50);
            const randomY = Math.trunc(Math.random() * 100 - 50);
            cube.body.velocity.setTo(isPause ? 0 : randomX, isPause ? 0 : randomY, 0);
            roam(cube);
        }, 1000 + timeoutDir);
    };

    const createCube = (scene: Phaser.Scene) => {
        totalCubes += 1;
        let cube: ICube;

        // Add a cube which is way above the ground
        cube = scene.add.isoSprite(810, 810, 600, 'cube', scene.isoGroup);
        // Enable the physics body on this cube
        scene.isoPhysics.world.enable(cube);

        // Collide with the world bounds so it doesn't go falling forever or fly off the screen!
        cube.body.collideWorldBounds = true;
        cube.id = uuidv5('cube-' + totalCubes, idLength);

        // Add a full bounce on the x and y axes, and a bit on the z axis.
        cube.body.bounce.set(1, 1, 0.2);
        cube.setInteractive();

        const camera = scene.cameras.main;

        cube.on('pointerdown', function () {
            const check = () => {
                unit.set(cube);
                $unit.setTint(hover);
                camera.startFollow($unit);
                messages.add({
                    id: 'click-cube-' + cube.id,
                    title: 'Name: ' + 'The Cube',
                    aside: 'right',
                    icon: 'a10',
                    message: `Game Unit "The Cube" with coordinates x: ${$unit._isoPosition.x} and y: ${$unit._isoPosition.y}`
                });
            };

            const kill = () => {
                $unit.clearTint();
                camera.stopFollow();
                unit.set(null);
            };

            if ($unit?.id) {
                if (cube.id !== $unit.id) {
                    kill();
                    check();
                } else {
                    kill();
                }
            } else {
                check();
            }
        });

        roam(cube);
        units.set([...$units, cube]);
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
            sceneKey: 'iso'
        });
        scene.load.scenePlugin({
            key: 'IsoPhysics',
            url: IsoPhysics,
            sceneKey: 'isoPhysics'
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
    mapAdd={{ isoPlugin: 'iso', isoPhysics: 'isoPhysics' }}
    {preload}
    {create}
    active={$user.isLoggedIn}
>
    <TileSprite
        x={0}
        y={0}
        width={w}
        height={h}
        originX={0}
        originY={0}
        texture="stars-1"
        tilePositionX={tile1PositionX}
    />
    <TileSprite
        x={0}
        y={0}
        width={w}
        height={h}
        originX={0}
        originY={0}
        texture="stars-2"
        tilePositionX={tile2PositionX}
    />
    <TileSprite
        x={0}
        y={0}
        width={w}
        height={h}
        originX={0}
        originY={0}
        texture="stars-3"
        tilePositionX={tile3PositionX}
    />
    <TileSprite
        x={50}
        y={0}
        width={w}
        height={h}
        originX={0}
        originY={0}
        texture="starship"
        tilePositionX={tile1PositionX}
    />
</Scene>
