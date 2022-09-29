<template>
    <v-card class="mb-1" 
        :style="[selected ? {'border': '3px solid white'} : settings.saved ? {'border': '3px solid green'} : {'border': '3px solid transparent'}]"
    >
        <v-img v-if="ready" :src="src" @click="$emit('show', settings, src)"></v-img>
        <v-progress-circular
            class="ma-4"
            v-if="!ready"
            :rotate="0"
            :size="100"
            :width="15"
            :value="progress"
            color="teal"
        >
        {{ progress }}
        </v-progress-circular>
    </v-card> 
</template>
<script>
    export default {
        emits: ['show'],
        props: ['prompt_id', 'settings', 'selected'],
        data() {
            return {
                ready:false,
                src: "",
                progress: 0,
                progressInterval: {},
            }
        },
        watch:{

            settings: {
                immediate: true,
                handler() {

                    if (this.settings.status == 2) {
                        this.overlay = false
                        this.progress = 0
                        var imgUrl = this.api_server + "/download_prompt/?prompt_id=" + this.settings.prompt_id
                        this.src = imgUrl
                        this.ready = true
                    }
                    else {
                        this.progressInterval = setInterval(() => {
                            if (this.progress === 100) {
                                var checkOptions = {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ 
                                        prompt_id: this.settings.prompt_id,
                                    })}
                                fetch(this.api_server + "/check_prompt/", checkOptions)
                                .then(response => response.json())
                                .then(data => {
                                    if(data.result == "OK"){
                                        this.overlay = false
                                        this.progress = 0
                                        clearInterval(this.progressInterval)
                                        var imgUrl = this.api_server + "/download_prompt/?prompt_id=" + this.settings.prompt_id
                                        this.src = imgUrl
                                        this.ready = true
                                    } else {
                                        this.progress = 80
                                    }
                                });
                            }
                            this.progress += 1
                        }, this.settings.gen_time / 100.0);
                    }
                }
            },
        },
    }
</script>