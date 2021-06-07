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
  <el-tabs class="tabsContainer"
           type="border-card">

    <el-tab-pane v-if="IsRoom == true" :label="$t('DataRoom.Equipment')">
      <el-row>
        <el-button class="spl-el-button" style="float: left"
          icon="el-icon-arrow-left"
          circle
          @click.stop="popView()"
        ></el-button>
        <div style="float: right">
         <el-button icon="el-icon-aim" circle @click="isolateAll()">
          </el-button>
          <el-button
            icon="el-icon-download"
            circle
            @click="exportToExcel()"
          >
          </el-button>
          <el-button
            icon="el-icon-picture-outline-round"
            circle
            @click.stop="SeeAll()"
          >
          </el-button>
        </div>
      </el-row>
      <br>
      <el-table :data="equipement"
                border
                style="width: 100%"
                :header-row-style="{&quot;min-height&quot; : &quot;0px&quot;,&quot;height&quot; : &quot;50px&quot;, &quot;padding&quot; : &quot;0px&quot;}"
                :header-cell-style="{&quot;background-color&quot;: &quot;#f0f2f5&quot;}"
                @row-click="selectInView"
                @row-dbclick="SeeEvent">
        <el-table-column prop="name"
                         :label="$t('DataRoom.Name')">
                         <template slot-scope="scope">
                      <div>
                        <div v-if="scope.row.color"
                            class="spinal-table-cell-color"
                            :style="getColor(scope.row.color)"></div>
                        <div> {{ scope.row.name }} </div>
                      </div>
                    </template>
        </el-table-column>
        <el-table-column align="center"
                         width="150">
          <template slot-scope="scope">
            <el-button icon="el-icon-arrow-right"
            @click="SelectEquipment(scope.row)"
                       circle></el-button>
          </template>
        </el-table-column>
    </el-tab-pane>

    <!-- ///////////////////////////////////////////////////////////////////////////////////-
       ////////////////////////////////// TICKET /////////////////////////////////////
     ////////////////////////////////////////////////////////////////////////////////////////-->
    <el-tab-pane class="pane-ticket"
                 :label="$t('DataRoom.Ticket')">

<div class="row">
        <div class="col-lg-9">
                 <el-button  v-if="IsRoom == false" class="spl-el-button" style="float: left; margin-right: 10px;"
          icon="el-icon-arrow-left"
          circle
          @click.stop="popView1()"
        ></el-button>

        <ticket-create v-bind:nodeId="nodeId"
                       @reload="updateticket"></ticket-create>
        </div>

      <div class="col-lg-3 barre">
        <div></div>
        <div>
        <header-bar :header="ticketHeader"
                    :content="ticketContent"
                    :data="ticketData"></header-bar>
        </div>
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
    <!-- ///////////////////////////////////////////////////////////////////////////////////-
       ////////////////////////////////// DOCUMENTATION /////////////////////////////////////
     ////////////////////////////////////////////////////////////////////////////////////////-->
    <el-tab-pane :label="$t('DataRoom.Documentation')">
      <div class="barre">

        <document-create v-bind:nodeId="nodeId"
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
            <el-button
                       icon="el-icon-download"
                       circle
                       @click="exportFichier(scope.row)"></el-button>
                       <el-button 
                        type="danger"
                       icon="el-icon-delete"
                       circle
                       @click="deleteFichier(scope.$index)"></el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-tab-pane>

    <!-- ///////////////////////////////////////////////////////////////////////////////////-
       ////////////////////////////////// NOTATION //////////////////////////////////////////
     ////////////////////////////////////////////////////////////////////////////////////////-->
    <el-tab-pane
    :label="$t('DataRoom.Note')">
      <el-container>
        <message-component :node-info="nodeInfo"></message-component>
      </el-container>
    </el-tab-pane>

    <!-- ///////////////////////////////////////////////////////////////////////////////////-
       ////////////////////////////////// Calendrier /////////////////////////////////////
     ////////////////////////////////////////////////////////////////////////////////////////-->
    <el-tab-pane class="spinal-space-tab-container tab-class" :label="$t('DataRoom.Calendar')">
      <div class="barre">
          <create-event v-bind:nodeId="nodeId"></create-event>
        </div>

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
  </el-tabs>
</template>

<script>
// import SpinalBackend from "../../services/spinalBackend";
import { ViewManager } from "../../../services/ViewManager/ViewManager";
import { spinalBackEnd } from "../../../services/spinalBackend";
import { serviceTicketPersonalized } from "spinal-service-ticket";
import { FileExplorer } from "spinal-env-viewer-plugin-documentation-service/dist/Models/FileExplorer";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import messageComponent from "./messageComponent.vue";
import Calendar from "./Calendar.vue";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import { SpinalEventService } from "spinal-env-viewer-task-service";
import GeographicContext from "spinal-env-viewer-context-geographic-service";
import ticketcreate from "./ticketcreate.vue";
import headerBarVue from "./headerBar.vue";
import documentcreateVue from "./documentcreate.vue";
import { EventBus } from "../../../services/event";
import excelManager from "spinal-env-viewer-plugin-excel-manager-service";
import fileSaver from "file-saver";
export default {
  components: {
    "message-component": messageComponent,
    VueCal,
    "ticket-create": ticketcreate,
    "header-bar": headerBarVue,
    "document-create": documentcreateVue,
    "create-event": Calendar
  },
  filters: {
    formatDate: function(date) {
      const newDate = new Date(date);
      return `${newDate.getDate()}/${newDate.getMonth() +
        1}/${newDate.getFullYear()}`;
    }
  },
  props: {
    nodeId: String,
    IsRoom: false,
    collums: { required: false, type: Array, default: () => [] },
    viewKey: { require: true, type: String, default: "" }
  },
  data() {
    return {
      display: true,
      items: [],
      tickets: [],
      documents: [],
      documentHeader: [],
      documentData: [],
      documentContent: [],
      ticketHeader: [],
      ticketData: [],
      ticketContent: [],
      nodeInfo: { selectedNode: SpinalGraphService.getRealNode(this.nodeId) },
      calendrier: [],
      equipement: [],
      equipmentHeader: [],
      equipmentData: [],
      equipmentContent: [],
      showDialog: false,
    };
  },
  watch: {
    nodeId() {
      this.nodeInfo = {
        selectedNode: SpinalGraphService.getRealNode(this.nodeId)
      };
    }
  },
  async mounted() {

    this.calendrier = await SpinalEventService.getEvents(this.nodeId).then(
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
      this.nodeId
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

    const salle = SpinalGraphService.getInfo(this.nodeId).get();

    /**
     * Pas une bonne idée de parcourir tout le tableau pour la même salle
     * ajouter une condition dans headerBar.vue pour regler ce probleme
     */
    this.ticketData = this.tickets.map(el => {
      el.rooms = [salle];
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

    let varEquipement = await SpinalGraphService.getChildren(
      this.nodeId,
      GeographicContext.constants.EQUIPMENT_RELATION
    );
    this.equipement = varEquipement.map(item => {
      return item.get();
    });
    this.equipmentHeader = [
        { key: "name", header: "name", width: 15 },
      ];

      this.equipmentContent = this.equipement.map(el => ({
        name: el.name,
      }));
      this.equipmentData = this.equipement.map(el => {
        return el.name;
      });
  },
  beforeDestroy() {},
  methods: {
    exportFichier(file) {
      if (file._info.model_type.get() != "Directory") {
        file._ptr.load(path => {
          if (file._info.model_type.get() == "HttpPath") {
            const element = document.createElement("a");
            const _path =
              path.host.get() +
              "/file/" +
              encodeURIComponent(path.httpRootPath.get()) +
              "/" +
              encodeURIComponent(path.httpPath.get());
            element.setAttribute("href", _path);
            element.setAttribute("download", file.name.get());
            element.style.display = "none";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
          } else {
            var element = document.createElement("a");
            element.setAttribute("href", "/sceen/_?u=" + path._server_id);
            element.setAttribute("download", file.name);
            element.click();
          }
        });
      } else {
        // check recursive directory & create a ZIP
      }
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
    async updateticket() {
      this.tickets = await serviceTicketPersonalized.getTicketsFromNode(
        this.nodeId
      );
    },
    SelectEquipment(equipment) {
      localStorage.setItem("equipmentId", equipment.id);
      ViewManager.getInstance("Data room").push(equipment.name, equipment.dbid);
      //this.$emit("select", context);
    },
    selectInView(item) {
      const serverId = localStorage.getItem("roomServerId");
      EventBus.$emit("data-room-select-item", {
        server_id: serverId,
        color: item.color
      });
    },
    SeeEvent(item) {
      const serverId = localStorage.getItem("roomServerId");
      EventBus.$emit("data-room-color-item", {
        server_id: serverId,
        color: item.color
      });
    },
    async deleteFichier(index) {
      if (confirm("Delete Document !")) {
        return FileExplorer.getDirectory(
        SpinalGraphService.getRealNode(this.nodeId)
      ).then(directory => {
        directory.splice(index, 1);
         this.updateDocument();
        });
      }
    },
    getColor(color) {
      return { backgroundColor: color[0] === "#" ? color : `#${color}` };
    },
    getDocuments() {
      return FileExplorer.getDirectory(
        SpinalGraphService.getRealNode(this.nodeId)
      ).then(directory => {
        let res = [];
        for (let index = 0; index < directory.length; index++) {
          const element = directory[index];
          res.push(element);
        }
        return res;
      });
    },
    popView() {
      localStorage.removeItem("roomServerId");
      ViewManager.getInstance("Data room").pop();
    },
    popView1() {
      ViewManager.getInstance("Data room").pop();
    },
    async updateDocument() {
      this.documents = await this.getDocuments();
    },
    ShowAll() {
      this.$refs["Explorer-table"].ShowAll();
    },
    isolateAll() {
      const serverId = localStorage.getItem("roomServerId");
      EventBus.$emit("view-isolate-all", { server_id: serverId});
    },
    SeeAll() {
      const serverId = localStorage.getItem("roomServerId");
      EventBus.$emit(
        "data-room-color-all",
        [{ server_id: serverId, color: "#008000" }],
        { server_id: serverId }
      );
    },
    exportToExcel() {
      let excelData = [
        {
          name: "Tableau",
          author: "",
          data: [
            {
              name: "Tableau",
              header: this.equipmentHeader,
              rows: this.equipmentContent
            }
          ]
        }
      ];
      excelManager.export(excelData).then(reponse => {
        fileSaver.saveAs(new Blob(reponse), `Tableau.xlsx`);
      });
      // console.log("expoooooooooooort", this.data);
    },
  }
};
</script>

<style scoped>
.tabsContainer {
  width: 100%;
  height: 100%;
}
.button-ajouter {
  display: inline-block;
}
.button-supprimer {
  display: inline-block;
}
.pane-ticket {
  position: relative;
  height: calc(100% - 20px);
}
.container-class,
.tab-class {
  height: 100%;
}
</style>

<style>
.tabsContainer .el-tabs__content {
  width: 100%;
  height: calc(100% - 50px);
}
.spinal-table-cell-color {
  height: 100%;
  width: 5px;
  position: absolute;
  left: 0;
  top: 0;
}
.barre {
  display: flex;
  justify-content: space-between;
}

</style>


