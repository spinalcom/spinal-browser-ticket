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

         <el-button id='test' v-if="variableSelected.type=='Consigne' && typeof value === 'boolean'" 
         v-on:click="flip()" class = "button" circle :style="{ 'background-color': getColor() }">


         </el-button>
   </div>
</template>

<script>
export default {
   name: "endpoint-component",
   props: { name: {}, endpoints: {}, variableSelected: {} },
   data() {
      return {
         value: undefined,
         unit: undefined,
         bindProcess: undefined,
         endpoint: undefined,

      };
   },
   mounted() {
      this.updateEndpoint();
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

      flip(){
      
         this.endpoint.currentValue.set(!this.endpoint.currentValue.get());

      },
      getColor(){
         
         if(this.endpoint.currentValue.get()){
            return this.variableSelected.config.max.color;
         }
         else {
            return this.variableSelected.config.min.color;
         }
      }


   
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