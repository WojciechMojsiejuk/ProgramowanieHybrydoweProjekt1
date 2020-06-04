<template>
    <div class="authorsWrapper">
        <navigation></navigation>
        <background></background>
        <div class="authorsHolder" v-if="authors.length">
            <!--                Bookslist options bar-->
            <v-container fluid justify="space-between">
                <v-app-bar
                        color="rgba(0,0,0,0.3)"
                        dark
                        flat
                >
                    <v-toolbar-title>
                        Authors
                    </v-toolbar-title>
                    <v-container align="center">
                        <v-row align="center">
                            <v-layout class="d-inline-flex" >
                                <v-flex  class="d-inline-flex">
                                    <v-layout column align-center>
                                        <v-switch v-model="threeLine" class="ma-0" label="Show authors' books" align="center"></v-switch>
                                    </v-layout>
                                </v-flex>
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
                                <v-text-field v-model="search" :clear-icon-cb="clearSearch" clearable placeholder="Search authors by their name..."
                                              append-icon="mdi-magnify"
                                ></v-text-field>
                            </v-layout>
                        </v-row>
                    </v-container>

                </v-app-bar>
            </v-container>
            <!--                Authors list-->

            <v-list
                    shaped
                    dark
                    style="max-height: 70vh; background: rgba(0,0,0,0.4)"
                    class="overflow-y-auto"
                    :three-line="threeLine"
            >
                <v-list-item-group>
                    <v-list-item
                            v-for="author in Authors"
                            :key="author.id"
                    >
                        <v-list-item-content>
                            <v-list-item-title>{{author.name}} {{author.surname}}</v-list-item-title>
                            <v-list-item-subtitle v-if="threeLine">
                                <v-row  class="px-4">
                                    <ul>
                                    <li class="ml-2" v-for="book in showBookAuthors(author)" :key="book.id">
                                            {{book.name}} {{book.publicationYear}}
                                        </li>
                                    </ul>
                                </v-row>
                                <v-row v-if="!showBookAuthors(author).length">
                                    <span class="overline font-weight-light px-4" style="color: aliceblue;"> This author doesn't have any books</span>
                                </v-row>
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>

        </div>
        <v-row class="authorsEmpty" justify="center" v-if="!authors.length">
            <h2 class="headline  font-weight-light" style="color: aliceblue;"> Your library don't have any authors, please add book first</h2>
        </v-row>
    </div>
</template>

<script>
    import Background from "@/components/Background";
    import Navigation from "@/components/Navigation";
    import axios from "axios";
    import orderBy from 'lodash/orderBy';
    const serverUrl = 'https://biblioteka-api-ph-library-api.azuremicroservices.io';

    export default {
        name: "Authors",
        components:
            {
                Navigation,
                Background,
            },
        data() {
            return {
                authors: [],
                books: [],
                authorsBooks: [],
                threeLine: true,
                sortShow: false,
                search: '',
                sort: [false, false],
                deleteDialog: false,
                authorToDelete: null,
            }
        },
        async mounted()
        {
            // load all authors from server
            await axios.get(serverUrl+'/authors').then(authors => this.authors=authors.data);
            await axios.get(serverUrl+'/books').then(books => this.books=books.data);
            await axios.get(serverUrl+'/authorBooks').then(authorsBooks => this.authorsBooks=authorsBooks.data);
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
            showConfirm(author){
                this.deleteDialog=true;
                this.authorToDelete=author;
            },
            showBookAuthors(author){
                console.log(this.authorsBooks)
                let _ = this.authorsBooks.filter((item) => {return item.authorId == author.id});
                let _bookAuthors = [];
                for( let entity of _){
                    _bookAuthors.push(this.books.filter(
                        (item) => {
                            return entity.bookId == item.id
                        }
                    )[0]);
                }
                console.log(_bookAuthors)
                return _bookAuthors;
            },
        },
        computed: {
            Authors() {
                //Filter
                let authors = this.authors.filter((item) => {
                    if (this.search == '') {
                        return true
                    } else {
                        try {
                            return item.surname.toLowerCase().match(this.search.toLowerCase()) + item.name.toLowerCase().match(this.search.toLowerCase())
                        } catch (TypeError) {
                            return true
                        }

                    }

                });
                //Sort
                if (this.sort[0]) {
                    return orderBy(authors, 'name', 'asc');
                }
                if (this.sort[1]) {
                    return orderBy(authors, 'name', 'desc');
                }
                return authors;

            },

        }
    }
</script>

<style scoped>

</style>