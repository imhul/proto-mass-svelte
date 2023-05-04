<h1>Proto-Mass<br /><i class="icon-i1" /></h1>

<style lang="scss">
    h1 {
        top: 50%;
        left: 50%;
        width: 100%;
        transform: translate(-50%, -50%) scale(1);
        position: absolute;
        font-weight: var(--weight-500);
        font-family: var(--hero);
        font-size: 13rem;
        text-align: center;
        color: #ff85e5;
        text-shadow: var(--size-4) var(--size-4) 0 #ff0045, var(--size-8) var(--size-8) 0 #5500ff;
        margin: 0 0 var(--size-10);
        animation: playHero 20s ease-in-out;
        user-select: none;
        touch-action: none;

        &::selection {
            color: #ff85e5;
        }
    }
</style>
