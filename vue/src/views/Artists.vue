<template>
    <div class="artistsWrapper">
        <background></background>
        <div class="artistsHolder" v-if="artists.length">
            <!--                Playlist options bar-->
            <v-container fluid justify="space-between">
                <v-app-bar
                        color="rgba(0,0,0,0.3)"
                        dark
                        flat
                >
                    <v-toolbar-title>
                        Artists
                    </v-toolbar-title>
                    <v-container align="center">
                        <v-row align="center">
                            <v-layout class="d-inline-flex" >
                                <v-flex  class="d-inline-flex">
                                    <v-layout column align-center>
                                        <v-switch v-model="threeLine" class="ma-0" label="Show artist songs" align="center"></v-switch>

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
                                            <v-btn rounded outlined @click="noSort"><v-icon>mdi-sort-variant-remove</v-icon>Clear</v-btn>
                                        </v-row>
                                    </v-container>

                                </v-menu>
                            </v-layout>
                            <v-layout>
                                <v-text-field v-model="search" :clear-icon-cb="clearSearch" clearable placeholder="Search artists by their name..."
                                              append-icon="mdi-magnify"
                                ></v-text-field>
                            </v-layout>
                        </v-row>
                    </v-container>

                </v-app-bar>
            </v-container>
            <!--                Artist list-->
            <v-list
                    :three-line="threeLine"
                    shaped
                    dark
                    style="max-height: 70vh; background: rgba(0,0,0,0.4)"
                    class="overflow-y-auto"
            >
                <v-list-item-group>
                    <v-list-item
                            v-for="artist in Artists"
                            :key="artist.id"
                    >
                        <v-list-item-content>
                            <v-list-item-title>{{artist.artistName}}</v-list-item-title>
                            <v-list-item-subtitle v-if="threeLine">
                                <v-row  class="px-4">
                                    <ul>
                                    <li class="ml-2" v-for="song in showArtistSongs(artist)" :key="song.id">
                                            {{song.songTitle}}
                                        </li>
                                    </ul>
                                </v-row>
                            </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-btn icon @click.stop="showConfirm(artist, showArtistSongs(artist))" ><v-icon>mdi-close</v-icon></v-btn>
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
                    <v-card-title class="headline" >Do you want to delete this artist and all their songs?</v-card-title>
                    <v-card-subtitle class="subtitle-1 font-italic font-weight-light" v-if="artistsToDelete">{{artistsToDelete.artistName}}</v-card-subtitle>
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
                                @click.prevent="remove(artistsToDelete,showArtistSongs(artistsToDelete))"
                        ><v-icon>mdi-delete</v-icon>
                            Remove
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

        </div>
        <v-row class="artistsEmpty" justify="center" v-if="!artists.length">
            <h2 class="headline  font-weight-light" style="color: aliceblue;"> Your playlist don't have any artists, please add songs first</h2>
        </v-row>
    </div>
</template>

<script>
    import Background from "@/components/Background";
    import axios from "axios";
    import orderBy from 'lodash/orderBy';
    const serverUrl = ' http://localhost:3000';

    export default {
        name: "Artist",
        components:
            {
                Background,
            },
        data() {
            return {
                artists: [],
                playlist: [],
                songArtists: [],
                threeLine: true,
                sortShow: false,
                search: '',
                sort: [false, false],
                deleteDialog: false,
                artistsToDelete: null,

            }
        },
        mounted()
        {
            let $this = this;
            // load all songs from server
            axios.get(serverUrl+'/songs').then(songs => $this.playlist=songs.data);
            axios.get(serverUrl+'/artists').then(artists => $this.artists=artists.data);
            axios.get(serverUrl+'/songArtists').then(songArtists => $this.songArtists=songArtists.data)
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
            showConfirm(artist){
                this.deleteDialog=true;
                this.artistsToDelete=artist;
            },
            showArtistSongs(artist){
                let _ = this.songArtists.filter((item) => {return item.artistId === artist.id});
                let _artistSongs = [];
                for( let entity of _){
                    _artistSongs .push(this.playlist.filter(
                        (item) => {
                            return entity.songId === item.id
                        }
                    )[0]);
                }
                return _artistSongs;
            },
            async remove(artist, songs) {
                for(let song of songs){
                    let linking = this.songArtists.filter((item) => {return item.songId == song.id});
                    if(linking.length==1)
                    {
                        // eslint-disable-next-line no-console
                        await axios.delete(serverUrl+'/songs/'+song.id);
                    }
                }
                await axios.delete(serverUrl+'/artists/'+artist.id);
            },
        },
        computed: {
            Artists() {
                //Filter
                let artists = this.artists.filter((item) => {
                    if (this.search == '') {
                        return true
                    } else {
                        try {
                            return item.artistName.toLowerCase().match(this.search.toLowerCase())
                        } catch (TypeError) {
                            return true
                        }

                    }

                });
                //Sort
                if (this.sort[0]) {
                    return orderBy(artists, 'artistName', 'asc');
                }
                if (this.sort[1]) {
                    return orderBy(artists, 'artistName', 'desc');
                }
                return artists;

            },

        }
    }
</script>

<style scoped>

</style>