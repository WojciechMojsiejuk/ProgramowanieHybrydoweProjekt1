<template>
    <div class="outerWrapper" align="center">
        <v-dialog
                v-model="dialog"
                persistent
                max-width="30%"
                class="innerWrapper"
        >
            <v-card shaped>
                <v-card-title class="headline" >Add user</v-card-title>
                <v-form v-model="valid">
                    <v-container fluid>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field
                                        required
                                        v-model="newUserLogin"
                                        :rules="rules"
                                        hide-details="auto"
                                        label="User login:"
                                        prepend-icon="mdi-account-details-outline"
                                        outlined
                                        rounded
                                        clearable
                                        dense
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-text-field
                                        required
                                        v-model="newUserPassword"
                                        :rules="rules"
                                        hide-details="auto"
                                        label="User password:"
                                        prepend-icon="mdi-shield-account-outline"
                                        outlined
                                        rounded
                                        clearable
                                        dense
                                        :type="'password'"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-text-field
                                        required
                                        v-model="newUserPasswordConfirm"
                                        :rules="[rules, passwordConfirmationRule]"
                                        hide-details="auto"
                                        label="User password confirm:"
                                        prepend-icon="mdi-shield-account-outline"
                                        outlined
                                        rounded
                                        clearable
                                        dense
                                        :type="'password'"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                            text
                            @click="$emit('closeModal')"
                    >
                        <v-icon>mdi-cancel</v-icon>
                        Cancel
                    </v-btn>

                    <v-btn
                            rounded
                            @click="addToDb()"
                            color="brown lighten-1"
                            :disabled="!valid"
                    ><v-icon>mdi-plus</v-icon>
                        Add user
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        </div>
</template>

<script>
    // <v-btn rounded @click="$emit('closeModal')"><v-icon >mdi-close</v-icon>Close</v-btn>
    import axios from 'axios';
    const serverUrl = 'https://ph-library-api-project.azurewebsites.net';

    export default {
        name: "Modal",
        data(){
            return{
                newUserLogin: '',
                newUserPassword: '',
                newUserPasswordConfirm: '',
                rules: [
                    value => value.length>0 || 'Required.',
                ],
                valid: false,
                dialog: true,
            };
        },
        methods:{
            async addToDb() {
                //Add user to db
                await axios.post( serverUrl+'/admin/sign-up',{
                    login: this.newUserLogin,
                    password: this.newUserPassword,
                    },
                    {
                        'headers': { 'Authorization': this.$cookies.get('token')}
                    }).then((response)=>{if(response.status==200){this.$emit('closeModal')}}).catch((error)=>console.log(error))

            },
        },
        computed: {
            passwordConfirmationRule() {
                return () => (this.newUserPassword === this.newUserPasswordConfirm) || 'Password must match'
            },
        }
    }
</script>

<style scoped>

    /*!*.outerWrapper{*!*/
    /*!*    max-width: 70%;*!*/
    /*!*    height: 90%;*!*/
    /*!*    position:fixed;*!*/
    /*!*    padding:30px;*!*/
    /*!*}*!*/
    /*!*.innerWrapper{*!*/
    /*!*    display: flex;*!*/
    /*!*    height: auto;*!*/
    /*!*    max-height: 100%;*!*/
    /*!*    padding:20px;*!*/
    /*!*    !*justify-content: center;*!*!*/
    /*!*    flex-direction: column;*!*/
    /*!*    overflow: scroll;*!*/
    /*}*/
</style>