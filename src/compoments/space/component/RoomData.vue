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
  <div>
    <el-tabs type="card">
      <el-tab-pane label="Équipements">Rôle</el-tab-pane>

      <!-- ///////////////////////////////////////////////////////////////////////////////////-
       ////////////////////////////////// TICKET /////////////////////////////////////
     ////////////////////////////////////////////////////////////////////////////////////////-->
      <el-tab-pane label="Tickets">
        <el-table :data="tickets"
                  border
                  style="width: 100%"
                  :header-row-style='{"min-height" : "0px","height" : "50px", "padding" : "0px"}'
                  :header-cell-style='{"background-color": "#f0f2f5"}'>

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
              {{scope.row.user.name}}
            </template>
          </el-table-column>

          <el-table-column label="Date de création"
                           align="center">
            <template slot-scope="scope">
              {{scope.row.creationDate | formatDate}}
            </template>
          </el-table-column>

        </el-table>
      </el-tab-pane>
      <!-- ///////////////////////////////////////////////////////////////////////////////////-
       ////////////////////////////////// DOCUMENTATION /////////////////////////////////////
     ////////////////////////////////////////////////////////////////////////////////////////-->
      <el-tab-pane label="Documentation">
        <el-table :data="documents"
                  border
                  style="width: 100%"
                  :header-row-style='{"min-height" : "0px","height" : "50px", "padding" : "0px"}'
                  :header-cell-style='{"background-color": "#f0f2f5"}'>

          <el-table-column :label="$t('SpaceManagement.Nom')">
            <template slot-scope="scope">
              {{scope.row.name.get()}}

            </template>
          </el-table-column>

          <el-table-column label=""
                           width="70"
                           align="center">
            <template slot-scope="scope">
              <el-button v
                         icon="el-icon-download"
                         @click="exportFichier(scope.row)"
                         circle></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- ///////////////////////////////////////////////////////////////////////////////////-
       ////////////////////////////////// NOTATION //////////////////////////////////////////
     ////////////////////////////////////////////////////////////////////////////////////////-->
      <el-tab-pane label="Notation">
        <el-container>
          <message-component :nodeInfo="nodeInfo"></message-component>
        </el-container>

      </el-tab-pane>

    </el-tabs>
  </div>
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
export default {
  data() {
    return {
      tickets: [],
      documents: [],
      nodeInfo: { selectedNode: SpinalGraphService.getRealNode(this.nodeId) }
    };
  },
  components: { "message-component": messageComponent },
  props: ["nodeId"],
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
    }
  },
  async mounted() {
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
  },
  watch: {
    nodeId() {
      this.nodeInfo = {
        selectedNode: SpinalGraphService.getRealNode(this.nodeId)
      };
    }
  },
  filters: {
    formatDate: function(date) {
      const newDate = new Date(date);
      return `${newDate.getDate()}/${newDate.getMonth() +
        1}/${newDate.getFullYear()}`;
    }
  },
  beforeDestroy() {}
};
</script>

