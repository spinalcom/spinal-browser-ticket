<template>
   <div
      class="md-scrollbar heatmap_legends_container"
      v-if="seeLegend"
   >
      <div class="legend">
         <heatmap-legend
            :gradients="gradients"
            :endpoints="endpoints"
            :profil="profil"
         ></heatmap-legend>
      </div>

   </div>
</template>

<script>
import HeatmapLegend from "./legend.vue";
import { EventBus } from "../../../services/event";

export default {
   name: "heatmapPanel",
   components: {
      "heatmap-legend": HeatmapLegend,
   },
   data() {
      this.button;
      return {
         seeLegend: false,
         profil: {},
         gradients: [],
         endpoints: [],
      };
   },
   mounted() {
      this.openEvent();
      this.getUpdateEvent();
      this.destroyLegend();
   },
   methods: {
      closeLegend(groupId) {
         // if (this.data[groupId]) {
         //    this.destroyLegend(groupId);
         //    const res = Object.assign({}, this.data);
         //    delete res[groupId];
         //    this.data = Object.assign({}, res);
         //    this.legendLength = Object.keys(this.data).length;
         //    itemColoredMap.delete(groupId);
         //    if (this.button) this.button.fontColor = "#FFFFFF";
         //    return;
         // }
      },

      destroyLegend(id) {
         EventBus.$on("hide-heatmap", (data) => {
            this.seeLegend = false;
         });
         // if (typeof this.$refs[id] !== "undefined") {
         //    this.$refs[id][0].$destroy();
         // }
      },

      closed() {},

      openEvent() {
         EventBus.$on("seeHeatMap",  (option) => {
            this.seeLegend = true;
            //console.log("heatmap-legends/ ",option);
            this.gradients = option.gradients;
            this.endpoints = option.endpoints;
            this.profil = option.profil;

            // const groupId = option.selectedNode.id;
            // this.button = option.button;
            // if (this.data[groupId]) {
            //    this.destroyLegend(groupId);
            //    const res = Object.assign({}, this.data);
            //    delete res[groupId];
            //    this.data = Object.assign({}, res);
            //    this.legendLength = Object.keys(this.data).length;
            //    return;
            // }
            // const data = await this.getAllData(groupId);
            // if (data.length === 0) {
            //    alert("No controlpoint Linked");
            //    if (this.button) this.button.fontColor = "#FFFFFF";
            //    return;
            // }
            // this.data = Object.assign({}, this.data, { [groupId]: data });
            // this.legendLength = Object.keys(this.data).length;
         });
      },

      getUpdateEvent() {
         EventBus.$on("update-controlPoint", (option) => {
            // Object.keys(this.data).map(async (groupId) => {
            //    const data = await this.getAllData(groupId);
            //    this.data[groupId] = data;
            // });
         });
      },
   },

   beforeDestroy() {
      console.log("destroy container");
   },

};
</script>

<style scoped>
/* {
   padding-top: 30px;
   cursor: all-scroll;
} */

.heatmap_legends_container {
   /* width: 100%;
  height: calc(100% - 15px);
  display: flex;
  flex-direction: column;
  align-items: center; */
   /* background: red; */
   /* width: 200px; */
   max-width: 200px;
   height: calc(40%);
   /* background: #393939 !important; */
   /* border: 1px solid black; */
   overflow-x: auto;
   position: absolute;
   left: 0px;
   top: calc(20%);
   padding: 10px;
   display: flex;
   justify-content: space-around;
   flex-direction: row;
   flex-wrap: wrap;
   z-index: 999;
}

.heatmap_legends_container .legend {
   width: 60px;
   height: calc(98% - 20px);
   /* color: white; */
   color: #000000;
   padding: 5px;
   display: inline-block;
   /* margin-right: 20px; */
   font-weight: bold;
   margin: 10px 10px 10px 0;
   /* border: 1px solid gray; */
}

.heatmap_legends_container:last-child {
   margin-right: 0px;
}
</style>