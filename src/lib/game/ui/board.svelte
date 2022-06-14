<script lang="ts">
	// types
	import type { Message } from '$types/ui';

	export let board: Message = {
		id: '',
		autokill: false,
		actions: [],
		title: '',
		isArchived: false,
		message: '',
		type: 'default',
		aside: 'left',
	};
</script>

<div class="board">
	<div class="head">
		<span>{board.title}</span>
		<div class="controls">
			<i class="icon-eye"></i>
			<i class="icon-close"></i>
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
		margin-bottom: var(--size-16);
		text-shadow: var(--size-2) var(--size-2) 0 var(--game-color-darkest);
		font-family: 'PressStart2P-Regular';
		background-color: var(--game-color-dark);
		border: var(--size-3) solid var(--game-color);
		flex-direction: column;
		color: var(--game-color);
		font-size: 1em;
		display: flex;
		padding: var(--size-24);
		z-index: 999;
		opacity: 0.5;
		width: 100%;
		.visibility {
			position: absolute;
			top: 0;
			right: var(--size-10);
			font-size: var(--size-20);
			svg {
				box-shadow: var(--size-2) var(--size-2) 0 var(--game-color-darkest);
			}
		}
	}
</style>
