<template>
  <HelloWorld/>
</template>

<script>
import HelloWorld from './components/HelloWorld';
export default {
  name: 'App',
  metaInfo: {
    title: 'Render Team AI Sandbox',
    titleTemplate: '%s'
  },
  components: {
    HelloWorld,
  },

  data: () => ({
    //
  }),
};
</script>
