<template>
    <div class="outerWrapper" align="center">
        <error :error="error"></error>
        <navigation :role="role"/>
        <background/>
        <v-card class="innerWrapper" v-if="!error" shaped >
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
                        <v-row>
                            <v-col>
                                <h1 class="headline font-weight-light"> Publication date:</h1>
                                <v-date-picker
                                        v-model="published"
                                        reactive
                                        :rules="DateRules"
                                        landscape
                                        show-current
                                ></v-date-picker>
                            </v-col>
                            <v-col>
                                <v-textarea
                                        outlined
                                        placeholder="Insert book description here..."
                                        full-width
                                        auto-grow
                                        v-model="description"
                                        prepend-inner-icon="mdi-book-open"
                                        rounded
                                        label="Book's description"
                                        clearable
                                        clear-icon="mdi-close"
                                        :rules="DescriptionRules"
                                >
                                </v-textarea>

                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
            </div>
            <v-card-actions>
                <v-container>
                    <v-row>
                        <v-alert v-if="bookError" type="error">Could not upload this book, check if it's not already in a library.</v-alert>
                    </v-row>
                    <v-row justify="space-around">
                        <v-btn rounded :disabled="!valid" @click.prevent="addToDb"><v-icon>mdi-book-plus</v-icon> Add book to your library</v-btn>
                    </v-row>
                    <v-spacer></v-spacer>
                </v-container>
            </v-card-actions>
        </v-card>

    </div>
</template>

<script>
    import axios from 'axios';
    import Navigation from "@/components/Navigation";
    import Background from "@/components/Background";
    import Error from "@/components/Error";
    const serverUrl = 'https://ph-library-api-project.azurewebsites.net';

    export default {
        name: "AddBook",
        components:
            {
                Navigation,
                Background,
                Error,
            },
        data(){
            return{
                bookError: false,
                authorId: null,
                valid: false,
                bookTitle: null,
                description: null,
                published: null,
                dbAuthors: [],
                newAuthors: [],
                search: null,
                bookTitleRules: [
                    value => !!value || 'Required.',
                    value => (value && value.length >= 3) || 'Min 3 characters',
                ],
                authorsRules: [
                    value => value.length>0 || 'Required.',
                ],
                DateRules: [
                    value => value.length>0 || 'Required.',
                ],
                DescriptionRules: [
                    value => value.length>0 || 'Required.',
                ],
                role: '',
                authRole: '',
                error: null,
            };
        },
        methods: {
            authorDescription: item => item.name,
            async addToDb() {
                //convert date to year only
                let publicationYear = parseInt(this.published.slice(0,4))
                //Add book to db
                try {
                    await axios.post(serverUrl + '/admin/createBookWithAuthors', {
                        name: this.bookTitle,
                        description: this.description,
                        publicationYear: publicationYear,
                        authors: this.newAuthors,
                    },
                        { 'headers': { 'Authorization': this.$cookies.get('token')}}
                    );
                    await this.$router.push('books')
                } catch (e) {
                    console.log(e)
                    this.bookError = true;
                    return;
                }

            }
        },
        async mounted()
        {
            this.role = this.$cookies.get('role')
            await axios.get(serverUrl+'/authors',{ 'headers': { 'Authorization': this.$cookies.get('token')} }).then(
                authors => {
                    let value = authors.data;
                    this.dbAuthors = value
                }).catch((error)=>console.log(error));
            this.authRole = this.role
        }
    }
</script>

<style scoped>

    .innerWrapper{
        height: auto;
        justify-content: center;
        flex-direction: column;
        margin: 20px;
    }
    .unauthorized{
        color: aliceblue;
    }
</style>