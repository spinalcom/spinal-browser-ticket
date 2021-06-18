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
  <div class="equipment-center">
    <SpinalBreadcrumb :view-key="viewKey"> </SpinalBreadcrumb>
    <el-tooltip content="Go back">
      <el-button v-show="(currentView.serverId != 0)" class="spl-el-button" style="float: left"
            icon="el-icon-arrow-left"
            circle
            @click.stop="popView()"
          >
      </el-button>
    </el-tooltip>
    <div class="spl-button-bar">
      <el-tooltip content="Isolate" :disabled="!isNode">
        <el-button class="spl-el-button"
          icon="el-icon-aim" circle
          @click.stop="isolateAll()"
          :disabled="!isNode"
        >
        </el-button>
      </el-tooltip>
      <el-tooltip content="Select" :disabled="!isNode">
        <el-button class="spl-el-button"
          icon="el-icon-location" circle
          @click.stop="selectInView()"
          :disabled="!isNode"
        >
        </el-button>
      </el-tooltip>
      <el-tooltip content="Zoom" :disabled="!isNode">
        <el-button class="spl-el-button"
          icon="el-icon-search" circle
          @click.stop="zoomOn()"
          :disabled="!isNode"
        >
        </el-button>
      </el-tooltip>
      <!-- <el-tooltip content="Color">
        <el-button class="spl-el-button"
          icon="el-icon-picture-outline-round" circle
          @click.stop="Color()"
        >
        </el-button>
      </el-tooltip>
      <el-tooltip content="Export data to excel">
        <el-button class="spl-el-button"
          icon="el-icon-download" circle
          @click.stop="exportToExcel()"
        >
        </el-button>
      </el-tooltip> -->
    </div>
    <tab-manager ref="tab-manager" class="tab-manager" :tabsprop="tabs" />
    <!-- <explorer :Properties="tabs[0].props"></explorer> -->
  </div>
</template>

<script>
// Script & tools
import { ViewManager } from "../../services/ViewManager/ViewManager";
import { EquipmentBack } from "./backend/EquipmentBack";
import BackendInitializer from "../../services/BackendInitializer";
import { EventBus } from "../../services/event";
import excelManager from "spinal-env-viewer-plugin-excel-manager-service";
import fileSaver from "file-saver";

// Generic components
import SpinalBreadcrumb from "../../compoments/SpinalBreadcrumb/SpinalBreadcrumb.vue";
import TabManager from "../../compoments/tabManager/tabManager.vue";
// Specific components
import Explorer from "./components/Explorer.vue";
import Visualizer from "./components/Visualizer.vue";
import CategoryAttribute from "./components/CategoryAttribute.vue";
import Documentation from "./components/Documentation.vue";
import "../../services/viewerUtils/eventsHandler/Equipment";
const VIEW_KEY = "Equipment Center";
// Component exports
export default {
  name: "EquipmentCenter",
  components: {
    SpinalBreadcrumb,
    TabManager,
  },
  data() {
    return {
      viewKey: VIEW_KEY,
      items: false,
      currentView: false,
      isNode: false,
      tabs: [
        {
          name: "node-type.context",
          content: Explorer,
          props: {
            viewKey: VIEW_KEY,
            items: false,
            view: false,
          },
        },
        {
          name: "spinal-twin.hasCategoryAttributes",
          content: CategoryAttribute,
          props: {
            viewKey: VIEW_KEY,
            view: false,
          },
        },
        {
          name: "spinal-twin.Documentation",
          content: Documentation,
          props: {
            viewKey: VIEW_KEY,
            view: false,
          }
        }
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
        // this.tabs[1].props.item = await EquipmentBack.getInstance().getContextsAttributes();
        this.isNode = false;
      } else {
        this.isNode = true;
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
      this.tabs[0].props.items = this.items;
      this.updateNames();
      for (let tab of this.tabs)
      {
        tab.props.view = this.currentView;
      }
    },
    updateNames()
    {
      this.tabs[0].name = `node-type.${this.items.nodeType}`;
    },
    popView() {
      ViewManager.getInstance(this.viewKey).pop()
    },
    zoomOn() {
      EventBus.$emit("equipment-zoom-all", { server_id: this.currentView.serverId });
    },
    isolateAll() {
      // let list = this.items.items.map(item => {
      //   return { server_id: item.serverId };
      // });
      // console.debug("list : ", list)
      // EventBus.$emit("view-isolate-list", list);
      EventBus.$emit("equipment-isolate-all", { server_id: this.currentView.serverId });
    },
    selectInView() {
      // let list = this.items.items.map(item => {
      //   return { server_id: item.serverId };
      // });
      // console.debug("list : ", list)
      // EventBus.$emit("view-isolate-list", list);
      EventBus.$emit("equipment-select-item", { server_id: this.currentView.serverId });
    },
    formatData(){
      const res = [];
      for (const item of this.items.items) {
        const resItem = {
          name: item.name,
          serverId: item.serverId,
          haveChild: false,
          color: item.getColor(),
        };
        if (item.children) {
          for (const [childTypes, childItems] of item.children) {
            resItem[childTypes] = childItems.length;
            resItem.haveChild = true;
          }
        }
        else if (FileSystem._objects[item.serverId] !== undefined) {
          let thisnode = FileSystem._objects[item.serverId]
          if (thisnode.children.PtrLst !== undefined) {
            for (const name of thisnode.children.PtrLst._attribute_names){
              resItem[name] = thisnode.children.PtrLst[name].length;
              resItem.haveChild = true
            }
          }
        }
        res.push(resItem);
      }
      return res
    },
    exportToExcel() {
      let headers = [
        {
          key: "name",
          header: this.$t("name"),
          width: 20
        },
      ];
      for (const column of this.items.cols) {
        headers.push({
          key: column,
          header: this.$t(column),
          width: 10
        });
      }
      let excelData = [
        {
          name: "Tableau",
          author: "",
          data: [
            {
              name: "Tableau",
              header: headers,
              rows: this.formatData()
            }
          ]
        }
      ];
      excelManager.export(excelData).then(reponse => {
        fileSaver.saveAs(new Blob(reponse), `Tableau.xlsx`);
      });
    },
    Color() {
      let items = this.items.items.map(item => {
        return { server_id: item.serverId, color: item.getColor() };
      });
      EventBus.$emit("equipment-color-all", items, { server_id: this.currentView.serverId });
    },
    ShowAll() {
      EventBus.$emit("equipment-show-all");
    },
  },
};
</script>

<style scoped>
.equipment-center {
  overflow: hidden;
}
.tab-manager {
  margin: 10px 10px 10px 0px;
  height: 88%;
  border-radius: 5px;
}

.spl-height-control {
  height: 100%;
}

.spl-el-button {
  margin: 0 0 0 10px;
}

.spl-button-bar {
  display: flex;
  flex-direction: row-reverse;
  padding: 5px 5px 5px 5px;
}

</style>
