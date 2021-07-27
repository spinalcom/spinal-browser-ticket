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
  <el-dialog
    title="Adding Ticket"
    :visible.sync="active"
  >
    <el-form
      ref="TicketDeclarationForm"
      :model="newTicket"
      label-width="80px"
    >
      <el-form-item label="Context">
        <el-select
          v-model="newTicket.context"
          placeholder="placeholder"
          @change="getProcesses()"
        >
          <el-option
            v-for="context in contexts"
            :key="context.id"
            :label="context.name"
            :value="context.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-show="processes"
        label="Process"
      >
        <el-select
          v-model="newTicket.process"
          placeholder="placeholder"
          @change="getIncidents()"
        >
          <el-option
            v-for="process in processes"
            :key="process.id.get()"
            :label="process.name.get()"
            :value="process.id.get()"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-show="incidents"
        label="Incident"
      >
        <el-select
          v-model="newTicket.incident"
          placeholder="placeholder"
        >
          <el-option
            v-for="incident in incidents"
            :key="incident.id"
            :label="incident.name"
            :value="incident.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-show="newTicket.incident != ''"
        label="Priority"
      >
        <el-radio-group v-model="newTicket.priority">
          <el-radio label="Occasionally"></el-radio>
          <el-radio label="Normal"></el-radio>
          <el-radio label="Urgent"></el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close()">
        Cancel
      </el-button>
      <el-button
        @click="confirm()"
        type="primary"
      >
        Confirm
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { spinalServiceTicket } from "spinal-service-ticket"

export default {
  name: "TicketDeclarationForm",
  props: {
    node: {
      required: true,
      type: Object,
    },
    active: {
      required: true,
      type: Boolean,
    },
  },

  computed:
  {
    user()
    {
      return {
        username: "admin",
        userId: FileSystem._user_id
      };
    }
  },
  
  data() {
    return {
      newTicket: {
        context: "",
        process: "",
        incident: "",
        priority: "",
      },
      contexts: false,
      processes: false,
      incidents: false,
    }
  },

  async mounted() {
    this.contexts = await spinalServiceTicket.getContexts();
  },

  methods: {
    async getProcesses()
    {
      this.processes = await spinalServiceTicket.getAllProcess(this.newTicket.context);
    },

    async getIncidents()
    {
      this.incidents = await spinalServiceTicket.getCommonIncident(this.newTicket.process);
    },

    close()
    {
      this.$emit("close");
    },

    async confirm()
    {
      let infos = {
        processId: this.newTicket.process,
        name: "test",
        user: user,
        priority: this.newTicket.priority,
      }
      await spinalServiceTicket.addTicket(infos, this.newTicket.process, this.newTicket.context, this.node)
      this.$emit("close");
    },
  },
}
</script>