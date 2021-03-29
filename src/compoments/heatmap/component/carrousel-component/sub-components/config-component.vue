<template>
   <div class="config">
      <div class="config_cont">
         <div class="name">{{getName()}}</div>
         <!--  -->
         <el-input-number
            class="input"
            size="mini"
            v-if="!hideInput"
            :disabled="disabled"
            v-model="config.value"
            @change="handleChange"
            :min="0"
         ></el-input-number>

         <div class="color">
            <div
               class="current-color"
               :style="'background-color: ' + color"
               @click="togglePicker"
            ></div>
            <chrome-picker
               class="colorSelect"
               v-model="color"
               v-if="display"
               @input="updateColor"
            />
         </div>
      </div>
   </div>
</template>

<script>
import { Chrome } from "vue-color";

export default {
   name: "configComponent",
   components: { "chrome-picker": Chrome },
   props: { config: {}, name: {}, disabled: {}, hideInput: {} },
   data() {
      return {
         display: false,
         color: "",
      };
   },
   mounted() {
      this.color = this.config.color;
      // console.log("this.config", this.config);
   },
   methods: {
      handleChange() {
         this.$emit("updateAverage");
      },

      togglePicker() {
         this.display = !this.display;
         if (this.color !== this.config.color) {
            this.config.color = this.color;
            this.$emit("colorUpdated");
         }
      },

      updateColor(val) {
         this.color = val.hex;
      },

      isBool() {
         // console.log("boolean", typeof this.config.value);
         return typeof this.config.value === "boolean";
      },

      getName() {
         if (this.isBool()) return this.config.value ? "True" : "False";
         return this.name;
      },
   },
   watch: {
      config() {
         this.color = this.config.color;
      },
   },
};
</script>

<style>
.config {
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   /* border: 1px solid green; */
   /* background-color: red; */
   /* height: 100%; */
}

.config .config_cont {
   width: 80%;
   /* border: 1px solid red; */
}

.config .config_cont .input {
   width: 100%;
   display: flex;
}

.config .config_cont .color {
   width: 100%;
   height: 25px;
   margin-top: 5px;
   margin-bottom: 5px;
   /* background-color: seagreen; */
}

.config .config_cont .color .current-color {
   width: 100%;
   height: 80%;
}

.config .config_cont .color .current-color:hover {
   cursor: pointer;
}

.config .config_cont .color .colorSelect {
   width: 100%;
}
</style>