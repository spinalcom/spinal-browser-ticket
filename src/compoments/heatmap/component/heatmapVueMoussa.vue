<template>
   <div>

      <el-select
         v-model="variableSelected"
         placeholder="Variable"
      >
         <el-option
            v-for="item in profil.endpointsProfils"
            :key="item.id"
            :label="item.name"
            :value="JSON.stringify(item)"
         >
         </el-option>
      </el-select>

   </div>

</template>


<script>
import { EventBus } from "../../../services/event";
import { spinalBackEnd } from "../../../services/spinalBackend";
const backendService = spinalBackEnd.heatmapBack;

export default {
   components: {},
   props: ["profil"],
   data() {
      return {
         variableSelected: undefined,
      };
   },
   methods: {},
   async mounted() {
      console.log(this.profil);
   },
   beforeDestroy() {
      EventBus.$emit("hide-heatmap");
   },

   methods: {
      async formatAndSendData(variableSelected) {
         const gradients = this.getColorGradient(variableSelected.config);
         const endpoints = await this.getEndpointToBind(variableSelected.id);
         const obj = {
            profil: variableSelected,
            gradients,
            endpoints,
         };

         EventBus.$emit("seeHeatMap", obj);
      },

      getColorGradient(config) {
         if (config.enumeration) {
            return backendService.getEnumGradientColor(config.enumeration);
         }
         let _colors = backendService.getGradientColor(
            config.min,
            config.average,
            config.max
         );
         return _colors.map((el, index) => {
            return {
               color: `#${el.toHex()}`,
               value: this.getValue(index, config.max.value, config.min.value),
            };
         });
      },

      getValue(index, max, min) {
         if (isNaN(parseInt(min)) && isNaN(parseInt(max)))
            return index ? "True" : "False";
         return (
            Number(min) + ((Number(max) - Number(min)) * Number(index)) / 10
         );
      },

      getEndpointToBind(endpointId) {
         const promises = this.profil.rooms.map(async (el) => {
            const endpoint = el.endpoints.find((e) => e.id.get() == endpointId);
            return {
               endpoint,
               ids: el.references,
            };
         });

         return Promise.all(promises);
      },
   },
   watch: {
      variableSelected() {
         const parsed = JSON.parse(this.variableSelected);
         this.formatAndSendData(parsed);
      },
   },
};
</script>