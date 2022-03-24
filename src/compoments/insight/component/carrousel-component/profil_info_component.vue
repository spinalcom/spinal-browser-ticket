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
               :rooms="filteredObjects"
               :variableSelected="variableSelected"
               :filterObjects="filterObjects"
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
   props: {filterObjects:{}, variableSelected: {}, profil: {} },
   components: { ColorConfig, ItemsLinkedComponent },
   data() {
      return {
         filteredObjects: {}

      };
   },
   mounted() {
      this.filteredObjects= this.profil.rooms;
      if(this.filterObjects == 0){
            this.filteredObjects=this.profil.rooms;
         }
         else{
            this.filteredObjects = this.profil.rooms.filter(room => {
            return this.filterObjects.includes(room.id);
            });
         }
      
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
      },
      filterObjects(){
         console.log("Watch on filter triggered");
         //console.log(this.filterObjects);
         
         if(this.filterObjects == 0){
            this.filteredObjects=this.profil.rooms;
         }
         else{
            this.filteredObjects = this.profil.rooms.filter(room => {
            return this.filterObjects.includes(room.id);
         });
         }


      }

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

   /*border: 1px solid red; */
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