<template>
  
  <div class = "spacecon spaceL-top">
    <h2> {{profil.name}} </h2>
    <div class="btn space-top btn-size space-right" > 
        <i @click="decreaseIndex()" class="arrow left"></i> 
          {{variables[index]}} 
        <i @click="increaseIndex()" class="arrow right"></i></div>
    <div class="btn space-top btn-size" > <i class="arrow left"></i> Unité de temps  <i class="arrow right"></i></div>
    <vueper-slides :slide-ratio="1 / 2" fixed-height="500px" :dragging-distance="70" prevent-y-scroll  class="space-top">
      
       <vueper-slide  class = "heigth"  v-for="(slide, i) in slides" :key="i" :title="slide.title" :content="slide.content" :image="slide.image"  />
    </vueper-slides>
  </div>
  
  
</template>


<script>
import { VueperSlides, VueperSlide } from 'vueperslides'
import 'vueperslides/dist/vueperslides.css'

import { spinalControlPointService } from "spinal-env-viewer-plugin-control-endpoint-service";
import SpinalBackend from "../../../services/spinalBackend";

export default {
  
  props: ["profil"],

  data() {
    return {
      details:[],
      variables:["Variable 1","Variable 2", "Variable 3"],
      trueVariables:[],
      index:0,
      slides: [
    {
      title: 'Slide #1',
      content: 'Graphiques',
      image: require('./img2.jpg')
    },
    {
      title: 'Slide #2',
      content: 'Graphiques',
      image: require('./img.jpg')
    },
  ]
    };

  },
  components: { VueperSlides, VueperSlide },
  methods:{
    decreaseIndex(){
      if(this.index >0) this.index--;
      else {
        this.index= this.variables.length-1;
      }
    },

    increaseIndex(){
      if(this.index < this.variables.length-1) this.index++;
      else {
        this.index= 0;
      }
    }




  },
  async mounted() {
    let profil = await spinalControlPointService.getElementLinked(this.profil.id);
    let linkedItemId = profil[0].childrenIds[0];
    let res = await spinalControlPointService.getEndpointsNodeLinked(linkedItemId,this.profil.id)
    res.forEach(element => {
      this.trueVariables.push(element.name._data);
      
    });
    console.log( this.trueVariables);
      
    //console.log( res[0].name._data);


    //this.details= await SpinalBackend.heatmapBack.getVariables(this.profil); // this is when we get the data of all the contexts
    //console.log(this.profil);
    //console.log(this.details);
  }

};
</script>


<style>
.vueperslides__arrow {color: black}

</style>

<style scoped>


.heigth{
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

.btn-size{
  width: 45%;
}

.spaceL-top {
  margin-top: 60px;
}
.space-top {
  margin-top: 20px;
}
.space-right{
  margin-right: 50px;
}

.panel-color{
  background-color: #ffffff;
}

.btn{
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