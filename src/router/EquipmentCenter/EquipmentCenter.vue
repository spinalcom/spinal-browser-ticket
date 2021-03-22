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
    <el-header>
      <SpinalBreadcrumb :view-key="viewKey"> </SpinalBreadcrumb>
    </el-header>
    <el-main>
      <tab-manager :tabsprop="tabs" />
      <!-- <explorer :Properties="tabs[0].props"></explorer> -->
    </el-main>
  </el-container>
</template>

<script>
// Script & tools
import { ViewManager } from "../../services/ViewManager/ViewManager";
import { EquipmentBack } from "./backend/EquipmentBack";
import BackendInitializer from "../../services/BackendInitializer";

// Generic components
import SpinalBreadcrumb from "../../compoments/SpinalBreadcrumb/SpinalBreadcrumb.vue";
import TabManager from "../../compoments/tabManager/tabManager.vue";

// Specific components
import Explorer from "./components/Explorer.vue";
import Visualizer from "./components/Visualizer.vue";

import CategoryAttribute from "./components/CategoryAttribute.vue";

const VIEW_KEY = "Equipment Center";

// Component exports
export default {
  name: "EquipmentCenter",
  components: {
    SpinalBreadcrumb,
    TabManager,
    Explorer,
  },
  data() {
    return {
      viewKey: VIEW_KEY,
      items: false,
      tabs: [
        {
          name: "Explorer",
          content: Explorer,
          props: {
            viewKey: VIEW_KEY,
            items: false,
            view: false,
          },
          optional: false,
        },
      ],
    };
  },
  async mounted() {
    await BackendInitializer.getInstance().initback(
      EquipmentBack.getInstance()
    );
    // Get the ViewManager instance for the TicketCenter viewKey and initializes it
    await ViewManager.getInstance(this.viewKey).init(
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
      for (const [nodeType, items] of mapItems) {
        const cols = new Set();
        for (const item of items) {
          if (item.children) {
            for (const [childTypes] of item.children) {
              cols.add(childTypes);
            }
          }
        }
        this.items = { nodeType, items, cols: Array.from(cols) };
      }
      this.currentView = view;
      console.debug(this.items.nodeType);
      // this.tabs = [
      //   {
      //     name: "Explorer",
      //     content: Explorer,
      //     props: {
      //       viewKey: VIEW_KEY,
      //       items: this.items,
      //     },
      //     optional: false,
      //   },
      // ]
      this.tabs.length = 1;
      this.tabs[0].props.items = this.items;
      this.tabs[0].props.view = this.currentView;
      if (this.items.nodeType === "BIMObject") {
        this.tabs.push({
          name: "Category Attribute",
          content: CategoryAttribute,
          props: {
            viewKey: VIEW_KEY,
          },
          optional: false,
        });
      }
    },
  },
};
</script>

<style scoped>
equipement-center {
  overflow-y: hidden;
}</style
>>
