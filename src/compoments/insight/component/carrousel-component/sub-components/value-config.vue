<template>
  <div class="_content">
    <input
      v-if="
        this.dataType == 'Float' ||
        this.dataType == 'Long' ||
        this.dataType == 'Double' ||
        this.dataType == 'Real'
      "
      type="range"
      :min="min"
      :max="max"
      class="slider"
      step="0.1"
      id="myRange"
      v-model="value"
    />
    <input
      v-if="IntegerType()"
      type="range"
      :min="min"
      :max="max"
      class="slider"
      v-model="value"
    />
    <select v-if="EnumType()" v-model="value">
      <option v-for="item in this.config.enumeration" :key="item.name">
        {{ item.name }}
      </option>
    </select>

    <p class="value" align="center">value : {{ value }}</p>

    <el-button v-on:click="validate()" class="_button"> OK </el-button>
  </div>
</template>


<script>
export default {
  name: "value-config",
  props: { endpoint: {}, config: {}, dataType: {} },

  data() {
    return {
      value: undefined,
      min: undefined,
      max: undefined,
    };
  },

  mounted() {
    if (this.FloatType() || this.IntegerType()) {
      this.value = this.endpoint.currentValue.get();
      this.min = this.config.min.value;
      this.max = this.config.max.value;
    }
  },

  methods: {
    validate() {
      this.$parent.endpoint.currentValue.set(this.value);
      this.$parent.isModalVisible = false;
    },
    FloatType() {
      return (
        this.dataType == "Float" ||
        this.dataType == "Double" ||
        this.dataType == "Real"
      );
    },
    IntegerType() {
      return (
        this.dataType == "Unsigned" ||
        this.dataType == "Unsigned8" ||
        this.dataType == "Unsigned16" ||
        this.dataType == "Unsigned32" ||
        this.dataType == "Integer" ||
        this.dataType == "Integer16" ||
        this.dataType == "Long"
      );
    },
    EnumType() {
      return this.dataType == "Enum";
    },
  },
};
</script>

<style scoped>
._content {
  position: relative;
  border: 1px solid black;
  width: 100%;
  height: 100px;
  background-color: white;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  overflow: hidden;
  overflow-y: auto;
  z-index: 2;
}

._button {
  justify-content: center;
  display: inline-block;
  margin-left: 20px;
  height: 30px;
  width: 40px;
  padding: 10px;
}

.value {
  width: 100%;
}
.circled-button {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20px;
  width: 20px;
  border: white;
}
.circled-button:hover {
  background-color: white;
}

.custom-icon {
  font-size: 20px;
}
</style>