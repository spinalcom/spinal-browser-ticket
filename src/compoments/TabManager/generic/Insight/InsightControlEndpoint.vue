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
  <el-container v-if="ctxNode
      && (ctxNode.info.type.get() == 'geographicRoom'
      && typeof endpoints !== 'undefined'
      && endpoints.length != 0)"
  >
    <div v-for="eq of endpoints" v-bind:key="eq.name">
      <div style="display: flex; flex-direction: row; flex-wrap: wrap">
        <insight-control-endpoint-box
          v-for="end of eq.info"
          v-bind:key="end.name"
          :name="end.name"
          :endpoint="end"
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
  name: "InsightControlEndpoint",
  components: { InsightControlEndpointBox },
  props: {
    Properties: {
      type: Object,
      required: true,
      default: undefined,
      validator: function(value) {
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
    };
  },

  watch:
  {
    Properties:
    {
      handler: async function(oldProp, newProp)
      {
        if (newProp.view.serverId != 0)
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
    this.update(this.Properties.view.serverId);
  },

  methods: {
    async update(id)
    {
      // update tab infos from current node
      this.ctxNode = FileSystem._objects[id];
      console.debug("ICE node", this.ctxNode);
      this.endpoints = await this.getNodeEndpointsInfo(this.ctxNode.info.id.get(), "hasControlPoints");
      console.debug("control endpoints", this.endpoints);
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
      return endpointInfo;
    },

    async getNodeEndpointsInfo(nodeId, endpointRelation){
      const endpointProfilsModel = await SpinalGraphService.getChildren(nodeId, endpointRelation);
      if (endpointProfilsModel && endpointProfilsModel.length == 0) return // si la node n'a pas d'endpoints on quitte la fonction
      if (endpointRelation == 'hasControlPoints'){ // on cherche les control endpoints (onglet insight)
        const res = [];
        for(const endpointProfil of endpointProfilsModel){ // pour chaque profil de control endpoint
          /** on récupère la data */
          const endpointsModels = await SpinalGraphService.getChildren(endpointProfil.id.get(), "hasBmsEndpoint");
          const endpoints = endpointsModels.map(el => el.get());
          const infos = [];

          for (const endpoint of endpoints) { // pour chaque control endpoint
          /** on récupère la data */
            const info = await this.getEndpointInfo(endpoint.id);
            infos.push(info);
          }
        res.push({name: endpointProfil.name.get(), info:infos})
        }
        return res;
      }
      //endpointRelation == 'hasEndpoint'
      else
      { // on cherche les endpoints (onglet endpoint)
        const res = [];
        // premier automate associé ( à changer si besoin )
        const endpointsModels = await SpinalGraphService.getChildren(endpointProfilsModel[0].id.get(), "hasBmsEndpoint");
        const endpoints = endpointsModels.map(el => el.get());

        for (const endpoint of endpoints) { // pour chaque endpoint
          const info = await this.getEndpointInfo(endpoint.id);
          res.push(info);
        }
        return res;
      }
    },

    async debug(what) {
      console.debug("Debugging", what);
    },
  },
};
</script>