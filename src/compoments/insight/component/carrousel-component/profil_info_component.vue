<template>
   <div class="info_container">
      <div
         class="content"
         v-if="variableSelected"
      >
      
         <div class="header">
            <color-config
               :variableSelected="variableSelected"
               @updateAverage="updateAverage"
               @colorUpdated="sendEvent"
            ></color-config>
         </div>
         
         <div class="endpointValues">
            <items-linked-component
               v-if="profil"
               :rooms="profil.rooms"
               :variableSelected="variableSelected"
            ></items-linked-component>
         </div>
      </div>

      <div
         class="noProfilSelected"
         v-else
      >
         No Variable selected.
      </div>
   </div>
</template>

<script>
import ColorConfig from "./sub-components/color-config.vue";
import ItemsLinkedComponent from "./sub-components/items-linked-component.vue";

export default {
   name: "ProfilInfoComponent",
   props: { variableSelected: {}, profil: {} },
   components: { ColorConfig, ItemsLinkedComponent },
   data() {
      return {};
   },
   mounted() {
      // console.log("this.variableSelected", this.variableSelected);
   },
   methods: {
      updateAverage() {
         if (this.variableSelected.config.average) {
            let max = parseInt(this.variableSelected.config.max.value);
            let min = parseInt(this.variableSelected.config.min.value);
            //   if (!isNaN(max) && !isNaN(min) && this.average)
            this.variableSelected.config.average.value = (max + min) / 2;
            this.sendEvent();
         }
      },

      sendEvent() {
         this.$emit("sendDataUpdated");
      },
   },
   watch: {
      variableSelected() {
         // console.log("variableSelected changed", this.variableSelected);
      },
   },
};
</script>

<style>
.info_container {
   width: 100%;
   height: 100%;
   padding: 10px 0;
}

.info_container .content {
   width: 100%;
   height: 100%;
}

.info_container .content .header {
   width: 100%;
   height: 90px;
   /* border: 1px solid red; */
}

.info_container .content .endpointValues {
   width: 100%;
   height: calc(100% - 90px);
   /* padding: 25px 0; */
   /* border: 1px solid red; */
}

.info_container .noProfilSelected {
   width: 100%;
   height: 100%;
   display: flex;
   align-items: center;
   justify-content: center;
   color: #000000;
}
</style>