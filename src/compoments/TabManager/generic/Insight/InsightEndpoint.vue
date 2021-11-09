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
  <el-container v-if="ctxNode">
    <div style="overflow: auto">
      <h4>
        {{ ctxNode.info.name.get() }}
      </h4>
      <div style="display: flex; flex-direction: row; flex-wrap: wrap">
        <insight-control-endpoint-box
          v-for="endpoint of endpoints"
          v-bind:key="endpoint.id"
          :name="endpoint.name"
          :endpoint="endpoint"
        ></insight-control-endpoint-box>
      </div>
      <h4>
        Room's equipment
      </h4>
      <div style="display: flex; flex-direction: row; flex-wrap: wrap">
        <insight-control-endpoint-box
          v-for="endpoint of childrenEndpoints"
          v-bind:key="endpoint.id"
          :name="endpoint.name"
          :endpoint="endpoint"
        ></insight-control-endpoint-box>
      </div>
    </div>
  </el-container>
</template>

<script>
// imports
import InsightControlEndpointBox from './InsightControlEndpointBox.vue'
import { SpinalGraphService } from 'spinal-env-viewer-graph-service'
import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service"

export default {
  name: "InsightEndpoint",
  components: { InsightControlEndpointBox },
  props: {
    Properties: {
      required: true,
      type: Object,
    },
  },

  data() {
    return {
      ctxNode: false,
      endpoints: false,
      childrenEndpoints: [],
    };
  },

  watch:
  {
    Properties:
    {
      handler: async function(oldProp, newProp)
      {
        if (newProp && newProp.view && newProp.view.serverId != 0)
        {
          await this.update(newProp.view.serverId);
        }
        else
        {
          this.ctxNode = false;
        }
      },
      deep: true,
    }
  },

  async mounted() {
    this.update();
  },

  methods: {
    async update()
    {
      // update tab infos from current node
      this.ctxNode = FileSystem._objects[this.Properties.view.serverId];
      console.debug("node", this.ctxNode);
      console.debug("Props", this.Properties);
      if (this.ctxNode.info.type.get() == "geographicRoom")
      {
        let children = await SpinalGraphService.getChildrenInContext(this.ctxNode.info.id.get(),
          FileSystem._objects[this.Properties.context].info.id.get());
        console.debug("children", children);
        for (const child of children)
        {
          let temp = await this.getNodeEndpointsInfo(child.id.get(), "hasEndPoint");
          console.debug("temp", temp);
          if (typeof temp !== 'undefined')
          {
            this.childrenEndpoints = this.childrenEndpoints.concat(temp);
          }
          console.debug("childrenEndpoints", this.childrenEndpoints);
        }
      }
      this.endpoints = await this.getNodeEndpointsInfo(this.ctxNode.info.id.get(), "hasEndPoint");
    },

    // return infos from an endpointNodeId
    async getEndpointInfo(endpointNodeId){
      const realnode = SpinalGraphService.getRealNode(endpointNodeId);
      const attributesLstModels = await serviceDocumentation.getAllAttributes(realnode);
      const attributes = attributesLstModels.map(el => el.get());
      const endpointInfo = {};
      for (const attr of attributes) {
        endpointInfo[attr.label] = attr.value;
      }
      const infos = await realnode.element.load();
      endpointInfo.name = infos.name.get();
      endpointInfo.id = realnode.info.id.get();
      endpointInfo.currentValue = infos.currentValue.get();
      endpointInfo.unit = infos.unit.get();
      return endpointInfo;
    },
    
    async getNodeEndpointsInfo(nodeId, endpointRelation) {
      const endpointProfilsModel = await SpinalGraphService.getChildren(nodeId, endpointRelation);
      console.debug("endpointProfilsModel", endpointProfilsModel);
      if (endpointProfilsModel.length == 0) return // si la node n'a pas d'endpoints on quitte la fonction
      console.debug("type", endpointProfilsModel[0].type.get());
      // if (endpointRelation == 'hasControlPoints'){ // on cherche les control endpoints (onglet insight)
      //   const res = [];
      //   for(const endpointProfil of endpointProfilsModel){ // pour chaque profil de control endpoint
      //     /** on récupère la data */
      //     const endpointsModels = await SpinalGraphService.getChildren(endpointProfil.id.get(), "hasBmsEndpoint");
      //     const endpoints = endpointsModels.map(el => el.get());
      //     const infos = [];

      //     for (const endpoint of endpoints) { // pour chaque control endpoint
      //     /** on récupère la data */
      //       const info = await this.getEndpointInfo(endpoint.id);
      //       infos.push(info);
      //     }
      //   res.push({name: endpointProfil.name.get(), info:infos})
      //   }
      //   return res;
      // }
      //endpointRelation == 'hasEndpoint'
      const res = [];
      // premier automate associé ( à changer si besoin )
      if (endpointProfilsModel[0].type.get() == "BmsDevice")
      {
        const endpointsModels = await SpinalGraphService.getChildren(endpointProfilsModel[0].id.get(), "hasBmsEndpoint");
        console.debug("endpointsModels", endpointsModels);
        const endpoints = endpointsModels.map(el => el.get());
        console.debug("endpoints", endpoints);
        for (const endpoint of endpoints) { // pour chaque endpoint
          const info = await this.getEndpointInfo(endpoint.id);
          console.debug("info :", info)
          res.push(info);
        }
      }
      else
      {
        for (const endpoint of endpointProfilsModel) { // pour chaque endpoint
          const info = await this.getEndpointInfo(endpoint.id);
          console.debug("info :", info)
          res.push(info);
        }
      }
      return res;
    },

    async debug(what) {
      console.debug("Debugging", what);
    },
  },
};
</script>