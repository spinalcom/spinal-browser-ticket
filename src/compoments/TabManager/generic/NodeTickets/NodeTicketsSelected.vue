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
<!-- 

          style="float: left"

-->

<template>
  <el-container v-if="ticket" style="height:100%">
    <el-header style="height:max-content; display: flex">
      <el-tooltip v-if="Properties.viewKey != 'TicketApp'"
                  :content="$t('spinal-twin.Back')">
        <el-button @click.stop="back()"
                   class="spl-el-button"
                   style="float: right"
                   icon="el-icon-search"
                   circle>
        </el-button>
      </el-tooltip>
      <p style="">
        {{ ticket.name }}
      </p>
      <div v-if="doStepping"
           style="float:right">
        <el-tooltip :content="$t('spinal-twin.TicketPrev')">
          <el-button
                     icon="el-icon-caret-left"
                     circle
                     plain
                     type="primary"
                     @click.stop="changeStep(-1, ticket)"></el-button>
        </el-tooltip>
        <el-tooltip :content="$t('spinal-twin.TicketNext')">
          <el-button
                     icon="el-icon-caret-right"
                     type="primary"
                     circle
                     plain
                     @click.stop="changeStep(1, ticket)"></el-button>
        </el-tooltip>
      </div>
    </el-header>

    <el-main>
      <el-collapse v-model="activeCollapses">
        <el-collapse-item name="Details"
                          title="Details">
          <div class="separate">
            <div> {{ $t('spinal-twin.CurrentStep') }} </div>
            <div> {{ ticket.step }} </div>
          </div>
          <div class="separate">
            <div> {{ $t('spinal-twin.Priority') }} </div>
            <div> {{ ticket.priority }} </div>
          </div>
          <div class="separate">
            <div> {{ $t('spinal-twin.CreationTime') }} </div>
            <div> {{ DateFormat(ticket.creationDate) }} </div>
          </div>
          <div class="separate">
            <div> {{ $t('spinal-twin.TicketAuthor') }} </div>
            <div>
              {{ (ticket.ticket.user && (ticket.ticket.user.name || ticket.ticket.user.username)) || "unknow" }}
            </div>
          </div>
        </el-collapse-item>

        <el-collapse-item v-if="ticket.comments && ticket.comments.length > 0"
                          name="Description"
                          title="Description">
          <p>
            {{ ticket.comments[0].element.message.get() }}
          </p>
        </el-collapse-item>

        <el-collapse-item name="Target" :title="$t('spinal-twin.Target')">
          <div class="separate">
            <div> {{ $t('spinal-twin.Name') }} </div>
            <div> {{ getTarget().name }} </div>
          </div>
          <div class="separate">
            <div> {{ $t('spinal-twin.Type') }} </div>
            <div> {{ getTarget().type }} </div>
          </div>
          <div v-if="getTarget().path !== ''" class="separate">
            <div v-if="getTarget().ispath"> {{ $t('spinal-twin.Path') }} </div>
            <div v-else> {{ $t('spinal-twin.Parent') }} </div>
            <div> {{ getTarget().path }} </div>
          </div>
        </el-collapse-item>

        <el-collapse-item name="Events"
                          :title="$t('spinal-twin.Events')">
          <el-table :data="ticket.events"
                    :header-cell-style="{'background-color': '#f0f2f5'}"
                    border
                    style="overflow: auto;">
            <el-table-column label="Date">
              <div slot-scope="scope">
                {{ elapsedTimeFormat(scope.row.creationDate) }}
              </div>
            </el-table-column>
            <el-table-column :label="$t('spinal-twin.User')">
              <div slot-scope="scope">
                {{ (scope.row.user && (scope.row.user.name || scope.row.user.username)) || "unknow"}}
              </div>
            </el-table-column>
            <el-table-column label="Action">
              <div slot-scope="scope">
                {{ logFormat(scope.row.event) }}
              </div>
            </el-table-column>
          </el-table>
        </el-collapse-item>

        <el-collapse-item name="Notes"
                          :title="$t('spinal-twin.TicketNotes')">
          <el-container>
            <el-header style="height: 140">
              <node-notes-create v-if="ticket.ticket"
                                 :node="getTicketRealNode(ticket.ticket)"
                                 @send-note="sendNote">
              </node-notes-create>
            </el-header>

            <div class="note-feed">
              <el-container v-for="note of ticket.comments"
                            :key="note._server_id"
                            style="display: flex; flex-direction: row; align-items: flex-start; margin-bottom: 10px">
                <el-main style="padding: 0 0 10px 0">
                  <node-notes-message :username="note.element.username.get()"
                                      :date="note.element.date.get()"
                                      :message="note.element.message.get()"
                                      :type="note.element.type.get()"
                                      :file="note.element.file ? note.element.file : {}"
                                      :viewPoint="note.element.viewPoint ? note.element.viewPoint : null">
                  </node-notes-message>
                </el-main>
                <el-tooltip :content="$t('spinal-twin.DeleteNote')"
                            class="delete-button">
                  <el-popconfirm @confirm="delNote(ticket.ticket)"
                                 :title="$t('spinal-twin.DeleteConfirm')">
                    <el-button class="spl-input-button"
                               icon="el-icon-delete"
                               type="danger"
                               size="small"
                               circle
                               slot="reference"></el-button>
                  </el-popconfirm>
                </el-tooltip>
              </el-container>
            </div>
          </el-container>
        </el-collapse-item>
      </el-collapse>
    </el-main>
  </el-container>
</template>

<script>
import moment from "moment";
import NodeNotesMessage from "../NodeNotes/NodeNotesMessage.vue";
import NodeNotesCreate from "../NodeNotes/NodeNotesCreate.vue";
import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service";
import {
  SpinalGraphService,
  SpinalNode,
} from "spinal-env-viewer-graph-service";
import { LOGS_EVENTS_STRING } from "spinal-service-ticket";
import { spinalServiceTicket } from "spinal-service-ticket";
import { ViewManager } from "../../../../services/ViewManager/ViewManager";
import { getTicketDescription } from "./Ticket";
import { Model } from "spinal-core-connectorjs_type";

export default {
  name: "NodeTicketSelected",
  components: { NodeNotesMessage, NodeNotesCreate },
  props: {
    Properties: {
      type: Object,
      required: false,
      default: undefined,
    },
    selected: {
      type: Object,
      required: false,
      default: undefined,
    },
    stepping: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      ticket: false,
      doStepping: true,
      activeCollapses: ["Details"],
    };
  },

  async mounted() {
    await this.update();
  },

  methods: {
    async sendNote() {
      // this.$emit("update");
      await this.$parent.$parent.update(this.Properties.view.serverId, true)
      await this.update()
    },

    async update() {
      if (typeof this.selected == "undefined") {
        let ticketinfo = SpinalGraphService.getRealNode(
          this.Properties.selected
        );
        this.ticket = await getTicketDescription(ticketinfo.info);
        this.doStepping = this.Properties.stepping;
      } else {
        this.ticket = this.selected;
        this.doStepping = this.stepping;
      }
    },

    async delNote(note) {
      await serviceDocumentation.delNote(this.ticket.ticket, note);
      this.$emit("update");
    },

    DateFormat(time) {
      const date = new Date(time);

      return moment(date, "DD/MM/YYYY HH:mm:ss");
    },

    elapsedTimeFormat(time) {
      const now = new Date();
      const then = new Date(time);

      var ms = moment(now, "DD/MM/YYYY HH:mm:ss").diff(
        moment(then, "DD/MM/YYYY HH:mm:ss")
      );
      var d = moment.duration(ms);
      if (d.asDays() < 1) {
        return this.$t("spinal-twin.Today");
      } else if (d.asDays() < 2) {
        return this.$t("spinal-twin.Yesterday");
      }
      return Math.floor(d.asDays()) + this.$t("spinal-twin.DaysAgo");
    },

    async changeStep(step, ticket) {
      let realTicket = ticket.ticket;
      let contextId = await spinalServiceTicket.getTicketContextId(
        realTicket.id
      );
      if (step > 0) {
        let tmpStep = await spinalServiceTicket.moveTicketToNextStep(
          contextId,
          realTicket.processId.get(),
          realTicket.id.get(),
          this.userInfo
        );
        if (tmpStep) {
          SpinalGraphService.setInfo(realTicket.id.get());
          let realStep = SpinalGraphService.getRealNode(tmpStep.id);
          ViewManager.getInstance(this.Properties.viewKey).breadcrumb[3].name =
            realStep.info.name.get();
          ViewManager.getInstance(
            this.Properties.viewKey
          ).breadcrumb[3].serverId = realStep._server_id;
        }
      } else if (step < 0) {
        let tmpStep = await spinalServiceTicket.moveTicketToPreviousStep(
          contextId,
          realTicket.processId.get(),
          realTicket.id.get(),
          this.userInfo
        );
        if (tmpStep) {
          SpinalGraphService.setInfo(realTicket.id.get());
          let realStep = SpinalGraphService.getRealNode(tmpStep.id);
          ViewManager.getInstance(this.Properties.viewKey).breadcrumb[3].name =
            realStep.info.name.get();
          ViewManager.getInstance(
            this.Properties.viewKey
          ).breadcrumb[3].serverId = realStep._server_id;
        }
      } else {
        return;
      }
      this.$emit("update");
      await this.update();
    },

    back() {
      this.$emit("back");
    },

    logFormat(n) {
      return LOGS_EVENTS_STRING[n];
    },

    getTarget() {
      return this.ticket.target
    },

    debug(what) {
      console.debug("debug", what);
    },

    getTicketRealNode(ticket) {
      if (ticket instanceof SpinalNode) return ticket;
      if (ticket.id instanceof Model)
        return SpinalGraphService.getRealNode(ticket.id);
    },
  },
};
</script>

<style scoped>
.ticketSelectedHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ticketSelectedHeader .name {
  width: 150px;
  display: flex;
  align-items: center;
}

.separate {
  display: flex;
  justify-content: space-between;
}

.note-feed {
  overflow: auto;
  display: flex;
  flex-direction: column-reverse;
  flex-wrap: wrap;
}

.delete-button {
  padding: 25px 10px 10px 10px;
}
</style>