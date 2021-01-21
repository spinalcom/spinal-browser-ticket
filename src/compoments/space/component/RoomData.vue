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
       ////////////////////////////////// Équipements /////////////////////////////////////
     ////////////////////////////////////////////////////////////////////////////////////////-->
    <el-tab-pane label="Équipements">
      <el-table :data="equipement"
                border
                style="width: 100%"
                :header-row-style="{&quot;min-height&quot; : &quot;0px&quot;,&quot;height&quot; : &quot;50px&quot;, &quot;padding&quot; : &quot;0px&quot;}"
                :header-cell-style="{&quot;background-color&quot;: &quot;#f0f2f5&quot;}">
        <el-table-column prop="name"
                         :label="$t('SpaceManagement.Nom')">
        </el-table-column>
        <el-table-column align="center"
                         width="150">
          <template>
            <el-button icon="el-icon-arrow-right"
                       circle></el-button>
          </template>
        </el-table-column>
    </el-tab-pane>

    <!-- ///////////////////////////////////////////////////////////////////////////////////-
       ////////////////////////////////// TICKET /////////////////////////////////////
     ////////////////////////////////////////////////////////////////////////////////////////-->
    <el-tab-pane label="Tickets">
      <el-table :data="tickets"
                border
                style="width: 100%"
                :header-row-style="{&quot;min-height&quot; : &quot;0px&quot;,&quot;height&quot; : &quot;50px&quot;, &quot;padding&quot; : &quot;0px&quot;}"
                :header-cell-style="{&quot;background-color&quot;: &quot;#f0f2f5&quot;}">
        <el-table-column prop="name"
                         :label="$t('SpaceManagement.Nom')"
                         width="180">
        </el-table-column>

        <el-table-column prop="priority"
                         label="Priorités"
                         align="center">
        </el-table-column>

        <el-table-column label="utilisateur"
                         align="center">
          <template slot-scope="scope">
            <!-- {{ scope.row.user.name }} -->
          </template>
        </el-table-column>

        <el-table-column label="Date de création"
                         align="center">
          <template slot-scope="scope">
            {{ scope.row.creationDate | formatDate }}
          </template>
        </el-table-column>
      </el-table>
      <ticket-create v-bind:nodeId="nodeId"
                     @reload="updateticket"></ticket-create>
    </el-tab-pane>
    <!-- ///////////////////////////////////////////////////////////////////////////////////-
       ////////////////////////////////// DOCUMENTATION /////////////////////////////////////
     ////////////////////////////////////////////////////////////////////////////////////////-->
    <el-tab-pane label="Documentation">
      <el-table :data="documents"
                border
                style="width: 100%"
                :header-row-style="{&quot;min-height&quot; : &quot;0px&quot;,&quot;height&quot; : &quot;50px&quot;, &quot;padding&quot; : &quot;0px&quot;}"
                :header-cell-style="{&quot;background-color&quot;: &quot;#f0f2f5&quot;}">
        <el-table-column :label="$t('SpaceManagement.Nom')">
          <template slot-scope="scope">
            {{ scope.row.name.get() }}
          </template>
        </el-table-column>

        <el-table-column label=""
                         width="70"
                         align="center">
          <template slot-scope="scope">
            <el-button v
                       icon="el-icon-download"
                       circle
                       @click="exportFichier(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="button-room">
        <div class="button-supprimer">
          <i class="el-icon-remove-outline"></i>
        </div>
        <div class="button-ajouter">
          <i class="el-icon-circle-plus-outline"></i>
        </div>
      </div>
    </el-tab-pane>

    <!-- ///////////////////////////////////////////////////////////////////////////////////-
       ////////////////////////////////// NOTATION //////////////////////////////////////////
     ////////////////////////////////////////////////////////////////////////////////////////-->
    <el-tab-pane label="Notes">
      <el-container>
        <message-component :node-info="nodeInfo"></message-component>
      </el-container>
    </el-tab-pane>

    <!-- ///////////////////////////////////////////////////////////////////////////////////-
       ////////////////////////////////// Calendrier /////////////////////////////////////
     ////////////////////////////////////////////////////////////////////////////////////////-->
    <el-tab-pane label="Calendrier">
      <vueCal :events="calendrier"></vueCal>
      <div class="button-ajouter">
        <i class="el-icon-circle-plus-outline"></i>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
// import SpinalBackend from "../../services/spinalBackend";
import { serviceTicketPersonalized } from "spinal-service-ticket";
import { FileExplorer } from "spinal-env-viewer-plugin-documentation-service/dist/Models/FileExplorer";
import {
  SpinalGraph,
  SpinalGraphService
} from "spinal-env-viewer-graph-service";
import messageComponent from "./messageComponent.vue";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import { SpinalEventService } from "spinal-env-viewer-task-service";
import GeographicContext from "spinal-env-viewer-context-geographic-service";
import ticketcreate from "./ticketcreate.vue";
const { EQUIPMENT_RELATION } = GeographicContext.constants;
export default {
  components: {
    "message-component": messageComponent,
    VueCal,
    "ticket-create": ticketcreate
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
    console.log("caaaaaaalendrier________", this.nodeId, this.calendrier);

    this.tickets = await serviceTicketPersonalized.getTicketsFromNode(
      this.nodeId
    );
    this.documents = await FileExplorer.getDirectory(
      SpinalGraphService.getRealNode(this.nodeId)
    ).then(directory => {
      let res = [];
      for (let index = 0; index < directory.length; index++) {
        const element = directory[index];
        res.push(element);
      }
      return res;
    });
    let varEquipement = await SpinalGraphService.getChildren(
      this.nodeId,
      EQUIPMENT_RELATION
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
</style>