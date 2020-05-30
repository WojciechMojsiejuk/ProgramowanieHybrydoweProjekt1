<template>
    <div class="item">
        <h3>{{this.songTitle}}</h3>
        <img :src="this.thumbnails.medium.url"/>
<!--        <youtube :video-id="videoId"></youtube>-->
    </div>
</template>

<script>
    export default {
        name: "SearchResultItem",
        props:
            {
                item: {
                    type: Object,
                    required: true,
                },
            },
        data(){
            return{
                songTitle: this.item.snippet.title,
                channelTitle: this.item.snippet.channelTitle,
                published: this.item.snippet.publishedAt,
                thumbnails: this.item.snippet.thumbnails,
                videoId: this.item.id.videoId,
            };
        },
        mounted()
        {
            this.videoId = this.item.id.videoId;
        }
    };
</script>

<style scoped>
    .item{
        position: relative;
        padding: 30px;
        margin: 1px;
        width: auto;
        height: auto;
    }
    .item:hover{
    outline: 1px solid aliceblue;
    cursor: pointer;
    box-shadow: 0 10px 20px -8px rgba(255,255,255,0.3);
    }

</style>