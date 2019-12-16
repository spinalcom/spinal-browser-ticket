<template>
  <div class="spinal-navbar-main-container">
    <el-button type="info"
               class="bread-btn"
               :class="{'bread-btn-opened' : openMenu}"
               :icon="openMenu ? 'el-icon-arrow-right' : 'el-icon-arrow-down'"
               @click="openMenu = !openMenu">
      <div class="bread"
           v-if="!openMenu">
        <p v-if="building">{{building.name}}</p>
        <p v-if="selectedLevel">/</p>
        <p v-if="selectedLevel">{{selectedLevel.name}}</p>
        <p v-if="selectedRoom">/</p>
        <p v-if="selectedRoom">{{selectedRoom.name}}</p>
      </div>

    </el-button>
    <div v-if="openMenu"
         class="nav-list-selector-container">
      <navItem icon='el-icon-office-building'
               label="Building"
               :select='building'></navItem>

      <navItem v-if="building"
               icon="el-icon-receiving"
               label="Etage"
               :items='levels'
               :select='selectedLevel'
               @select="onLevelChange"></navItem>

      <navItem v-if="selectedLevel"
               icon="el-icon-receiving"
               label="Local"
               :items='selectedLevelRooms'
               :select='selectedRoom'
               @select="onRoomChange"></navItem>
    </div>

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
      openMenu: false
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
      console.log("sideBarChange", data, building);
    },
    onLevelChange(level) {
      console.log("onLevelChange", level);
      this.selectedLevel = level;
      this.selectedLevelRooms = level.children;
    },
    onRoomChange(room) {
      this.selectedRoom = room;
    }
  }
  // computed: {
  //   buildingName() {
  //     if (this.building) {
  //       return this.building.name;
  //     } else {
  //       return "Batiment";
  //     }
  //   }
  // }
};
</script>

<style>
.spinal-navbar-main-container {
  height: 60px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-wrap: nowrap;
  background: #ccc;
}
.bread {
  display: flex;
  align-self: center;
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
}
.bread-btn {
  display: flex !important;
  flex-wrap: nowrap;
  width: 100%;
  padding: 0 !important;
}
.bread-btn-opened {
  width: unset;
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
