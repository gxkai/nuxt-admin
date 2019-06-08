<template>
  <new-chat></new-chat>
</template>

<script>
  import Vue from 'vue'
  import Component from 'class-component'
  import NewChat from '@/components/business/Chat'

  @Component({
    components: {
      'new-chat': NewChat
    }
  })
  export default class Chat extends Vue {

  }
</script>

