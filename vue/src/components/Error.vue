<template>
    <div class="errorMessage" v-if="error">
        <v-alert type="error">{{error}} <v-btn align="center" justify="center" rounded @click="ReturnToLogin">Try to log into authorized account</v-btn></v-alert>
    </div>
</template>

<script>
    export default {
        name: "Error",
        props:
            {
                error:
                    {
                        type: Error,
                    }
            },
        methods:
            {
                ReturnToLogin()
                {
                    this.$router.push('/')
                }
            }
    }
</script>

<style scoped>

</style>