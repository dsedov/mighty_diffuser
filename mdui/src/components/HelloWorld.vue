<template>
  <v-app id="inspire">




    <v-navigation-drawer app clipped permanent left width="150px" color="transparent" class="pa-2 invisible-scrollbar">
      <v-list class="d-flex flex-column-reverse" ref="history_container" id="historycontainer">
        <ImageThumb v-for="im in image_history" :key="im.prompt_id"
          :settings="im.settings" 
          :prompt_id="im.prompt_id"
          :selected="im.prompt_id == selected_image_id"
          @show="show_image"
        ></ImageThumb>
        
      </v-list>
      <v-btn
        class="ml-4 save_button"
        solo
        small
        elevation="0"
        style="padding:20px;"
        label="save"
        v-if="selected_image_id != '' && !selected_image_saved"
        @click="onSave"
      ><v-icon>mdi-floppy</v-icon></v-btn>
      <v-btn
        class="ml-4 delete_button"
        solo
        small
        elevation="0"
        style="padding:20px;"
        label="delete"
        v-if="selected_image_id != ''"
        @click="onDelete"
      ><v-icon>mdi-trash-can</v-icon></v-btn>
    </v-navigation-drawer>
    <v-main app style="display: flex;justify-content: center;align-items: center;" id="main">
      <v-container fluid id="imgcontainer" style="display:block;">
        
      </v-container>
    </v-main>
    <v-navigation-drawer app clipped permanent right color="transparent" class="pa-0">
            
            
            <v-select
              :items="possible_modes"
              v-model="current_mode"
              filled
              label="Mode"
              ></v-select>
            <v-subheader>
              Resolution {{width.val}} x {{height.val}} pixels
            </v-subheader>
            <v-slider 
              class="ml-4 mr-4"
              v-model="width.val"
              :thumb-color="width.color"
              :min="512"
              :max="768"
              step="64"
              ticks="always"
              tick-size="2"
              thumb-label
              prepend-icon="mdi-arrow-expand-horizontal"
              ></v-slider>

            <v-slider 
              class="ml-4 mr-4"
              v-model="height.val"
              :thumb-color="height.color"
              :min="512"
              :max="768"
              step="64"
              ticks="always"
              tick-size="2"
              prepend-icon="mdi-arrow-expand-vertical"
              thumb-label
              ></v-slider>

              <v-subheader>
            {{steps.val}} steps @ {{scale.val}} scale
            </v-subheader>
            <v-slider 
              class="ml-4 mr-4"
              v-model="steps.val"
              :thumb-color="scale.color"
              :min="10"
              :max="60"
              thumb-label
              prepend-icon="mdi-av-timer"
              ></v-slider>
              <v-slider 
              class="ml-4 mr-4"
              v-model="scale.val"
              :thumb-color="scale.color"
              :min="1"
              :max="20"
              thumb-label
              prepend-icon="mdi-lightning-bolt-outline"
              ></v-slider>

            
              <v-subheader>
            {{num_of_images}} image{{num_of_images > 1 ? 's' : ''}}
            </v-subheader>
            <v-slider 
              class="ml-4 mr-4"
              v-model="num_of_images"
              thumb-color="blue lighten-1"
              ticks="always"
              tick-size="2"
              :min="1"
              :max="4"
              thumb-label
              prepend-icon="mdi-animation-outline"
              ></v-slider>
              <v-subheader>
            Seed number
            </v-subheader>
            <v-text-field
              class="ml-4 mr-4"
              solo
              flat
              dense
              label="seed"
              v-model="seed"
            ></v-text-field>
     
            <v-btn
              class="ml-4"
              solo
              small
              elevation="0"
              style="padding:20px;"
              label="explore"
              @click="onExplore"
            >explore</v-btn>
            

            <v-btn
                  class=" mb-3 render_button"
                  solo
                  x-large
                  elevation="0"
                  style="padding:20px;"
                  label="render"
                  
                  @click="onGenerate"
            >render</v-btn>
    </v-navigation-drawer>
    
    <v-footer v-if="current_mode == 'Text -> Image'" fixed app color="transparent" height="80" inset class="pl-0 pr-0">
      <v-container>
        <v-row>
          <v-col class="ma-0 pa-0">
            <v-textarea
              class="ml-4 mr-4"
              filled
              rows="2"
              solo
              flat
              dense
              @keydown.enter.exact.prevent="textarea_keypress"
              v-model="prompt"
              ></v-textarea>
            </v-col>
        </v-row>
      </v-container>
    </v-footer>
    
    <v-footer v-if="current_mode == 'List -> Image'" fixed app color="transparent" height="135" inset class="pl-0 pr-0">
      <v-container>
        <v-row>
          <v-col class="ma-0 pa-0">
            <v-textarea
              class="ml-4 mr-4"
              filled
              rows="1"
              solo
              flat
              dense
              hide-details
              v-model="promptA"
              ></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="ma-0 pa-0">
            <v-slider 
            class="ml-4 mr-4"
              v-model="prompt_blend"
              :min="0.0"
              :max="1.0"
              :step="0.01"
              thumb-label
              hide-details
              ></v-slider>
          </v-col>
        </v-row>
        <v-row>
          <v-col  class="ma-0 pa-0">
            <v-textarea
              class="ml-4 mr-4"
              filled
              rows="1"
              solo
              flat
              dense
              hide-details
              v-model="promptB"
              ></v-textarea>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>

    <v-alert app :value="alert" 
    prominent 
    dismissible
    elevation="16"

    type="error"
    >{{alertMessage}}</v-alert>
  </v-app>
</template>
<style>
  .imgh {
    display: block;
    border-radius: 4px;
    object-fit: contain;
    min-width:100%;
    min-height:100%;
    max-width: 100%;
    max-height: 100%;
    margin-bottom: 4px;
  }
  .v-alert {
  position: fixed;
  left:0;
  width:100%;
  top: 0px;
  z-index: 10000;
  margin: 0 auto; 
}
</style>
<style >
  .render_button {
    width:224px;
    position: fixed;
    bottom: -2px;
    right: 16px;
  }
  .save_button {
    width:50px;
    position: fixed;
    bottom: 22px;
    left: 0px;
  }
  .delete_button {
    width:50px;
    position: fixed;
    bottom: 22px;
    left: 66px;
  }

  #imgcontainer > img {
    display: block;
    object-fit: contain;
    min-width:100%;
    min-height:100%;
    max-width: 100%;
    max-height: 100%;
  }
  #historycontainer > img {
    max-width: 100%;
  }
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-track {
    background: black;
    opacity: 0.5;
  }
  ::-webkit-scrollbar-thumb {
    background:#181818;
    opacity: 0.5;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #2c2c2c;
    opacity: 1.0;
  }
</style>
<script>
  import ImageThumb from './ImageThumb'
  export default {
    components: {
      ImageThumb,
    },
    data: () => ({
      possible_modes: ['Text -> Image', 'List -> Image'],
      current_mode:'Text -> Image',
      alert: false,
      alertMessage: "Warning, generated images contained some not safe for work content and have been replaced.",
      prompt: "product photo, beautiful vase, zen garden, still life, photoreal, bokeh, depth of field, calming",
      image_history: [],

      image_id:'',
      selected_image_id:'',
      selected_image_saved:false,

      promptA: "product photo, beautiful vase, zen garden, still life, photoreal, bokeh, depth of field, calming",
      promptB: "renaissance painting, beautiful vase, zen garden, still life, photoreal, bokeh, depth of field, calming",
      prompt_blend: 0.5,

      seed:42,
      width: { label: 'width', val: 512, color: 'blue lighten-1'},
      height: { label: 'height', val: 512, color: 'blue lighten-1'},
      scale: { label: 'scale', val: 7, color: 'blue lighten-1' },
      steps: { label: 'steps', val: 25, color: 'blue lighten-1' },
      num_of_images: 1,
    }),
    mounted() {
      window.addEventListener("resize", this.onWindowResize);
      const loadHistoryOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                username: '',
            })
        };
      fetch(this.api_server + '/load_history/', loadHistoryOptions)
        .then(response => response.json())
        .then(data => {
          if (data.result == 'OK') {
            data.prompts.forEach(prompt=> {
              this.image_history.push( {
                  prompt_id: prompt.prompt_id,
                  settings: {
                    seed: prompt.seed,
                    width: prompt.width,
                    height: prompt.height,
                    scale: prompt.scale,
                    steps: prompt.steps,
                    prompt : prompt.prompt,
                    prompt_id: prompt.prompt_id,
                    saved: prompt.saved,
                    status: prompt.status,
                    mode: prompt.mode,
                  }
                });
            })
          }
      });
    },
    destroyed() {
      window.removeEventListener("resize", this.onWindowResize);
    },
    watch :{

    },
    methods: {
      show_image (settings, url) {
        
        this.seed = settings.seed;
        this.width.val = settings.width;
        this.height.val = settings.height;
        this.steps.val = settings.steps;
        this.scale.val = settings.scale;
        this.selected_image_id = settings.prompt_id;
        this.selected_image_saved = settings.saved;
        this.current_mode = settings.mode;
        if(settings.mode == 'List -> Image'){
          this.promptA = settings.prompt[0].text;
          this.promptB = settings.prompt[1].text;
          this.prompt_blend = settings.prompt[1].weight;
        } else {
          this.prompt = settings.prompt;
        }

        var display_image = document.getElementById('display_image')
        if(display_image != null){
          display_image.setAttribute('src', url)
          this.onWindowResize()
        } else {
          document.querySelector('#imgcontainer').innerHTML = ''
          let img = document.createElement('img')
          img.id = "display_image"
          var downloadingImage = new Image();
          downloadingImage.onload = function() {
            img.src  = url; 
          }
          downloadingImage.src = url;
          document.querySelector('#imgcontainer').appendChild(img)

          this.onWindowResize()
        }
      },
      textarea_keypress() {
          this.onGenerate();
      },

      onSave(){
        const saveOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                prompt_id: this.selected_image_id,
            })
        };

        fetch(this.api_server + '/save_prompt/', saveOptions)
            .then(response => response.json())
            .then(data => {
                if (data.result == 'OK') {
                  var i = 0;
                  for(i; i < this.image_history.length; i++){
                    if(this.selected_image_id == this.image_history[i].prompt_id){
                      this.image_history[i].settings.saved = true;
                      break;
                    }
                  }
                  this.selected_image_saved = true;
                } else if (data.result == "ERR") {
                  this.warning(data.message);
                }
            });
      },
      onDelete(){
        const deleteOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                prompt_id: this.selected_image_id,
            })
        };
        fetch(this.api_server + '/delete_prompt/', deleteOptions)
            .then(response => response.json())
            .then(data => {
                if (data.result == 'OK') {
                  var i = 0;
                  var found = false;
                  for(i; i < this.image_history.length; i++){
                    if(this.selected_image_id == this.image_history[i].prompt_id){
                      found = true;
                      break;
                    }
                  }
                  if(found){
                    this.image_history.splice(i, 1);
                    if(i > 0 && this.image_history.length > 0){
                      this.selected_image_id = this.image_history[i-1].prompt_id
                      this.selected_image_saved = this.image_history[i-1].settings.saved;
                      var display_image = document.getElementById('display_image')
                      display_image.setAttribute('src', this.api_server + "/download_prompt/?prompt_id=" + this.image_history[i-1].prompt_id)
                      this.onWindowResize()
                      

                    } else {
                      this.selected_image_id = ''
                      this.selected_image_saved = false;
                    }
                  }
                } else if (data.result == "ERR") {
                  this.warning(data.message);
                }
            });

        
      },
      onExplore(){
        this.seed = Math.floor(Math.random() * 10000000);
        this.onGenerate();
      },
      onGenerate(){

        for(var i=0; i < this.num_of_images; i++){
          const seed_number = this.seed + i + i * Math.floor(Math.random() * 100000);
          const prompt_value = this.current_mode == 'List -> Image'? 
                    [{
                      text: this.promptA,
                      weight: 1.0 - this.prompt_blend,
                    },{
                      text: this.promptB,
                      weight: this.prompt_blend
                    }] : this.prompt

          fetch(this.api_server + '/submit_prompt/', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    prompt: prompt_value,
                    w: this.width.val,
                    h: this.height.val,
                    scale: this.scale.val,
                    steps: this.steps.val,
                    seed: seed_number,
                    mode: this.current_mode,
                })
            } )
            .then(response => response.json())
            .then(data => {
              if(data.result == "OK"){
                this.image_history.push( {
                  prompt_id: data.prompt_id,
                  settings: {
                    seed: seed_number,
                    width: this.width.val,
                    height: this.height.val,
                    scale: this.scale.val,
                    steps: this.steps.val,
                    prompt : prompt_value,
                    saved: false,
                    mode: this.current_mode,
                    status: 0,
                    prompt_id: data.prompt_id,
                  }
                });
              } else if (data.result == "ERR") {
                this.warning(data.message);
              }
              console.log(data);
            });
        }
        this.num_of_images = 1
      },
      onWindowResize(){
        var container = document.querySelector('#imgcontainer');
        var image_container = document.querySelector('#main');
        var width = image_container.offsetWidth;
        var height = window.innerHeight-90;
        if(this.current_mode == 'List -> Image'){
          height = window.innerHeight-135;
        } 

        container.style.width = width + "px";
        container.style.height = height + "px";
      },
      warning(text) {
        this.alertMessage = text
        this.alert = true;
        window.setTimeout(() => {
          this.alert = false;
          console.log("hide alert after 3 seconds");
        }, 3000) 
      }
    }
  }
</script>

