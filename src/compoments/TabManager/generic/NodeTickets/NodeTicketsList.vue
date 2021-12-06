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
  <el-main>
    <el-table
      v-if="tickets"
      :data="tickets"
      :header-cell-style="{'background-color': '#f0f2f5'}"
      border
      style="overflow: auto;"
    >
      <el-table-column label="Ticket">
        <div slot-scope="scope">
          {{ scope.row.name }}
        </div>
      </el-table-column>
      <el-table-column :label="$t('spinal-twin.Step')">
        <div slot-scope="scope">
          {{ scope.row.step }}
        </div>
      </el-table-column>
      <el-table-column label="Creation">
        <div slot-scope="scope">
          {{ scope.row.creation }}
        </div>
      </el-table-column>
      <el-table-column
          label="Actions"
          fixed="right"
          width=120>
        <div slot-scope="scope">
          <el-tooltip :content="$t('spinal-twin.TicketInspect')">
              <el-button
                @click="select(scope.row)"
                icon="el-icon-search"
                circle
              ></el-button>
          </el-tooltip>
          <el-tooltip :content="$t('spinal-twin.TicketArchive')">
              <el-button
                @click="archive(scope.row)"
                icon="el-icon-delete"
                circle
                type=danger
              ></el-button>
          </el-tooltip>
        </div>
      </el-table-column>
    </el-table>
    <el-button
      v-on:click.native="debug(tickets)"
      class="spl-input-button"
      icon="el-icon-search"
      type="primary"
      size="small"
      circle
    ></el-button>
  </el-main>
</template>

<script>
export default {
  name: "NodeTicketsList.vue",
  props: {
    tickets: {
      required: true,
      type: Array,
    },
  },
  data() {
    return {
      
    };
  },
  methods: {
    debug(item) {
      console.debug(item);
    },

    archive(ticket) {
      this.$emit("archive", ticket);
    },

    select(ticket) {
      this.$emit("select", ticket);
    },
  },
}
</script>