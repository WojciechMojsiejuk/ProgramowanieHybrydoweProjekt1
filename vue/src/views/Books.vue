<template>
    <div class="outerWrapper" align="center">
        <v-card class="innerWrapper" shaped >
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
    export default {
        name: "Books"
    }
</script>

<style scoped>

</style>