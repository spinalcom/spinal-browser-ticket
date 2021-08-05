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
    <el-row v-if="display === false" style="margin-top: 12px;">
      <el-tabs type="border-card">
        <el-tab-pane :label="panel">
            <div v-for="(item, index) in items"
                              :key="item.nodeType"
                              :name="item.nodeType">
                              <el-header>
                                <el-button v-show="(item.serverId != 0)" v-if="item.nodeType != 'geographicContext'" class="spl-el-button" style="float: left"
          icon="el-icon-arrow-left"
          circle
          @click.stop="popView(index)"
        >
    </el-button>
        <div style="float: right">
          <el-button circle
        icon="el-icon-aim"
        @click.stop="isolate(index)"
      ></el-button>
                    <el-button icon="el-icon-download"
                               circle
                               @click.stop="exportData(index)">
                    </el-button>
                    <!--<el-button icon="el-icon-view"
                               circle
                               @click.stop="SeeAll()"></el-button>-->
                    <el-button icon="el-icon-picture-outline-round"
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


        <!-- Tab Tickets -->
        <el-tab-pane v-if="addTabs === true" :label="$t('DataRoom.Ticket')">
      <div class="barre"
      v-for="(item, index) in items"
                              :key="item.nodeType"
                              :name="item.nodeType"
      >
      <div>
        <ticket-create v-bind:nodeId="item.nodeId"
                       @reload="updateticket"></ticket-create>
                       </div>
                       <div>
        <header-bar :header="ticketHeader"
                    :content="ticketContent"
                    :data="ticketData"></header-bar>
                      </div>

      </div>
      <el-table :data="tickets"
                border
                style="width: 100%"
                :header-row-style="{&quot;min-height&quot; : &quot;0px&quot;,&quot;height&quot; : &quot;50px&quot;, &quot;padding&quot; : &quot;0px&quot;}"
                :header-cell-style="{&quot;background-color&quot;: &quot;#f0f2f5&quot;}">
        <el-table-column prop="name"
                         :label="$t('DataRoom.Name')"
                         width="180">
        </el-table-column>

        <el-table-column prop="priority"
                         :label="$t('DataRoom.Priority')"
                         align="center">
        </el-table-column>

        <el-table-column :label="$t('DataRoom.User')"
                         align="center">
          <template slot-scope="scope">
            <!-- {{ scope.row.user.name }} -->
          </template>
        </el-table-column>
        <el-table-column :label="$t('DataRoom.Note')"
                         align="center">
          <template slot-scope="scope">
            {{ scope.row.creationDate | formatDate }}
          </template>
        </el-table-column>
      </el-table>
        </el-tab-pane>

        <!-- Tab Documentation -->
        <el-tab-pane v-if="addTabs === true" :label="$t('DataRoom.Documentation')">
      <div class="barre"
      v-for="(item, index) in items"
                              :key="item.nodeType"
                              :name="item.nodeType">

        <document-create v-bind:nodeId="item.nodeId"
                         @reload="updateDocument"></document-create>
        <header-bar :header="documentHeader"
                    :content="documentContent"
                    :data="documentData"></header-bar>
      </div>
      <el-table :data="documents"
                border
                style="width: 100%"
                :header-row-style="{&quot;min-height&quot; : &quot;0px&quot;,&quot;height&quot; : &quot;50px&quot;, &quot;padding&quot; : &quot;0px&quot;}"
                :header-cell-style="{&quot;background-color&quot;: &quot;#f0f2f5&quot;}">
        <el-table-column :label="$t('DataRoom.Name')">
          <template slot-scope="scope">
            {{ scope.row.name.get() }}
          </template>
        </el-table-column>

        <el-table-column label="Actions"
                         width="200"
                         align="center">
          <template slot-scope="scope">
            <el-button v
                       icon="el-icon-download"
                       circle
                       @click="exportData(scope.row)"></el-button>
                       <el-button 
                        type="danger"
                       icon="el-icon-delete"
                       circle
                       @click="deleteFichier(scope.$index)"></el-button>
          </template>
        </el-table-column>
      </el-table>

        </el-tab-pane>

        <!-- Tab Notes -->
        <el-tab-pane v-if="addTabs === true" :label="$t('DataRoom.Note')">
          <el-container>
            <message-component :node-info="nodeInfo"></message-component>
          </el-container>
        </el-tab-pane>


        <!-- Tab Calendrier -->
        <el-tab-pane v-if="addTabs === true" :label="$t('DataRoom.Calendar')">
       <div class="barre"
      v-for="(item, index) in items"
                              :key="item.nodeType"
                              :name="item.nodeType"
      >
      <Calendar :nodeId="item.nodeId"></Calendar> </div>
      <div class="spinal-space-table-content spinal-scrollbar">

        <vueCal class="calendar_container vuecal--full-height-delete"
        ref="vuecal"
        :time="true"
        :dblclick-to-navigate="true"
        events-count-on-year-view
        events-on-month-view="short"
        default-view="month"
        active-view="month"
        :editable-events="{
          title: false,
          drag: false,
          resize: false,
          delete: true,
          create: false,
        }"
        :on-event-click="onEventClick"
        :events="calendrier"></vueCal>

        </div>

        </el-tab-pane>

      <!-- Tab Attributes -->
    <el-tab-pane v-if="addTabs === true" :label="$t('DataRoom.Attributes')">
       <div class="barre"
      v-for="(item, index) in items"
                              :key="item.nodeType"
                              :name="item.nodeType"
      >
      <category-attribute :Properties="attributes"></category-attribute>

    </el-tab-pane>
    <!-- Tab Endpoints -->
    <el-tab-pane v-if="addTabs === true" :label="$t('DataRoom.Endpoints')">


    </el-tab-pane>

    <!-- Tab Insight -->
    <el-tab-pane v-if="addTabs === true" :label="$t('DataRoom.Insight')">


    </el-tab-pane>


      </el-tabs>
    </el-row>
    <div style="margin: -3px;"  v-else class="spinal-space-spacecon_container-container">
      <div
           class="spacecon_container">
    <display-tabs v-if="roomId"
                   :node-id="roomId" v-bind:IsRoom="true"></display-tabs>
           </div>
           <div
           class="spacecon_container">
    <display-tabs v-if="equipmentId"
                   :node-id="equipmentId" v-bind:IsRoom="false"></display-tabs>
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
import CategoryAttribute from "./components/CategoryAttribute.vue";
import ticketcreate from "./components/ticketcreate";
import headerBarVue from "./components/headerBar.vue";
import Calendar from "./components/Calendar.vue";
import documentcreateVue from "./components/documentcreate.vue";
import messageComponent from "./components/messageComponent.vue";
import VueCal from "vue-cal";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { FileSystem } from 'spinal-core-connectorjs_type';
import { FileExplorer } from "spinal-env-viewer-plugin-documentation-service/dist/Models/FileExplorer";
import { SpinalEventService } from "spinal-env-viewer-task-service";
import { serviceTicketPersonalized } from "spinal-service-ticket";
import DisplayTabs from './components/DisplayTabs.vue';
export default {
  components: { SpinalBreadcrumb, DataRoomTypeTable, TabManager, CategoryAttribute,
  "ticket-create": ticketcreate,
  "header-bar": headerBarVue,
  "document-create": documentcreateVue,
  "message-component": messageComponent,
  "Calendar": Calendar,
  "display-tabs": DisplayTabs,
  VueCal,
    DisplayTabs },
  data() {
    return {
      currentView: null,
      equipmentId: null,
      panel: null,
      viewKey: VIEWKEY_DATA_ROOM_CENTER,
      contextServId: 0,
      roomId: null,
      addTabs: false,
      tickets: [],
      nodeInfo: {},
      documents: [],
      documentHeader: [],
      documentData: [],
      documentContent: [],
      ticketHeader: [],
      ticketData: [],
      ticketContent: [],
      calendrier: [],
      items: [],
      dataEq: {},
      display: false,
      activeNames: [],
      attributes: {
        view: false,
        viewKey: VIEWKEY_DATA_ROOM_CENTER
      },
    };
  },
  filters: {
    formatDate: function(date) {
      const newDate = new Date(date);
      return `${newDate.getDate()}/${newDate.getMonth() +
        1}/${newDate.getFullYear()}`;
    }
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
      this.attributes.view = this.currentView;
      if (this.items[0]) {
        if (this.items[0].nodeType === "geographicContext") {
          this.addTabs = false;
          this.panel = this.$t('DataRoom.geographicContext');
        }
        if (this.items[0].nodeType === "geographicBuilding") {
          this.addTabs = false;
          this.panel = this.$t('DataRoom.geographicBuilding');
        }
        if (this.items[0].nodeType === "geographicFloor") {
          this.panel = this.$t('DataRoom.geographicFloor');
          this.addTabs = true;
          this.displayOtherTabs();
        }
        if (this.items[0].nodeType === "geographicRoom") {
          localStorage.removeItem("roomServerId");
          this.panel = this.$t('DataRoom.geographicRoom');
          this.addTabs = true;
          this.displayOtherTabs();
        }
        if (this.items[0].nodeType === "BIMObject") {
          this.panel = this.$t('DataRoom.Equipment');
          this.display = true
          this.addTabs = false;
          this.equipmentId = null
          const idNode = localStorage.getItem("roomId");
          this.roomId = idNode;
        }
      } else if (this.panel === this.$t('DataRoom.geographicRoom')) {
          console.log(this.panel);
          this.display = true
          this.addTabs = false;
          this.equipmentId = null
          const idNode = localStorage.getItem("roomId");
          this.roomId = idNode;
        } else {
          console.log("here2");
        this.display = true
        this.addTabs = false;
        this.roomId = null
        const equipment = localStorage.getItem("equipmentId");
        this.equipmentId = equipment;
      }
      
      
    },
    changeView(item) {
      ViewManager.getInstance(this.viewKey).push(
        item.name,
        item.serverId,
        item.nodeId
      );
    },
    popView(index) {
      localStorage.removeItem("roomServerId");
      this.$refs["data-room-table"][index].popView();
    },
    exportData(index) {
      this.$refs["data-room-table"][index].exportToExcel();
    },
    SeeAllClick(index) {
      this.$refs["data-room-table"][index].SeeAll(this.currentView.serverId);
    },
    isolate(index) {
      this.$refs["data-room-table"][index].isolateAll(this.currentView.serverId);
    },
    async updateticket() {
      this.tickets = await serviceTicketPersonalized.getTicketsFromNode(
        this.items[0].nodeId
      );
    },
    getDocuments() {
      return FileExplorer.getDirectory(
        SpinalGraphService.getRealNode(this.items[0].nodeId)
      ).then(directory => {
        let res = [];
        for (let index = 0; index < directory.length; index++) {
          const element = directory[index];
          res.push(element);
        }
        return res;
      });
    },
    async deleteFichier(index) {
      if (confirm("Delete Document !")) {
        return FileExplorer.getDirectory(
        SpinalGraphService.getRealNode(this.items[0].nodeId)
      ).then(directory => {
        directory.splice(index, 1);
         this.updateDocument();
        });
      }
    },
    async updateDocument() {
      this.documents = await this.getDocuments();
    },
    _formatDate(argDate) {
      let date = new Date(argDate);
      return `${date.getFullYear()}-${date.getMonth() +
        1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    },
    onEventClick(event, e) {
      this.selectedEvent = event;
      console.log("idEventSelectid", this.selectedEvent.class, this.nodeId);
      this.showDialog = true;

      // Prevent navigating to narrower view (default vue-cal behavior).
      e.stopPropagation();
    },
    async displayOtherTabs () {
      /***********
       * Other Tabs
       */
        this.calendrier = await SpinalEventService.getEvents(this.items[0].nodeId).then(
        rest => {
          return rest.map(el => {
            const event = el.get();
            return {
              title: event.name,
              start: this._formatDate(event.startDate),
              end: this._formatDate(event.endDate),
              class: event.groupId
              // backgroundColor : group && group.color
            };
          });
        }
      );
      /*console.log("caaaaaaalendrier________", this.nodeId, this.calendrier);*/

      this.tickets = await serviceTicketPersonalized.getTicketsFromNode(
        this.items[0].nodeId
      );

      this.ticketHeader = [
        { key: "name", header: "name", width: 15 },
        { key: "priority", header: "priority", width: 15 },
        { key: "user", header: "utilisateur", width: 15 },
        { key: "creationDate", header: "date de création", width: 15 }
      ];

      this.ticketContent = this.tickets.map(el => ({
        name: el.name,
        priority: el.priority,
        user: el.user ? el.user.name : "unknow",
        creationDate: this._formatDate(el.creationDate)
      }));

      const salle = SpinalGraphService.getInfo(this.items[0].nodeId).get();

      /**
       * Pas une bonne idée de parcourir tout le tableau pour la même salle
       * ajouter une condition dans headerBar.vue pour regler ce probleme
       */
      this.ticketData = this.tickets.map(el => {
        // el.rooms = [salle];
        return el;
      });
      this.documents = await this.getDocuments();
      this.documentHeader = [
        { key: "name", header: "name", width: 15 },
      ];

      this.documentContent = this.documents.map(el => ({
        name: el.name._data,
      }));
      this.documentData = this.documents.map(el => {
        return el.name._data;
      });
      this.nodeInfo = {
        selectedNode: SpinalGraphService.getRealNode(this.items[0].nodeId)
      };

      /***********
       * End Other Tabs
       */
    },

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
}
.data-room-data-tabs .el-tabs__content {
  height: calc(100% - 37px);
}
</style>

<style scoped>
.data-room-data-pane,
.data-room-data-pane > div {
  height: 100%;
}
.data-room-data-table {
  height: calc(100% - 60px);
  overflow: auto;
}
.data-room-breadcrumb-container {
  margin: 0 10px 10px 10px;
}
.data-room-data-container {
  height: calc(100% - 65px);
}
.data-room-data-tabs {
  height: 100%;
}
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
  border-radius: 4px;
}
.spinal-space-spacecon_container-container {
  width: 100%;
  height: calc(100% - 55px);
  padding: 5px 10px 10px 5px;
  background-color: #fdfdfd;
  overflow: auto;
}
.spl-el-button {
  margin: 0 0 0 -20px;
}
.tabsContainer .el-tabs__content {
  width: 100%;
  height: calc(100% - 50px);
}
</style>
