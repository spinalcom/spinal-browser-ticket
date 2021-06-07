<template>
   <div
      class="_content"
      v-if="rooms.length > 0"
   >
      <div v-if="variableSelected.type=='Consigne' && variableSelected.dataType =='Boolean'" class="fullWidth">
         <el-button 
         v-on:click="ModifyAll(false)" class = "_buttonGlobal2" circle :style="{ 'background-color': getColor(false,this.variableSelected.config) }">
         </el-button>
         <p class= "modifyAllValuesText"> Modify all Values </p>
         <el-button 
            v-on:click="ModifyAll(true)" class = "_buttonGlobal2" circle :style="{ 'background-color': getColor(true,this.variableSelected.config) }">
         </el-button>
      </div>
      
      <div v-if="variableSelected.type=='Consigne' && variableSelected.dataType !='Boolean'" class= "fullWidth" >
      <el-button  
         v-on:click="openModal()" class = "_buttonGlobal" icon="el-icon-edit" > Modify all values
      </el-button>
      </div>
      

      <value-config-global v-if="isModalVisible"
          :config="variableSelected.config" :dataType="variableSelected.dataType"
          @globalValue="ModifyAll"
            >
      </value-config-global>

<!-- v-if="room.name== '1-Pièce'|| room.name== '2-Pièce' " -->
      <endpoint-component 
         v-for="room of rooms"
         :name="room.name"
         v-bind="room.name"
         :endpoints="room.endpoints"
         :variableSelected="variableSelected"
         :room="room"
         @select="onSelect"
         @isolate="onIsolate"
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
import { EventBus } from "../../../../../services/event";
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
         isIsolate: false,
         isSelect: false,

         isolated: undefined,
         selected: undefined
      };
   },
   mounted() {
   },
   methods: {

      openModal() {
      this.isModalVisible=!this.isModalVisible;
      },
      ModifyAll(value){
         if (value == undefined || !confirm("Are you sure you want to modify all values")){
            return;
         }
         for (var room of this.rooms){   
            var endpoints = room.endpoints;
            var endpoint = endpoints.find(
               (el) => el.id.get() == this.variableSelected.id
               );
            endpoint.currentValue.set(value);
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

      onIsolate(data){
         if(this.isIsolate && data.id == this.isolated ){
            EventBus.$emit("view-show-all");
            this.isIsolate=false;
         }
         else{
         EventBus.$emit("insight-isolate", data);
         this.isIsolate=true;
         }
         this.isolated= data.id;
      },

      onSelect(data){
         if(this.isSelect && data.id == this.selected ){
            EventBus.$emit("insight-clear-select");
            this.isSelect=false;
         }
         else{
         EventBus.$emit("insight-select", data);
         this.isSelect=true;
         }
         this.selected= data.id;
      }
      






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
    width: 200px;
    padding: 10px;
}

._buttonGlobal2 {
    
    justify-content: center;
    display: inline-block;
    padding: 10px;
    height: 25px;
    width:25px;
}


.modifyAllValuesText {
   margin-left: 25%;
   margin-right: 25%;
}

.fullWidth{
   width: 100%;
   display: flex;
   justify-content: center;
   flex-wrap: wrap;
   
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