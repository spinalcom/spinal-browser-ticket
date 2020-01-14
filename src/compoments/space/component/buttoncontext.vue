<template>
  <div>
    
    <b-button  v-for="contextCat in contextLst">
      {{contextCat.context.info.name.get()}}
    </b-button>
  </div>
</template>

<script>

  import SpinalBackend from "../../../services/spinalBackend";

  export default {
    data() {
      return {
        contextLst : []
      }
    },
    props: [],
  methods: {
      selectContext (contextCat){
          console.log(contextCat)
       // this.$emit("selectContext", contextCat);
      }

  },
    
    async mounted() {
      let context = await SpinalBackend.spaceBack.getAllContext();
      console.log(context)
      this.contextLst = [];

      context.forEach(contextCat => {
        this.contextLst.push(contextCat);
        
      })

    },
      watch: {
    
  },
  beforeDestroy() {
  }
};
    
  
</script>

