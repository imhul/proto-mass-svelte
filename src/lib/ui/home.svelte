<script lang="ts">
	// components
	import Hero from '$ui/hero.svelte';
	import Header from '$ui/header.svelte';
	import Footer from '$ui/footer.svelte';
</script>

<Header />
<main>
	<Hero />
</main>
<Footer />

<style lang="scss">
	main {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
	}
</style>
