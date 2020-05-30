<template>
    <div class="searchSong">
        <input
                id="search"
                name="search"
                :value="value"
                @input="handleChange"
                :class="{dark}"
        />
    </div>
</template>

<script>
    export default {
        name: "SearchInput",
        props:
            {
                value:
                    {
                        type: String,
                        required: true,
                    },
                dark:
                    {
                        type: Boolean,
                        default: false,
                    },
            },
        methods:
            {
                handleChange(e)
                {
                    this.$emit('input', e.target.value);
                }

            },
    }
</script>

<style scoped>

    .searchSong{
        display: flex;
        flex-direction: column;
        width: 300px;
    }
    input{
        background:none;
        height: 50px;
        border: 0;
        border-bottom: 1px solid white;
        color: aliceblue;
        text-align: center;
        transition: box-shadow .5s;
        font-size: large;
    }
    input:focus{
        outline: none;
        box-shadow: 0 10px 20px -8px rgba(255,255,255,0.3);
    }
    input:hover{
        cursor: pointer;
    }
</style>