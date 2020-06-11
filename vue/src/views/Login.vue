<template>
    <v-app id="inspire">
        <v-app id="inspire">
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
                                    <v-form v-model="valid">
                                        <v-row>
                                            <v-alert v-if="error" type="error">Invalid login or password</v-alert>
                                        </v-row>
                                        <v-text-field
                                                label="Login"
                                                name="login"
                                                :rules="rules"
                                                v-model="login"
                                                prepend-icon="mdi-account"
                                                type="text"
                                        ></v-text-field>

                                        <v-text-field
                                                id="password"
                                                label="Password"
                                                name="password"
                                                :rules="rules"
                                                v-model="password"
                                                prepend-icon="mdi-lock"
                                                type="password"
                                        ></v-text-field>
                                    </v-form>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="brown lighten-2" @click="LogInto" :dark="valid" :disabled="!valid">Login</v-btn>
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
    import axios from 'axios';

    const serverUrl = 'https://ph-library-api-project.azurewebsites.net';


    export default {
        name: "Login",
        methods:
            {
                async LogInto()
                {
                    await axios.post(serverUrl+'/login', {
                        login: this.login,
                        password: this.password
                    }).then(
                        response => {
                            this.$cookies.set("token", response.headers.authorization, '10min','','',false, 'Strict');
                            this.$cookies.set("role", response.headers.roles, '10min','','',false, 'Strict');
                            this.$router.push('books')
                        }).catch((error)=>(this.error = error));
                }
            },
        data(){
            return{
                valid: false,
                login: '',
                password: '',
                rules: [
                    value => value.length>0 || 'Required.',
                ],
                error:null,

            };
        },
    }

</script>

<style scoped>

</style>