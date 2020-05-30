<template>
    <v-app>
        <v-row justify="center">
            <h2 class="headline  font-weight-light" > You've been logged out.</h2>
        </v-row>
    </v-app>
</template>

<script>
    export default {
        name: "Logout",
        mounted: function () {
            localStorage.clear()
            this.$router.push('/')

        }
    }

</script>

<style scoped>

</style>