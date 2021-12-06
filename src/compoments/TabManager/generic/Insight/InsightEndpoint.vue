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
  <el-container>
    <el-header>
      Component Header
    </el-header>
    <el-main v-if="ctxNode">
      <el-container>
        <el-header>
          Endpoints
        </el-header>
          {{ ctxNode.info.name.get() }}
        <el-main>
          <insight-control-endpoint
            v-for="endpoint of endpoints"
            v-bind:key="endpoint.name"
            :name="endpoint.name"
            :endpoint="endpoint"
          ></insight-control-endpoint>
        </el-main>
      </el-container>
      <div v-if="controlEndpoints">
        <div v-for="profil of controlEndpoints" v-bind:key="profil.name">
          <h3>
            {{profil.name}}
          </h3>
          <insight-control-endpoint
            v-for="endpoint of profil.info"
            v-bind:key="endpoint.name"
            :name="endpoint.name"
            :endpoint="endpoint"
          ></insight-control-endpoint>
        </div>
      </div>
    </el-main>
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
      console.debug("node", this.ctxNode)
      // this.controlEndpoints = await this.getNodeEndpointsInfo(this.ctxNode.info.id, "hasControlPoints");
      this.endpoints = await this.getNodeEndpointsInfo(this.ctxNode.info.id, "hasEndPoint");
      console.debug("endpoints", this.endpoints)
    },

    // return infos from an endpointNodeId
    async getEndpointInfo(endpointNodeId){
      const realnode = SpinalGraphService.getRealNode(endpointNodeId);
      console.debug("real node:", realnode)
      const attributesLstModels = await serviceDocumentation.getAllAttributes(realnode);
      console.debug("attributesLstModels:", attributesLstModels)
      const attributes = attributesLstModels.map(el => el.get());
      console.debug("attributes:", attributes)
      const endpointInfo = {};
      for (const attr of attributes) {
        endpointInfo[attr.label] = attr.value;
      }
      return endpointInfo;
    },

    async getNodeEndpointsInfo(nodeId, endpointRelation){
      const endpointProfilsModel = await SpinalGraphService.getChildren(nodeId, endpointRelation);
      if (endpointProfilsModel.length == 0) return // si la node n'a pas d'endpoints on quitte la fonction
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
      else { // on cherche les endpoints (onglet endpoint)
        const res = [];
        // premier automate associé ( à changer si besoin )
        const endpointsModels = await SpinalGraphService.getChildren(endpointProfilsModel[0].id.get(), "hasBmsEndpoint");
        const endpoints = endpointsModels.map(el => el.get());
        
        for (const endpoint of endpoints) { // pour chaque endpoint
          const info = await this.getEndpointInfo(endpoint.id);
          console.debug(info)
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