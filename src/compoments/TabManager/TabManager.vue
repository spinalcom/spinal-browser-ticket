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
  <el-tabs
    :value="activetab"
    class="tab-manager-tabs"
    type="border-card"
  >
    <template
        v-for="tab in tabsprop">
      {{ updateActive() }}
      <template v-if="!tab.ignore">
        <el-tab-pane
            :key="$t(tab.name)"
            :label="$t(tab.name)"
            :name="$t(tab.name)"
            :closable="false"
            style="height:100%; overflow: auto">
          <component
            :is="tab.content"
            :Properties="tab.props"
          ></component>
        </el-tab-pane>
      </template>
    </template>
  </el-tabs>
</template>

<script>
import Vue from 'vue';
export default {
  name: "TabManager",
  components: {},
  props: {
    tabsprop: {
      type: Array,
      required: true,
      validator: function (value) {
        if (!value.name instanceof String) {
          console.error("Invalid tab name");
          return false;
        }
        if (!value.content instanceof Vue) {
          console.error("Invalid component for tab content");
          return false;
        }
        return true;
      }
    }
  },

  data() {
    return {
      activetab: this.$t(this.tabsprop[0].name),
    };
  },

  watch: {
    tabsprop: {
      handler(oldTabs, newTabs) {
        if (
          typeof newTabs !== "undefined" &&
          !oldTabs.some((tab) => {
            this.$t(tab.name) == this.activeTab;
          })
        ) {
          this.activetab = this.$t(newTabs[0].name);
        }
      },
      deep: true,
      immediate: true,
    },
  },

  async mounted() {
    this.activetab = this.$t(this.tabsprop[0].name)
  },

  methods: {
    updateActive() {
      this.activetab = this.$t(this.tabsprop[0].name);
    },

    debug(active) {
      console.log(active);
    },
  },
};
</script>

<style>
.tab-manager-tabs .el-tabs__content {
  height: 95%;
}
.tab-manager-pane {
  height: 100%;
}
</style>
