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
      <template v-if="categorieRoomSelect && roomSelected">
        <!-- <roomLstVue :rooms="roomSelected.rooms"
                    :color="roomSelected.color"
                    ref="roomscomponent"
                    @seeEvent="SeeEvent"
                    @addBreadcrumb="emitBreadcrumb"> </roomLstVue> -->
      </template>

      <template v-else>
        <el-tab-pane label="Tableau">
          <el-row class="barre">
            <el-button class="boutton-barre"
                       icon="el-icon-download"
                       circle
                       @click="exportData"></el-button>
            <el-button class="boutton-barre"
                       icon="el-icon-view"
                       circle
                       @click="SeeAll"></el-button>

          </el-row>

          <el-table v-if="!roomSelected"
                    :data="data"
                    class="tab"
                    border
                    style="width: 100%"
                    :header-cell-style='{"background-color": "#f0f2f5"}'
                    @row-click="SeeEvent">

            <el-table-column :label="$t('SpaceManagement.Nom')">
              <template slot-scope="scope">
                <div>
                  <div class="spinal-table-cell-color"
                       :style="{'background-color': scope.row.color}"></div>
                  <div> {{ scope.row.name }} </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="rooms.length"
                             :label="$t('SpaceManagement.NombreDePiece')"
                             align="center">
            </el-table-column>
            true
            <el-table-column prop="surface"
                             :label="$t('SpaceManagement.Surface')"
                             align="center">
              <template slot-scope="scope">

                {{scope.row.surface | roundSurface}} m²
              </template>
            </el-table-column>
            <!-- <el-table-column prop=color
                           label="Couleur"
                           align="center">
            <template slot-scope="scope">

              <div :style="{'background-color': scope.row.color}"
                   class="couleur"
                   style="width: 30%; height: 30px; margin: auto;">

              </div>
            </template>
          </el-table-column> -->

            <!-- <el-table-column>

            <template slot="header"
                      slot-scope="scope">
              <el-button @click="SeeAll"
                         icon="el-icon-view"></el-button>
            </template>

          </el-table-column> -->
            <el-table-column :label="$t('SpaceManagement.ListeDePiece')"
                             align="center">
              <template slot-scope="scope">
                <el-button @click="seeRoomTable(scope.row)"
                           icon="el-icon-arrow-right"
                           circle></el-button>
              </template>
            </el-table-column>

          </el-table>
          <!-- <div v-else>
            <roomLstVue :rooms="roomSelected.rooms"
                        :color="roomSelected.color"
                        ref="roomscomponent"
                        @seeEvent="SeeEvent"
                        @addBreadcrumb="emitBreadcrumb"> </roomLstVue>
          </div> -->
        </el-tab-pane>
        <el-tab-pane label="Dashboard">
          <el-row class="barre">

            <el-button class="boutton-barre"
                       @click="SeeAll"
                       circle
                       icon="el-icon-view"></el-button>

          </el-row>

          <el-carousel height="500px"
                       :loop="false">
            <el-carousel-item>
              <h3 class="small">
                <ChartsPiece :entreprise="data"></ChartsPiece>
              </h3>
            </el-carousel-item>
            <el-carousel-item>
              <h3 class="small">
                <ChartsEsp :entreprise="data"></ChartsEsp>
              </h3>
            </el-carousel-item>
          </el-carousel>

        </el-tab-pane>
      </template>

    </el-tabs>

    <!-- <el-row>

      <el-button @click="exportData">Export</el-button>
    </el-row> -->

  </el-row>
</template>

<script>
import roomLstVue from "./roomLstVue";
import SpinalBackend from "../../../services/spinalBackend";
import ChartsPiece from "./ChartsPiece";
import ChartsEsp from "./ChartsEsp";
import { EventBus } from "../../../services/event";
import excelManager from "spinal-env-viewer-plugin-excel-manager-service";
import fileSaver from "file-saver";

import groupManagerUtilities from "spinal-env-viewer-room-manager/js/utilities";

export default {
  data() {
    return {
      categoryLst: [],
      fields: [],
      items: [],
      roomSelected: null,
      categorieRoomSelect: null
    };
  },
  components: { ChartsPiece, ChartsEsp, roomLstVue },
  props: ["selectCategorie"],
  methods: {
    getColor(color) {
      return { backgroundColor: color[0] === "#" ? color : `#${color}` };
    },
    async SeeEvent(data) {
      console.log("SEEEEEEE");
      const allBimObjects = await this.getAllBimObjects(data);
      EventBus.$emit("see", {
        id: data.id,
        ids: allBimObjects,
        color: data.color
      });
    },

    async getAllBimObjects(data) {
      // const allBimObjects = await groupManagerUtilities.getBimObjects(id);
      const promises = data.rooms.map(el =>
        groupManagerUtilities.getBimObjects(el.id)
      );

      const allBimObjects = await Promise.all(promises).then(result => {
        result = result.flat(10);
        return result;
      });

      return allBimObjects.map(el => el.get());
    },
    async SeeAll() {
      if (this.roomSelected) {
        this.$refs.roomscomponent.SeeAll();
        return;
      }

      let promises = this.data.map(async el => {
        return {
          id: el.id,
          ids: await this.getAllBimObjects(el),
          color: el.color
        };
        seeRoomTable;
      });

      let allBimObjects = await Promise.all(promises);

      EventBus.$emit("seeAll", allBimObjects);
    },
    exportData() {
      //let excelRows = Object.assign({}, this.data);
      //excelRows.rooms = this.data.rooms.length;
      let headers = this.getHeader();
      let excelData = [
        {
          name: "Tableau",
          author: "",
          data: [
            {
              name: "Tableau",
              header: headers,
              rows: this.getRow()
            }
          ]
        }
      ];
      excelManager.export(excelData).then(reponse => {
        fileSaver.saveAs(new Blob(reponse), `Tableau.xlsx`);
      });
      rooms;
      console.log("expoooooooooooort", this.data);
    },

    seeRoomTable(roomData) {
      this.roomSelected = {
        id: roomData.id,
        rooms: roomData.rooms,
        color: roomData.color
      };

      this.$emit("updateBreadcrumb", {
        index: 2,
        item: {
          name: roomData.name,
          click: () => {
            this.$refs.roomscomponent.resetTabRoom();

            const groupSelected = this.selectCategorie.groups.find(
              el => el.id === roomData.id
            );

            this.seeRoomTable(groupSelected);
          }
        }
      });

      // this.$emit("addbreadcrumb", {
      //   name: roomData.name,
      //   click: () => {

      //     const groupSelected = this.selectCategorie.groups.find(
      //       el => el.id === roomData.id
      //     );

      //     this.$refs.roomscomponent.resetTabRoom();

      //     this.$emit("updateBreadcrumb", {
      //       index: 2,
      //       item: {
      //         ...groupSelected,
      //         click: () => {
      //           this.$refs.roomscomponent.resetTabRoom();
      //         }
      //       }
      //     });
      //   }
      // });
    },
    emitBreadcrumb(data) {
      console.log(data);
      this.$emit("addbreadcrumb", data);
    },

    resetRoomSelected() {
      this.roomSelected = null;
    },
    getHeader() {
      if (this.roomSelected) {
        return [
          {
            key: "name",
            header: "name",
            width: 10
          },
          {
            key: "surface",
            header: "Surface",
            width: 10
          }
        ];
      } else {
        return [
          {
            key: "name",
            header: "name",
            width: 10
          },
          {
            key: "rooms",
            header: "Nombre de pièces",
            width: 10
          },
          {
            key: "surface",
            header: "Surface",
            width: 10
          }
        ];
      }
    },
    getRow() {
      if (this.roomSelected) {
        return this.roomSelected.rooms;
      } else {
        return this.data.map(gitu => {
          let excelRows = Object.assign({}, gitu);
          excelRows.rooms = gitu.rooms.length;
          return excelRows;
        });
      }
    },
    isRoom() {}
  },
  computed: {
    data: function() {
      return this.selectCategorie.groups.map(obj => {
        // if (this.roomSelected && this.roomSelected.id === obj.id) {
        //   this.roomSelected = obj;
        // }
        let roo = {
          id: obj.id,
          name: obj.name,
          color: obj.color,
          rooms: obj.rooms,
          surface: obj.rooms.reduce((acc, e) => acc + e.surface, 0)
        };

        if (this.roomSelected && this.roomSelected.id === roo.id) {
          this.roomSelected = {
            id: roo.id,
            rooms: roo.rooms,
            color: roo.color
          };
        }
        return roo;
      });
    }
  },
  watch: {
    selectCategorie() {}
  },
  filters: {
    roundSurface(surface) {
      return Math.round(surface * 100) / 100;
    }
  },
  beforeDestroy() {},
  async mounted() {
    console.log("tttttttttt", this.data);
    this.roomSelected = null;
  }
};
</script>

<style scoped>
.butcen {
  text-align: center;
  padding-top: 100px;
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

.spinal-table-cell-color {
  height: 100%;
  width: 5px;
  position: absolute;
  left: 0;
  top: 0;
}
</style>

