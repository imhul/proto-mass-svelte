<script lang="ts">
    import { getContext } from 'svelte';
    import user from '$store/user/auth';

    export let message = '';
    const { close } = getContext('simple-modal');

    let isRegistration = false;

    const onSubmit = () => {
        $user.isLoggedIn = true; // mock
        close();
    };
</script>

<!-- TODO: login/reg switch -->
<h1>{!message.length ? 'Log in' : message}</h1>
<form on:submit|preventDefault={onSubmit}>
    <input type="email" />
    <input type="password" />
    <button type="submit">Login</button>
</form>

<style lang="scss">
    form {
        display: flex;
        flex-direction: column;
        width: 17.5rem;
    }
</style>
