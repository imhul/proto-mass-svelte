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
	<a href="/" class="logo-wrapper">
		<img src="" alt="logo" />
	</a>

	<nav>
		<a href="/game" class="menu-link" on:click|preventDefault="{goGame}">
			<span>game</span>
		</a>
		<span class="menu-link" on:click="{isLoggedIn ? logout : login}">
			<span>{isLoggedIn ? 'logout' : 'login'}</span>
		</span>
	</nav>
</header>
