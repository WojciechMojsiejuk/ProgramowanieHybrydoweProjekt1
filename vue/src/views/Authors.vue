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
<!--                            <v-list-item-subtitle v-if="threeLine">-->
<!--                                <v-row  class="px-4">-->
<!--                                    <ul>-->
<!--&lt;!&ndash;                                    <li class="ml-2" v-for="song in showArtistSongs(artist)" :key="song.id">&ndash;&gt;-->
<!--&lt;!&ndash;                                            {{song.songTitle}}&ndash;&gt;-->
<!--&lt;!&ndash;                                        </li>&ndash;&gt;-->
<!--                                    </ul>-->
<!--                                </v-row>-->
<!--                            </v-list-item-subtitle>-->
                        </v-list-item-content>
<!--                        , showArtistSongs(author)-->
                        <v-list-item-action>
                            <v-btn icon @click.stop="showConfirm(author)" ><v-icon>mdi-close</v-icon></v-btn>
                        </v-list-item-action>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
            <!--                    Confirm delete dialog-->
            <v-dialog
                    persistent
                    v-model="deleteDialog"
                    max-width="45%"

            >
                <v-card>
                    <v-card-title class="headline" >Do you want to delete this author and all their books?</v-card-title>
                    <v-card-subtitle class="subtitle-1 font-italic font-weight-light" v-if="authorToDelete">{{authorToDelete.artistName}}</v-card-subtitle>
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
                        ><v-icon>mdi-delete</v-icon>
                            <!--                                @click.prevent="remove(artistsToDelete,showArtistSongs(artistsToDelete))"-->
                            Remove
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

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
    const serverUrl = ' http://localhost:7777';

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
                booksList: [],
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
            console.log(serverUrl+'/authors')
            // load all songs from server
            await axios.get(serverUrl+'/authors').then(authors => this.authors=authors.data);
            console.log(this.authors)
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
            // showArtistSongs(artist){
            //     let _ = this.songArtists.filter((item) => {return item.artistId === artist.id});
            //     let _artistSongs = [];
            //     for( let entity of _){
            //         _artistSongs .push(this.playlist.filter(
            //             (item) => {
            //                 return entity.songId === item.id
            //             }
            //         )[0]);
            //     }
            //     return _artistSongs;
            // },
            // async remove(artist, songs) {
            //     for(let song of songs){
            //         let linking = this.songArtists.filter((item) => {return item.songId == song.id});
            //         if(linking.length==1)
            //         {
            //             // eslint-disable-next-line no-console
            //             await axios.delete(serverUrl+'/songs/'+song.id);
            //         }
            //     }
            //     await axios.delete(serverUrl+'/artists/'+artist.id);
            // },
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