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
    class="tab-manager-tabs"
    type="border-card"
    :value="activetab"
  >
    <el-tab-pane
      v-for="tab in tabsprop"
      :key="$t(tab.name)"
      :label="$t(tab.name)"
      :name="$t(tab.name)"
      :closable="false"
      style="height:100%; overflow: auto"
    >
      {{ updateActive() }}
      <component :is="tab.content" :Properties="tab.props"></component>
    </el-tab-pane>
    <!-- <el-tab-pane :disabled="true">
      <span slot="label">
        <el-dropdown trigger="click"
                     @command="addTab">
          <el-button type="primary"
                     plain>
            ···
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="tab in tabs"
                              :key="tab.name"
                              :command="tab">
              <div v-if="!hasTab(tabsprop, tab)">
                {{ tab.name }}
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>
    </el-tab-pane> -->
  </el-tabs>
</template>

<script>
export default {
  name: "tabManager",
  components: {},
  props: { tabsprop: Array },
  data() {
    return {
      activetab: this.$t(this.tabsprop[0].name),
    };
  },
  async mounted() {
    this.activetab = this.$t(this.tabsprop[0].name)
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
