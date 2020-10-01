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
  <el-row>

    <el-table :data="rooms"
              class="tab"
              border
              style="width: 100%"
              :header-cell-style='{"background-color": "#f0f2f5"}'
              @row-click="SeeEvent">

      <el-table-column prop=name
                       label="Nom"
                       align="center">
      </el-table-column>

      <el-table-column prop="surface"
                       label="Surface"
                       align="center">
        <template slot-scope="scope">

          {{scope.row.surface}} m²
        </template>
      </el-table-column>

    </el-table>

  </el-row>
</template>

<script>
// import { EventBus } from "../../../services/event";
export default {
  data() {
    return {
      contextLst: []
    };
  },
  components: {},
  props: ["rooms", "color"],
  methods: {
    SeeEvent(data) {
      this.$emit("seeEvent", { rooms: [data], color: this.color });
    },
    SeeAll() {
      this.$emit("seeEvent", { rooms: this.rooms, color: this.color });
    }
  },
  async mounted() {
    // this.rooms = this.roomSelected.rooms;
  },
  watch: {
    // roomSelected() {
    //   this.rooms = this.roomSelected.rooms;
    // }
  },
  beforeDestroy() {}
};
</script>