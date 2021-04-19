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
    <!-- ///////////////////////////////////////////////////////////////////////////////////-
       ////////////////////////////////// TICKET /////////////////////////////////////
     ////////////////////////////////////////////////////////////////////////////////////////-->
    <el-tab-pane class="pane-ticket"
                 :label="$t('DataRoom.Ticket')">

<div class="row">
        <div class="col-lg-9">
                 <el-button class="spl-el-button" style="float: left; margin-right: 10px;"
          icon="el-icon-arrow-left"
          circle
          @click.stop="popView()"
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
        <header-bar :header="ticketHeader"
                    :content="ticketContent"
                    :data="ticketData"></header-bar>

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
                       @click="exportFichier(scope.row)"></el-button>
                       <el-button 
                        type="danger"
                       icon="el-icon-delete"
                       circle
                       @click="deleteFichier(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-tab-pane>

    <!-- ///////////////////////////////////////////////////////////////////////////////////-
       ////////////////////////////////// NOTATION //////////////////////////////////////////
     ////////////////////////////////////////////////////////////////////////////////////////-->
    <el-tab-pane :label="$t('DataRoom.Note')">
      <el-container>
        <message-component :node-info="nodeInfo"></message-component>
      </el-container>
    </el-tab-pane>

    <!-- ///////////////////////////////////////////////////////////////////////////////////-
       ////////////////////////////////// Calendrier /////////////////////////////////////
     ////////////////////////////////////////////////////////////////////////////////////////-->
    <el-tab-pane :label="$t('DataRoom.Calendar')">
      <div class="barre">
        <div>

        <ticket-create v-bind:nodeId="nodeId"
                       @reload="updateticket"></ticket-create>
        </div>
      </div>
        <br>
      <vueCal :events="calendrier"></vueCal>

    </el-tab-pane>
  </el-tabs>
</template>

<script>
// import SpinalBackend from "../../services/spinalBackend";
import { ViewManager } from "../../../services/ViewManager/ViewManager";
import { serviceTicketPersonalized } from "spinal-service-ticket";
import { FileExplorer } from "spinal-env-viewer-plugin-documentation-service/dist/Models/FileExplorer";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import messageComponent from "./messageComponent.vue";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import { SpinalEventService } from "spinal-env-viewer-task-service";
import GeographicContext from "spinal-env-viewer-context-geographic-service";
import ticketcreate from "./ticketcreate.vue";
import headerBarVue from "./headerBar.vue";
import documentcreateVue from "./documentcreate.vue";
export default {
  components: {
    "message-component": messageComponent,
    VueCal,
    "ticket-create": ticketcreate,
    "header-bar": headerBarVue,
    "document-create": documentcreateVue
  },
  filters: {
    formatDate: function(date) {
      const newDate = new Date(date);
      return `${newDate.getDate()}/${newDate.getMonth() +
        1}/${newDate.getFullYear()}`;
    }
  },
  props: ["nodeId"],
  data() {
    return {
      tickets: [],
      documents: [],
      ticketHeader: [],
      ticketData: [],
      ticketContent: [],
      nodeInfo: { selectedNode: SpinalGraphService.getRealNode(this.nodeId) },
      calendrier: [],
      equipement: []
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
        console.log(el)
      // el.rooms = [salle];
      return el;
    });

    this.documents = await this.getDocuments();
    let varEquipement = await SpinalGraphService.getChildren(
      this.nodeId,
      GeographicContext.constants.EQUIPMENT_RELATION
    );
    this.equipement = varEquipement.map(item => {
      return item.get();
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
    async updateticket() {
      this.tickets = await serviceTicketPersonalized.getTicketsFromNode(
        this.nodeId
      );
    },
    popView() {
      ViewManager.getInstance("Data room").pop();
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
    async updateDocument() {
      this.documents = await this.getDocuments();
    }
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
</style>

<style>
.tabsContainer .el-tabs__content {
  width: 100%;
  height: 100%;
}

.barre {
  display: flex;
  justify-content: space-between;
}
.spl-el-button {
  margin: 0 0 0 -10px;
}
</style>