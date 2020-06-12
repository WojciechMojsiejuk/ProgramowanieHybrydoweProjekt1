<template>
    <div class="playlistWrapper">
        <Navigation></Navigation>
        <background></background>
        <div class="playlistHolder" v-if="booksList.length">
<!--                Playlist options bar-->
                <v-container fluid justify="space-between">
                    <v-app-bar
                            color="rgba(0,0,0,0.3)"
                            dark
                            flat
                            >
                    <v-toolbar-title>
                        Borrowed Books List
                    </v-toolbar-title>
                     <v-container align="center">
                         <v-row align="center">
                             <v-layout>
                             <v-menu
                                     v-model="sortShow"
                                     close-on-click
                                     close-on-content-click
                                     offset-y
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
                             <v-text-field v-model="search" :clear-icon-cb="clearSearch" clearable placeholder="Search books by their title..."
                                     append-icon="mdi-magnify"
                             ></v-text-field>
                             </v-layout>
                         </v-row>
                     </v-container>

                </v-app-bar>
                </v-container>
                <v-content>
                        <v-list
                            shaped
                            dark
                            style="max-height: 70vh; background: rgba(0,0,0,0.4)"
                            class="overflow-y-auto"
                        >
                        <v-list-item-group id="books" >
                            <v-list-item
                                    v-for="book in BooksList"
                                    :key="book.id"
                            >
                                <v-list-item-content>
                                    <v-list-item-title>{{book.name}}</v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-action>
                                    <v-btn outlined rounded @click.stop="showConfirm(book)"><v-icon>mdi-book-remove</v-icon> Return</v-btn>
                                </v-list-item-action>
                            </v-list-item>
                        </v-list-item-group>
                        </v-list>
<!--                    Confirm delete dialog-->
                    <v-dialog
                            persistent
                            v-model="returnDialog"
                            max-width="30%"
                    >
                        <v-card>
                            <v-card-title class="headline" >Do you want to return this book?</v-card-title>
                            <v-card-subtitle class="subtitle-1 font-italic font-weight-light" v-if="bookToReturn">"{{bookToReturn.name}}"</v-card-subtitle>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                        text
                                        @click.native="returnDialog = false"
                                >
                                    <v-icon>mdi-cancel</v-icon>
                                    Cancel
                                </v-btn>

                                <v-btn
                                        color="error"
                                        text
                                        @click="returnBook(bookToReturn)"
                                ><v-icon>mdi-book-remove</v-icon>
                                    Return book
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-content>

        </div>
        <v-row class="booksListEmpty" justify="center" v-if="!booksList.length">
            <h2 class="headline  font-weight-light" style="color: aliceblue;"> Your boorowed books' list is empty</h2>
        </v-row>
    </div>
</template>

<script>
    import axios from 'axios'
    import Background from "@/components/Background";
    import Navigation from "@/components/Navigation";
    import orderBy from 'lodash/orderBy';
    const serverUrl = 'https://ph-library-api-project.azurewebsites.net';
    export default {
        name: "Bookslist",
        components:
            {
                Navigation,
                Background,
            },
        data() {
            return {
                booksList:[],
                search: '',
                sort: [false, false],
                sortShow: false,
                role:'',
                error:null,
                bookToReturn:null,
                returnDialog: false,
            }
            },
        mounted()
        {
            this.role = this.$cookies.get('roles')
            axios.get(serverUrl+'/listMyBooks',{ 'headers': { 'Authorization': this.$cookies.get('token')}}).then(books => this.booksList=books.data).catch((error)=>this.error=error);
        },
        methods:
        {
            showConfirm(book){
                this.returnDialog=true;
                this.bookToReturn=book;
            },
            async returnBook(book) {
                await axios.patch(serverUrl+'/returnBook?bookId='+book.id, {},{ 'headers': { 'Authorization': this.$cookies.get('token')}}).then(response => {if(response.status==200){this.returnDialog=false; this.$delete(this.booksList,book.id)}}).catch((error)=>console.log(error));
            },
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
                this.sort = [false, false] ;
            },
        },
        computed: {
            BooksList(){
                //Filter
                let booklist = this.booksList.filter((item) => {
                    if(this.search=='')
                    {
                        return true
                    }
                    else
                    {
                        try{
                            return item.name.toLowerCase().match(this.search.toLowerCase())
                        }
                        catch(TypeError){
                            return true
                        }
                    }
                });
                //Sort
                if(this.sort[0])
                {
                    return orderBy(booklist, 'name', 'asc');
                }
                if(this.sort[1])
                {
                    return orderBy(booklist, 'name', 'desc');
                }
                return booklist;

            },
        }

    }
</script>

<style scoped>
    p{
        color: black;
    }
    .playlistWrapper{
        /*height: 90vh;*/
        /*overflow-y:hidden;*/
    }
</style>