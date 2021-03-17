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
    <el-dropdown :class="{ 'spinal-dropdown-disabled': itemsComputed.length === 0}"
                 split-button
                 type="default"
                 trigger="click"
                 @click="focusItem">
      <span class="el-dropdown-link">
        {{ selectCompu }}
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(item) in itemsComputed"
                          :key="item.server_id"
                          :label="item.name"
                          :value="item">
          <span class="dropdown-item-container"
                @click="handleCommand(item)"
                @mouseover="onMouseOver(item)">{{ item.name }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: "NavItem",
  props: ["label", "items", "select", "icon"],
  data() {
    return {};
  },
  computed: {
    selectCompu: {
      get() {
        try {
          console.log("this.select", this.select);
          if (this.select.name === "") return this.label;
          return this.select.name;
        } catch (e) {
          return this.label;
        }
      },
      set(value) {
        this.$emit("select", value);
      }
    },
    itemsComputed() {
      const res = [];
      this.items.forEach(e => {
        if (e) res.push(e);
      });
      return res;
    }
  },
  mounted() {
    eva.replace();
  },
  methods: {
    onMouseOver(item) {
      this.$emit("onMouseOver", item);
    },
    handleCommand(value) {
      console.log("handleCommand", value);
      this.$emit("select", value);
    },
    focusItem() {
      this.$emit("focusItem", this.select);
    }
  }
};
</script>

<style scoped>
.navbar-item {
  flex-grow: 1;
  display: flex;
  align-self: center;
  margin: 0px 5px;
  /* background: white; */
}
.navbar-item > * {
  display: flex;
  align-self: center;
  width: 100%;
}

.navbar-item > div > .el-button {
  margin-left: 8px;
}
.spinal-dropdown-disabled {
  cursor: not-allowed !important;
  color: #bbb !important;
}

/* .navbar-item {
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
} */
</style>

<style>
.navbar-item .el-input__inner {
  /* background-color: #114b5f; */
  /* border-color: #114b5f; */
  /* color: #ededed; */
  color: #1d4b5e;
}
.navbar-item .el-button-group {
  width: 100%;
  white-space: nowrap;
}

.navbar-item .el-button-group .el-button:first-child {
  width: calc(100% - 28px);
}

.button-icon-left-focus.is-disabled,
.button-icon-left-focus.is-disabled:active,
.button-icon-left-focus.is-disabled:focus,
.button-icon-left-focus.is-disabled:hover {
  color: #fff !important;
  background-color: #c8c9cc !important;
  border-color: #c8c9cc !important;
}
.dropdown-item-container {
  float: left;
  width: calc(100% + 40px);
  margin-left: -20px;
  padding-left: 20px;
}
.el-dropdown-menu.el-popper {
  max-height: 95vh;
  overflow: auto;
}

.el-dropdown-menu.el-popper::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
.el-dropdown-menu.el-popper::-webkit-scrollbar-thumb {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  background: rgba(169, 169, 169, 0.9);
}
.el-dropdown-menu.el-popper::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  -webkit-border-radius: 5px;
  border-radius: 5px;
}



.spinal-dropdown-disabled * {
  cursor: not-allowed !important;
  pointer-events: none !important;
  background-color: #c8c9cc !important;
  border-radius: 4px;
}
</style>
