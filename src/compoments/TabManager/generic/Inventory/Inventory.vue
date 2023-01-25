<!--
Copyright 2020 SpinalCom - www.spinalcom.com

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
  
  <!-- <el-container v-if="ctxNode">
    <div style="overflow: auto">
      <h4 class="box-node-name">
        {{ ctxNode.info.name.get() + " : " + $t('datas.current-value')}}
      </h4>
      <div>
        <div v-for="eq of endpoints" :key="eq.name">
          <div class="control-endpoint-grid">
          </div>
        </div>
      </div>
    </div>
  </el-container> -->
  <div>
    <el-button @click="spaceInventory">INVENTAIRE DES SALLES</el-button>
  </div>
</template>

<script>
// imports
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service";
import * as inventoryUtils from "../../../../services/utlils/inventory";
import { EventBus } from "../../../../services/event";

export default {
  name: "Inventory",
  props: {
    Properties: {
      type: Object,
      required: true,
      default: undefined,
      validator: function (value) {
        if (!value.viewKey instanceof String) {
          return false;
        }
        return true;
      },
    },
  },

  data() {
    return {
      ctxNode: false,
      endpoints: false,
      controlEndpoints: false,
      context:false
    };
  },

  watch: {
    Properties: {
      handler: async function (oldProp, newProp) {
        if (newProp.view.serverId != 0) {
          await this.update(newProp.view.serverId);
        } else {
          this.ctxNode = false;
        }
      },
      deep: true,
    },
  },

  async mounted() {
    const promise = new Promise((res,rej)=>{
      this.ctxNode=false;
      this.endpoints=false;
      this.controlEndpoints=false;
      res();
    })
    promise.then(async ()=>{
      await this.update(this.Properties.view.serverId);
    })
    // EventBus.$on("insight-breadcrumb-click", async serverId => {
    //   await this.update(serverId);
    // });
    // EventBus.$on("click-on_spinal-twin.ControlEndpoints", async () => {
    //   await this.update(this.ctxNode._server_id);
    // });
    
  },

  methods: {
    async update(id) {
      // update tab infos from current node
      this.ctxNode = FileSystem._objects[id];


    },
    async spaceInventory(){
      if(this.ctxNode.getType().get() == "groupingCategory"){
        let data = await inventoryUtils.getRoomCategoryInventory(this.ctxNode);
        EventBus.$emit("inventory-mode", data)
      }
      else if(this.ctxNode.getType().get() == "geographicRoomGroupContext"){
        let data = await inventoryUtils.getRoomContextInventory(this.ctxNode);
        EventBus.$emit("inventory-mode", data)
      }
    }
  },
};
</script>

<style scoped>
.control-endpoint-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-height: 70vh;
  overflow: auto;
}

.box-node-name{
  text-align: center;
}
</style>
