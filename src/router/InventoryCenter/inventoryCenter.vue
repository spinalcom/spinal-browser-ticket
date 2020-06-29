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
  <div class="inventory-center">
    <div class="inventory-center-breadcrumb-container">
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
                <div class="inventory-collapse-bar">
                  <div class="inventory-collapse-bar-title">
                    {{ $t(item.nodeType) }}
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

              <InventoryTypeTable :ref="`intentory-table`"
                                  :view-key="viewKey"
                                  :node-type="item.nodeType"
                                  :items="item.items">
              </InventoryTypeTable>
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
const VIEWKEY_INVENTORY_CENTER = "Inventory Center";
import { spinalBackEnd } from "../../services/spinalBackend";
import InventoryTypeTable from "./InventoryTypeTable.vue";
import './InventoryEventHandler';
export default {
  components: { SpinalBreadcrumb, InventoryTypeTable },
  data() {
    return {
      currentView: null,
      viewKey: VIEWKEY_INVENTORY_CENTER,
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
        mapItems = await spinalBackEnd.InventoryBack.getContexts();
      } else {
        if (this.contextServId === 0) {
          this.contextServId = view.serverId;
        }
        mapItems = await spinalBackEnd.InventoryBack.getItems(
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
      this.$refs["intentory-table"][index].exportToExcel();
    },
    SeeAllClick(index) {
      this.$refs["intentory-table"][index].SeeAll(this.currentView.serverId);
    }
  }
};
</script>

<style>
.inventory-center-barre {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  background-color: #f5f7fa;
}
/* .inventory-center .el-icon-download {
  width: 15px;
} */

.inventory-center .el-collapse-item__header {
  direction: rtl;
}
</style>

<style scoped>
.inventory-collapse-bar {
  direction: ltr;
  display: flex;
  flex-grow: 1;
}
.inventory-collapse-bar-title {
  flex-grow: 1;
}
</style>
