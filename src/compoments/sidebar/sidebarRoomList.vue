<template>

  <el-menu v-loading="loading">
    <el-menu-item v-for="room in data"
                  @click="onSelectRoom(room)"
                  class="sidebar-rooms-item"
                  :class="{'room-selected': roomSelectedId === room.id}"
                  :key="room.id">
      <!-- <i class="el-icon-menu"></i> -->
      <span>{{room.name}}</span>
    </el-menu-item>

  </el-menu>

  <!-- <el-page-header @back="$emit('goBack')"
                    :content="floorSelected.name">
    </el-page-header> -->

  <!-- <button @click="$emit('goBack')">back</button> -->
  <!-- <p>floorSelected : </p> -->
  <!-- <hr> -->
  <!-- <table>
      <tr>
        <th>name</th>
        <th>server_id</th>
        <th>id</th>
      </tr>
      <tr v-for="room in data"
          :key="room.id"
          @click="onSelectRoom(room)"
          :class="{'room-selected': roomSelectedId === room.id}">
        <td>{{room.name}}</td>
        <td>{{room.server_id}}</td>
        <td>{{room.id}}</td>
      </tr>
      <p v-if="data.length === 0">loading...</p>
    </table>

  </div> -->
</template>

<script>
import { EventBus } from "../../services/event";
export default {
  name: "sidebarRoomList",
  props: ["floorSelected"],
  data() {
    return {
      data: [],
      roomSelectedId: "",
      loading: true
    };
  },
  methods: {
    sideBarChange(data) {
      this.data = data;
      this.loading = false;
    },
    onSelectRoom(room) {
      this.roomSelectedId = room.id;
      EventBus.$emit("sidebar-selected-floor", room);
    }
  },

  created() {
    this.sideBarChangeBinded = this.sideBarChange.bind(this);
    EventBus.$on("side-bar-room-change", this.sideBarChangeBinded);
    EventBus.$emit("get-side-bar-rooms-data", this.floorSelected);
  },
  beforeDestroy() {
    EventBus.$off("side-bar-room-change", this.sideBarChangeBinded);
  }
};
</script>

<style>
.room-selected {
  background-color: aqua !important;
}
.sidebar-rooms-item:hover {
  background-color: aqua !important;
}
.el-menu-item {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
