<script lang="ts">
    import svelteLogo from '$assets/logo/svelte.svg';
    import phaserLogo from '$assets/logo/phaser.png';
</script>

<footer>
    <div class="col" />
    <div class="col">
        <span>Powered by</span>
        <img src={phaserLogo} height="30" alt="phaser logo" />
        <span>+</span>
        <img src={svelteLogo} height="30" alt="svelte logo" />
    </div>
</footer>

<style lang="scss">
    footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: var(--size-80);
        width: 100%;
        padding: 0 var(--size-30);
        background-color: var(--transparent);

        .col {
            display: flex;
            justify-content: flex-end;
            align-items: center;

            & > * {
                margin-left: var(--size-10);
            }

            span {
                font-family: var(--8-bit);
                color: var(--game-color);
                text-shadow: var(--size-2) var(--size-2) 0 var(--game-color-darkest);
            }
        }
    }
</style>
