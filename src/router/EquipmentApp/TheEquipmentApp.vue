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
    <spinal-breadcrumb :view-key="viewKey"></spinal-breadcrumb>
    <el-tooltip :content="$t('spinal-twin.Back')">
      <el-button
        v-show="(currentView.serverId != 0)"
        @click.stop="popView()"
        class="spl-el-button"
        style="float: left"
        icon="el-icon-arrow-left"
        circle
      >
      </el-button>
    </el-tooltip>
    <div class="spl-button-bar">
      <el-tooltip
        :disabled="!isNode"
        :content="$t('spinal-twin.Isolate')"
      >
        <el-button
          :disabled="!isNode"
          @click.stop="isolateAll()"
          circle
          class="spl-el-button"
          icon="el-icon-aim"
        >
        </el-button>
      </el-tooltip>
      <el-tooltip
        :disabled="!isNode"
        :content="$t('spinal-twin.Select')"
      >
        <el-button
          :disabled="!isNode"
          @click.stop="selectInView()"
          circle
          class="spl-el-button"
          icon="el-icon-location"
        >
        </el-button>
      </el-tooltip>
      <el-tooltip
        :disabled="!isNode"
        content="Zoom"
      >
        <el-button
          :disabled="!isNode"
          @click.stop="zoomOn()"
          circle
          class="spl-el-button"
          icon="el-icon-search"
        >
        </el-button>
      </el-tooltip>
    </div>
    <tab-manager
      :tabsprop="tabs"
      ref="tab-manager"
      class="tab-manager"
    ><tab-manager>
  </div>
</template>

<script>
// Script & tools
import { ViewManager } from "../../services/ViewManager/ViewManager";
import { AppBack } from "../../services/backend/AppBack";
import BackendInitializer from "../../services/BackendInitializer";
import { EventBus } from "../../services/event";
import excelManager from "spinal-env-viewer-plugin-excel-manager-service";
import fileSaver from "file-saver";
import "../../services/viewerUtils/eventsHandler/Equipment";

// Generic components
import SpinalBreadcrumb from "../../compoments/SpinalBreadcrumb/SpinalBreadcrumb.vue";
import TabManager from "../../compoments/TabManager/TabManager.vue";
import ContextExplorer from "../../compoments/TabManager/generic/ContextExplorer/ContextExplorer.vue";
// Specific components
import CategoryAttribute from "../../compoments/TabManager/generic/CategoryAttribute.vue";
import NodeDocumentation from "../../compoments/TabManager/generic/NodeDocumentation.vue";
import NodeTickets from "../../compoments/TabManager/generic/NodeTickets/NodeTickets.vue";
import NodeNotes from "../../compoments/TabManager/generic/NodeNotes/NodeNotes.vue";
import NodeCalendar from "../../compoments/TabManager/generic/NodeCalendar/NodeCalendar.vue";
import NodeNotesMessage from '../../compoments/TabManager/generic/NodeNotes/NodeNotesMessage.vue';
const VIEW_KEY = "EquipmentApp";
// Component exports
export default {
  name: "TheEquipmentApp",
  components: {
    SpinalBreadcrumb,
    TabManager,
    NodeNotesMessage,
    NodeTickets,
    NodeCalendar,
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
          content: ContextExplorer,
          props: {
            viewKey: VIEW_KEY,
            items: false,
            view: false,
          },
          ignore: false,
        },

        {
          name: "spinal-twin.hasCategoryAttributes",
          content: CategoryAttribute,
          props: {
            viewKey: VIEW_KEY,
            view: false,
          },
          ignore: true,
        },

        {
          name: "spinal-twin.Documentation",
          content: NodeDocumentation,
          props: {
            viewKey: VIEW_KEY,
            view: false,
          },
          ignore: true,
        },

        {
          name: "spinal-twin.Notes",
          content: NodeNotes,
          props: {
            viewKey: VIEW_KEY,
            view: false,
          },
          ignore: true,
        },

        {
          name: "spinal-twin.Tickets",
          content: NodeTickets,
          props: {
            viewKey: VIEW_KEY,
            view: false,
          },
          ignore: true,
        },

        {
          name: "spinal-twin.Calendar",
          content: NodeCalendar,
          props: {
            viewKey: VIEW_KEY,
            view: false,
          },
          ignore: true,
        },
      ],
    };
  },

  async mounted() {
    const graph = await BackendInitializer.getInstance().getGraph()
    await AppBack.getInstance().init(
      graph,
      "BIMObjectGroupContext"
    );
    // Get the ViewManager instance for the TicketCenter viewKey and initializes it
    await ViewManager.getInstance(this.viewKey).init(
      this.onViewChange.bind(this),
      0
    );
  },

  methods: {
    async onViewChange(view) {

      // Get items from graph
      let mapItems;
      if (view.serverId === 0) {
        this.contextServId = 0;
        mapItems = await AppBack.getInstance().getContexts("BIMObject");
        this.isNode = false;
      } else {
        this.isNode = true;
        if (this.contextServId === 0) {
          this.contextServId = view.serverId;
        }
        mapItems = await AppBack.getInstance().getItems(
          view.serverId,
          this.contextServId,
          "BIMObject"
        );
      }

      // Get children
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
      
      // Update tabs
      this.tabs[0].props.items = this.items;
      this.updateNames();
      for (let tab of this.tabs)
      {
        tab.props.view = this.currentView;
      }
      if (this.isNode)
      {
        for (let tab of this.tabs)
        {
          tab.ignore = false;
        }
      }
      else
      {
        for (let i = 1; i < this.tabs.length; ++i)
        {
          this.tabs[i].ignore = true;
        }
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
      EventBus.$emit("equipment-isolate-all", { server_id: this.currentView.serverId });
    },

    selectInView() {
      EventBus.$emit("equipment-select-item", { server_id: this.currentView.serverId });
    },

    formatData() {
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
