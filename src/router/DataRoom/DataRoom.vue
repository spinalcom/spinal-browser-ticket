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
    <div class="data-room-breadcrumb-container">
      <SpinalBreadcrumb :view-key="viewKey">
      </SpinalBreadcrumb>
    </div>
    <el-row>
      <el-tabs type="border-card">
        <el-tab-pane label="Tableau">
          <el-collapse v-model="activeNames">
            <el-collapse-item v-for="(item, index) in items"
                              :key="item.nodeType"
                              :name="item.nodeType">
              <template slot="title">
                <div class="data-room-collapse-bar">
                  <div class="data-room-collapse-bar-title">
                    {{ $t(`data-room.${item.nodeType}`) }}
                  </div>
                  <div>
                    <el-button icon="el-icon-download"
                               circle
                               @click.stop="exportData(index)">
                    </el-button>
                    <el-button icon="el-icon-view"
                               circle
                               @click.stop="SeeAllClick(index)"></el-button>
                  </div>
                </div>
              </template>

              <DataRoomTypeTable :ref="`data-room-table`"
                                 :view-key="viewKey"
                                 :node-type="item.nodeType"
                                 :items="item.items">
              </DataRoomTypeTable>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
import { ViewManager } from "../../services/ViewManager/ViewManager";
import SpinalBreadcrumb from "../../compoments/SpinalBreadcrumb/SpinalBreadcrumb.vue";
const VIEWKEY_DATA_ROOM_CENTER = "Data room";
import { spinalBackEnd } from "../../services/spinalBackend";
import DataRoomTypeTable from "./DataRoomTypeTable.vue";
import './DataRoomEventHandler';
export default {
  components: { SpinalBreadcrumb, DataRoomTypeTable },
  data() {
    return {
      currentView: null,
      viewKey: VIEWKEY_DATA_ROOM_CENTER,
      contextServId: 0,
      items: [],
      activeNames: []
    };
  },
  async mounted() {
    await spinalBackEnd.waitInit();
    ViewManager.getInstance(this.viewKey).init(this.onViewChange.bind(this), 0);
  },
  methods: {
    async onViewChange(view) {
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
      this.activeNames = [];
      for (const [nodeType, items] of mapItems) {
        this.items.push({ nodeType, items });
        this.activeNames.push(nodeType);
      }
      this.currentView = view;
    },
    changeView(item) {
      ViewManager.getInstance(this.viewKey).push(item.name, item.serverId);
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
  margin-bottom: 10px;
  background-color: #f5f7fa;
}
/* .data-room .el-icon-download {
  width: 15px;
} */

.data-room .el-collapse-item__header {
  direction: rtl;
}
</style>

<style scoped>
.data-room-collapse-bar {
  direction: ltr;
  display: flex;
  flex-grow: 1;
}
.data-room-collapse-bar-title {
  flex-grow: 1;
}
</style>
