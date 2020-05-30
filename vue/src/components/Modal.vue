<template>
    <div class="outerWrapper" align="center">
        <v-card class="innerWrapper" shaped >
            <div class="mediaPlayer pa-4">
                <youtube :video-id="videoId"></youtube>
            </div>
                <div class="description">
                    <v-form v-model="valid">
                    <v-container fluid>
                        <v-row>
                            <v-col cols="12">
                            <v-text-field
                                    required
                                    v-model="songTitle"
                                    :rules="songTitleRules"
                                    hide-details="auto"
                                    label="Song title:"
                                    prepend-icon="mdi-music-note-eighth"
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
                                    v-model="newArtists"
                                    :rules="artistsRules"
                                    :items="dbArtists"
                                    :item-text="artistDescription"
                                    :search-input.sync="search"
                                    label="Artists:"
                                    deletable-chips
                                    prepend-icon="mdi-artist"
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
                                <div class="artistSearch"></div>
                            </v-col>
                            </v-row>
                    </v-container>
                    </v-form>
                    </div>
            <v-card-actions>
                <v-container>
                <v-row>
                    <v-alert v-if="songError" type="error">Could not upload this song, check if it's not already in your playlist.</v-alert>
                    <v-alert v-if="artistError" type="error">Something went wrong. Could not add artist.</v-alert>
                    <v-alert v-if="artistSongError" type="error">Something went wrong, we couldn't add this song to your playlist</v-alert>
                </v-row>
                <v-row justify="space-around">
                        <v-btn rounded @click="$emit('closeModal')"><v-icon >mdi-close</v-icon>Close</v-btn>
                        <v-btn rounded :disabled="!valid" @click.prevent="addToDb"><v-icon>mdi-music-note-plus</v-icon> Add song to your playlist</v-btn>
                </v-row>
                <v-spacer></v-spacer>
                </v-container>
            </v-card-actions>
            </v-card>
        </div>
</template>

<script>
    import axios from 'axios';
    const serverUrl = 'http://localhost:3000';

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
                songError: false,
                artistSongError: false,
                artistError: false,
                artistId: null,
                valid: false,
                songTitle: null,
                channelTitle: null,
                published: null,
                thumbnails: null,
                videoId: null,
                dbArtists: [],
                newArtists: [],
                newSong: null,
                search: null,
                songTitleRules: [
                    value => !!value || 'Required.',
                    value => (value && value.length >= 3) || 'Min 3 characters',
                ],
                artistsRules: [
                    value => value.length>0 || 'Required.',
                ]
            };
        },
        methods:{
            artistDescription: item => item.artistName,
            async addToDb() {
                // //Add song to db
                try{
                    await axios.post(serverUrl+'/songs', {
                        id: this.videoId,
                        songTitle: this.songTitle,
                        publishedDate: this.published,
                        joiningDate: new Date(),
                        thumbnails: this.thumbnails,
                        lyrics: "",
                    });
                }
                catch(e){
                    // eslint-disable-next-line no-console
                    console.log('Song error', e);
                    this.songError=true;
                    return;
                }
                for(let artist of this.newArtists)
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
                    else if(this.dbArtists.map(s => s.artistName).includes(artist))
                    {
                        //this name is already in DB, we need to find this artist, and add linking
                        let searchedArtist = this.dbArtists.find((item) => {return item.artistName === artist});
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
                            this.artistError=true;
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
            this.songTitle = this.item.snippet.title;
            this.channelTitle = this.item.snippet.channelTitle;
            this.published = this.item.snippet.publishedAt;
            this.thumbnails = this.item.snippet.thumbnails;
            this.videoId = this.item.id.videoId;
            this.newArtists.push(this.channelTitle);
            // let $this = this;
            axios.get(serverUrl+'/artists').then(
                artists => {
                    let value = artists.data;
                    this.dbArtists = value
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
    .artistSearch{
        padding:10px;
    }
</style>