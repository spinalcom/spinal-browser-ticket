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
    <el-container
      v-if="selected"
    >
      <el-header
        class="rowify"
        style="height:max-content;"
      >
        <el-tooltip content="Go back">
          <el-button
            @click.stop="selected = false"
            class="spl-el-button"
            style="float: left"
            icon="el-icon-arrow-left"
            circle
          >
          </el-button>
        </el-tooltip>
        <el-button
          @click="debug(selected)"
          icon="el-icon-search"
          circle
        ></el-button>
        <h2 style="margin: 0 50px">
          {{ selected.name }}
        </h2>
      </el-header>
      <el-main>
        <node-tickets-selected
          :selected="selected"
          @update="update(Properties.view.serverId, true)"
        >
        </node-tickets-selected>
      </el-main>
    </el-container>
    <el-container
      v-else-if="addingTicket"
    >
      <ticket-declaration-form
        v-if="this.ctxNode"
        :node="this.ctxNode"
        :active.sync="addingTicket"
        @close="addingTicket = false"
        @update="update(Properties.view.serverId)"
      >
      </ticket-declaration-form>
    </el-container>
    <el-container v-if="!selected && !addingTicket">
      <el-header>
        <el-tooltip
          :content="$t('spinal-twin.TicketDeclare')"
          style="float: right"
        >
          <el-button
            @click.native="addingTicket = true"
            icon="el-icon-plus"
            type="primary"
            circle
          ></el-button>
        </el-tooltip>
      </el-header>
      <el-main>
        <node-tickets-list
          v-if="tickets"
          @select="select"
          @archive="archive"
          :tickets="tickets"
        >
        </node-tickets-list>
      </el-main>
    </el-container>
  </div>
</template>

<script>
// imports
import moment from "moment";
import { spinalServiceTicket } from "spinal-service-ticket"
import { LOGS_EVENTS } from "spinal-service-ticket/src/Constants"
import { FileSystem } from 'spinal-core-connectorjs_type'
import { SpinalGraphService } from 'spinal-env-viewer-graph-service'
import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service";
import NodeTicketsList from './NodeTicketsList.vue';
import spinalCore from 'spinal-core-connectorjs';
import NodeTicketsSelected from './NodeTicketsSelected.vue';
import TicketDeclarationForm from './TicketDeclarationForm.vue';

export default {
  name: "NodeTickets",
  components: { NodeTicketsList, NodeTicketsSelected, TicketDeclarationForm },
  props: {
    Properties: {
      required: true,
      type: Object,
    },
  },

  data() {
    return {
      // properties
      ctxNode: false,
      tickets: false,
      selected: false,
      addingTicket: false,
    };
  },

  computed:
  {
    userInfo()
    {
      return {
        username: "admin",
        userId: FileSystem._user_id
      };
    }
  },

  watch:
  {
    Properties:
    {
      handler: async function(oldProp, newProp)
      {
        if (newProp.view.serverId != 0)
        {
          await this.update(newProp.view.serverId);
        }
        else
        {
          this.ctxNode = false;
        }
      },
      deep: true,
    }
  },

  async mounted() {
    this.update(this.Properties.view.serverId);
  },

  methods: {
    async update(id, keepSelected = false)
    {
      // update tab infos from current node
      this.ctxNode = await FileSystem._objects[id];
      const node = await SpinalGraphService.findNode(this.ctxNode.info.id.get())

      let ticketList = await spinalServiceTicket.getTicketsFromNode(node.id.get())
      this.tickets = []
      let arrayId = 0;
      for (let ticket of ticketList)
      {
        let ticketDesc = {
          id: arrayId,
          ticket: ticket,
          name: ticket.name,
          creation: this.elapsedTimeFormat(ticket.creationDate),
          creationDate: ticket.creationDate,
        }

        let step = await SpinalGraphService.findNode(ticket.stepId);
        ticketDesc.step = step.name.get();

        ticketDesc.events = await spinalServiceTicket.getLogs(ticket.id);

        let ticketNode = await SpinalGraphService.getRealNode(ticket.id);
        ticketDesc.comments = await serviceDocumentation.getNotes(ticketNode);

        let priority = ticket.priority;
        switch(priority)
        {
          case 0:
            ticketDesc.priority = this.$t('spinal-twin.TicketPriority.Occasion')
            break;
          case 1:
            ticketDesc.priority = this.$t('spinal-twin.TicketPriority.Normal')
            break;
          case 2:
            ticketDesc.priority = this.$t('spinal-twin.TicketPriority.Urgent')
            break;
        }

        this.tickets.push(ticketDesc);
        arrayId += 1;
      }
      if (keepSelected)
      {
        this.selected = this.tickets[this.selected.id];
        return;
      }
      this.selected = false;
      this.addingTicket = false;
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

    select(ticket)
    {
      this.selected = ticket;
    },

    async archive(ticket)
    {
      let realTicket = ticket.ticket;
      let contextId = await spinalServiceTicket.getTicketContextId(realTicket.id);
      if (ticket.step == "Archived")
      {
        await spinalServiceTicket.unarchiveTicket(contextId, realTicket.processId, realTicket.id, this.userInfo);
        this.update(this.Properties.view.serverId);
        return;
      }
      await spinalServiceTicket.ArchiveTickets(contextId, realTicket.processId, realTicket.id, this.userInfo);
      this.update(this.Properties.view.serverId);
    },

    addTicket()
    {
      console.debug("TODO : add ticket");
    },

    async changeStep(step, ticket)
    {
      if (step > 0)
      {
        let test = await spinalServiceTicket.moveTicketToNextStep(ticket.contextId, ticket.processId, ticket.id, this.userInfo)
      }
      else if (step < 0)
      {
        let test = await spinalServiceTicket.moveTicketToPreviousStep(ticket.contextId, ticket.processId, ticket.id, this.userInfo)
      }
      else
      {
        return
      }
      this.update(this.Properties.view.serverId, true)
    },

    async debug(what) {
      console.debug("Debugging", what);
    },
  },
};
</script>

<style scoped>
.detail-row {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 10px 0;
}

.columnize {
  display: flex;
  flex-direction: column;
}

.rowify {
  display: flex;
  flex-direction: row;
}
</style>