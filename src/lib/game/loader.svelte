<script lang="ts">
    import { browser } from '$app/env';
    import { goto } from '$app/navigation';
    // types
    import type Phaser from 'phaser';
    // store
    import user from '$store/user/auth';
    // components
    import { Game } from 'svelte-phaser';
    import Header from '$game/ui/header.svelte';
    import AsideL from '$game/ui/aside-left.svelte';
    import AsideR from '$game/ui/aside-right.svelte';
    import Scenario from '$game/game.svelte';

    $: !$user.isLoggedIn && goto('/');
    $: h = 0;
    $: w = 0;
    const onKeypress = (e: KeyboardEvent) => console.info('key: ', e.key);
</script>

<svelte:window bind:innerHeight={h} bind:innerWidth={w} on:keypress={onKeypress} />

<Header />
<AsideL />
<AsideR />
{#if browser && w > 0 && h > 0}
    <Game physics={{ default: 'arcade' }} width={w} height={h} backgroundColor="#000">
        <Scenario {w} {h} />
    </Game>
{/if}
