<template>
   <div class="div__content">

      <div
         class="name"
         v-tooltip="name"
      >{{name}}</div>

      
      <div
         class="value"
         v-tooltip="`${value} ${unit}`"
      >
         {{value | filterValue}} {{unit}}</div>

         <el-button v-if="displayBoolButton" 
         v-on:click="flip()" class = "button" circle :style="{ 'background-color': getColor(this.endpoint.currentValue.get(),this.variableSelected.config) }">
         </el-button>

         <el-button v-if="this.variableSelected.type=='Consigne' && this.variableSelected.dataType !='Boolean'" 
         v-on:click="openModal()" class = "button" circle :style="{ 'background-color': getColor(this.endpoint.currentValue.get(),this.variableSelected.config) }">
         </el-button>


         <value-config v-if="isModalVisible"
            :endpoint ="this.endpoint" :config="this.variableSelected.config" :dataType="this.variableSelected.dataType"
            
            >
         </value-config>

         


   </div>
</template>

<script>

import { spinalBackEnd } from "../../../../../services/spinalBackend";
const backendService = spinalBackEnd.heatmapBack;
import valueConfig from "./value-config";




export default {
   components: { valueConfig},
   name: "endpoint-component",
   props: { name: {}, endpoints: {}, variableSelected: {} },
   data() {
      return {
         value: undefined,
         unit: undefined,
         bindProcess: undefined,
         endpoint: undefined,
         displayBoolButton: undefined,
         isModalVisible: false,
      };
   },
   mounted() {
      this.updateEndpoint(); 
      this.updateDisplay();
      //console.log(this.variableSelected);
   },

   methods: {
      updateEndpoint() {
         this.endpoint = this.endpoints.find(
            (el) => el.id.get() == this.variableSelected.id
         );

         if (this.endpoint) {
            this.bindProcess = this.endpoint.currentValue.bind(() => {
               this.value = this.endpoint.currentValue.get();
               this.unit = this.endpoint.unit.get();
            });
         }
         
      },

      updateDisplay(){
         if(this.variableSelected.type=='Consigne' && this.variableSelected.dataType=='Boolean'){
         this.displayBoolButton=true;
         } else this.displayBoolButton=false;
      },

      flip(){
      
         this.endpoint.currentValue.set(!this.endpoint.currentValue.get());

      },
   

      getColor(endpointValue, config) {
         //console.log("END POINT ", endpointValue);
         //console.log("config ",config);
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

      openModal() {
      this.isModalVisible=!this.isModalVisible;
      },


   
   },
   computed:{
      
   },

   filters: {
      filterValue(value) {
         if (typeof value !== "undefined") {
            const isBoolean = typeof value === "boolean";
            if (isBoolean) return value.toString().toUpperCase();
            if (value.toString().trim().length === 0) return "NULL";
            return value.toFixed(2);
         }

         return "NULL";
      },
   },

   watch: {
      variableSelected() {
         if (this.endpoint && this.bindProcess)
            this.endpoint.currentValue.unbind(this.bindProcess);

         this.updateEndpoint();
         this.updateDisplay();
      },
   },

   beforeDestroy() {
      if (this.endpoint && this.bindProcess)
         this.endpoint.currentValue.unbind(this.bindProcess);
   },
};
</script>

<style scoped>
.div__content {
   width: 30%;
   height: 100px;
   margin: 5px;
   padding: 5px;
   border: 1px solid grey;
}

.div__content:hover {
   cursor: pointer;
}

.div__content .name {
   width: 100%;
   height: 30px;
   text-align: center;
   white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;
   font-size: 15px;
   
}

.div__content .value {
   width: 100%;
   height: calc(100% - 60px);
   display: flex;
   justify-content: center;
   align-items: center;
   color: #fab73a;
   font-size: 25px;
}

.div__content .button {
   
}


</style>