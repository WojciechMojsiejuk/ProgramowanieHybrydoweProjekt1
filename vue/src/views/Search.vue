<template>
  <v-container>
    <Navigation></Navigation>
    <v-layout
            text-center
            wrap
    >
    <div :class="[{ flexStart: step===1 },'wrapper']">
      <transition name="fade">
        <SearchBackground/>
      </transition>
      <SearchClaim v-if="step === 0"/>
      <SearchInput v-model="searchValue" @input="handleInput" :dark="step===1"/>
      <div class="searchResults" v-if="results && !loading && step===1">
        <SearchResultItem v-for="item in results" :item="item" :key="item.id.videoId" @click.native="handleModalOpen(item)"/>
      </div>
      <Modal v-if="modalOpen" @closeModal="modalOpen=false" :item="modalItem"/>
    </div>
    </v-layout>
  </v-container>
</template>

<script>
  import axios from 'axios';
  import debounce from 'lodash.debounce';
  import SearchInput from "@/components/SearchInput";
  import SearchBackground from "@/components/Background";
  import SearchClaim from "@/components/SearchClaim";
  import SearchResultItem from "@/components/SearchResultItem";
  import Modal from "@/components/Modal";
  import Navigation from "@/components/Navigation";
  const YOUTUBE_API = 'https://www.googleapis.com/youtube/v3/search';
export default {
  name: 'Search',
  components:
          {
            Navigation,
            SearchClaim,
            SearchBackground,
            SearchInput,
            SearchResultItem,
            Modal,
          },
  data() {
    return {
      modalOpen: false,
      modalItem: null,
      loading: false,
      step: 0,
      searchValue: '',
      results: [],
    };
  },
  //
  methods:
          {
            handleInput: debounce(function()
            {
              let $this = this;
              $this.loading = true;
              axios.get(`${YOUTUBE_API}?q=${this.searchValue}&part=snippet&key=AIzaSyCofLG8HocAvre4tEmdRye5-jhmvu9f3Qc&type=video&videoCategoryId=10`)
                      .then(function(response){
                        let searchResults = response.data.items;
                        $this.results = searchResults;
                        $this.loading=false;
                        $this.step=1;

                      }).catch(function(error){
                        // eslint-disable-next-line no-console
                        console.log(error);
                      });
            }, 1000),
            handleModalOpen(item){
              this.modalOpen=true;
              this.modalItem=item;

            }
          },
};

</script>

<style>

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  /*padding: 30px;*/
  width: 100%;
  height: 100vh;
  justify-content: center;
  color: aliceblue;
}

.flexStart{
  justify-content: flex-start;
}

  .fade-enter-active, .fade-leave-active{
    transition: opacity .5s ease;
  }
  .fade-enter, .fade-leave-to{
    opacity: 0;
  }
  .searchResults{
    margin-top: 50px;
    color: aliceblue;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
    backdrop-filter: blur(1px);
  }


</style>
