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
  <el-container>
    <div v-for="(item, idx) in items" :key="idx" style="width: 100%">
      <el-header>
        {{ $t(`node-type.${item.nodeType}`) }}
        <div style="float: right">
          <el-button
            icon="el-icon-download"
            circle
            @click.stop="exportToExcel(idx)"
          >
          </el-button>
          <el-button icon="el-icon-view" circle @click.stop="SeeAll(idx)">
          </el-button>
        </div>
      </el-header>
      <el-main>
        <node-table
          :ref="`Explorer-table`"
          :view-key="Properties.viewKey"
          :items="item.items"
          :columns="item.cols"
        >
        </node-table>
      </el-main>
    </div>
  </el-container>
</template>

<script>
import { ViewManager } from "../../../services/ViewManager/ViewManager";
// import { spinalBackEnd } from "../../../services/spinalBackend";
import { EquipmentBack } from "../backend/EquipmentBack";
import BackendInitializer from "../../../services/BackendInitializer";
import { EventBus } from "../../../services/event";
import "../../../services/EventHandler";

import NodeTable from "./NodeTable.vue";

export default {
  name: "Explorer",
  components: { NodeTable },
  props: {
    Properties: {
      required: true,
      type: Object,
      validator: function(value) {
        if (value.viewKey == "") {
          return "danger";
        }
        return "success";
      },
    },
  },
  data() {
    return {
      items: [],
      contextServId: 0,
      currentView: null,
    };
  },
  async mounted() {
    await BackendInitializer.getInstance().initback(
      EquipmentBack.getInstance()
    );
    // Get the ViewManager instance for the TicketCenter viewKey and initializes it
    ViewManager.getInstance(this.Properties.viewKey).init(
      this.onViewChange.bind(this),
      0
    );
  },
  methods: {
    async onViewChange(view) {
      let mapItems;

      if (view.serverId === 0) {
        this.contextServId = 0;
        mapItems = await EquipmentBack.getInstance().getContexts();
      } else {
        if (this.contextServId === 0) {
          this.contextServId = view.serverId;
        }
        mapItems = await EquipmentBack.getInstance().getItems(
          view.serverId,
          this.contextServId
        );
      }
      this.items = [];
      for (const [nodeType, items] of mapItems) {
        const cols = new Set();
        for (const item of items) {
          if (item.children) {
            for (const [childTypes] of item.children) {
              cols.add(childTypes);
            }
          }
        }
        this.items.push({ nodeType, items, cols: Array.from(cols) });
      }
      this.currentView = view;
      (async () => {
        console.log(
          "+++++++++++++++++++++++++++",
          await BackendInitializer.getInstance().initback(
            EquipmentBack.getInstance()
          )
        );
      })();
    },
    changeView(item) {
      ViewManager.getInstance(this.Properties.viewKey).push(
        item.name,
        item.serverId
      );
    },
    SeeAll(index) {
      this.$refs["Explorer-table"][index].SeeAll(this.currentView.serverId);
    },
    exportToExcel(index) {
      this.$refs["Explorer-table"][index].exportToExcel();
    },
    async debug() {
      console.debug("");
    },
  },
};
</script>
