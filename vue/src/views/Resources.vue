<template>
    <div class="resourcesWrapper">
        <navigation :role="role"/>
        <background/>
        <error :error="error"></error>
        <div class="resourcesHolder" v-if="books.length">
            <!--  options bar-->
            <v-container fluid justify="space-between">
                <v-app-bar
                        color="rgba(0,0,0,0.3)"
                        dark
                        flat
                >
                    <v-toolbar-title>
                        Library resources
                    </v-toolbar-title>
                    <v-container align="center">
                        <v-row align="center">
                            <v-layout class="d-inline-flex" >
                                <v-flex  class="d-inline-flex">
                                    <v-layout column align-center>
                                        <v-switch v-model="threeLine" class="ma-0" label="More info" align="center"></v-switch>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
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
                                            <v-btn rounded outlined @click="sortPubDateAsc"><v-icon>mdi-sort-ascending</v-icon> by date of publication ascending </v-btn>
                                        </v-row>
                                        <v-row class="ma-1">
                                            <v-btn rounded outlined @click="sortPubDateDsc"><v-icon>mdi-sort-descending</v-icon> by date of publication descending </v-btn>
                                        </v-row>
                                        <v-row class="ma-1">
                                            <v-btn rounded outlined @click="noSort"><v-icon>mdi-sort-variant-remove</v-icon>Clear</v-btn>
                                        </v-row>
                                    </v-container>

                                </v-menu>
                            </v-layout>
                            <v-layout>
                                <v-text-field v-model="search" :clear-icon-cb="clearSearch" clearable placeholder="Search books..."
                                              append-icon="mdi-magnify"
                                ></v-text-field>
                            </v-layout>
                        </v-row>
                    </v-container>

                </v-app-bar>
            </v-container>
            <v-content>
                <!--                    Songs list-->
                <v-list
                        :three-line="threeLine"
                        shaped
                        dark
                        style="max-height: 70vh; background: rgba(0,0,0,0.4)"
                        class="overflow-y-auto"
                >
                    <v-list-item-group id="songs" >
                        <v-list-item
                                v-for="book in Books"
                                :key="book.id"
                        >

                            <v-list-item-content>
                                <v-list-item-title><h3 class="headline font-weight-light">{{book.name}}</h3></v-list-item-title>
                                <v-row  class="px-4">Published: {{book.publicationYear | formatDate}}
                                </v-row>
                                <v-list-item-subtitle v-if="threeLine">
                                    <v-row  class="px-4">
                                        {{book.description}}
                                    </v-row>
                                    <v-row  class="px-4">
                                        <span>By:</span>
                                        <span class="ml-2" v-for="author in showBookAuthors(book)" :key="author.id">
                                            {{author.name}}
                                        </span>
                                    </v-row>
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn outlined rounded @click="borrow(book)" :disabled="bookIsBorrowed(book)"><v-icon>mdi-book-plus</v-icon>Borrow</v-btn>
                                <v-btn icon @click.stop="showConfirm(book)" ><v-icon>mdi-close</v-icon></v-btn>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
                <!--                    Confirm delete dialog-->
                <v-dialog
                        persistent
                        v-model="deleteDialog"
                        max-width="30%"

                >
                    <v-card>
                        <v-card-title class="headline" >Do you want to delete this book?</v-card-title>
                        <v-card-subtitle class="subtitle-1 font-italic font-weight-light" v-if="bookToDelete">"{{bookToDelete.name}}"</v-card-subtitle>
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
                                    @click="remove(bookToDelete)"
                            ><v-icon>mdi-delete</v-icon>
                                Remove
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-content>

        </div>
        <v-row class="resourcesEmpty" justify="center" v-if="!books.length">
            <h2 class="headline  font-weight-light" style="color: aliceblue;"> Your library is empty</h2>
        </v-row>
    </div>
</template>

<script>
    import Background from "@/components/Background";
    import Navigation from "@/components/Navigation";
    import Error from "@/components/Error"
    import axios from "axios";
    import orderBy from 'lodash/orderBy';
    const serverUrl = 'https://ph-library-api-project.azurewebsites.net';


    export default {
        name: "Resources",
        components:
            {
                Navigation,
                Background,
                Error,
            },
        data() {
            return {
                books:[],
                authors:[],
                authorBooks: [],
                threeLine: true,
                search: '',
                sort: [false, false, false, false],
                sortShow: false,
                detailsDialog: false,
                bookToFocus: null,
                bookTitle: null,
                bookDescription: null,
                bookAuthors: [],
                deleteDialog: false,
                bookToDelete: null,
                error: null,
                role:'',
            }
        },
        methods:
            {
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
                sortPubDateAsc()
                {
                    this.noSort();
                    this.sort[2] = true;
                },
                sortPubDateDsc()
                {
                    this.noSort();
                    this.sort[3] = true;
                },
                noSort()
                {
                    this.sort = [false, false, false, false];
                },
                showBookAuthors(book){
                    let _ = this.authorBooks.filter((item) => {return item.bookId == book.id});
                    let _bookAuthors = [];
                    for( let entity of _){
                        _bookAuthors.push(this.authors.filter(
                            (item) => {
                                return entity.authorId == item.id
                            }
                        )[0]);
                    }
                    return _bookAuthors;
                },
                showConfirm(book){
                    this.deleteDialog=true;
                    this.bookToDelete=book;
                },
                async borrow(book)
                {
                    await axios.patch( serverUrl+'/borrowBook?bookId='+book.id, {},
                        {
                            'headers': { 'Authorization': this.$cookies.get('token')}
                        }).then((response)=>{if(response.status==200){book.borrowedBy=true}}).catch((error)=>this.error = error)

                },
                bookIsBorrowed: function(book)
                {
                    if(book.borrowedBy != null)
                    {
                        return true;
                    }
                    else
                    {
                        return false
                    }
                },
                async remove(book)
                {
                    await axios.delete( serverUrl+'/admin/deleteBook?id='+book.id,
                        {
                            'headers': { 'Authorization': this.$cookies.get('token')}
                        }).then((response)=>{if(response.status==200){this.deleteDialog=false,this.$delete(this.books,book.id)}}).catch((error)=>this.error = error)

                }
            },
        mounted()
        {
            this.role = this.$cookies.get('roles')
            // load all books from server
            axios.get(serverUrl+'/books',{ 'headers': { 'Authorization': this.$cookies.get('token')}}).then(books => this.books=books.data).catch((error)=>this.error=error);
            axios.get(serverUrl+'/authors',{ 'headers': { 'Authorization': this.$cookies.get('token')}}).then(authors => this.authors=authors.data).catch((error)=>this.error=error);
            axios.get(serverUrl+'/authorBook',{ 'headers': { 'Authorization': this.$cookies.get('token')}}).then(authorBooks => this.authorBooks=authorBooks.data).catch((error)=>this.error=error);
        },
        computed: {
            Books(){
                //Filter
                let books = this.books.filter((item) => {
                    if(this.search=='')
                    {
                        return true
                    }
                    else
                    {
                        try{
                            let search = item.name.toLowerCase().match(this.search.toLowerCase())
                            if(search == null)
                            {
                                return item.publicationYear.toString().match(this.search.toString())
                            }
                            return search
                        }
                        catch(TypeError){
                            return true
                        }
                    }
                });
                //Sort
                if(this.sort[0])
                {
                    return orderBy(books, 'name', 'asc');
                }
                if(this.sort[1])
                {
                    return orderBy(books, 'name', 'desc');
                }
                if(this.sort[2])
                {
                    return orderBy(books, 'publicationYear', 'asc');
                }
                if(this.sort[3])
                {
                    return orderBy(books, 'publicationYear', 'desc');
                }
                return books;
            },
        },
    }
</script>

<style scoped>

</style>