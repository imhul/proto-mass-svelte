<script lang="ts">
    import { getContext } from 'svelte';
    // components
    import Journal from '$game/ui/journal.svelte';

    const { open } = getContext('simple-modal');
</script>

<header>
    <nav>
        <span
            class="menu-link"
            on:click|stopPropagation={() => open(Journal, { message: 'Journal' })}
        >
            <i class="icon-asciicircum5" />
        </span>
    </nav>
</header>

<style lang="scss">
    header {
        position: fixed;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        top: 0;
        left: 0;
        right: 0;
        height: var(--size-80);

        nav {
            @extend %nav;

            .menu-link {
                background: var(--transparent);
                font-size: var(--size-40);

                span,
                i {
                    color: var(--game-color);

                    // &.icon-asciicircum5 {

                    // }
                }

                &:hover {
                    background: var(--transparent);

                    span,
                    i,
                    a {
                        color: var(--game-color-light);
                        text-shadow: none;
                    }
                }
            }
        }
    }
</style>
