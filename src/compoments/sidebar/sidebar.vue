<template>
  <sidebarFloorList v-if="!showFloorRooms"
                    @selected-floor="onSelectFloor">
  </sidebarFloorList>
  <sidebarRoomList v-else
                   @goBack="showFloorRooms = false"
                   :floorSelected="selectedFloor">

  </sidebarRoomList>
</template>

<script>
import sidebarFloorList from "./sidebarFloorList.vue";
import sidebarRoomList from "./sidebarRoomList.vue";

export default {
  name: "sidebar",
  components: { sidebarFloorList, sidebarRoomList },
  data() {
    return {
      showFloorRooms: false,
      selectedFloor: null
    };
  },
  methods: {
    onSelectFloor(selectedFloor) {
      this.selectedFloor = selectedFloor;
      this.showFloorRooms = true;
    }
  }
};
</script>

<style scoped>
</style>
