<template>

   <div class="spacecon spaceL-top">
      <h2> {{profil.name}} </h2>

      <div class="btn space-top btn-size space-right">
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

      <div class="btn space-top btn-size"> <i class="arrow left"></i> Unité de temps <i class="arrow right"></i></div>

      <vueper-slides
         :slide-ratio="1 / 2"
         fixed-height="500px"
         :dragging-distance="70"
         prevent-y-scroll
         class="space-top"
      >

         <vueper-slide
            class="heigth"
            v-for="(slide, i) in slides"
            :key="i"
            :title="slide.title"
            :content="slide.content"
            :image="slide.image"
         />
      </vueper-slides>
   </div>

</template>


<script>
import { VueperSlides, VueperSlide } from "vueperslides";
import { EventBus } from "../../../services/event";
import { spinalBackEnd } from "../../../services/spinalBackend";

import "vueperslides/dist/vueperslides.css";

const backendService = spinalBackEnd.heatmapBack;

// import { spinalControlPointService } from "spinal-env-viewer-plugin-control-endpoint-service";

export default {
   props: ["profil"],

   data() {
      return {
         variableSelected: undefined,
         details: [],
         //variables:["Variable 1","Variable 2", "Variable 3"],
         variables: [],
         index: undefined,
         slides: [
            {
               title: "Slide #1",
               content: "Graphiques",
               image: require("./img2.jpg"),
            },
            {
               title: "Slide #2",
               content: "Graphiques",
               image: require("./img.jpg"),
            },
         ],
      };
   },
   components: { VueperSlides, VueperSlide },

   methods: {
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

   mounted() {
      if (
         this.profil.endpointsProfils &&
         this.profil.endpointsProfils.length > 0
      ) {
         this.variables = this.profil.endpointsProfils;
         this.index = 0;
         //  this.variableSelected = this.profil.endpointsProfils[0];
      }
      // let profil = await spinalControlPointService.getElementLinked(
      //    this.profil.id
      // );
      // let linkedItemId = profil[0].childrenIds[0];
      // let res = await spinalControlPointService.getEndpointsNodeLinked(
      //    linkedItemId,
      //    this.profil.id
      // );
      // res.forEach((element) => {
      //    this.variables.push(element.name._data);
      // });
      // console.log(this.variables);
   },

   watch: {
      variableSelected() {
         console.log("variableSelected", this.variableSelected);
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


<style>
.vueperslides__arrow {
   color: black;
}
</style>

<style scoped>
.heigth {
   height: 100%;
}

.arrow {
   border: solid black;
   border-width: 0 3px 3px 0;
   display: inline-block;
   padding: 3px;
}

.right {
   transform: rotate(-45deg);
   -webkit-transform: rotate(-45deg);
}

.left {
   transform: rotate(135deg);
   -webkit-transform: rotate(135deg);
}

.spacecon {
   width: 100%;
   padding: 35px 10px;
}

.btn-size {
   width: 45%;
}

.spaceL-top {
   margin-top: 60px;
}
.space-top {
   margin-top: 20px;
}
.space-right {
   margin-right: 50px;
}

.panel-color {
   background-color: #ffffff;
}

.btn {
   display: inline-block;
   padding: 20px 12px;
   margin-bottom: 0;
   font-size: 14px;
   font-weight: 400;
   line-height: 1.42857143;
   text-align: center;
   white-space: nowrap;
   vertical-align: middle;
   -ms-touch-action: manipulation;
   touch-action: manipulation;
   cursor: pointer;
   -webkit-user-select: none;
   -moz-user-select: none;
   -ms-user-select: none;
   user-select: none;
   background-image: none;
   border: 1px solid transparent;
   border-radius: 4px;
   text-decoration: none;

   color: #333;
   background-color: #fff;
   border-color: #ccc;
}
</style>