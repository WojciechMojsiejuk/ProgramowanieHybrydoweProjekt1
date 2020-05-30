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
                        Playlist
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
                             <v-layout  class="d-inline-flex">
                                 <v-flex xs12 md6 lg3>
                                     <v-layout column align-center>
                                         <v-switch v-model="avatar" class="ma-0" label="Cover" align="center"></v-switch>
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
                                     <v-btn rounded outlined @click="sortPubDateAsc"><v-icon>mdi-sort-ascending</v-icon> by date of joining ascending </v-btn>
                                 </v-row>
                                 <v-row class="ma-1">
                                     <v-btn rounded outlined @click="sortPubDateDsc"><v-icon>mdi-sort-descending</v-icon> by date of joining descending </v-btn>
                                 </v-row>
                                 <v-row class="ma-1">
                                     <v-btn rounded outlined @click="sortJDateAsc"><v-icon>mdi-sort-ascending</v-icon> by date of publishing ascending </v-btn>
                                 </v-row>
                                 <v-row class="ma-1">
                                     <v-btn rounded outlined @click="sortJDateDsc"><v-icon>mdi-sort-descending</v-icon> by date of publishing descending </v-btn>
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
<!--                    Songs list-->
                        <v-list
                            :three-line="threeLine"
                            shaped
                            dark
                            :avatar="avatar"
                            style="max-height: 70vh; background: rgba(0,0,0,0.4)"
                            class="overflow-y-auto"
                        >
                        <v-list-item-group id="songs" >
                            <v-list-item
                                    v-for="song in BooksList"
                                    :key="song.id"
                                    @click="showSongDetails(song)"
                            >
                                <v-list-item-avatar v-if="avatar">
                                    <v-img :src="song.thumbnails.default.url"></v-img>
                                </v-list-item-avatar>
                                <v-list-item-content>
                                    <v-list-item-title>{{song.songTitle}}</v-list-item-title>
                                    <v-list-item-subtitle v-if="threeLine">
                                        <v-row  class="px-4">
                                            <span>By:</span>
                                             <span class="ml-2" v-for="artists in showSongArtists(song)" :key="artists.id">
                                            {{artists.artistName}}
                                        </span>
                                        </v-row>

                                        <v-row justify="end" class="px-4">
                                            Joined: {{song.joiningDate | formatDate}}
                                        </v-row>
                                        <v-row justify="end" class="px-4">
                                            Published: {{song.publishedDate | formatDate}}
                                        </v-row>
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-action>
                                    <v-btn icon @click.stop="showConfirm(song)" ><v-icon>mdi-close</v-icon></v-btn>
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
                            <v-card-title class="headline" >Do you want to delete this song?</v-card-title>
                            <v-card-subtitle class="subtitle-1 font-italic font-weight-light" v-if="songToDelete">"{{songToDelete.songTitle}}"</v-card-subtitle>
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
                                        @click="remove(songToDelete)"
                                ><v-icon>mdi-delete</v-icon>
                                    Remove
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
<!--                    Details dialog-->
                    <v-dialog v-if="songToFocus" v-model="detailsDialog" hide-overlay transition="dialog-bottom-transition" persistent>
                        <v-container fluid style="background: aliceblue" scrollable fill-height>
                            <v-row>
                                <!--                        Song Title-->
                                <v-col class="px-8" align="center" xs="12" sm="12" md="12" lg="12" xl="12" >
                                    <v-form v-model="valid">
                                        <v-text-field
                                                v-model="songTitle"
                                                :rules="songTitleRules"
                                                outlined
                                                rounded
                                                prepend-icon="mdi-music"
                                                label="Song Title"
                                                :readonly="!editSong"
                                                :clearable="editSong"
                                                clear-icon="mdi-close"

                                        >

                                        </v-text-field>
                                    </v-form>
                                </v-col>
                                <v-col class="px-4 xs12 sm12 md4 lg6" justify="center">
                                    <v-row>
                                        <youtube :video-id="songToFocus.id" fitParent resize></youtube>
                                    </v-row>
                                    <v-row class="overline mx-3">
                                        Published: {{songToFocus.publishedDate | formatDate}}
                                    </v-row>
                                </v-col>
                                <v-col class="px-4 xs12 sm12 md8 lg6 overflow-y-auto" style="max-height: 60vh; min-width: 30%;">
                                    <v-form v-model="valid">
                                        <v-col align="end">
                                            <v-combobox
                                                    v-model="newArtists"
                                                    :rules="artistsRules"
                                                    :items="artists"
                                                    :item-text="artistDescription"
                                                    :search-input.sync="searchArtists"
                                                    label="Artists:"
                                                    deletable-chips
                                                    prepend-icon="mdi-artist"
                                                    multiple
                                                    rounded
                                                    :clearable="editSong"
                                                    :disabled="!editSong"
                                                    outlined
                                                    dense
                                                    persistent-hint
                                                    small-chips
                                            >
                                                <template v-slot:no-data v-if="editSong">
                                                    <v-list-item>
                                                        <v-list-item-content>
                                                            <v-list-item-title>
                                                                No results matching "<strong>{{ search }}</strong>". Press <kbd>enter</kbd> to create a new one
                                                            </v-list-item-title>
                                                        </v-list-item-content>
                                                    </v-list-item>
                                                </template>
                                            </v-combobox>
                                            <!--                                                <span class="ml-2" v-for="artists in showSongArtists(songToFocus)" :key="artists.id">-->
                                            <!--                                            {{artists.artistName}}-->
                                            <!--                                            </span>-->
                                        </v-col>
                                        <v-col align="center" class="px-4">
                                            <h2>Lyrics:</h2>
                                            <v-textarea
                                                    outlined
                                                    placeholder="Put song lyrics here..."
                                                    full-width
                                                    auto-grow
                                                    v-model="songLyrics"
                                                    prepend-inner-icon="mdi-file-music"
                                                    rounded
                                                    label="Song Lyrics"
                                                    :readonly="!editSong"
                                                    :clearable="editSong"
                                                    clear-icon="mdi-close"

                                            >

                                            </v-textarea>

                                        </v-col>
                                    </v-form>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-alert v-if="dbError" type="error">Something went wrong, could not update song to database.</v-alert>
                            </v-row>
                            <v-row justify="space-around">
                                <v-btn @click="detailsDialog=false, editSong=false" rounded text><v-icon >mdi-close</v-icon> <span v-if="!editSong">Close</span><span v-if="editSong">Discard changes</span></v-btn>
                                <v-btn v-if="!editSong" rounded text @click="editSong=true"><v-icon>mdi-pencil</v-icon> Edit song</v-btn>
                                <v-btn v-if="editSong" rounded text :disabled="!valid" @click.prevent="editDb"><v-icon>mdi-content-save-edit</v-icon> Save modified</v-btn>
                            </v-row>
                        </v-container>
                    </v-dialog>
                </v-content>

        </div>
        <v-row class="playlistEmpty" justify="center" v-if="!booksList.length">
            <h2 class="headline  font-weight-light" style="color: aliceblue;"> Your boorowed books' list is empty</h2>
        </v-row>
    </div>
</template>

<script>
    import axios from 'axios'
    import Background from "@/components/Background";
    import Navigation from "@/components/Navigation";
    import orderBy from 'lodash/orderBy';
    import intersection from 'lodash/intersection';
    const serverUrl = ' http://localhost:3000';
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
                artists:[],
                songArtists: [],
                threeLine: true,
                avatar: true,
                search: '',
                sort: [false, false, false, false, false, false],
                sortShow: false,
                deleteDialog: false,
                songToDelete: null,
                detailsDialog: false,
                songToFocus: null,
                editSong: false,
                lyrics:'',
                songTitle:'',
                songLyrics:'',
                valid:false,
                songTitleRules: [
                    value => !!value || 'Required.',
                    value => (value && value.length >= 3) || 'Min 3 characters',
                ],
                artistsRules: [
                    value => value.length>0 || 'Required.',
                ],
                searchArtists:'',
                newArtists: [],
                artistsId: null,
                dbError: false,
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
        methods:
        {
            artistDescription: item => item.artistName,
            showSongDetails(song){
                this.detailsDialog=true;
                this.songToFocus=song;
                this.songTitle=this.songToFocus.songTitle;
               this.songLyrics = this.songToFocus.lyrics;
               this.newArtists = [];
               this.newArtists = this.showSongArtists(this.songToFocus);
            },
            showConfirm(song){
                this.deleteDialog=true;
                this.songToDelete=song;
            },
            async remove(song) {
                await axios.delete(serverUrl+'/songs/'+song.id);
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
            sortJDateAsc()
            {
                this.noSort();
                this.sort[4] = true;
            },
            sortJDateDsc()
            {
                this.noSort();
                this.sort[5] = true;
            },
            noSort()
            {
                this.sort = [false, false, false, false, false, false] ;
            },
            showSongArtists(song){
                let _ = this.songArtists.filter((item) => {return item.songId === song.id});
                let _songArtists = [];
                for( let entity of _){
                    _songArtists.push(this.artists.filter(
                        (item) => {
                            return entity.artistId === item.id
                        }
                    )[0]);
                }
                return _songArtists;
            },
            async editDb(){
                await axios.put(serverUrl+'/songs/'+this.songToFocus.id, {
                    id: this.songToFocus.id,
                    songTitle: this.songTitle,
                    publishedDate: this.songToFocus.publishedDate,
                    joiningDate:this.songToFocus.joiningDate,
                    thumbnails: this.songToFocus.thumbnails,
                    lyrics: this.songLyrics,
                });
                let oldArtists = this.showSongArtists(this.songToFocus);
                let intersect = intersection(oldArtists, this.newArtists);
                // eslint-disable-next-line no-console
                console.log("oldArtists:" + oldArtists);
                // eslint-disable-next-line no-console
                console.log("intersect:" + intersect);
                //artists which were originally but are not longer need to be deleted
                for (let oldArtist of oldArtists)
                {
                    //no intersect, all connection to old artists needs to be deleted
                    if(!intersect.length)
                    {
                        // eslint-disable-next-line no-console
                        console.log("Empty intersect")

                        try{
                            let oldArtistSongs = this.songArtists.filter((item) => {return item.artistId === oldArtist.id});
                            let linkingToDelete = oldArtistSongs.find((item) => {return item.songId === this.songToFocus.id});
                            await axios.put(serverUrl+'/songArtists/'+linkingToDelete.id, {
                                artistId: '',
                                songId: ''
                            });
                            await axios.delete(serverUrl+'/songArtists/'+linkingToDelete.id);
                        }
                        catch(e)
                        {
                            // eslint-disable-next-line no-console
                            console.log('Artist delete error', e);
                            this.dbError=true;
                            return;
                        }
                    }
                    else if(!intersect.map(s => s.artistName).includes(oldArtist.artistName))
                    {
                        try{
                            let oldArtistSongs = this.songArtists.filter((item) => {return item.artistId === oldArtist.id});
                            let linkingToDelete = oldArtistSongs.find((item) => {return item.songId === this.songToFocus.id});
                            await axios.put(serverUrl+'/songArtists/'+linkingToDelete.id, {
                                id:'ToDelete'
                            });
                            await axios.delete(serverUrl+'/songArtists/'+linkingToDelete.id);
                        }
                        catch(e)
                        {
                            // eslint-disable-next-line no-console
                            console.log('Artist delete error', e);
                            this.dbError=true;
                            return;
                        }

                    }
                }
                // artists which were not originally but now are need to be added to DB if they are not there already
                for(let newArtist of this.newArtists)
                {
                    // eslint-disable-next-line no-console
                    console.log("New artist: "+newArtist);
                    if(newArtist.artistName != undefined)
                    {
                        //artist is in a db
                        if(this.artists.map(s => s.artistName).includes(newArtist.artistName))
                        {
                            let newArtistSongs = this.songArtists.filter((item) => {return item.artistId === newArtist.id});
                            let linking = newArtistSongs.find((item) => {return item.songId === this.songToFocus.id});
                            //no linking? need to create new linking: no need to create, we can continue
                            if(linking==undefined)
                            {
                                this.artistId = newArtist.id;
                            }
                            else
                            {
                                continue;
                            }
                        }
                    }
                    else{
                        // eslint-disable-next-line no-console
                        console.log("Nowy artysta");
                        try{
                            let response = await axios.post(serverUrl+'/artists', {
                                artistName: newArtist
                            });
                            this.artistId = await response.data.id;
                        }
                        catch (e) {
                            // eslint-disable-next-line no-console
                            console.log('Artist error', e);
                            this.dbError=true;
                            return;
                        }
                    }
                    try{
                        //linking artists with songs
                        await axios.post(serverUrl+'/songArtists', {
                            artistId: this.artistId,
                            songId: this.songToFocus.id
                        })
                    }
                    catch (e) {

                        // eslint-disable-next-line no-console
                        console.log('songArtist', e);
                        this.dbError=true;
                        return;
                    }
                    }
            }
        },
        computed: {
            Playlist(){
                //Filter
                let playlist = this.booksList.filter((item) => {
                    if(this.search=='')
                    {
                        return true
                    }
                    else
                    {
                        try{
                            return item.songTitle.toLowerCase().match(this.search.toLowerCase())
                        }
                        catch(TypeError){
                            return true
                        }

                    }

                });
                //Sort
                if(this.sort[0])
                {
                    return orderBy(playlist, 'songTitle', 'asc');
                }
                if(this.sort[1])
                {
                    return orderBy(playlist, 'songTitle', 'desc');
                }
                if(this.sort[2])
                {
                    return orderBy(playlist, 'joiningDate', 'asc');
                }
                if(this.sort[3])
                {
                    return orderBy(playlist, 'joiningDate', 'desc');
                }
                if(this.sort[4])
                {
                    return orderBy(playlist, 'publishedDate', 'asc');
                }
                if(this.sort[5])
                {
                    return orderBy(playlist, 'publishedDate', 'desc');
                }
                return playlist;

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