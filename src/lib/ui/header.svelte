<script lang="ts">
	import { getContext } from 'svelte';
	import { goto } from '$app/navigation';
	// store
	import user from '$store/user/auth';
	// components
	import AuthModal from '$ui/auth.svelte';

	const { open } = getContext('simple-modal');
	$: isLoggedIn = $user.isLoggedIn;

	const goGame = () => {
		isLoggedIn ? goto('/game') : open(AuthModal, { message: 'Log in first!' });
	};

	const login = () => {
		open(AuthModal);
	};

	const logout = () => {
		$user.isLoggedIn = false;
	};
</script>

<header>
	<a href="/" class="logo">
		<i class="icon-i1"></i>
	</a>

	<nav>
		<a href="/game" class="menu-link" on:click|preventDefault="{goGame}">
			<!-- <i class="icon-Y15"></i> -->
			<span>game</span>
		</a>
		<a
			href="https://github.com/imhul/proto-mass-svelte/blob/master/README.mdx"
			rel="noopener noreferrer"
			target="_blank"
			class="menu-link"
		>
			<!-- <i class="icon-Y15"></i> -->
			<span>About</span>
		</a>
		<a
			href="https://www.patreon.com/protomass"
			rel="noopener noreferrer"
			target="_blank"
			class="menu-link"
		>
			<!-- <i class="icon-dollar3"></i> -->
			<span>Donate</span>
		</a>
		<span class="menu-link" on:click="{isLoggedIn ? logout : login}">
			<!-- <i class="icon-Y15"></i> -->
			<span>{isLoggedIn ? 'logout' : 'login'}</span>
		</span>
	</nav>
</header>

<style lang="scss">
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: var(--size-80);
		width: 100%;
		padding: 0 var(--size-30);
		background-color: var(--game-color-dark);

		.logo {
			font-size: var(--size-32);
			color: var(--game-color);
			text-shadow: var(--size-2) var(--size-2) 0 var(--game-color-darkest);

			&:hover {
				color: var(--game-color-darkest);
				text-shadow: var(--size-2) var(--size-2) 0 var(--game-color-warn);
			}
		}

		nav {
			display: flex;
			justify-content: center;
			align-items: center;

			.menu-link {
				display: block;
				height: var(--size-80);
				padding: 0 var(--size-20);
				line-height: var(--size-80);
				text-transform: uppercase;
				background: var(--game-color-dark);
				text-shadow: var(--size-2) var(--size-2) 0 var(--game-color-darkest);

				span {
					font-size: var(--size-22);
					font-family: var(--8-bit);
					color: var(--game-color);
				}

				&:hover {
					background-color: var(--game-color);
					span,
					i,
					a {
						color: var(--game-color-darkest);
						text-shadow: var(--size-2) var(--size-2) 0 var(--game-color-warn);
					}
				}
			}
		}
	}
</style>
