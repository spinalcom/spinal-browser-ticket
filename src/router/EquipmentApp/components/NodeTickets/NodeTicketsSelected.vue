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
  <el-collapse>
    <el-collapse-item name="Details" title="Details">
      <div class="separate">
        <div> {{ $t('spinal-twin.CurrentStep') }} </div>
        <div> {{ selected.step }} </div>
      </div>
      <div class="separate">
        <div> {{ $t('spinal-twin.Priority') }} </div>
        <div> {{ selected.priority }} </div>
      </div>
      <div class="separate">
        <div> {{ $t('spinal-twin.CreationTime') }} </div>
        <div> {{ DateFormat(selected.creationDate) }} </div>
      </div>
      <div class="separate">
        <div> {{ $t('spinal-twin.TicketAuthor') }} </div>
        <div> {{ selected.ticket.user.name }} </div>
      </div>
    </el-collapse-item>
    <el-collapse-item name="Events" :title="$t('spinal-twin.Events')">
      <el-table
        :data="selected.events"
        :header-cell-style="{'background-color': '#f0f2f5'}"
        border
        style="overflow: auto;"
      >
        <el-table-column label="Date">
          <div slot-scope="scope">
            {{ elapsedTimeFormat(scope.row.creationDate) }}
          </div>
        </el-table-column>
        <el-table-column :label="$t('spinal-twin.User')">
          <div slot-scope="scope">
            {{ scope.row.user.name }}
          </div>
        </el-table-column>
        <el-table-column label="Action">
          <div slot-scope="scope">
            {{ logFormat(scope.row.event) }}
          </div>
        </el-table-column>
      </el-table>
    </el-collapse-item>
    <el-collapse-item name="Notes" title="Notes">
      <el-container>
        <el-header>
          <node-notes-create
            v-if="selectedNode"
            :node="selectedNode"
            @send-note="sendNote"
          ></node-notes-create>
        </el-header>
        <el-main class="note-feed">
          <el-container
            v-for="note of selected.comments"
            :key="note._server_id"
          >
            <el-header class="delete-button">
              <el-tooltip :content="$t('spinal-twin.DeleteNote')">
                <el-popconfirm
                  @confirm="delNote(note.selectedNode)"
                  :title="$t('spinal-twin.DeleteConfirm')">
                  <el-button
                    class="spl-input-button"
                    icon="el-icon-delete"
                    type="danger"
                    size="small"
                    circle
                    slot="reference"
                  ></el-button>
                </el-popconfirm>
              </el-tooltip>
              <!-- <el-button
                v-on:click.native="debug(note)"
                class="spl-input-button"
                icon="el-icon-search"
                type="primary"
                size="small"
                circle
              ></el-button> -->
            </el-header>
            <el-main style="padding: 0 0 10px 0">
              <node-notes-message
                :username="note.element.username.get()"
                :date="note.element.date.get()"
                :message="note.element.message.get()"
                :type="note.element.type.get()"
                :file="note.element.file ? note.element.file : {}"
                :viewPoint="note.element.viewPoint ? note.element.viewPoint : null"
              ></node-notes-message>
            </el-main>
          </el-container>
        </el-main>
      </el-container>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import moment from "moment";
import NodeNotesMessage from "../NodeNotes/NodeNotesMessage.vue";
import NodeNotesCreate from "../NodeNotes/NodeNotesCreate.vue";
import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service";
import { SpinalGraphService } from 'spinal-env-viewer-graph-service'
import { LOGS_EVENTS } from "spinal-service-ticket/src/Constants"

export default {
  name: "NodeTicketSelected",
  components: { NodeNotesMessage, NodeNotesCreate },
  props: {
    selected: {
      required: true,
      type: Object,
    },
  },
  
  data() {
    return {
      selectedNode: false,
    };
  },

  async mounted() {
    this.selectedNode = await SpinalGraphService.getRealNode(this.selected.ticket.id);
  },

  methods: {
    sendNote() {
      this.$emit("update");
    },

    async delNote(note)
    {
      await serviceDocumentation.delNote(this.selectedNode, note);
      this.$emit("update");
    },

    DateFormat(time)
    {
      const date = new Date(time);

      return moment(date,"DD/MM/YYYY HH:mm:ss");
    },

    elapsedTimeFormat(time)
    {
      const now = new Date();
      const then = new Date(time);

      var ms = moment(now,"DD/MM/YYYY HH:mm:ss").diff(moment(then,"DD/MM/YYYY HH:mm:ss"));
      var d = moment.duration(ms);
      return Math.floor(d.asDays()) + this.$t('spinal-twin.DaysAgo');
    },

    logFormat(n)
    {
      return LOGS_EVENTS[n];
    },
  },
}
</script>

<style scoped>
.separate {
  display: flex;
  justify-content: space-between;
}

.note-feed {
  overflow: auto;
  display: flex;
  flex-direction: column-reverse
}

.delete-button {
  padding: 10px 0 0 0;
  display: flex;
  flex-direction: row-reverse;
  height: min-content;
}
</style>