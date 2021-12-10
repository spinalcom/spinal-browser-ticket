<template>

   <div class="_heatmapContainer spaceL-top">
      <div class="buttons">
         <el-button class="boutton-barre"
               icon="el-icon-arrow-left"
               circle
               style ="position: fixed; z-index: 1;"
               @click="goBack()">
         </el-button>
         <div class="btn space-top btn-size space-right center-div">
            <i
               @click="decreaseIndex()"
               class="arrow left"
            ></i>
            {{variableSelected ? variableSelected.name : ""}}
            <i
               @click="increaseIndex()"
               class="arrow right"
            ></i>
         </div>

         
      </div>

      <vueper-slides
         :slide-ratio="1 / 2"
         :touchable="false"
         prevent-y-scroll
         class="space-top"
      >

         <vueper-slide
            class="heigth"
            v-for="(slide, i) in slides"
            :key="i"
         >
            <template v-slot:content>
               <component
                  :is="renderComponent(i)"
                  :variableSelected="variableSelected"
                  :profil="profil"
                  :filterObjects="filter"
                  @sendDataUpdated="sendDataUpdated"
               />
            </template>
         </vueper-slide>

      </vueper-slides>
   </div>
</template>


<script>
import { VueperSlides, VueperSlide } from "vueperslides";
import { EventBus } from "../../../services/event";
import { spinalBackEnd } from "../../../services/spinalBackend";

import "vueperslides/dist/vueperslides.css";

import profilInfoComponent from "./carrousel-component/profil_info_component.vue";
import chartComponent from "./carrousel-component/chart_component.vue";

const backendService = spinalBackEnd.heatmapBack;


export default {
   props: ["profil","filter"],

   data() {
      return {
         variableSelected: undefined,
         endpoints: [],
         details: [],
         variables: [],
         index: undefined,
         slides: [
            {
               title: "Profil info",
               content: profilInfoComponent
            },

         ],
      };
   },
   components: {
      VueperSlides,
      VueperSlide,
      profilInfoComponent,
      chartComponent,
   },

   methods: {
      renderComponent(i) {
         return this.slides[i].content;
      },

      decreaseIndex() {
         if (this.index > 0) this.index--;
         else {
            this.index = this.variables.length - 1;
         }
      },

      increaseIndex() {
         if (this.index < this.variables.length - 1) this.index++;
         else {
            this.index = 0;
         }
      },

      async formatAndSendData(variableSelected) {
         const gradients = this.getColorGradient(variableSelected.config);
         this.endpoints = await this.getEndpointToBind(variableSelected.id);
         const obj = {
            profil: variableSelected,
            gradients,
            endpoints: this.endpoints,
         };
         EventBus.$emit("seeHeatMap", obj);
      },

      sendDataUpdated() {
         const gradients = this.getColorGradient(this.variableSelected.config);
         EventBus.$emit("seeHeatMap", {
            profil: this.variableSelected,
            gradients,
            endpoints: this.endpoints,
         });
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
            //console.log(el);
            const endpoint = el.endpoints.find((e) => e.id.get() == endpointId);
            return {
               endpoint,
               ids: el.references,
            };
         });

         return Promise.all(promises);
      },

      goBack(){
      this.$emit("goBackProfil");
      },
   },

   mounted() {
      if (
         this.profil.endpointsProfils &&
         this.profil.endpointsProfils.length > 0
      ) {
         this.variables = this.profil.endpointsProfils;
         this.index = 0;
         
      }
   },

   watch: {
      variableSelected() {
         if (this.variableSelected) {
            // const parsed = JSON.parse(this.variableSelected);
            this.formatAndSendData(this.variableSelected);
         }
      },

      index() {
         if (typeof this.index !== "undefined") {
            this.variableSelected = this.variables[this.index];
         }
      },
   },

   beforeDestroy() {
      EventBus.$emit("hide-heatmap");
   },
};
</script>

<style scoped>
._heatmapContainer {
   width: 100%;
   height: 100%;
   /* padding: 35px 10px; */
}

._heatmapContainer .name {
   width: 100%;
   height: 50px;
   display: flex;
   align-items: center;
   font-size: 1.5em;
   /* background-color: green; */
}

._heatmapContainer .buttons {
   width: 100%;
   height: 100px;
   margin: 10px 0;
}

._heatmapContainer .buttons .btn {
   width: 300px;
   height: 100%;
   color: #333;
   background-color: #fff;
   border-color: #ccc;
   display: flex;
   justify-content: space-between;
   align-items: center;
}

._heatmapContainer .buttons .btn .arrow {
   border: solid black;
   border-width: 0 3px 3px 0;
   display: inline-block;
   padding: 3px;
}

._heatmapContainer .buttons .btn .arrow.right {
   transform: rotate(-45deg);
   -webkit-transform: rotate(-45deg);
}

._heatmapContainer .buttons .btn .arrow.left {
   transform: rotate(135deg);
   -webkit-transform: rotate(135deg);
}

._heatmapContainer .space-top {
   width: 100%;
   height: calc(100% - 140px);
   /* background-color: green; */
}

._heatmapContainer .space-top .heigth {
   width: 100%;
   height: 100%;
   /* background-color: red; */
}

.center-div {
     margin: 0 auto;
     width: 100px; 


}

.boutton-barre {
  padding: 14px !important;
}

</style>


<style>
._heatmapContainer .space-top .vueperslides__inner {
   width: 100%;
   height: 100%;
}

._heatmapContainer
   .space-top
   .vueperslides__inner
   .vueperslides__parallax-wrapper {
   width: 100%;
   height: 100%;
}

.vueperslides__arrow {
   color: black;
}
</style>
