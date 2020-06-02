<template>
    <div class="background"></div>
</template>

<script>
    export default {
        name: "SearchBackground"
    }
</script>

<style>
.background{
    position: fixed;
    width: 100%;
    top: 0;
    z-index: -1;
    height: 100vh;
    background-blend-mode: soft-light;
    background: url("../assets/background2.jpg") no-repeat;
    background-size: cover;
    /*filter: blur(10px);*/
    /*filter: sepia(5%);*/
}
</style>