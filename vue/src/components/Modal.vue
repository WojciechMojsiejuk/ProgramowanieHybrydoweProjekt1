<template>
    <div class="outerWrapper" align="center">
        <v-card class="innerWrapper" shaped >
            <div class="mediaPlayer pa-4">
            </div>
                <div class="description">
                    <v-form v-model="valid">
                    <v-container fluid>
                        <v-row>
                            <v-col cols="12">
                            <v-text-field
                                    required
                                    v-model="bookTitle"
                                    :rules="bookTitleRules"
                                    hide-details="auto"
                                    label="Book title:"
                                    prepend-icon="mdi-book"
                                    outlined
                                    rounded
                                    clearable
                                    dense
                            ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">

                            <v-combobox
                                    required
                                    v-model="newAuthors"
                                    :rules="authorsRules"
                                    :items="dbAuthors"
                                    :item-text="authorDescription"
                                    :search-input.sync="search"
                                    label="Authors:"
                                    deletable-chips
                                    prepend-icon="mdi-account-edit"
                                    multiple
                                    rounded
                                    clearable
                                    outlined
                                    dense
                                    persistent-hint
                                    small-chips
                            >
                                <template v-slot:no-data>
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                No results matching "<strong>{{ search }}</strong>". Press <kbd>enter</kbd> to create a new one
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </template>
                            </v-combobox>
                                <div class="authorSearch"></div>
                            </v-col>
                            </v-row>
                    </v-container>
                    </v-form>
                    </div>
            <v-card-actions>
                <v-container>
                <v-row>
                    <v-alert v-if="bookError" type="error">Could not upload this book, check if it's not already in a library.</v-alert>
                    <v-alert v-if="authorError" type="error">Something went wrong. Could not add author.</v-alert>
                    <v-alert v-if="artistSongError" type="error">Something went wrong, we couldn't add this book to your playlist</v-alert>
                </v-row>
                <v-row justify="space-around">
                        <v-btn rounded @click="$emit('closeModal')"><v-icon >mdi-close</v-icon>Close</v-btn>
                        <v-btn rounded :disabled="!valid" @click.prevent="addToDb"><v-icon>mdi-music-note-plus</v-icon> Add book to your playlist</v-btn>
                </v-row>
                <v-spacer></v-spacer>
                </v-container>
            </v-card-actions>
            </v-card>
        </div>
</template>

<script>
    import axios from 'axios';
    const serverUrl = 'http://localhost:7777';

    export default {
        name: "Modal",
        props:
            {
                item:
                    {
                        type: Object,
                        required: true,
                    },
            },
        data(){
            return{
                bookError: false,
                artistSongError: false,
                authorError: false,
                artistId: null,
                valid: false,
                bookTitle: null,
                channelTitle: null,
                published: null,
                thumbnails: null,
                videoId: null,
                dbAuthors: [],
                newAuthors: [],
                newSong: null,
                search: null,
                bookTitleRules: [
                    value => !!value || 'Required.',
                    value => (value && value.length >= 3) || 'Min 3 characters',
                ],
                authorsRules: [
                    value => value.length>0 || 'Required.',
                ]
            };
        },
        methods:{
            authorDescription: item => item.artistName,
            async addToDb() {
                // //Add song to db
                try{
                    await axios.post(serverUrl+'/songs', {
                        id: this.videoId,
                        songTitle: this.bookTitle,
                        publishedDate: this.published,
                        joiningDate: new Date(),
                        thumbnails: this.thumbnails,
                        lyrics: "",
                    });
                }
                catch(e){
                    // eslint-disable-next-line no-console
                    console.log('Song error', e);
                    this.bookError=true;
                    return;
                }
                for(let artist of this.newAuthors)
                {
                    if(artist.artistName != undefined)
                    {
                        //linking artists with songs
                        try{
                            await axios.post(serverUrl+'/songArtists', {
                                artistId: artist.id,
                                songId: this.videoId});
                        }
                        catch(e)
                        {
                            // eslint-disable-next-line no-console
                            console.log('songArtist error', e);
                            this.artistSongError=true;
                            return;
                        }
                    }
                    else if(this.dbAuthors.map(s => s.artistName).includes(artist))
                    {
                        //this name is already in DB, we need to find this artist, and add linking
                        let searchedArtist = this.dbAuthors.find((item) => {return item.artistName === artist});
                        //linking artists with songs
                        try{
                            await axios.post(serverUrl+'/songArtists', {
                                artistId: searchedArtist.id,
                                songId: this.videoId});
                        }
                        catch(e)
                        {
                            // eslint-disable-next-line no-console
                            console.log('songArtist error', e);
                            this.artistSongError=true;
                            return;
                        }
                    }
                    else{
                        // if artists is not in DB we need to create him/her
                        //Add artist to db
                        try{
                            let response = await axios.post(serverUrl+'/artists', {
                                artistName: artist
                            });
                            this.artistId = await response.data.id;
                        }
                        catch (e) {
                            // eslint-disable-next-line no-console
                            console.log('Artist error', e);
                            this.authorError=true;
                            return;
                        }
                        try{
                            //linking artists with songs
                            await axios.post(serverUrl+'/songArtists', {
                                artistId: this.artistId,
                                songId: this.videoId
                            })
                        }
                        catch (e) {

                            // eslint-disable-next-line no-console
                            console.log('songArtist', e);
                            this.artistSongError=true;
                            return;
                        }
                    }
                }
            }
        },
        mounted(){
            // let $this = this;
            this.bookTitle = this.item.snippet.title;
            this.channelTitle = this.item.snippet.channelTitle;
            this.published = this.item.snippet.publishedAt;
            this.thumbnails = this.item.snippet.thumbnails;
            this.videoId = this.item.id.videoId;
            this.newAuthors.push(this.channelTitle);
            // let $this = this;
            axios.get(serverUrl+'/artists').then(
                artists => {
                    let value = artists.data;
                    this.dbAuthors = value
                });
        },
    }
</script>

<style scoped>

    .outerWrapper{
        max-width: 70%;
        height: 90%;
        position:fixed;
        padding:30px;
    }
    .innerWrapper{
        display: flex;
        height: auto;
        max-height: 100%;
        padding:20px;
        /*justify-content: center;*/
        flex-direction: column;
        overflow: scroll;
    }
    .mediaPlayer{
        display: block;
        /*height: auto;*/
        float:left;
        position: relative;
    }
    @media (max-width:1200px){
        .mediaPlayer{
            display: none;
        }
    }
    .description{
        display: block;
        height: auto;
        color: black;
        float:left;
        position: relative;
    }
    .authorSearch{
        padding:10px;
    }
</style>