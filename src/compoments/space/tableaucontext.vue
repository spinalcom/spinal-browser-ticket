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

  <el-table :data="contextLst"
            class="tab"
            border
            style="width: 100%;"
            :header-row-style='{"min-height" : "0px","height" : "50px", "padding" : "0px"}'
            :header-cell-style='{"background-color": "#f0f2f5"}'
            @row-click="SelectContext">

    <el-table-column prop="name"
                     label="Nom"
                     width="180">
    </el-table-column>

    <el-table-column prop="categories.length"
                     label="Categories"
                     align="center">
    </el-table-column>

    <el-table-column label=" Groupe"
                     align="center">
      <template slot-scope="scope">
        {{getContextGroup(scope.row)}}
      </template>
    </el-table-column>

    <el-table-column label="Nombre de pièces"
                     align="center">
      <template slot-scope="scope">
        {{getRoomsCount(scope.row)}}
      </template>
    </el-table-column>

    <el-table-column label="Surface Totale"
                     align="center">
      <template slot-scope="scope">
        {{getSurfaceTotale(scope.row)}} m²
      </template>
    </el-table-column>
  </el-table>

  <!-- <div>
    <el-card class="box-card"
             v-for="context in contextLst"
             :key=context.id>

      <div slot="header"
           class="clearfix">
        <span>{{context.name}}</span>
      </div>
      <div class="card-content">
        <el-button v-for="contextCat in context.categories"
                   :key=contextCat.id
                   @click="onclick(contextCat)">
          {{contextCat.name}}
        </el-button>
      </div>
    </el-card>
  </div> -->

</template>

<script>
import SpinalBackend from "../../services/spinalBackend";

export default {
  data() {
    return {};
  },
  components: {},
  props: ["contextLst"],
  methods: {
    getRoomsCount(context) {
      return SpinalBackend.spaceBack.getContextRoomCount(context);
    },
    getSurfaceTotale(context) {
      const surfaceTotal = SpinalBackend.spaceBack.getContextSurface(context);
      return Math.round(surfaceTotal * 100) / 100;
    },
    getContextGroup(context) {
      let count = 0;
      for (const category of context.categories) {
        count += category.groups.length;
      }

      return count;
    },

    SelectContext(context) {
      this.$emit("select", context);
    }
  },
  async mounted() {},
  watch: {
    contextLst() {
      console.log("context", this.contextLst);
    }
  },
  beforeDestroy() {}
};
</script>

<style scoped>
.tab {
  padding: 0 -20 px 0 -10px;
}
</style>

