<template>
    <div class="authorsWrapper">
        <error :error="error"></error>
        <navigation></navigation>
        <background></background>

        <div class="authorsHolder" v-if="users.length">
            <!--                Userlist options bar-->
            <v-container fluid justify="space-between">
                <v-app-bar
                        color="rgba(0,0,0,0.3)"
                        dark
                        flat
                >
                    <v-toolbar-title>
                        Users
                    </v-toolbar-title>
                    <v-container align="center">
                        <v-row align="center">
                            <v-layout>
                                <v-btn outlined rounded @click.native="addUserDialog=true"><v-icon>mdi-account-plus-outline</v-icon> Add new user</v-btn>
                            </v-layout>
                            <v-layout>
                                <v-menu
                                        close-on-click
                                        close-on-content-click
                                        offset-y
                                        v-model="sortShow"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-btn
                                                rounded outlined
                                                v-on="on"
                                        >
                                            <v-icon>mdi-sort</v-icon> Sort
                                        </v-btn>
                                    </template>
                                    <v-container class="pa-4 mt-6" style="background: rgb(255,255,255)">
                                        <v-row class="ma-1">
                                            <v-btn rounded outlined @click="sortNameAsc"><v-icon>mdi-sort-alphabetical-ascending</v-icon>by name ascending</v-btn>
                                        </v-row>
                                        <v-row class="ma-1">
                                            <v-btn rounded outlined @click="sortNameDsc"><v-icon>mdi-sort-alphabetical-descending</v-icon>by name descending</v-btn>
                                        </v-row>
                                        <v-row class="ma-1">
                                            <v-btn rounded outlined @click="noSort"><v-icon>mdi-sort-variant-remove</v-icon>Clear</v-btn>
                                        </v-row>
                                    </v-container>

                                </v-menu>
                            </v-layout>
                            <v-layout>
                                <v-text-field v-model="search" :clear-icon-cb="clearSearch" clearable placeholder="Search users by their login..."
                                              append-icon="mdi-magnify"
                                ></v-text-field>
                            </v-layout>
                        </v-row>
                    </v-container>
                </v-app-bar>
            </v-container>
            <!--                Users list-->

            <v-list
                    shaped
                    dark
                    style="max-height: 70vh; background: rgba(0,0,0,0.4)"
                    class="overflow-y-auto"
            >
                <v-list-item-group>
                    <v-list-item
                            v-for="user in Users"
                            :key="user.id"
                    >
                        <v-list-item-content>
                            <v-list-item-title>{{user.login}}</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-btn outlined rounded @click.stop="showConfirm(user)"><v-icon>mdi-account-minus-outline</v-icon> Delete</v-btn>
                        </v-list-item-action>
                    </v-list-item>
                </v-list-item-group>
            </v-list>

            <v-dialog
                    persistent
                    v-model="deleteDialog"
                    max-width="30%"

            >
                <v-card>
                    <v-card-title class="headline" >Do you want to delete this user?</v-card-title>
                    <v-card-subtitle class="subtitle-1 font-italic font-weight-light" v-if="userToDelete">"{{userToDelete.login}}"</v-card-subtitle>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                                text
                                @click="deleteDialog = false"
                        >
                            <v-icon>mdi-cancel</v-icon>
                            Cancel
                        </v-btn>

                        <v-btn
                                color="error"
                                text
                                @click="remove(userToDelete)"
                        ><v-icon>mdi-delete</v-icon>
                            Remove
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <Modal v-if="addUserDialog" @closeModal="addUserDialog = false"/>
        </div>
    </div>
</template>

<script>
    import Background from "@/components/Background";
    import Navigation from "@/components/Navigation";
    import Error from "@/components/Error";
    import Modal from "@/components/Modal";
    import axios from "axios";
    import orderBy from 'lodash/orderBy';
    const serverUrl = 'https://ph-library-api-project.azurewebsites.net';

    export default {
        name: "Users",
        components:
            {
                Navigation,
                Background,
                Error,
                Modal,
            },
        data() {
            return {
                users: [],
                roles: [],
                usersRole: [],
                sortShow: false,
                search: '',
                sort: [false, false],
                deleteDialog: false,
                userToDelete: null,
                error:null,
                role: '',
                addUserDialog: false,
            }
        },
        async mounted()
        {
            this.role = this.$cookies.get('role')
            // load all users from server
            await axios.get(serverUrl+'/admin/getUsers', { 'headers': { 'Authorization': this.$cookies.get('token')}}).then(users => this.users=users.data).catch((error)=>this.error=error);
            await axios.get(serverUrl+'/admin/getRoles', { 'headers': { 'Authorization': this.$cookies.get('token')}}).then(roles => this.roles=roles.data);
            await axios.get(serverUrl+'/admin/getUserRole', { 'headers': { 'Authorization': this.$cookies.get('token')}}).then(usersRole => this.usersRole=usersRole.data);
        },
        methods:{
            clearSearch(){
                this.search='';
            },
            sortNameAsc()
            {
                this.noSort();
                this.sort[0] = true;
            },
            sortNameDsc()
            {
                this.noSort();
                this.sort[1] = true;
            },
            noSort()
            {
                this.sort = [false, false];
            },
            showConfirm(user){
                this.deleteDialog=true;
                this.userToDelete=user;
            },
            showUserRole(user){
                let _ = this.usersRole.filter((item) => {return item.userId == user.id})[0];
                let _userRole = this.roles.filter(
                        (item) => {
                            return _.roleId == item.id
                        })[0];
                return _userRole;
            },
            remove(user)
            {
                console.log("delete" + user)
            }

        },
        computed: {
            Users() {
                //Filter
                let users = this.users.filter((item) => {
                    if (this.search == '') {
                        return true
                    } else {
                        try {
                            return item.login.toLowerCase().match(this.search.toLowerCase())
                        } catch (TypeError) {
                            return true
                        }
                    }

                });
                //Sort
                if (this.sort[0]) {
                    return orderBy(users, 'login', 'asc');
                }
                if (this.sort[1]) {
                    return orderBy(users, 'login', 'desc');
                }
                return users;
            },
        }
    }
</script>

<style scoped>

</style>