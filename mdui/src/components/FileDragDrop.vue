<template>
    <form ref="fileform">
        <v-sheet 
            v-if="files.length == 0" 
            :style="[highlighted ? {'background-color': '#1B5E20'} : {'background-color' : '#E65100'}]" 
            class="ml-4 mr-4 mb-4 pa-2 rounded d-flex justify-space-between">
            Drop image here
        </v-sheet>
        <v-sheet 
            v-if="files.length == 1" 
            style="background-color: #1B5E20"  class="ml-4 mr-4 mb-4 pa-2 rounded d-flex justify-space-between">
            {{files[0].name}}
            <v-btn icon x-small @click="files=[]"><v-icon style="color:white!important">mdi-close</v-icon></v-btn>
        </v-sheet>
    </form>
    
</template>
<script>
    export default {
        data: () => ({
            highlighted: false,
            files: [],

        }), 
        emits:['file_added'],
        methods:{
            ondragenter() {
                alert("enter")
            }
        },
        mounted() {
            ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach( function( evt ) {
                this.$refs.fileform.addEventListener(evt, function(e){
                    e.preventDefault();
                    e.stopPropagation();
                }.bind(this), false);
                }.bind(this));
            this.$refs.fileform.addEventListener('dragenter', function(){
                this.highlighted = true;
            }.bind(this));
            this.$refs.fileform.addEventListener('dragleave', function(){
                this.highlighted = false;
            }.bind(this));
            this.$refs.fileform.addEventListener('dragend', function(){
                this.highlighted = false;
            }.bind(this));
            this.$refs.fileform.addEventListener('drop', function(e){
                this.highlighted = false;
                this.files = [];
                for( let i = 0; i < e.dataTransfer.files.length; i++ ){
                    this.files.push( e.dataTransfer.files[i] );
                }
                this.$emit('file_added', this.files[0])
            }.bind(this));
        }
    }
</script>