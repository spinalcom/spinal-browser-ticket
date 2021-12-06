<template>
   <div class="__container">
      <!-- <config-component
         class="header-item"
         v-if="variableSelected.config.min"
         :config="variableSelected.config.min"
         :name="'Min'"
         @updateAverage="updateAverage"
         @colorUpdated="sendEvent"
      ></config-component>

      <config-component
         class="header-item"
         v-if="variableSelected.config.average"
         :config="variableSelected.config.average"
         :disabled="true"
         :name="'Average'"
         @updateAverage="updateAverage"
         @colorUpdated="sendEvent"
      ></config-component>

      <config-component
         class="header-item"
         v-if="variableSelected.config.max"
         :config="variableSelected.config.max"
         :name="'Max'"
         @updateAverage="updateAverage"
         @colorUpdated="sendEvent"
      ></config-component> -->

      <config-component
         class="header-item"
         v-for="item of colors"
         :config="item"
         :name="item.name"
         :hideInput="hideInput"
         :disabled="item.disabled"
         :style="{'z-index' : 1}"
         @updateAverage="updateAverage"
         @colorUpdated="sendEvent"
      ></config-component>

   </div>
</template>

<script>
import ConfigComponent from "./config-component.vue";

export default {
   name: "colorConfigComponent",
   props: { variableSelected: {} },
   components: { ConfigComponent },
   data() {
      return {
         colors: [],
         hideInput: false,
      };
   },
   mounted() {
      this.changeInput();
      this.colors = this.getColorList(this.variableSelected);
   },
   methods: {
      getColorList(variableSelected) {
         let res = [];
         switch (variableSelected.dataType) {
            case "Enum":
               res = variableSelected.config.enumeration;
               break;
            case "Boolean":
               variableSelected.config.min.name = "False";
               variableSelected.config.max.name = "True";
               res = [variableSelected.config.min, variableSelected.config.max];
               break;

            default:
               variableSelected.config.min.name = "Min";
               variableSelected.config.average.name = "Average";
               variableSelected.config.average.disabled = true;
               variableSelected.config.max.name = "Max";
               res = [
                  variableSelected.config.min,
                  variableSelected.config.average,
                  variableSelected.config.max,
               ];
               break;
         }

         return res;
      },

      updateAverage() {
         this.$emit("updateAverage");
      },

      sendEvent() {
         this.$emit("colorUpdated");
      },

      changeInput() {
         this.hideInput =
            ["Enum", "Boolean"].indexOf(this.variableSelected.dataType) !== -1;
      },
   },
   watch: {
      variableSelected() {
         this.changeInput();
         this.colors = this.getColorList(this.variableSelected);
      },
   },
};
</script>

<style scoped>
.__container {
   width: 100%;
   height: 100%;
   display: flex;
   justify-content: space-between;
}

.__container .header-item {
   flex: 1;
}
</style>