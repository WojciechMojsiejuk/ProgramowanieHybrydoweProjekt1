<template>
    <v-app id="inspire">
        <v-app id="inspire" v-if="!token">
            <v-content>
                <v-container
                        class="fill-height"
                        fluid
                >
                    <v-row
                            align="center"
                            justify="center"
                    >
                        <v-col
                                cols="12"
                                sm="8"
                                md="4"
                        >
                            <v-card class="elevation-12">
                                <v-toolbar
                                        color="brown lighten-1"
                                        dark
                                        flat
                                >
                                    <v-toolbar-title> <v-icon>mdi-library</v-icon> Log into Library</v-toolbar-title>
                                    <v-spacer></v-spacer>
                                </v-toolbar>
                                <v-card-text>
                                    <v-form>
                                        <v-text-field
                                                label="Login"
                                                name="login"
                                                prepend-icon="mdi-account"
                                                type="text"
                                        ></v-text-field>

                                        <v-text-field
                                                id="password"
                                                label="Password"
                                                name="password"
                                                prepend-icon="mdi-lock"
                                                type="password"
                                        ></v-text-field>
                                    </v-form>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="brown lighten-2" dark @click="login">Login</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
            </v-content>
        </v-app>
    </v-app>
</template>

<script>
    export default {
        name: "Login",
        methods:
            {
                login()
                {
                    console.log("Logged")
                    localStorage.setItem('user-token', "HasloToOkon;)")
                }
            },
        data(){
            return{
                token: null,
            };
        },
        mounted: function () {
            this.token = localStorage.getItem('user-token')
            if(this.token)
            {
                this.$router.push('BooksList')
            }

        }
    }

</script>

<style scoped>

</style>