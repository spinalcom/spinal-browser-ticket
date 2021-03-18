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
  <el-row>
    <el-tabs type="border-card">

      <el-tab-pane label="Tableau">

        <header-bar :header="getHeader()"
                    :content="getRow()"
                    :data="contextLst"></header-bar>

        <el-table :data="contextLst"
                  border
                  style="width: 100%"
                  :header-cell-style="{'background-color': '#f0f2f5'}">
          <el-table-column :min-width="200" :label="$t('HeatmapCenter.Contextes')">
            <template slot-scope="scope" >
                <div v-if="scope.row.color"
                     class="spinal-table-cell-color"
                     :style="getColor(scope.row.color)"></div>
                <div> {{ scope.row.name }}</div>
            </template>
          </el-table-column>

          <el-table-column prop="categories.length"
                           :label="$t('HeatmapCenter.Categories')"
                           align="center">
                           
          </el-table-column>

          <el-table-column :label="$t('HeatmapCenter.Nb_groupes')"
                           align="center">
            <template slot-scope="scope">
              {{getContextGroup(scope.row)}}
            </template>
          </el-table-column>

          <el-table-column :label="$t('HeatmapCenter.Nb_profils')"
                           align="center">
            <template slot-scope="scope">
              {{getRoomsCount(scope.row)}}
            </template>
          </el-table-column>

          <el-table-column :label="$t('HeatmapCenter.GO')"
                           width="65"
                           align="center">
            <template slot-scope="scope">
              <el-button icon="el-icon-arrow-right"
                         circle
                         @click="SelectContext(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>

</template>

<script>
import SpinalBackend from "../../services/spinalBackend";

import headerBar from "./component/headerBar.vue";

export default {
  data() {
    return {};
  },
  components: {
    "header-bar": headerBar
  },
  props: ["contextLst"],
  methods: {
    getColor(color) {
      return { backgroundColor: color[0] === "#" ? color : `#${color}` };
    },
    getRoomsCount(context) {
      return SpinalBackend.heatmapBack.getContextRoomCount(context);
    },
    getSurfaceTotale(context) {
      const surfaceTotal = SpinalBackend.heatmapBack.getContextSurface(context);
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
    },
    async SeeAll() {
      let promises = this.data.map(async el => {
        return {
          id: el.id,
          ids: await this.getAllBimObjects(el.id),
          color: el.color
        };
      });

      let allBimObjects = await Promise.all(promises);

      EventBus.$emit("seeAll", allBimObjects);
    },

    getHeader() {
      return [
        {
          key: "name",
          header: "name",
          width: 10
        },
        {
          key: "categories",
          header: "Categories",
          width: 10
        },
        {
          key: "groups",
          header: "Groupes",
          width: 10
        },
        {
          key: "rooms",
          header: "Nombre de pièces",
          width: 10
        },
        {
          key: "surface",
          header: "Surface Totale",
          width: 10
        }
      ];
      
    },

    getRow() {

      return this.contextLst.map(el => {
        return {
          name: el.name,
          categories: el.categories.length,
          groups: this.getContextGroup(el),
          rooms: this.getRoomsCount(el),
          surface: this.getSurfaceTotale(el)
        };
      });
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
.boutton-barre {
  padding: 14px !important;
}
.barre {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}
.el-icon-download {
  width: 30px;
}

</style>

