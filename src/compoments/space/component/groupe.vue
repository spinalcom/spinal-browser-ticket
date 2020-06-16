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
                       label="Name">
      </el-table-column>

      <el-table-column prop="surface"
                       label="Area">
        <template slot-scope="scope">

          {{scope.row.surface}} m²
        </template>
      </el-table-column>
      <el-table-column prop=color
                       label="Color">
        <template slot-scope="scope">

          <div :style="{'background-color': scope.row.color}"
               class="couleur"
               style="width: 30%; height: 30px">

          </div>
        </template>
      </el-table-column>
    </el-table>

  </el-row>
</template>

<script>
import SpinalBackend from "../../../services/spinalBackend";

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
  methods: {},
  computed: {
    data: function() {
      return this.selectCategorie.groups.rooms.map(obj => {
        return {
          id: obj.id,
          name: obj.name,
          surface: obj.rooms.surface
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
