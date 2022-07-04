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
    @tab-click="handleClick"
    class="tab-manager-tabs"
    type="border-card"
  >
    <template v-for="tab in tabsprop">
      <template v-if="!tab.ignore" style="height: calc(100% - 120px)">
        <el-tab-pane
          :key="$t(tab.name)"
          :label="$t(tab.name)"
          :name="tab.name"
          :closable="false"
          style="height: calc(100%); overflow: hidden"
        >
          <keep-alive>
            <component
              :is="tab.content"
              :Properties="tab.props"
              style="height: calc(100% - 20px)"
            ></component>
          </keep-alive>
        </el-tab-pane>
      </template>
    </template>
  </el-tabs>
</template>

<script>
import Vue from 'vue';
export default {
  name: 'TabManager',
  components: {},
  props: {
    tabsprop: {
      type: Array,
      required: true,
      validator: function (value) {
        if (!value.name instanceof String) {
          console.error('Invalid tab name');
          return false;
        }
        if (!value.content instanceof Vue) {
          console.error('Invalid component for tab content');
          return false;
        }
        return true;
      },
    },
  },

  data() {
    return {
      activetab: this.tabsprop[0].name,
    };
  },

  watch: {
    tabsprop: {
      handler(oldTabs, newTabs) {
        if (
          !newTabs.some((tab) => !tab.ignore && tab.name === this.activetab)
        ) {
          this.activetab = newTabs[0].name;
        }
      },
      deep: true,
    },
  },

  async mounted() {
    this.activetab = this.$t(this.tabsprop[0].name);
  },

  methods: {
    handleClick(tab, event) {
      this.activetab = tab._props.name;
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
