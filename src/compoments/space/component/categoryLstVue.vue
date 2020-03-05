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
  <el-row>

    <el-table :data="data"
              class="tab">
      <el-table-column prop=name
                       label="Nom">
      </el-table-column>
      <el-table-column prop="rooms.length"
                       label="Nombre de pièces">
      </el-table-column>

      <el-table-column prop="surface"
                       label="Surface">
        <template slot-scope="scope">

          {{scope.row.surface}} m²
        </template>
      </el-table-column>
      <el-table-column prop=color
                       label="Couleur">
        <template slot-scope="scope">

          <div :style="{'background-color': scope.row.color}"
               class="couleur"
               style="width: 30%; height: 30px">

          </div>
        </template>
      </el-table-column>

      <el-table-column>

        <template slot="header"
                  slot-scope="scope">
          <el-button @click="SeeAll"
                     icon="el-icon-view"></el-button>
        </template>

        <template slot-scope="scope">
          <el-button icon="
                  el-icon-view"
                     @click="SeeEvent(scope.row)"></el-button>
        </template>

      </el-table-column>

    </el-table>
    <ChartsPiece :entreprise="data"></ChartsPiece>
    <ChartsEsp :entreprise="data"></ChartsEsp>
  </el-row>
</template>

<script>
import SpinalBackend from "../../../services/spinalBackend";
import ChartsPiece from "./ChartsPiece";
import ChartsEsp from "./ChartsEsp";
import { EventBus } from "../../../services/event";

import groupManagerUtilities from "spinal-env-viewer-room-manager/js/utilities";

export default {
  data() {
    return {
      categoryLst: [],
      fields: [],
      items: []
    };
  },
  components: { ChartsPiece, ChartsEsp },
  props: ["selectCategorie"],
  methods: {
    async SeeEvent(data) {
      const allBimObjects = await this.getAllBimObjects(data.id);
      EventBus.$emit("see", { ids: allBimObjects, color: data.color });
    },

    async getAllBimObjects(id) {
      const allBimObjects = await groupManagerUtilities.getBimObjects(id);

      return allBimObjects.map(el => el.get());
    },
    async SeeAll() {
      let promises = this.data.map(async el => {
        return { ids: await this.getAllBimObjects(el.id), color: el.color };
      });

      let allBimObjects = await Promise.all(promises);

      EventBus.$emit("seeAll", allBimObjects);
    }
  },
  computed: {
    data: function() {
      return this.selectCategorie.groups.map(obj => {
        return {
          id: obj.id,
          name: obj.name,
          color: obj.color,
          rooms: obj.rooms,
          surface: obj.rooms.reduce((acc, e) => acc + e.surface, 0)
        };
      });
    }
  },
  watch: {},
  beforeDestroy() {},
  async mounted() {}
};
</script>

<style scoped>
.butcen {
  text-align: center;
  padding-top: 100px;
}
.tab {
  padding-top: 20px;
}
</style>

