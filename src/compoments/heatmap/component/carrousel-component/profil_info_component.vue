<template>
   <div class="info_container">
      <div
         class="content"
         v-if="variableSelected"
      >
         <div class="header">
            <config-component
               class="header-item"
               v-if="variableSelected.config.min"
               :config="variableSelected.config.min"
               :name="'Min'"
               @updateAverage="updateAverage"
               @colorUpdated="sendEvent"
            ></config-component>

            <config-component
               class="header-item"
               v-if="variableSelected.config.average"
               :config="variableSelected.config.average"
               :disabled="true"
               :name="'Average'"
               @updateAverage="updateAverage"
               @colorUpdated="sendEvent"
            ></config-component>

            <config-component
               class="header-item"
               v-if="variableSelected.config.max"
               :config="variableSelected.config.max"
               :name="'Max'"
               @updateAverage="updateAverage"
               @colorUpdated="sendEvent"
            ></config-component>
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
import ConfigComponent from "./sub-components/config-component.vue";
import ItemsLinkedComponent from "./sub-components/items-linked-component.vue";

export default {
   name: "ProfilInfoComponent",
   props: { variableSelected: {}, profil: {} },
   components: { ConfigComponent, ItemsLinkedComponent },
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
         // console.log("variableSelected changed", this.variableSelected.config);
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
   display: flex;
   justify-content: space-between;
   /* border: 1px solid red; */
}

.info_container .content .header .header-item {
   flex: 1;
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