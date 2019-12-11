<template>
  <div class="side-bar-compomenet-container"
       v-loading="loading">
    <div class="side-bar-header-container">
      <el-button type="info"
                 icon="el-icon-s-home"
                 size="small"
                 circle></el-button>
      <h4>{{buildingName}}</h4>
    </div>
    <el-menu class="spinal-side-bar-menu spinal-scrollbar"
             background-color="#303133"
             :collapse=collapse
             text-color="#fff"
             active-text-color="#ffd04b"
             ref="sideBarMenu"
             @select="onSelect"
             :unique-opened="uniqueOpened"
             @open="onOpen"
             @close="onClose">
      <el-popover v-for="floor in data"
                  :key="floor.id"
                  placement="right"
                  trigger="hover"
                  :content="floor.name">
        <el-submenu slot="reference"
                    :index="floor.id">
          <template slot="title">
            <span>{{floor.name}}</span>
          </template>
          <el-popover v-for="room in floor.children"
                      :key="room.id"
                      placement="right"
                      trigger="hover"
                      :content="room.name">
            <el-menu-item slot="reference"
                          :class="{'side-bar-selected-room-item' : room.id === roomIdSelected}"
                          :index="room.id">
              <template slot="title">
                <span>{{room.name}}</span>
              </template>
            </el-menu-item>
          </el-popover>
        </el-submenu>
      </el-popover>
    </el-menu>
  </div>
</template>

<script>
import { EventBus } from "../../services/event";

export default {
  name: "sidebarFloorList",
  data() {
    return {
      loading: true,
      activeName: "",
      data: [],
      building: null,
      uniqueOpened: true,
      floorIdSelected: "",
      roomIdSelected: "",
      collapse: true
    };
  },
  computed: {
    buildingName() {
      if (this.building) {
        return this.building.name;
      } else {
        return "Batiment";
      }
    }
  },
  methods: {
    onSelect(a, [floorId, roomId]) {
      this.roomIdSelected = roomId;
      EventBus.$emit(
        "sidebar-selected-floor",
        this.getRoomFromFloorId(floorId, roomId)
      );
    },
    onOpen(floorId) {
      EventBus.$emit("sidebar-selected-floor", this.getFloorById(floorId));
    },
    onClose(floorId) {
      EventBus.$emit("sidebar-selected-floor", this.getFloorById(floorId));
    },
    sideBarChange(data, building) {
      console.log("sideBarChange", data, building);
      this.loading = false;
      this.data = data;
      this.building = building;
    },
    onSelectFloor(floor) {
      // this.$emit("selected-floor", floor);
      this.roomIdSelected = null;
      this.floorIdSelected = floor.id;
      EventBus.$emit("sidebar-selected-floor", floor);
    },
    getFloorById(id) {
      for (const floor of this.data) {
        if (floor.id === id) return floor;
      }
    },
    getRoomFromFloorId(floorId, roomId) {
      const floor = this.getFloorById(floorId);
      for (const room of floor.children) {
        if (room.id === roomId) return room;
      }
    }
  },
  mounted() {
    this.sideBarChangeBinded = this.sideBarChange.bind(this);
    EventBus.$on("side-bar-change", this.sideBarChangeBinded);
    EventBus.$emit("get-side-bar-floors-data");
  },
  beforeDestroy() {
    EventBus.$off("side-bar-change", this.sideBarChangeBinded);
  }
};
</script>

<style scoped>
.side-bar-compomenet-container {
  height: 100%;
}
.side-bar-header-container {
  display: flex;
  align-self: auto;
  height: 56px;
  line-height: 56px;
  background-color: #409eff;
  color: white;
}
.side-bar-header-container > * {
  display: flex;
  align-self: center;
  margin-left: 5px;
}
.side-bar-header-container > h4 {
  margin-left: 8px;
}
</style>

<style>
.spinal-side-bar-menu {
  height: calc(100% - 56px);
  border-right: none !important;
  overflow: auto;
}
.spinal-side-bar-menu li.el-submenu.is-opened > .el-submenu__title {
  background-color: #8cc5ff !important;
  color: black !important;
}
.spinal-side-bar-menu li.el-menu-item.side-bar-selected-room-item {
  background-color: #909398 !important;
  padding-right: 10px;
  color: black !important;
}
.spinal-side-bar-menu li.el-submenu:focus {
  outline: none;
}
.spinal-side-bar-menu li.el-submenu > .el-menu {
  background-color: #e5eefc;
}
.spinal-side-bar-menu li.el-submenu > .el-menu .el-menu-item {
  padding-right: 10px;
}

.spinal-side-bar-menu li.el-submenu.is-opened > .el-submenu__title i {
  color: black !important;
}

.spinal-side-bar-menu .el-submenu__title:hover,
.spinal-side-bar-menu .el-menu-item:hover {
  background-color: #606266 !important;
  color: black !important;
}
.spinal-side-bar-menu .el-submenu__title:hover i,
.spinal-side-bar-menu .el-menu-item:hover i {
  color: black !important;
}
</style>
