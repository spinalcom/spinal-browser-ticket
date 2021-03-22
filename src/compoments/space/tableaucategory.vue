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
        <!-- <el-row class="barre">
          <el-button class="boutton-barre"
                     icon="el-icon-download"
                     circle
                     @click="exportData"></el-button>
          <el-button class="boutton-barre"
                     icon="el-icon-view"
                     circle
                     @click="SeeAll"></el-button>

        </el-row> -->

        <header-bar :header="getHeader()"
                    :content="getRow()"
                    :data="categories"></header-bar>

        <el-table :data="categories"
                  border
                  style="width: 100%"
                  :header-row-style="{&quot;min-height&quot; : &quot;0px&quot;,&quot;height&quot; : &quot;50px&quot;, &quot;padding&quot; : &quot;0px&quot;}"
                  :header-cell-style="{&quot;background-color&quot;: &quot;#f0f2f5&quot;}">
          <el-table-column prop="name"
                           :label="$t('SpaceManagement.Nom')"
                           width="180">
          </el-table-column>

          <el-table-column prop="groups.length"
                           :label="$t('SpaceManagement.NombreTotalGroupe')"
                           align="center">
          </el-table-column>

          <el-table-column :label="$t('SpaceManagement.NombreTotalPiece')"
                           align="center">
            <template slot-scope="scope">
              {{ getRoomsCount(scope.row) }}
            </template>
          </el-table-column>

          <el-table-column :label="$t('SpaceManagement.SurfaceTotale')"
                           align="center">
            <template slot-scope="scope">
              {{ getSurfaceTotale(scope.row) }} m²
            </template>
          </el-table-column>
          <el-table-column label=""
                           width="65"
                           align="center">
            <template slot-scope="scope">
              <el-button v
                         icon="el-icon-arrow-right"
                         circle
                         @click="seeGroups(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-row>
</template>

<script>
import SpinalBackend from "../../services/spinalBackend";
import headerBarVue from "./component/headerBar.vue";

export default {
  components: {
    "header-bar": headerBarVue
  },
  props: ["contextSelected"],
  data() {
    return {
      categories: []
    };
  },
  watch: {
    contextSelected() {
      this.categories = this.contextSelected.categories;
      console.log(this.categories);
    }
  },
  async mounted() {
    this.categories = this.contextSelected.categories;
  },
  beforeDestroy() {},
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
    },

    getHeader() {
      return [
        {
          key: "name",
          header: "name",
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
      // if (this.roomSelected) {
      //   return [
      //     {
      //       key: "name",
      //       header: "name",
      //       width: 10
      //     },
      //     {
      //       key: "surface",
      //       header: "Surface",
      //       width: 10
      //     }
      //   ];
      // } else {
      //   return [
      //     {
      //       key: "name",
      //       header: "name",
      //       width: 10
      //     },
      //     {
      //       key: "rooms",
      //       header: "Nombre de pièces",
      //       width: 10
      //     },
      //     {
      //       key: "surface",
      //       header: "Surface",
      //       width: 10
      //     }
      //   ];
      // }
    },

    getRow() {
      // if (this.roomSelected) {
      //   return this.roomSelected.rooms;
      // } else {
      //   return this.data.map(gitu => {
      //     let excelRows = Object.assign({}, gitu);
      //     excelRows.rooms = gitu.rooms.length;
      //     return excelRows;
      //   });
      // }

      return this.categories.map(el => {
        return {
          name: el.name,
          groups: el.groups.length,
          rooms: this.getRoomsCount(el),
          surface: this.getSurfaceTotale(el)
        };
      });
    }
  }
};
</script>

<style scoped>
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
