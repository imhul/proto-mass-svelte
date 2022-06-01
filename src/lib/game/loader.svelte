<script lang="ts">
    import { goto } from '$app/navigation';
    // store
    import user from '$store/auth';
    // components
    import Game from '$game/collisions.svelte';
    
    let h = 600;
    let w = 800;

    $: !$user.isLoggedIn && goto('/');
</script>

<svelte:window bind:innerHeight={h} bind:innerWidth={w} />

<Game {h} {w} />