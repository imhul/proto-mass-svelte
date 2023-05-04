<script lang="ts">
    // store
    import { gameUI } from '$store/game/ui';
    // components
    import { TileSprite, onGameEvent } from 'svelte-phaser';

    export let h = 0;
    export let w = 0;
    let tile1PositionX = 0;
    let tile2PositionX = 0;
    let tile3PositionX = 0;
    const step = () => {
        if ($gameUI.isGamePaused) return;
        tile1PositionX += 0.1;
        tile2PositionX += 0.15;
        tile3PositionX += 0.2;
    };

    onGameEvent('step', step);
</script>

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
