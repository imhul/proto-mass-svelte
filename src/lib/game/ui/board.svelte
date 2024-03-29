<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	// store
	import { messages } from '$store/game/notify';
	// types
	import type { Message } from '$types/ui';

	export let board: Message;

	$: overBoard = false;
	let timer: NodeJS.Timeout;
	const timeout = 3000;
	const flyOptions = {
		y: 200,
		duration: 1000,
	};

	const expiring = () => {
		timer = setTimeout(() => {
			messages.delete(board.id);
			clearTimeout(timer);
		}, timeout);
	};

	$: if (overBoard && Boolean(timer)) clearTimeout(timer);
	$: if ($messages?.length > 1 && !board.fixed) expiring();
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
	class="board {board.type ?? 'default'}"
	class:fixed="{board.fixed}"
	in:fly="{flyOptions}"
	out:fade
	on:click="{() => (overBoard = true)}"
	on:mouseenter="{() => (overBoard = true)}"
	on:mouseover="{() => (overBoard = true)}"
	on:mouseleave="{() => (overBoard = false)}"
>
	<div class="head">
		<span>{board.title}</span>
		<div class="controls">
			<i
				class="icon-{board.fixed ? 'bar' : 'numbersign'}"
				on:click="{messages.fixation(board.id)}"></i>
			<i class="icon-forbid" on:click="{() => messages.delete(board.id)}"></i>
		</div>
	</div>
	<div class="content">
		<slot />
		{#if board.message?.length}
			<div class="message">{board.message}</div>
		{/if}
	</div>
	{#if board.actions?.length}
		<div class="actions">
			{#each board.actions as action (action.id)}
				{#if action.url.length}
					<a href="{action.url}" class="link btn">
						{action.title}
					</a>
				{:else}
					<button on:click="{action.callback}">
						{action.title}
					</button>
				{/if}
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	.board {
		z-index: 999;
		position: relative;
		display: flex;
		flex-direction: column;
		width: 100%;
		padding: var(--size-24);
		margin-bottom: var(--size-16);
		text-shadow: var(--size-2) var(--size-2) 0 var(--game-color-darkest);
		font-family: var(--8-bit);
		background-color: var(--game-color-dark);
		border: var(--size-3) solid var(--game-color);
		color: var(--game-color);
		font-size: var(--size-20);
		opacity: 0.5;
		transition: opacity 0.3s;

		&.fixed,
		&:hover {
			opacity: 1;
		}

		.head {
			min-height: var(--size-50);

			.controls {
				position: absolute;
				top: 0;
				right: 0;

				i {
					&:hover {
						color: var(--game-color-light);
					}
				}
			}
		}
	}
</style>
