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
  <div class="data-room">
    <div class="data-room-breadcrumb-container"
         style="margin: 10px;">
      <SpinalBreadcrumb :view-key="viewKey">
      </SpinalBreadcrumb>
    </div>
    <el-row v-if="display === false">
      <el-tabs type="border-card">
        <el-tab-pane :label="panel">
          <div v-for="(item, index) in items"
               :key="item.nodeType"
               :name="item.nodeType">
            <el-header>
              <div style="float: right">

                <el-button icon="el-icon-download"
                           circle
                           @click.stop="exportData(index)">
                </el-button>
                <el-button icon="el-icon-view"
                           circle
                           @click.stop="SeeAllClick(index)"></el-button>
              </div>
            </el-header>
            <DataRoomTypeTable :ref="`data-room-table`"
                               :view-key="viewKey"
                               :node-type="item.nodeType"
                               :items="item.items"
                               :collums="item.cols">
            </DataRoomTypeTable>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-row>
    <div v-else
         class="spinal-space-spacecon_container-container">
      <div class="spacecon_container">
        <room-data :node-id="nodeId"></room-data>
      </div>
    </div>
  </div>
</template>

<script>
import { ViewManager } from "../../services/ViewManager/ViewManager";
import SpinalBreadcrumb from "../../compoments/SpinalBreadcrumb/SpinalBreadcrumb.vue";
const VIEWKEY_DATA_ROOM_CENTER = "Data room";
import { spinalBackEnd } from "../../services/spinalBackend";
import TabManager from "../../compoments/tabManager/tabManager.vue";
import DataRoomTypeTable from "./DataRoomTypeTable.vue";
import RoomData from "./components/RoomData.vue";
import CategoryAttribute from "./components/CategoryAttribute.vue";
import "./DataRoomEventHandler";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { FileSystem } from "spinal-core-connectorjs_type";
export default {
  components: {
    SpinalBreadcrumb,
    DataRoomTypeTable,
    TabManager,
    "room-data": RoomData,
    CategoryAttribute
  },
  data() {
    return {
      currentView: null,
      panel: null,
      viewKey: VIEWKEY_DATA_ROOM_CENTER,
      contextServId: 0,
      nodeId: null,
      items: [],
      dataEq: {},
      display: false,
      activeNames: [],
      tabs: [
        /*{
          name: "Tableau",
          content: Explorer,
          props: {
            viewKey: VIEWKEY_DATA_ROOM_CENTER,
            items: false,
            view: false,
          },
          optional: false,
        },*/
      ]
    };
  },
  async mounted() {
    await spinalBackEnd.waitInit();
    ViewManager.getInstance(this.viewKey).init(this.onViewChange.bind(this), 0);
  },
  methods: {
    async onViewChange(view) {
      this.display = false;
      let mapItems;
      if (view.serverId === 0) {
        this.contextServId = 0;
        mapItems = await spinalBackEnd.DataRoomBack.getContexts();
      } else {
        if (this.contextServId === 0) {
          this.contextServId = view.serverId;
        }
        mapItems = await spinalBackEnd.DataRoomBack.getItems(
          view.serverId,
          this.contextServId
        );
      }
      this.items = [];
      this.tabs = [];
      this.activeNames = [];
      let nodeId;
      let serverId;
      for (const [nodeType, items] of mapItems) {
        const cols = new Set();
        for (const item of items) {
          nodeId = item.nodeId;
          if (item.children) {
            for (const [childTypes] of item.children) {
              cols.add(childTypes);
            }
          }
        }
        this.items.push({ nodeType, items, cols: Array.from(cols), nodeId });
        this.activeNames.push(nodeType);
      }
      this.currentView = view;
      if (this.items[0].nodeType === "geographicContext") {
        this.panel = "Contextes";
      }
      if (this.items[0].nodeType === "geographicBuilding") {
        this.panel = "Bâtiments";
      }
      if (this.items[0].nodeType === "geographicFloor") {
        this.panel = "Etages";
      }
      if (this.items[0].nodeType === "geographicRoom") {
        this.panel = "Pièces";
      }
      /*this.tabs = [
        {
          name: "Equipements",
          content: Explorer,
          props: {
            viewKey: VIEWKEY_DATA_ROOM_CENTER,
            items: false,
            view: false,
          },
          optional: false,
        },
      ]*/
      if (this.items[0].nodeType === "BIMObject") {
        this.display = true;
        const idNode = localStorage.getItem("nodeId");
        this.nodeId = idNode;
      }
    },
    changeView(item) {
      ViewManager.getInstance(this.viewKey).push(
        item.name,
        item.serverId,
        item.nodeId
      );
    },
    exportData(index) {
      this.$refs["data-room-table"][index].exportToExcel();
    },
    SeeAllClick(index) {
      this.$refs["data-room-table"][index].SeeAll(this.currentView.serverId);
    }
  }
};
</script>

<style>
.data-room-barre {
  display: flex;
  justify-content: flex-end;
  background-color: #f5f7fa;
}
/* .data-room .el-icon-download {
  width: 15px;
} */

.data-room {
  direction: ltr;
  overflow-x: auto;
  overflow-y: hidden;
}
</style>

<style scoped>
.data-room-tabs {
  margin: 5px auto;
  height: calc(100% - 55px);
  overflow: auto;
  border-radius: 5px;
}

.data-room-collapse-bar {
  direction: ltr;
  display: flex;
  flex-grow: 1;
}
.data-room-collapse-bar-title {
  flex-grow: 1;
}
<<<<<<< HEAD .spacecon .spacecon_container {
  border-radius: 4px;
}
.spinal-space-spacecon_container-container {
  width: 100%;
  height: calc(100% - 55px);
  padding: 5px 10px 10px 5px;
  background-color: #fdfdfd;
  overflow: auto;
}
</style>
=======
</style>
>>>>>>> origin/graphic-normalisation
