<script lang="ts">
    // components
    import Board from '$game/ui/board.svelte';
    // store
    import { messages } from '$store/game/notify';
    // types
    import type { Message } from '$types/ui';

    $: boards = $messages ? $messages.filter((board: Message) => board.aside === 'left') : [];
</script>

<aside>
    {#each boards as board (board.id)}
        <Board {board} />
    {/each}
</aside>

<style lang="scss">
    aside {
        position: absolute;
        width: 13rem;
        z-index: 999;
        left: var(--size-16);
        top: 5rem;
    }
</style>