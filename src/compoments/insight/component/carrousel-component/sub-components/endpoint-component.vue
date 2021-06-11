<template>
   <div class="div__content">
      <div class="relative">
         <div class="div__rectangle" :style="{ 'background-color': getColor(this.endpoint.currentValue.get(),this.variableSelected.config) }">
         </div>
         <el-tooltip content="Isolate" effect="light"
             :open-delay="300"
             placement="right">
         <el-button v-on:click="isolate()" class="custom-icon circled-button position_right" circle icon="el-icon-location"></el-button>
         </el-tooltip>


         <el-tooltip content="Focus" effect="light"
             :open-delay="300"
             placement="right">
         <el-button v-on:click="focus()" class="custom-icon circled-button position_right3" circle icon="el-icon-zoom-in"></el-button>
         </el-tooltip>

         <el-tooltip content="Select" effect="light"
             :open-delay="300"
             placement="right">
         <el-button v-on:click="select()" class="custom-icon circled-button position_right2" circle icon="el-icon-view"></el-button>
         </el-tooltip>
      </div>

      <div
         class="name"
         v-tooltip="name"
      >{{name}}</div>

      
      <div
         class="value"
         v-tooltip="`${value} ${unit}`"
      >
         {{value | filterValue}} {{unit}}
      </div>


      <el-button v-if="displayBoolButton" 
      v-on:click="flip()" class="margin-left custom-icon circled-button" circle icon="el-icon-refresh">
      </el-button>

      <el-button v-if="this.variableSelected.type=='Consigne' && this.variableSelected.dataType !='Boolean'" 
      v-on:click="openModal()" class="margin-left custom-icon circled-button" circle icon="el-icon-setting">
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
import { EventBus } from "../../../../../services/event";
import groupManagerUtilities from "spinal-env-viewer-room-manager/js/utilities";




export default {
   components: { valueConfig},
   name: "endpoint-component",
   props: { name: {}, endpoints: {}, variableSelected: {}, room:{} },
   data() {
      return {
         value: undefined,
         unit: undefined,
         bindProcess: undefined,
         endpoint: undefined,
         displayBoolButton: undefined,
         isModalVisible: false,
         isInsightIsolate: false,
      };
   },
   mounted() {
      this.updateEndpoint(); 
      this.updateDisplay();
      //console.debug(this.room);
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

      async focus() {
         
         let data = { rooms: [this.room]}
         const allBimObjects = await this.getAllBimObjects(data);
         EventBus.$emit("insight-focus", {
         id: data.id,
         ids: allBimObjects,
         });
      },
      async select() {
         let data = { rooms: [this.room]}
         const allBimObjects = await this.getAllBimObjects(data);

         this.$emit('select',{
         id: this.room.id,
         ids: allBimObjects,
         });
         /*EventBus.$emit("insight-select", {
         id: data.id,
         ids: allBimObjects,
         });*/
      },
      async isolate() {
         
         let data = { rooms: [this.room]}
         const allBimObjects = await this.getAllBimObjects(data);
         /*EventBus.$emit("insight-isolate", {
         id: data.id,
         ids: allBimObjects,
         });*/

         this.$emit('isolate',{
         id: this.room.id,
         ids: allBimObjects,
         });
      },

      async getAllBimObjects(data) {
         // const allBimObjects = await groupManagerUtilities.getBimObjects(id);
         const promises = data.rooms.map(el =>
         groupManagerUtilities.getBimObjects(el.id)
         );

         const allBimObjects = await Promise.all(promises).then(result => {
         result = result.flat(10);
         return result;
         });

         return allBimObjects.map(el => el.get());
      },

      

      openModal() {
      this.isModalVisible=!this.isModalVisible;
      },
      onMouseOver(){
         //console.log(this.room);
         //EventBus.$emit('view-show-all');
      }
   
   },
   computed:{
      
   },

   filters: {
      filterValue(value) {
         if (typeof value == "string" && value != "") {
            return value;
            }
         else if (typeof value !== "undefined") {
            const isBoolean = typeof value === "boolean";
            if (isBoolean) return value.toString().toUpperCase();
            if (value.toString().trim().length === 0) return "NULL";
            
            return value.toFixed(2);
         }
         else
         return "NULL";
      },
   },

   watch: {
      variableSelected() {
         if (this.endpoint && this.bindProcess)
            this.isModalVisible=false;
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
   width: 90%;
   height: 30px;
   text-align: center;
   white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;
   font-size: 15px;
   margin-left: 10px;
   
}

.div__content .value {
   width: 100%;
   height: calc(100% - 60px);
   display: flex;
   justify-content: center;
   align-items: center;
   color: #000000;
   font-size: 25px;
}

.div__rectangle{
   position: absolute;
   top:-6px;
   left:-6px;
   width:10px;
   height: 100px;

}


.position_right{
   position: absolute;
   right : 0%;
}

.position_right3{
   position: absolute;
   top: 30px;
   right : 0%
}

.position_right2{
   position: absolute;
   top: 60px;
   right : 0%
}



.fixed{
   position: fixed;
}

.relative{
   position :relative;
}

.margin-left{
   margin-left: 45%;
}

.circled-button{
   display: flex;
   justify-content: center;
   align-items: center;
   height: 20px;
   width: 20px;
   border: white;
   z-index: 0;
   
}
.circled-button:hover{
   background-color: white;
}


.custom-icon {
   font-size: 20px;
}
</style>