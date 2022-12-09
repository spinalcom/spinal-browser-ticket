<!--
Copyright 2022 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->

<template>
  <div class="info_container">
    <div class="content" v-if="variableSelected">
      <div class="header">
        <color-config
          :variableSelected="variableSelected"
          @updateAverage="updateAverage"
          @colorUpdated="sendEvent"
        ></color-config>
      </div>

      <div class="endpointValues">
        <items-linked-component
          v-if="profil"
          :rooms="filteredObjects"
          :variableSelected="variableSelected"
          :filterObjects="filterObjects"
        ></items-linked-component>
      </div>
    </div>
    <div class="noProfilSelected" v-else>{{$t('HeatmapCenter.no-variable-selected')}}</div>
    <!-- <div class="noProfilSelected" v-else> No Variable selected. </div> -->
  </div>
</template>

<script>
import ColorConfig from './sub-components/color-config.vue';
import ItemsLinkedComponent from './sub-components/items-linked-component.vue';
import { EventBus } from "../../../../services/event";
import * as threeJsManager from "../../../../services/viewerUtils/threejsManager"
// import * as threeJsManager from "../../../services/viewerUtils/threejsManager";
import { SpinalGraphService } from 'spinal-env-viewer-graph-service';
import AttributeService from 'spinal-env-viewer-plugin-documentation-service';


export default {
  name: 'ProfilInfoComponent',
  props: { filterObjects: {}, variableSelected: {}, profil: {} },
  components: { ColorConfig, ItemsLinkedComponent },
  data() {
    return {
      filteredObjects: {},
    };
  },
  mounted() {
    this.filteredObjects = this.profil.rooms;
    if (this.filterObjects == 0) {
      this.filteredObjects = this.profil.rooms;
    } else {
      this.filteredObjects = this.profil.rooms.filter((room) => {
        return this.filterObjects.includes(room.id);
      });
    }
    EventBus.$on('InsightCenter-display-sprites', async () => {
      console.log(this.filteredObjects);
      console.log(this.variableSelected)
      await this.genSprites();
    })
    
  },
  methods: {
    async genSprites(){
      for(let obj of this.filteredObjects){
        let node = SpinalGraphService.getRealNode(obj.id);
        let endpoint = obj.endpoints.filter(el=> el.name.get() == this.variableSelected.name);
        if(endpoint.length != 0){
          let text = (parseFloat(endpoint[0].currentValue.get()).toFixed(1)).toString() + " " + endpoint[0].unit.get()
          let position = await AttributeService.findOneAttributeInCategory(node, "Spatial", "XYZ center");
          if(position != -1){
            const pos = position.value.get().split(";");
            // console.log(position);
            await threeJsManager.createSprite({x:pos[0], y:pos[1], z:pos[2]}, text);
          }
        }
        

      }
      // console.log(this.endpoints)
      // for(let endpoint of this.endpoints){
      //   let text = (parseFloat(endpoint.endpoint.currentValue.get()).toFixed(1)).toString() + " " + endpoint.endpoint.unit.get();
      //   let node = SpinalGraphService.getRealNode(endpoint.target.id);
      //   let position = await AttributeService.findOneAttributeInCategory(node, "Spatial", "XYZ center");
      //   if(position != -1){
      //     const pos = position.value.get().split(";");
      //     // console.log(position);
      //     // await threeJsManager.createSprite({x:pos[0], y:pos[1], z:pos[2]}, text);
      //   }
        
      //   // console.log(this.endpoints)
      // }
    },
    updateAverage() {
      if (this.variableSelected.config.average) {
        let max = parseInt(this.variableSelected.config.max.value);
        let min = parseInt(this.variableSelected.config.min.value);
        //   if (!isNaN(max) && !isNaN(min) && this.average)
        this.variableSelected.config.average.value = (max + min) / 2;
        this.sendEvent();
      }
    },

    sendEvent() {
      this.$emit('sendDataUpdated');
    },
  },
  watch: {
    filterObjects() {
      if (this.filterObjects == 0) {
        this.filteredObjects = this.profil.rooms;
      } else {
        this.filteredObjects = this.profil.rooms.filter((room) => {
          return this.filterObjects.includes(room.id);
        });
      }
    },
  },
};
</script>

<style>
.info_container {
  width: 100%;
  height: 100%;
  padding: 10px 0;
}

.info_container .content {
  width: 100%;
  height: 100%;
}

.info_container .content .header {
  width: 100%;
  height: 90px;

  /*border: 1px solid red; */
}

.info_container .content .endpointValues {
  width: 100%;
  height: calc(100% - 90px);
  padding-bottom: 6px;
  /* padding: 25px 0; */
  /* border: 1px solid red; */
}

.info_container .noProfilSelected {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000;
}
</style>
