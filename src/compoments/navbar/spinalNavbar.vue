<template>
  <div class="spinal-navbar-main-container">
    <el-collapse-transition>
      <el-button v-if="!openMenu"
                 class="bread-btn"
                 :class="{'bread-btn-opened' : openMenu}"
                 icon="el-icon-arrow-left"
                 @click="openMenu = !openMenu">
        <div class="bread">
          <p v-if="building">{{building.name}}</p>
          <p v-if="selectedLevel">/</p>
          <p v-if="selectedLevel">{{selectedLevel.name}}</p>
          <p v-if="selectedRoom">/</p>
          <p v-if="selectedRoom">{{selectedRoom.name}}</p>
        </div>
      </el-button>
      <el-button v-else
                 class="bread-btn bread-btn-opened"
                 icon="el-icon-arrow-right"
                 @click="openMenu = !openMenu">
      </el-button>
    </el-collapse-transition>
    <el-collapse-transition>
      <div v-if="openMenu"
           class="nav-list-selector-container">
        <el-collapse-transition>

          <navItem icon='el-icon-office-building'
                   label="Building"
                   :select='building'></navItem>

        </el-collapse-transition>
        <el-collapse-transition>
          <navItem v-if="building"
                   icon="el-icon-receiving"
                   label="Etage"
                   :items='levels'
                   :select='selectedLevel'
                   @select="onLevelChange"></navItem>
        </el-collapse-transition>
        <el-collapse-transition>

          <navItem v-if="selectedLevel"
                   icon="el-icon-receiving"
                   label="Local"
                   :items='selectedLevelRooms'
                   :select='selectedRoom'
                   @select="onRoomChange"></navItem>
        </el-collapse-transition>
      </div>
    </el-collapse-transition>

  </div>
</template>

<script>
import { EventBus } from "../../services/event";
import navItem from "./nav-Item.vue";

export default {
  name: "spinalNavbar",
  components: { navItem },
  data() {
    return {
      levels: [],
      selectedLevelRooms: [],
      building: null,
      selectedLevel: null,
      selectedRoom: null,
      openMenu: true
    };
  },
  mounted() {
    this.sideBarChangeBinded = this.sideBarChange.bind(this);
    EventBus.$on("side-bar-change", this.sideBarChangeBinded);
    EventBus.$emit("get-side-bar-floors-data");
  },
  beforeDestroy() {
    EventBus.$off("side-bar-change", this.sideBarChangeBinded);
  },
  methods: {
    sideBarChange(data, building) {
      this.levels = data;
      this.building = building;
    },
    onLevelChange(level) {
      this.selectedLevel = level;
      this.selectedLevelRooms = level.children;
      this.selectedRoom = null;
    },
    onRoomChange(room) {
      this.selectedRoom = room;
    }
  }
};
</script>

<style>
.spinal-navbar-main-container {
  height: 60px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-wrap: nowrap;
  background: #1d3461;
  background-image: radial-gradient(circle at top left, #04092d, #1d3461);
}
.bread {
  display: flex;
  align-self: center;
}
.bread-btn.bread-btn-opened i {
  padding: 8px;
}
.bread > * {
  align-self: center;
  padding: 0 3px;
}
.switch-menu-bread {
  align-self: center;
}
.nav-list-selector-container {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  padding: 5px 0;
}
.bread-btn {
  display: flex !important;
  flex-wrap: nowrap;
  width: 100%;
  padding: 0 !important;
  color: #fff !important;
  background-color: #1d3461 !important;
  border-color: #1d3461 !important;
  background-image: radial-gradient(
    circle at top left,
    #04092d,
    #1d3461
  ) !important;
}
.bread-btn-opened {
  width: unset;
  border-color: #1e3461 !important;
  background-color: white !important;
  background-image: unset !important;
  color: #1e3461 !important;
}

.bread-btn > * {
  align-self: center;
}

@media screen and (max-width: 567px) {
  .nav-list-selector-container {
    flex-wrap: wrap;
    height: unset;
  }
  .spinal-navbar-main-container {
    height: unset;
  }
}
</style>
