<template>
   <div
      class="_content"
      v-if="rooms.length > 0"
   >

      <el-button v-if="variableSelected.type=='Consigne' && variableSelected.dataType =='Boolean'"
         v-on:click="ModifyAll(false)" class = "_buttonGlobal2" circle :style="{ 'background-color': getColor(false,this.variableSelected.config) }">
      </el-button>
      <el-button v-if="variableSelected.type=='Consigne' && variableSelected.dataType =='Boolean'"
         v-on:click="ModifyAll(true)" class = "_buttonGlobal2" circle :style="{ 'background-color': getColor(true,this.variableSelected.config) }">
      </el-button>


      <el-button v-if="variableSelected.type=='Consigne' && variableSelected.dataType !='Boolean'" 
         v-on:click="openModal()" class = "_buttonGlobal" icon="el-icon-edit" > Modify all values
      </el-button>
      

      <value-config-global v-if="isModalVisible"
          :config="variableSelected.config" :dataType="variableSelected.dataType"
          @globalValue="ModifyAll"
            >
      </value-config-global>

      <endpoint-component
         v-for="room of rooms"
         :name="room.name"
         :endpoints="room.endpoints"
         :variableSelected="variableSelected"
         :room="room"
      ></endpoint-component>
   </div>

   <div
      class="empty"
      v-else
   >
      No item Linked
   </div>
</template>

<script>
import { spinalBackEnd } from "../../../../../services/spinalBackend";
import endpointComponent from "./endpoint-component.vue";
import valueConfigGlobal from "./value-config-global.vue";
const backendService = spinalBackEnd.heatmapBack;


export default {
   components: { endpointComponent, valueConfigGlobal },
   name: "itemsLinkedComponent",
   props: {
      rooms: {},
      variableSelected: {},
   },
   data() {
      return {
         isModalVisible: false,

      };
   },
   mounted() {
      
   },
   methods: {

      openModal() {
      this.isModalVisible=!this.isModalVisible;
      },
      ModifyAll(value){
         if (value != undefined){
            for (var room of this.rooms){   
               var endpoints = room.endpoints;
               var endpoint = endpoints.find(
                  (el) => el.id.get() == this.variableSelected.id
                  );
               endpoint.currentValue.set(value);
            }

         }
      },
      getColor(endpointValue, config) {
         if (config.enumeration) {
            return backendService.getEnumColor(
               endpointValue,
               config.enumeration
            );
         }
         let gradient = backendService.getGradientColor(
            config.min,
            config.average,
            config.max
         );

         let color = backendService.getColor(
            endpointValue,
            config.min.value,
            config.max.value,
            gradient
         );

         let colorHex = `#${color}`;

         return colorHex;
      },
      






   },
};
</script>

<style scoped>


.empty {
   width: 100%;
   height: 100%;
   display: flex;
   justify-content: center;
   align-items: center;
   font-size: 1.5em;
}

._buttonGlobal {
    
    justify-content: center;
    display: inline-block;
    margin-left: 40%;
    margin-right: 40%;
    height: 40px;
    width: 20%;
    padding: 10px;
}

._buttonGlobal2 {
    
    justify-content: center;
    display: inline-block;
    margin-left: 25%;
    margin-right: 25%;
    padding: 10px;
}



</style>


<style>
._content {
   width: 100%;
   height: 100%;
   display: flex;
   justify-content: center;
   flex-wrap: wrap;
   overflow: hidden;
   overflow-y: auto;
}
</style>