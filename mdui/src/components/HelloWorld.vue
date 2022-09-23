<template>
  <v-app id="inspire">
    <v-alert app :value="alert" prominent type="error">{{alertMessage}}</v-alert>
    <v-navigation-drawer app clipped permanent left width="150px" color="transparent" class="pa-2 invisible-scrollbar">
      <v-list ref="history_container" id="historycontainer">
        <img 
          class="imgh" 
          v-for="im in image_history" :key="im.id" 
          :style= "[im.id == selected_image_id ? {'border':'1px solid white'} : im.saved ? {'border':'2px solid green'} : {'border':'1px solid black', 'opacity':0.7}]"
          :src="im.url" 
          :seed="im.seed"
          :prompt="im.prompt" 
          :im_id="im.id"
          :gen_width="im.gen_width"
          :gen_height="im.gen_height"
          :gen_scale="im.gen_scale"
          :gen_steps="im.gen_steps"
          @click="image_click" />
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
      <v-overlay :value="overlay" opacity="0.9">
          <v-progress-circular
            :rotate="360"
            :size="100"
            :width="15"
            :value="progress"
            color="teal"
          >
            {{ progress }}
          </v-progress-circular>
      </v-overlay>
      <v-container fluid id="imgcontainer" style="display:block;">
        
      </v-container>
    </v-main>
    <v-navigation-drawer app clipped permanent right color="transparent" class="pa-0">
            
            <v-subheader>
              Width
            </v-subheader>
            
              <v-slider 
              class="ml-4 mr-4"
              :label="width.val"
              v-model="width.val"
              :thumb-color="width.color"
              :min="512"
              :max="768"
              step="64"
              ticks="always"
              tick-size="2"
              thumb-label
              inverse-label
              v-bind="attrs"
              v-on="on"
              ></v-slider>
              
   
            <v-subheader>
              Height
            </v-subheader>
            <v-slider 
              class="ml-4 mr-4"
              :label="height.val"
              v-model="height.val"
              :thumb-color="height.color"
              :min="512"
              :max="768"
              step="64"
              ticks="always"
              tick-size="2"
              thumb-label
              inverse-label
              ></v-slider>

            <v-subheader>
              Scale
            </v-subheader>
            <v-slider 
              class="ml-4 mr-4"
              :label="scale.val"
              v-model="scale.val"
              :thumb-color="scale.color"
              :min="1"
              :max="20"
              thumb-label
              inverse-label
              ></v-slider>
            <v-subheader>
              Steps
            </v-subheader>
            <v-slider 
            class="ml-4 mr-4"
              :label="steps.val"
              v-model="steps.val"
              :thumb-color="scale.color"
              :min="10"
              :max="60"
              thumb-label
              inverse-label
              ></v-slider>
            <v-subheader>
              Seed
            </v-subheader>
            <v-text-field
              class="ml-4 mr-4"
              solo
              flat
              dense
              :value="seed"
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
    
    <v-footer app color="transparent" height="84" inset class="pl-0 pr-0">
      <v-container>
        <v-row>
          <v-textarea
            class="ma-4"
            filled
            rows="2"
            solo
            flat
            dense
            @keydown.enter.exact.prevent="textarea_keypress"
            v-model="prompt"
            ></v-textarea>
          </v-row>
        </v-container>
    </v-footer>
    
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
  export default {
    data: () => ({
      progress: 0,
      progressInterval: {},
      alert: false,
      overlay: false,
      last_prompt : '',
      last_seed : 0,
      prompt: "product photo, beautiful vase, zen garden, still life, photoreal, bokeh, depth of field, calming",
      showImage: false,
      currentImageData: 0,
      currentImageUrl: "test.html",
      currentImageName: "no_name.jpg",
      image_history: [],
      seed:42,
      lock_seed: true,
      image_id:'',
      selected_image_id:'',
      selected_image_saved:false,
      generatedImage: "imagepath",
      alertMessage: "Warning, generated images contained some not safe for work content and have been replaced.",
      links: [
        'Dashboard',
        'Messages',
        'Profile',
        'Updates',
      ],
      width: { label: 'width', val: 512, color: 'blue lighten-1'},
      height: { label: 'height', val: 512, color: 'blue lighten-1'},
      scale: { label: 'scale', val: 7, color: 'blue lighten-1' },
      steps: { label: 'steps', val: 25, color: 'blue lighten-1' },
    }),
    created() {
      window.addEventListener("resize", this.onWindowResize);
    },
    destroyed() {
      window.removeEventListener("resize", this.onWindowResize);
    },
    watch :{
      seed:{
        immediate: true,
        handler(){
          this.last_prompt = ''
        }
      },
      lock_seed:{
        immediate: true,
        handler(){
          this.last_prompt = ''
        }
      }
    },
    methods: {
      textarea_keypress() {
          this.onGenerate();
      },
      image_click (event) {
        var source = event.target || event.srcElement;
        this.prompt = ''+(source.getAttribute('prompt'));
        this.seed = parseInt(''+(source.getAttribute('seed')));
        this.width.val = parseInt(''+(source.getAttribute('gen_width')));
        this.height.val = parseInt(''+(source.getAttribute('gen_height')));
        this.steps.val = parseInt(''+(source.getAttribute('gen_steps')));
        this.scale.val = parseInt(''+(source.getAttribute('gen_scale')));
        this.selected_image_id = ''+(source.getAttribute('im_id'))
        var i = 0;
        for(i; i < this.image_history.length; i++){
          if(this.selected_image_id == this.image_history[i].id){
            if(this.image_history[i].saved){
              this.selected_image_saved = true;
            } else {
              this.selected_image_saved = false;
            }
            break;
          }
        }

        this.lock_seed = true;
        var display_image = document.getElementById('display_image')
        display_image.setAttribute('src', source.getAttribute('src'))
        this.last_prompt = '';
      },
      onSave(){
        const saveOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                id: this.selected_image_id,
            })
        };

        fetch(this.api_server + '/save_prompt/', saveOptions)
            .then(response => response.json())
            .then(data => {
                if (data.result == 'OK') {
                  
                  var i = 0;
                  for(i; i < this.image_history.length; i++){
                    if(this.selected_image_id == this.image_history[i].id){
                      this.image_history[i].saved = true;
                      break;
                    }
                  }
                  this.selected_image_saved = true;
                }
            });
      },
      onDelete(){
        var i = 0;
        var found = false;
        for(i; i < this.image_history.length; i++){
          if(this.selected_image_id == this.image_history[i].id){
            found = true;
            break;
          }
        }
        if(found){
          this.image_history.splice(i, 1);
          this.selected_image_id = ''
          this.selected_image_saved = false;
        }
      },
      onExplore(){
        this.seed = Math.floor(Math.random() * 10000000);
        //this.onGenerate();
      },
      onGenerate(){

        var request_url = this.api_server + "/submit_prompt/?q=" + this.prompt + "&w=" + this.width.val + "&h=" + this.height.val + "&scale=" + this.scale.val + "&steps=" + this.steps.val;
        if(this.lock_seed) request_url = request_url + '&seed=' + this.seed;
        fetch(request_url)
          .then(response => response.json())
          .then(data => {
            if(data.result == "OK"){
              this.seed = data.seed;
              this.image_id = data.id;
              this.overlay = true;
              this.progressInterval = setInterval(() => {
                if (this.progress === 100) {
                  // Check image
                  fetch(this.api_server + "/check_prompt/?id=" + this.image_id )
                  .then(response => response.json())
                  .then(data => {
                    if(data.result == "OK"){
                      this.overlay = false
                      this.progress = 0
                      clearInterval(this.progressInterval)
                      var imgUrl = this.api_server + "/download_prompt/?id=" + this.image_id
                      this.image_history.unshift( {
                        url : imgUrl,
                        id: this.image_id,
                        seed: this.seed,
                        gen_width: this.width.val,
                        gen_height: this.height.val,
                        gen_scale: this.scale.val,
                        gen_steps: this.steps.val,
                        prompt : this.prompt,
                        saved: false,
                      });
                      this.selected_image_id = this.image_id;
                      this.selected_image_saved = false;
                      document.querySelector('#imgcontainer').innerHTML = ''
                      
                      let img = document.createElement('img')
                      let imgHist = document.createElement('img')
                      img.id = "display_image"
                      var downloadingImage = new Image();
                      downloadingImage.onload = function() {
                        img.src  = this.src; 
                        imgHist.src = this.src; 
                      }
                      downloadingImage.src = imgUrl;
                      document.querySelector('#imgcontainer').appendChild(img)

                      this.onWindowResize()

                    } else {
                      this.progress = 50
                    }
                  });
                }
                this.progress += 10
              }, 750);
            } else if (data.result == "ERROR") {
              this.warning(data.message);
            }
            console.log(data);
          });
          
      },
      onWindowResize(){
        var container = document.querySelector('#imgcontainer');
        var image_container = document.querySelector('#main');
        var width = image_container.offsetWidth;
        var height = window.innerHeight-90;

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

