<script lang="ts">
    import Phaser from 'phaser';
    import { goto } from '$app/navigation';
    // types
    import type { Message } from '$types/ui';
    import type { ICube } from '$types/objects';
    // store
    import user from '$store/user/auth';
    import { unit, units } from '$store/game/unit';
    import { gameUI } from '$store/game/ui';
    import { messages } from '$store/game/notify';
    // components
    import { Scene, getScene } from 'svelte-phaser';
    import { IsoPlugin, IsoPhysics, IsoSprite } from '$lib/iso';
    import Background from '$game/background.svelte';
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

    export let h = 0;
    export let w = 0;

    $: !$user.isLoggedIn && goto('/');

    // const scene = getScene();
    const sceneID = 'main_scene';
    const MIN_WIDTH_FOR_ZOOM = 1500;
    const GROWTH_MAX = 5;
    const GROWTH_COOF = 2;
    const idLength = new Array(16);
    const hover = 0x86bfda;
    const tilesArray = [Tile0, Tile1, Tile2, Tile3, Tile4, Tile5, Tile6, Tile7, Tile8];
    $: totalCubes = 0;
    $: timeout = GROWTH_COOF * 1000 * (totalCubes <= 1 ? 1 : totalCubes);

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
                    let id = tile.name + '-' + (i += 1);
                    let isDuplicate = $messages
                        .map((message: Message) => {
                            message.id;
                        })
                        .includes(id);
                    let suffix = id + '-' + uuidv5('message-' + $messages?.length, idLength);

                    messages.add({
                        id: isDuplicate ? suffix : id,
                        title: 'Name: ' + tile.name,
                        aside: 'right',
                        img: tilesArray[tileId],
                        message: `x: ${tile._isoPosition.x}, y: ${tile._isoPosition.y}`
                    });
                });
            }
        }
    };

    const roam = (cube: ICube) => {
        let timer;
        if ($gameUI.isGamePaused) {
            clearTimeout(timer);
            cube.body.velocity.setTo(0, 0, 0);
            return;
        }

        const timeoutDir = Math.abs(Math.trunc(Math.random() * 2000 - 50));
        const isPause = Math.random() > 0.5;
        timer = setTimeout(() => {
            const randomX = Math.trunc(Math.random() * 100 - 50);
            const randomY = Math.trunc(Math.random() * 100 - 50);
            cube.body.velocity.setTo(isPause ? 0 : randomX, isPause ? 0 : randomY, 0);
            roam(cube);
        }, 1000 + timeoutDir);
    };

    const collide: ArcadePhysicsCallback = () => {
        // TODO: game objects collide event handler
        // https://github.com/mattjennings/svelte-phaser/blob/master/examples/invaders/src/App.svelte
        console.info('collide');
    };

    const createCube = (scene: Phaser.Scene) => {
        if ($gameUI.isGamePaused) return;
        totalCubes += 1;
        if ($units.length) {
            $units.forEach((unit: ICube) => roam(unit));
        }
        let cube: ICube;

        // Add a cube which is way above the ground
        cube = scene.add.isoSprite(810, 810, 600, 'cube', scene.isoGroup);
        // Enable the physics body on this cube
        scene.isoPhysics.world.enable(cube);

        // Collide with the world bounds so it doesn't go falling forever or fly off the screen!
        cube.body.collideWorldBounds = true;
        cube.id = uuidv5('cube-' + ($units?.length + totalCubes + 1), idLength);

        // Add a full bounce on the x and y axes, and a bit on the z axis.
        cube.body.bounce.set(1, 1, 0.2);
        // scene.physics.add.collider($units, $units, collide);
        scene.physics.add.collider($units, $units, collide);
        // scene.physics.collide($units, $units, collide);
        cube.setInteractive();

        const camera = scene.cameras.main;

        cube.on('pointerdown', function () {
            const unitFocus = () => {
                unit.set(cube);
                $unit.setTint(hover);
                camera.startFollow($unit);
                $messages.forEach((board: Message) => {
                    if (board.parent === 'unit') messages.delete(board.id, 'delete');
                });
                messages.add({
                    id: 'click-unit-' + cube.id + '-' + totalCubes,
                    type: 'info',
                    title: 'Name: ' + 'The Cube',
                    aside: 'right',
                    icon: 'a10',
                    fixed: true,
                    parent: 'unit',
                    message: `x: ${$unit._isoPosition.x} and y: ${$unit._isoPosition.y}`
                });
            };

            const unitBlur = () => {
                $unit.clearTint();
                camera.stopFollow();
                unit.set(null);
            };

            if ($unit?.id) {
                if (cube.id !== $unit.id) {
                    unitBlur();
                    unitFocus();
                } else {
                    unitBlur();
                }
            } else {
                unitFocus();
            }
        });

        roam(cube);
        units.set([...$units, cube]);
        spawnCubes(scene);
    };

    const spawnCubes = (scene: Phaser.Scene) => {
        if ($gameUI.isGamePaused) return;
        const timer = setTimeout(() => {
            createCube(scene);
            totalCubes === GROWTH_MAX && clearTimeout(timer);
        }, timeout);
    };

    const pause = (scene: Phaser.Scene) => {
        gameUI.set({
            ...$gameUI,
            isGamePaused: true
        });
        scene.events.emit('pause');
    };

    const resume = (scene: Phaser.Scene) => {
        gameUI.set({
            ...$gameUI,
            isGamePaused: false
        });
        scene.events.emit('resume');
    };

    const onKeyup = (e: KeyboardEvent, scene: Phaser.Scene) => {
        if (e.key === 'Escape') pause(scene);
        if (e.key === 'r') resume(scene);
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

        scene.isoPhysics.world.gravity.setTo(0, 0, -500);
        scene.isoPhysics.projector.origin.setTo(0.5, 0);

        scene.input.keyboard.on('keyup', (event: KeyboardEvent) => onKeyup(event, scene), scene);

        scene.events.on('pause', function () {
            console.info('paused');
        });

        scene.events.on('resume', function () {
            console.info('resumed');
        });

        cameraControls(scene);
        // TODO: replace spawn functions to JSX
        spawnTiles(scene);
        spawnCubes(scene);
    };
</script>

<Scene
    key={sceneID}
    mapAdd={{ isoPlugin: 'iso', isoPhysics: 'isoPhysics' }}
    {preload}
    {create}
    active={$user.isLoggedIn}
>
    <Background {w} {h} />
</Scene>
