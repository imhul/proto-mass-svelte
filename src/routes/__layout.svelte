<script>
    import Modal from 'svelte-simple-modal';
    // styles
    import '../app.scss';
</script>

<Modal
    closeButton={false}
    classBg="modal-bg"
    classWindowWrap="modal-window-wrap"
    classWindow="modal-window"
    classContent="modal-content"
>
    <slot />
</Modal>
