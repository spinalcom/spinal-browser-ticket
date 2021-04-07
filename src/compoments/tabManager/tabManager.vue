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
  <el-tabs type="border-card"
           :value="activetab"
           @tab-remove="removeTab">
    <el-tab-pane v-for="tab in opentabs"
                 :key="tab.name"
                 :label="tab.name"
                 :name="tab.name"
                 :closable="false">
      <component :is="tab.content"
                 :Properties="tab.props"></component>
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
              <div v-if="!hasTab(opentabs, tab)">
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
      opentabs: [],
      activetab: this.tabsprop[0].name
    };
  },
  async mounted() {
    for (const tab of this.tabsprop) {
      if (!tab.optional) {
        this.opentabs.push(tab);
      }
    }
  },
  computed: {
    
  },
  methods: {
    hasTab(tabname) {
      for (var idx = 0; idx < this.opentabs.length; idx += 1) {
        if (this.opentabs[idx].name === tabname) {
          return true;
        }
      }
      return false;
    },
    addTab(target) {
      if (!this.opentabs.some(e => e.name == target.name)){
        this.opentabs.push({
          title: target.name,
          name: target.name,
          content: target.content,
          props: target.props
        });
      }
      // this.activetab = target.name;
    },
    removeTab(targetName) {
      let tmptabs = this.opentabs;
      let activeName = this.activetab;
      if (activeName === targetName) {
        tmptabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tmptabs[index + 1] || tmptabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.activetab = activeName;
      this.opentabs = tmptabs.filter(tab => tab.name !== targetName);
    },
    debug(active) {
      console.log(active);
    }
  }
};
</script>

<style></style>
