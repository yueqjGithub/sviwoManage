<template>
  <div class="drawerCustom">
    <p v-html="his"></p>
  </div>
</template>

<script>
export default {
  name: 'history',
  props: {
    his: {
      type: 'string',
      default: ''
    }
  }
}
</script>

<style scoped>

</style>
