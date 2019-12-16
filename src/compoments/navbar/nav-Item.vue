<template>
  <div class="navbar-item">
    <i class="el-icon-arrow-right"></i>
    <div>
      <el-button v-if="icon"
                 type="info"
                 :icon="icon"
                 size="small"
                 circle></el-button>

      <!-- <h4 v-if="!items">{{selectCompu}}</h4> -->
      <el-select v-model="selectCompu"
                 :placeholder="label"
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
  }
};
</script>

<style>
.navbar-item {
  flex-grow: 1;
  display: flex;
  align-self: center;
}
.navbar-item > * {
  display: flex;
  align-self: center;
}
.navbar-item > i {
  flex-grow: 0;
}

.navbar-item > div {
  flex-grow: 1;
}
.navbar-item > div > * {
  align-self: center;
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

.navbar-item:first-child > i {
  display: none;
}

@media screen and (max-width: 567px) {
  .navbar-item > i {
    display: none;
  }
}
</style>
