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
  <el-table :data="categories"
            border
            style="width: 100%"
            :header-row-style='{"min-height" : "0px","height" : "50px", "padding" : "0px"}'
            :header-cell-style='{"background-color": "#f0f2f5"}'
            @row-click="seeGroups">

    <el-table-column prop="name"
                     label="Nom"
                     width="180">
    </el-table-column>

    <el-table-column prop="groups.length"
                     label="Nombre de total de groupe"
                     align="center">
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
</template>

<script>
import SpinalBackend from "../../services/spinalBackend";

export default {
  data() {
    return {
      categories: []
    };
  },
  components: {},
  props: ["contextSelected"],
  methods: {
    getRoomsCount(category) {
      return SpinalBackend.spaceBack.getCategoriesRoomCount(category);
    },

    getSurfaceTotale(category) {
      const surfaceTotal = SpinalBackend.spaceBack.getCategoriesSurface(
        category
      );
      return Math.round(surfaceTotal * 100) / 100;
    },

    seeGroups(category) {
      this.$emit("seeGroups", category);
    }
  },
  async mounted() {
    this.categories = this.contextSelected.categories;
  },
  watch: {
    contextSelected() {
      this.categories = this.contextSelected.categories;
    }
  },
  beforeDestroy() {}
};
</script>

