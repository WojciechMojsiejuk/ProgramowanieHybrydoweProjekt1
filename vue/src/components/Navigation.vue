<template>
    <v-app-bar
            app
            color="rgba(0,0,0,0.4)"
            dark
    >
        <v-container fluid >
            <v-row>
                <v-col>
                    <v-row align="center" justify="center">
                        <v-col xs="2" sm="2" md="2" lg="2" v-if="!this.$user.isAdmin">
                            <v-btn outlined rounded to="/playlist" color="white" class="mx-2"><v-icon>mdi-book-open-page-variant</v-icon>Borrowed</v-btn>
                        </v-col>
                        <v-col xs="2" sm="2" md="2" lg="2">
                            <v-btn outlined rounded to="/playlist/add" color="white" class="mx-2" v-if="!this.$user.isAdmin"><v-icon>mdi-plus</v-icon>Borrow a book</v-btn>
                        </v-col>
                        <v-col xs="2" sm="2" md="2" lg="2">
                            <v-btn outlined rounded to="/artists" color="white" class="mx-2" v-if="this.$user.isAdmin"><v-icon>mdi-bookshelf</v-icon>Resources</v-btn>
                        </v-col>
                        <v-col xs="2" sm="2" md="2" lg="2">
                            <v-btn outlined rounded to="/artists" color="white" class="mx-2" v-if="this.$user.isAdmin"><v-icon>mdi-account-edit</v-icon>Authors</v-btn>
                        </v-col>
                        <v-col xs="2" sm="2" md="2" lg="2">
                            <v-btn outlined rounded to="/artists" color="white" class="mx-2" v-if="this.$user.isAdmin"><v-icon>mdi-account-box-outline</v-icon>Users</v-btn>
                        </v-col>
                        <v-col xs="2" sm="2" md="2" lg="2">
                            <v-btn outlined rounded to="/logout" color="white" class="mx-2"><v-icon>mdi-account-circle-outline</v-icon>Logout</v-btn>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>

        <v-spacer></v-spacer>

    </v-app-bar>
</template>

<script>
    export default {
        name: "Navigation"
    }
</script>

<style scoped>

</style>