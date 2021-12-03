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
  <div class="data-app">
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
        <button-switch
          @click.native="isolateAll"
          :disabled="!isNode"
          :active="isolated"
          class="spl-el-button"
          icon="el-icon-aim"
        ></button-switch>
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
import { getSurfaceFromNode } from "./DataTools.ts";
import { viewerState } from "../../compoments/TabManager/generic/ContextExplorer/viewerState.ts";
import {
  ROOM_RELATION,
} from '../../constants';

// Generic components
import ButtonSwitch from "../../compoments/ButtonSwitch.vue";
import SpinalBreadcrumb from "../../compoments/SpinalBreadcrumb/SpinalBreadcrumb.vue";
import TabManager from "../../compoments/TabManager/TabManager.vue";
import ContextExplorer from "../../compoments/TabManager/generic/ContextExplorer/ContextExplorer.vue";
import CategoryAttribute from "../../compoments/TabManager/generic/CategoryAttribute.vue";
import NodeDocumentation from "../../compoments/TabManager/generic/NodeDocumentation.vue";
import NodeTickets from "../../compoments/TabManager/generic/NodeTickets/NodeTickets.vue";
import NodeNotes from "../../compoments/TabManager/generic/NodeNotes/NodeNotes.vue";
import NodeCalendar from "../../compoments/TabManager/generic/NodeCalendar/NodeCalendar.vue";
import NodeNotesMessage from '../../compoments/TabManager/generic/NodeNotes/NodeNotesMessage.vue';
import InsightEndpoint from '../../compoments/TabManager/generic/Insight/InsightEndpoint.vue'
import InsightControlEndpoint from '../../compoments/TabManager/generic/Insight/InsightControlEndpoint.vue'

const VIEW_KEY = "DataApp";

// Component exports
export default {
  name: "TheDataApp",
  components: {
    SpinalBreadcrumb,
    TabManager,
    ContextExplorer,
    NodeTickets,
    NodeDocumentation,
    NodeNotesMessage,
    NodeCalendar,
    CategoryAttribute,
    ButtonSwitch,
  },

  data() {
    return {
      viewKey: VIEW_KEY,
      items: {},
      currentView: false,
      isNode: false,
      isolated: false,
      tabs: [
        {
          name: "node-type.context",
          content: ContextExplorer,
          props: {
            viewKey: VIEW_KEY,
            items: false,
            view: false,
            relation: ROOM_RELATION,
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

        // {
        //   name: "spinal-twin.Calendar",
        //   content: NodeCalendar,
        //   props: {
        //     viewKey: VIEW_KEY,
        //     view: false,
        //   },
        //   ignore: true,
        // },

        {
          name: "spinal-twin.Endpoints",
          content: InsightEndpoint,
          props: {
            viewKey: VIEW_KEY,
            view: false,
            context: false,
          },
          ignore: true,
        },

        {
          name: "spinal-twin.ControlEndpoints",
          content: InsightControlEndpoint,
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
      "geographicContext"
    );
    await ViewManager.getInstance(this.viewKey).init(
      this.onViewChange.bind(this),
      0
    );
    this.items.cols = [ "children", "Area" ];
  },

  methods: {
    async onViewChange(view) {

      // Get items from graph
      let mapItems;
      if (view.serverId === 0) {
        this.contextServId = 0;
        mapItems = await AppBack.getInstance().getContexts("hasGeographicRoom");
        this.isNode = false;
      } else {
        this.isNode = true;
        if (this.contextServId === 0) {
          this.contextServId = view.serverId;
        }
        mapItems = await AppBack.getInstance().getItems(
          view.serverId,
          this.contextServId,
          "hasGeographicRoom"
        );
      }

      // Get children
      for (const [nodeType, items] of mapItems) {
        this.items.nodeType = nodeType
        this.items.items = items;
      }
      await Promise.all(this.items.items.map(async function (item) {
        item["Area"] = await getSurfaceFromNode(item);
      }));
      this.currentView = view;
      
      if (this.isolated == true)
      {
        viewerState.changeIsolation();
        EventBus.$emit("viewer-reset-isolate");
        this.isolated = false;
      }

      // Update tabs
      this.tabs[0].props.items = this.items;
      this.tabs[0].props.cols = this.items.cols;
      this.updateNames();
      for (let tab of this.tabs)
      {
        tab.props.view = this.currentView;
        if (tab.name == "spinal-twin.Endpoints")
        {
          tab.props["context"] = this.contextServId
        }
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
      ViewManager.getInstance(this.viewKey).pop();
    },

    zoomOn() {
      EventBus.$emit("viewer-zoom", this.currentView, ROOM_RELATION);
    },

    isolateAll() {
      viewerState.changeIsolation();
      EventBus.$emit("viewer-reset-isolate");
      this.isolated = false;
      if (viewerState.isolated())
      {
        this.isolated = true;
        EventBus.$emit("viewer-isolate", [ this.currentView ], ROOM_RELATION);
      }
    },

    selectInView() {
      EventBus.$emit("viewer-select", this.currentView, ROOM_RELATION);
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
        else if (
          [item.serverId] !== undefined) {
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
      return res;
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
  },
};
</script>

<style scoped>
.data-app {
  overflow: hidden;
}

.tab-manager {
  margin: 10px 10px 10px 0px;
  height: calc(100% - 120px);
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
