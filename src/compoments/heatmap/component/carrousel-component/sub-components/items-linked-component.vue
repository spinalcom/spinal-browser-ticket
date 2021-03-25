<template>
   <div
      class="_content"
      v-if="rooms.length > 0"
   >
      <endpoint-component
         v-for="room of rooms"
         :name="room.name"
         :endpoints="room.endpoints"
         :variableSelected="variableSelected"
      ></endpoint-component>
   </div>

   <div
      class="empty"
      v-else
   >
      No item Linked
   </div>
</template>

<script>
import endpointComponent from "./endpoint-component.vue";

export default {
   components: { endpointComponent },
   name: "itemsLinkedComponent",
   props: {
      rooms: {},
      variableSelected: {},
   },
   data() {
      return {};
   },
   mounted() {
      console.log(this.rooms);
   },
   methods: {},
};
</script>

<style scoped>
._content {
   width: 100%;
   height: 100%;
   display: flex;
   justify-content: center;
   flex-wrap: wrap;
   overflow: hidden;
   overflow-y: auto;
}

.empty {
   width: 100%;
   height: 100%;
   display: flex;
   justify-content: center;
   align-items: center;
   font-size: 1.5em;
}
</style>