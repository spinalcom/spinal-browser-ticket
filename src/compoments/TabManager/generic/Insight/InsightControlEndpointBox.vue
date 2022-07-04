<!--
Copyright 2022 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->

<template>
  <el-card class="control-endpoint-box">
    <h5>
      {{ name }}
    </h5>
    <span> {{ value | filterValue }} {{ unit }} </span>
  </el-card>
</template>

<script>
export default {
  name: 'InsightControlEndpointBox',
  props: {
    name: { required: true, type: String },
    endpoint: { required: true, type: Object },
  },
  data() {
    return {
      value: undefined,
      unit: undefined,
      bindProcess: undefined,
    };
  },
  mounted() {
    this.value = this.endpoint.currentValue;
    this.unit = this.endpoint.unit;
  },

  methods: {
    updateEndpoint() {
      if (this.endpoint) {
        this.bindProcess = this.endpoint.currentValue.bind(() => {
          this.value = this.endpoint.currentValue.get();
          this.unit = this.endpoint.unit.get();
        });
      }
    },
  },

  filters: {
    filterValue(value) {
      if (typeof value == 'string' && value != '') {
        return value;
      } else if (typeof value !== 'undefined') {
        const isBoolean = typeof value === 'boolean';
        if (isBoolean) return value.toString().toUpperCase();
        if (value.toString().trim().length === 0) return 'NULL';
        return value.toFixed(2);
      } else return 'NULL';
    },
  },
};
</script>

<style scoped>
.control-endpoint-box {
  width: 30%;
  margin: 10px;
  height: 10%;
}
</style>
