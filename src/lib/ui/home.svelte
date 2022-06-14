<script lang="ts">
	// components
	import Hero from '$ui/hero.svelte';
	import Header from '$ui/header.svelte';
	import Footer from '$ui/footer.svelte';
</script>

<div class="container">
	<Header />
	<main>
		<Hero />
	</main>
	<Footer />
</div>

<style lang="scss">
	.container {
		width: 100%;
		background: url('/images/bg.gif') no-repeat 50% 50%;
		background-size: cover;

		main {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			min-height: 100%;
			height: calc(100vh - 10rem);
			transform: perspective(18.75rem) rotateX(20deg);
		}
	}
</style>
