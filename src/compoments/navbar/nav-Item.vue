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
  <div class="navbar-item">
    <i class="arrow-left-icon"
       data-eva="arrow-ios-forward-outline"
       data-eva-fill="#EDEDED"></i>
    <div>
      <el-button class="button-icon-left-focus"
                 v-if="icon"
                 type="info"
                 :icon="icon"
                 size="small"
                 circle></el-button>
      <el-select v-model="selectCompu"
                 :placeholder="label"
                 @mouseover="onMouseOver"
                 clearable>
        <el-option v-for="item in items"
                   :key="item.server_id"
                   :label="item.name"
                   :value="item">
        </el-option>
      </el-select>

    </div>
  </div>
</template>

<script>
export default {
  name: "navItem",
  props: ["label", "items", "select", "icon"],
  data() {
    return {};
  },
  computed: {
    selectCompu: {
      get() {
        try {
          return this.select.name;
        } catch (e) {
          return null;
        }
      },
      set(value) {
        this.$emit("select", value);
      }
    }
  },
  methods: {
    onMouseOver(e) {
      console.log("onMouseOver", e);
    }
  },
  mounted() {
    eva.replace();
  }
};
</script>

<style scoped>
.navbar-item {
  flex-grow: 1;
  display: flex;
  align-self: center;
  padding: 1px 0;
}
.navbar-item > * {
  display: flex;
  align-self: center;
}
.navbar-item > .arrow-left-icon {
  flex-grow: 0;
}

.navbar-item > div {
  flex-grow: 1;
}
.navbar-item > div > * {
  align-self: center;
}
.navbar-item .button-icon-left-focus {
  background: white;
  color: #1d4b5e;
  padding: 5px !important;
  font-size: 20px;
}

.navbar-item > div > .el-button {
  margin-left: 8px;
}
.navbar-item > div > .el-select,
.navbar-item > div > h4 {
  flex-grow: 1;
  margin-left: 10px;
  margin-right: 10px;
}

.navbar-item:first-child > .arrow-left-icon {
  display: none;
}

@media screen and (max-width: 567px) {
  .navbar-item > .arrow-left-icon {
    display: none;
  }
}
</style>

<style>
.navbar-item .el-input__inner {
  /* background-color: #114b5f; */
  /* border-color: #114b5f; */
  /* color: #ededed; */
  color: #1d4b5e;
}
</style>
