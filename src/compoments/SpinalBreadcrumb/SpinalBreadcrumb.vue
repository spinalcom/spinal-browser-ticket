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
  <el-breadcrumb class="spinal-breadcrumb"
                 separator="/">
    <el-breadcrumb-item v-for="(bc, index) in breadcrumb"
                        :key="index">
      <a @click="selectBreadcrumb(bc)">{{ bc.name }}</a>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
import { ViewManager } from "../../services/ViewManager/ViewManager";

export default {
  name: "SpinalBreadcrumb",
  props: { viewKey: { require: true, type: String, default: "" } },
  data() {
    return {
      breadcrumb: []
    };
  },
  mounted() {
    const viewManager = ViewManager.getInstance(this.viewKey);
    viewManager.breacrumbSubscribe(this.onBreadcrumbChange.bind(this));
  },
  methods: {
    onBreadcrumbChange(breadcrumb) {
      this.breadcrumb = breadcrumb;
    },
    selectBreadcrumb(bc) {
      const viewManager = ViewManager.getInstance(this.viewKey);
      viewManager.move(bc.serverId);
      // console.log("selectBreadcrumb",breadcrumb );
      // this.$emit("selectHome");
    }
  }
};
</script>

<style>
.spinal-breadcrumb {
  font-size: 20px;
  margin: 10px 0 10px 10px;
}
</style>
