<template>
   <div class="colors">

      <div
         class="boxContainer"
         v-for="(g,index) in gradients"
         :key="index"
      >
         <div
            class="boxColor"
            :style="{'background-color': g.color}"
         ></div>
         <div
            class="boxValue"
            v-tooltip="g.value + ''"
         >{{g.value}}</div>
      </div>

   </div>
</template>
<script>
import { spinalBackEnd } from "../../../services/spinalBackend";
const backendService = spinalBackEnd.heatmapBack;

export default {
   props: {
      gradients: {},
      endpoints: {},
      profil: {},
   },
   data() {
      this.bindProcessMap = new Map();
      this.bimObjectsColored = [];
      return {};
   },
   mounted() {
      console.log("colorElement");
      this.colorElement();
   },

   beforeDestroy() {
      this.unBindAll();
      this.restoreColor();
   },

   methods: {
      unBindAll() {
         this.bindProcessMap.forEach((value, key) => {
            key.currentValue.unbind(value);
            this.bindProcessMap.delete(key);
         });
         this.bindProcessMap = new Map();
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
         return backendService.getColor(
            endpointValue,
            config.min.value,
            config.max.value,
            gradient
         );
      },

      colorElement() {
         this.unBindAll();
         this.endpoints.map(({ endpoint, ids }) => {
            let bindProcess = endpoint.currentValue.bind(() => {
               const value = endpoint.currentValue.get();
               let color = this.getColor(value, this.profil.config);
               let vector = backendService.convertColorToVector(color);

               ids.forEach((el) => {
                  this.bimObjectsColored.push({ model: el.model, ids: el.ids });

                  el.ids.forEach((id) => {
                     el.model.setThemingColor(id, vector, true);
                  });
               });

               spinal.SpinalForgeViewer.viewerManager.viewer.impl.invalidate(
                  true
               );
            });
            this.bindProcessMap.set(endpoint, bindProcess);
         });
      },

      restoreColor() {
         const vector = new THREE.Vector4(0, 0, 0, 0);
         this.bimObjectsColored.forEach(({ model, ids }) => {
            ids.forEach((dbid) => model.setThemingColor(dbid, vector, true));
         });
         spinal.SpinalForgeViewer.viewerManager.viewer.impl.invalidate(true);
         this.bimObjectsColored = [];
      },
   },

   watch: {
      endpoints() {
         this.unBindAll();
         this.restoreColor();

         this.colorElement();
      },
   },
};
</script>
<style scoped>
.colors {
   /* width: 100%; */
   height: 100%;
   margin: auto;
   display: flex;
   justify-content: space-between;
   flex-direction: column-reverse;
}
.colors .boxContainer {
   flex-grow: 1;
   display: flex;
   flex-direction: row;
   position: relative;
}

.colors .boxContainer .boxColor {
   width: calc(20%);
   /* width: calc(100%); */
   background-color: red;
}

.colors .boxContainer .boxValue {
   width: calc(80%);
   align-self: flex-end;
   justify-self: flex-end;
   max-height: 30px;
   overflow: hidden;
   white-space: nowrap;
   text-overflow: ellipsis;
   font-size: 12px;
   padding-left: 4px;
   position: absolute;
   bottom: -10px;
   left: 10px;
}
</style>