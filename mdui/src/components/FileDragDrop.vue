<template>
    <form ref="fileform">
        <v-sheet v-if="files.length == 0" :style="[highlighted ? {'background-color': '#6A1B9A'} : {'background-color' : '#212121'}]" class="ml-4 mr-4 mb-4 pa-2 rounded">Drag and drop file here</v-sheet>
        <v-sheet v-if="files.length == 1" style="background-color: #0D47A1"  class="ml-4 mr-4 mb-4 pa-2 rounded">
            {{files[0].name}}
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
                for( let i = 0; i < e.dataTransfer.files.length; i++ ){
                    this.files.push( e.dataTransfer.files[i] );
                }
                this.$emit('file_added', this.files[0])
            }.bind(this));
        }
    }
</script>