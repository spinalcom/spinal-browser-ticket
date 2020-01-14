<template>
  <div>
    
    <b-button v-for="contextCat in contextLst">
      {{contextCat.context.info.name.get()}}
    </b-button>
  </div>
</template>

<script>

  import SpinalBackend from "../../services/spinalBackend";

  export default {
    data() {
      return {
        contextLst : []
      }
    },
    async mounted() {
      let context = await SpinalBackend.spaceBack.getAllContext();
      console.log(context)
      this.contextLst = [];

      context.forEach(contextCat => {
        this.contextLst.push(contextCat);
        
      })

    }
  }
</script>

