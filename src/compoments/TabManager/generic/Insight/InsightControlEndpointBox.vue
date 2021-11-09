<template>
   <!-- <div class="div__content" >
      <div v-tooltip="name">
         {{ name }}
      </div>
      <div v-tooltip="`${value} ${unit}`">
         {{ value | filterValue }} {{ unit }}
      </div>
   </div> -->
   <el-card style="width: 30%; margin: 10px; height: 10%">
      <h5>
         {{ name }}
      </h5>
      <span>
         {{ value | filterValue }} {{ unit }}
      </span>
   </el-card>
</template>

<script>

export default {
   name: "InsightControlEndpointBox",
   props: {
      name: { required: true, type: String},
      endpoint: { required: true, type: Object},
   },
   data() {
      return {
         value: undefined,
         unit: undefined,
         bindProcess: undefined,
      };
   },
   mounted() {
      this.value = this.endpoint.currentValue;
      this.unit = this.endpoint.unit;
   },

   methods: {
      updateEndpoint() {
         if (this.endpoint) {
            this.bindProcess = this.endpoint.currentValue.bind(() => {
               this.value = this.endpoint.currentValue.get();
               this.unit = this.endpoint.unit.get();
            });
         }
      },
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
};

</script>

<style scoped>



</style>