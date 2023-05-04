<script lang="ts">
    import { getContext } from 'svelte';
    // types
    import type { Message } from '$types/ui';
    // store
    import { messages } from '$store/game/notify';

    const { close } = getContext('simple-modal');
    const archive = $messages.filter((message: Message) => message.archived);
</script>

<i class="icon-forbid close" on:click|stopPropagation={close} />
<div class="list">
    {#each archive as message (message.id)}
        <div class="list-item">
            <div class="list-item-icon">
                {#if message.img}
                    <img src={message.img} alt={message.title} />
                {:else if message.icon}
                    <i class="icon-{message.icon}" />
                {/if}
            </div>
            <div class="list-item-text">
                <h3>{message.title}</h3>
                <p>{message.message}</p>
            </div>
        </div>
    {/each}
</div>

<style lang="scss">
    .close {
        position: absolute;
        right: var(--size-6);
        top: var(--size-6);
        font-size: var(--size-32);
        cursor: pointer;

        &:hover {
            color: var(--game-color-dark);
        }
    }

    .list {
        @include scrollbar(var(--size-24), var(--game-color-dark), var(--game-color-light));
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        height: 90vh;
        margin-top: var(--size-26);
        overflow-y: auto;
        overflow-x: hidden;

        .list-item {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            width: 100%;

            background-color: var(--game-color);
            transition: background-color 0.3s;

            &:hover {
                background-color: var(--game-color-light);
            }

            &-icon {
                display: flex;
                justify-content: center;
                align-items: center;
                flex: 0 0 var(--size-60);
                width: var(--size-60);
                height: var(--size-60);
                margin: var(--size-10);
                background-color: var(--game-color-warn);

                i {
                    font-size: var(--size-50);
                    margin-top: 10px;
                }
            }

            &-text {
                flex: 1 0 calc(100% - 4.375rem);
                padding-right: var(--size-20);

                h3 {
                    font-size: var(--size-14);
                    font-family: var(--8-bit);
                    text-shadow: var(--size-2) var(--size-2) 0 var(--game-color-light);
                }
            }
        }
    }
</style>
