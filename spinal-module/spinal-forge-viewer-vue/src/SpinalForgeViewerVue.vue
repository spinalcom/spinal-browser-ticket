<template>
    <div id="spinal-forge-viewer"></div>
</template>

<script>
  import {
    ForgeViewer
  } from "spinal-forge-viewer";

  export default {
    name: "SpinalForgeViewerVue",
    props: {
      modelProperty: {
        type: Object,
        required: false,
        validator( value ) {
          return (value.hasOwnProperty( "isInteractive" ) &&
            value.hasOwnProperty( "path" )) || value.hasOwnProperty( "path" )
        }
      },
      onInitialize: {
        type: Function,
        required: true
      },
      headless: {
        type: Boolean,
        default: function () {
          return false;
        }
      }
    },

    data: function () {
      return {
        viewerManager: null
      }
    },
    mounted() {

      const viewerContainer = document
        .getElementById( "spinal-forge-viewer" );

      this.viewerManager = new ForgeViewer( viewerContainer, this.headless );


      if (this.modelProperty) {
        this.viewerManager.start( this.modelProperty.path,
          !!this.modelProperty.isInteractive );
      }
      this.onInitialize( this.viewerManager );

    },

    beforeDestroy() {
      this.viewerManager.finish();
    }

  }
</script>

<style scoped>

</style>