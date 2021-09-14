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
    <div class="spl-button-bar">
      <el-button
        @click.stop="Color()"
        class="spl-el-button"
        icon="el-icon-picture-outline-round"
        circle
      >
      </el-button>
      <el-button
        @click.stop="exportToExcel()"
        class="spl-el-button"
        icon="el-icon-download"
        circle
      >
      </el-button>
    </div>
    <div
      v-if="Properties.items !== false"
      style="height:100%"
    >
      <context-explorer-node-table
        :ref="'Explorer-table'"
        :view-key="Properties.viewKey"
        :items="itemsComputed"
        :columns="cols"
        :relation="Properties.relation"
        :colored="colored"
        @select="Select"
        @isolate="Isolate"
      >
      </context-explorer-node-table>
    </div>
  </div>
</template>

<script>
import { ViewManager } from "../../../../services/ViewManager/ViewManager";
// import { spinalBackEnd } from "../../../services/spinalBackend";
import { AppBack } from "../../../../services/backend/AppBack";
import BackendInitializer from "../../../../services/BackendInitializer";
import { EventBus } from "../../../../services/event";
import ColorState from "./colorState"

import ContextExplorerNodeTable from "../ContextExplorer/ContextExplorerNodeTable.vue";

export default {
  name: "ContextExplorer",
  components: { ContextExplorerNodeTable },
  props: {
    Properties: {
      required: true,
      type: Object,
      validator: function(value) {
        if (!value.viewKey instanceof String) {
          return false;
        }
        return true;
      },
    },
  },

  data() {
    return {
      items: false,
      contextServId: 0,
      currentView: null,
    };
  },

  computed: {
    itemsComputed() {
      if (
        this.Properties &&
        this.Properties.items &&
        this.Properties.items.items
      )
        return this.Properties.items.items;
      return [];
    },
    cols() {
      if (this.Properties && this.Properties.cols) return this.Properties.cols;
      return [];
    },
    colored() {
      return ColorState.colored();
    }
  },

  methods: {
    Color() {
      ColorState.changeState();
      EventBus.$emit("viewer-reset-color")
      if (ColorState.colored())
        this.$refs["Explorer-table"].Color(this.Properties.relation);
    },

    Select(item)
    {
      EventBus.$emit("viewer-select", item, this.Properties.relation);
    },

    Isolate(item)
    {
      EventBus.$emit("viewer-isolate", item, this.Properties.relation);
    },

    exportToExcel() {
      this.$refs["Explorer-table"].exportToExcel();
    },
    
    async debug(what) {
      console.debug("Debugging", what);
    },
  },
};
</script>

<style scoped>
.spl-el-button {
  margin: 0 0 0 10px;
}
.spl-button-bar {
  display: flex;
  flex-direction: row-reverse;
  padding: 5px 5px 5px 5px;
}

.spinal-height-control {
  height: auto;
}
</style>
