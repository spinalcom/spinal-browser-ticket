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
  <!-- <el-card class="control-endpoint-box">
    <h5>
      {{ name }}
    </h5>
    <span> {{ value | filterValue }} {{ unit }} </span>
  </el-card> -->

  <v-list-item class="data-table-item">
    <v-list-item-content>
      <v-list-item-title>
        <!-- <div
          v-if="this.endpoint"
          class="div__rectangle"
          :style="{
            'background-color': getColor(
              this.endpoint.currentValue.get(),
              this.variableSelected.config
            ),
          }"
        ></div> -->
        <div
          class="div__rectangle"
          :style="{
            'background-color': '#14202c',
          }"
        ></div>
        <!-- <div
          class="div__rectangle"
          :style="{
            'background-color': '#'+(Math.floor(Math.random()*0xFFFFFF)).toString(16)
          }"
        ></div> -->
        <div class="value" v-tooltip="`${value} ${unit}`">
          {{ value | filterValue }}
        </div>
        <div class="unit" v-tooltip="`${unit}`">{{ unit }}</div>
        <!-- <div class="name" v-tooltip="name" v-on:mouseover="select()"> -->
        <div class="name" v-tooltip="name">
          {{ name }}
        </div>
      </v-list-item-title>
    </v-list-item-content>

    <v-list-item-action class="data-table-item-btn-container">
      <!-- <el-tooltip
          content="Focus"
          effect="light"
          :open-delay="300"
          placement="right"
        >
          <el-button
            v-on:click="focus()"
            class="custom-icon circled-button position_right"
            circle
            icon="el-icon-zoom-in"
          ></el-button>
        </el-tooltip> -->
      <!-- <el-tooltip
          content="Select"
          effect="light"
          :open-delay="300"
          placement="right"
        >
          <el-button
            v-on:click="select()"
            class="custom-icon circled-button position_right2"
            circle
            icon="el-icon-view"
          ></el-button>
        </el-tooltip> -->

      <el-button
        v-on:click="openChartModal()"
        :disabled="endpoint.saveTimeSeries === 0"
        class="dashboard-btn custom-icon circled-button"
        :class="{
          'dashboard-btn-disabled':
            parseInt(endpoint['timeSeries maxDay']) != NaN,
          'dashboard-btn-on': isDataMode,
          'dashboard-btn-off': !isDataMode,
        }"
        circle
        icon="el-icon-menu"
      >
      </el-button>

      <el-button
        v-on:click="uploadTS()"
        :disabled="endpoint.saveTimeSeries === 0"
        class="dashboard-btn custom-icon circled-button"
        circle
        icon="el-icon-download"
      >
      </el-button>

      <!-- <el-button
            v-if="displayBoolButton"
            v-on:click="flip()"
            class="config-btn-position custom-icon circled-button"
            circle
            icon="el-icon-refresh"
          >
          </el-button> -->

      <!-- <el-button
            v-if="
              variableSelected.type == 'Consigne' &&
              variableSelected.dataType != 'Boolean'
            "
            v-on:click="openConfigModal()"
            class="config-btn-position custom-icon circled-button"
            circle
            icon="el-icon-setting"
          >
          </el-button> -->
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
import { EventBus } from "../../../../services/event";
import { NetworkService, InputDataEndpoint, InputDataEndpointDataType, InputDataEndpointType } from "spinal-model-bmsnetwork";
import excelManager from "spinal-env-viewer-plugin-excel-manager-service";
import fileSaver from "file-saver";

export default {
  name: "InsightControlEndpointBox",
  props: {
    name: { required: true, type: String },
    endpoint: { required: true, type: Object },
    targetName: { required: false, type: String },
  },
  data() {
    return {
      value: undefined,
      unit: undefined,
      bindProcess: undefined,
      isDataMode: false,
    };
  },
  mounted() {
    // console.log(this.endpoint);
    this.selectedNode = SpinalGraphService.getRealNode(
      this.endpoint.endpointNodeId
    );
    this.value = this.endpoint.currentValue;
    this.unit = this.endpoint.unit;
  },

  methods: {
    updateEndpoint() {
      if (this.endpoint) {
        // console.log(this.endpoint);
        this.bindProcess = this.endpoint.currentValue.bind(() => {
          this.value = this.endpoint.currentValue.get();
          this.unit = this.endpoint.unit.get();
        });
      }
    },
    openChartModal() {
      // console.log(this.endpoint);
      // console.log(this.targetName);
      let data = this.selectedNode.info;
      // console.log(this.endpoint)
      // let data = this.endpoint;
      // data.objectName = this.name;
      data.objectName = this.targetName;
      // console.log(data.objectName);
      data.unit = this.unit;
      // console.log(data);
      EventBus.$emit("data-mode", data);
      this.isDataMode = !this.isDataMode;
    },
    async downloadTimeSeries() {
      let netWorkService = new NetworkService();
      let tsNode = await netWorkService.getTimeseries(
        this.endpoint.endpointNodeId
      );
      let tsValues = await tsNode.getFromIntervalTime();
      console.log(tsValues);
      let headers = [
        {
          key: "date",
          header: "date",
          width: 20,
        },
        {
          key: "value",
          header: "value",
          width: 20,
        },
      ];
      let excelData = [
        {
          name: "Tableau",
          author: "",
          data: [
            {
              name: "Tableau",
              header: headers,
              rows: tsValues,
            },
          ],
        },
      ];
      excelManager.export(excelData).then((reponse) => {
        fileSaver.saveAs(new Blob(reponse), this.endpoint.name + `.xlsx`);
      });
    },
    async uploadTS() {
      let model = await SpinalGraphService.getNodeAsync(this.endpoint.endpointNodeId);
      // console.log(model);
      let datas = [
        {
          date: 1664413200000,
          value: 5,
        },
        {
          date: 1664416800000,
          value: 3,
        },
        {
          date: 1664420400000,
          value: 0,
        },
        {
          date: 1664424000000,
          value: 6,
        },
        {
          date: 1664427600000,
          value: 0,
        },
        {
          date: 1664431200000,
          value: 120,
        },
        {
          date: 1664434800000,
          value: 1900,
        },
        {
          date: 1664438400000,
          value: 28,
        },
        {
          date: 1664442000000,
          value: 112,
        },
        {
          date: 1664445600000,
          value: 408,
        },
        {
          date: 1664449200000,
          value: 703,
        },
        {
          date: 1664452800000,
          value: 792,
        },
        {
          date: 1664456400000,
          value: 850,
        },
        {
          date: 1664460000000,
          value: 704,
        },
        {
          date: 1664463600000,
          value: 978,
        },
        {
          date: 1664467200000,
          value: 690,
        },
        {
          date: 1664470800000,
          value: 665,
        },
        {
          date: 1664474400000,
          value: 662,
        },
        {
          date: 1664478000000,
          value: 565,
        },
        {
          date: 1664481600000,
          value: 515,
        },
        {
          date: 1664485200000,
          value: 304,
        },
        {
          date: 1664488800000,
          value: 1862,
        },
        {
          date: 1664492400000,
          value: 22,
        },
        {
          date: 1664496000000,
          value: 0,
        },
        {
          date: 1664499600000,
          value: 240,
        },
        {
          date: 1664503200000,
          value: 0,
        },
        {
          date: 1664506800000,
          value: 0,
        },
        {
          date: 1664510400000,
          value: 0,
        },
        {
          date: 1664514000000,
          value: 1,
        },
        {
          date: 1664517600000,
          value: 220,
        },
        {
          date: 1664521200000,
          value: 1800,
        },
        {
          date: 1664524800000,
          value: 10,
        },
        {
          date: 1664528400000,
          value: 103,
        },
        {
          date: 1664532000000,
          value: 395,
        },
        {
          date: 1664535600000,
          value: 517,
        },
        {
          date: 1664539200000,
          value: 868,
        },
        {
          date: 1664542800000,
          value: 1040,
        },
        {
          date: 1664546400000,
          value: 1001,
        },
        {
          date: 1664550000000,
          value: 657,
        },
        {
          date: 1664553600000,
          value: 832,
        },
        {
          date: 1664557200000,
          value: 516,
        },
        {
          date: 1664560800000,
          value: 756,
        },
        {
          date: 1664564400000,
          value: 483,
        },
        {
          date: 1664568000000,
          value: 595,
        },
        {
          date: 1664571600000,
          value: 377,
        },
        {
          date: 1664575200000,
          value: 1776,
        },
        {
          date: 1664578800000,
          value: 5,
        },
        {
          date: 1664582400000,
          value: 5,
        },
        {
          date: 1664586000000,
          value: 253,
        },
        {
          date: 1664589600000,
          value: 10,
        },
        {
          date: 1664593200000,
          value: 0,
        },
        {
          date: 1664596800000,
          value: 0,
        },
        {
          date: 1664600400000,
          value: 4,
        },
        {
          date: 1664604000000,
          value: 150,
        },
        {
          date: 1664607600000,
          value: 1877,
        },
        {
          date: 1664611200000,
          value: 23,
        },
        {
          date: 1664614800000,
          value: 182,
        },
        {
          date: 1664618400000,
          value: 314,
        },
        {
          date: 1664622000000,
          value: 591,
        },
        {
          date: 1664625600000,
          value: 728,
        },
        {
          date: 1664629200000,
          value: 841,
        },
        {
          date: 1664632800000,
          value: 757,
        },
        {
          date: 1664636400000,
          value: 828,
        },
        {
          date: 1664640000000,
          value: 481,
        },
        {
          date: 1664643600000,
          value: 498,
        },
        {
          date: 1664647200000,
          value: 744,
        },
        {
          date: 1664650800000,
          value: 553,
        },
        {
          date: 1664654400000,
          value: 686,
        },
        {
          date: 1664658000000,
          value: 327,
        },
        {
          date: 1664661600000,
          value: 1644,
        },
        {
          date: 1664665200000,
          value: 6,
        },
        {
          date: 1664668800000,
          value: 10,
        },
        {
          date: 1664672400000,
          value: 162,
        },
        {
          date: 1664676000000,
          value: 14,
        },
        {
          date: 1664679600000,
          value: 0,
        },
        {
          date: 1664683200000,
          value: 0,
        },
        {
          date: 1664686800000,
          value: 4,
        },
        {
          date: 1664690400000,
          value: 260,
        },
        {
          date: 1664694000000,
          value: 1774,
        },
        {
          date: 1664697600000,
          value: 22,
        },
        {
          date: 1664701200000,
          value: 153,
        },
        {
          date: 1664704800000,
          value: 334,
        },
        {
          date: 1664708400000,
          value: 587,
        },
        {
          date: 1664712000000,
          value: 751,
        },
        {
          date: 1664715600000,
          value: 567,
        },
        {
          date: 1664719200000,
          value: 539,
        },
        {
          date: 1664722800000,
          value: 704,
        },
        {
          date: 1664726400000,
          value: 687,
        },
        {
          date: 1664730000000,
          value: 590,
        },
        {
          date: 1664733600000,
          value: 555,
        },
        {
          date: 1664737200000,
          value: 687,
        },
        {
          date: 1664740800000,
          value: 544,
        },
        {
          date: 1664744400000,
          value: 361,
        },
        {
          date: 1664748000000,
          value: 1696,
        },
        {
          date: 1664751600000,
          value: 0,
        },
        {
          date: 1664755200000,
          value: 7,
        },
        {
          date: 1664758800000,
          value: 195,
        },
        {
          date: 1664762400000,
          value: 19,
        },
        {
          date: 1664766000000,
          value: 2,
        },
        {
          date: 1664769600000,
          value: 0,
        },
        {
          date: 1664773200000,
          value: 0,
        },
        {
          date: 1664776800000,
          value: 180,
        },
        {
          date: 1664780400000,
          value: 1850,
        },
        {
          date: 1664784000000,
          value: 19,
        },
        {
          date: 1664787600000,
          value: 108,
        },
        {
          date: 1664791200000,
          value: 230,
        },
        {
          date: 1664794800000,
          value: 532,
        },
        {
          date: 1664798400000,
          value: 549,
        },
        {
          date: 1664802000000,
          value: 718,
        },
        {
          date: 1664805600000,
          value: 580,
        },
        {
          date: 1664809200000,
          value: 525,
        },
        {
          date: 1664812800000,
          value: 408,
        },
        {
          date: 1664816400000,
          value: 517,
        },
        {
          date: 1664820000000,
          value: 505,
        },
        {
          date: 1664823600000,
          value: 487,
        },
        {
          date: 1664827200000,
          value: 425,
        },
        {
          date: 1664830800000,
          value: 245,
        },
        {
          date: 1664834400000,
          value: 1764,
        },
        {
          date: 1664838000000,
          value: 0,
        },
        {
          date: 1664841600000,
          value: 0,
        },
        {
          date: 1664845200000,
          value: 185,
        },
        {
          date: 1664848800000,
          value: 9,
        },
        {
          date: 1664852400000,
          value: 0,
        },
        {
          date: 1664856000000,
          value: 3,
        },
        {
          date: 1664859600000,
          value: 0,
        },
        {
          date: 1664863200000,
          value: 262,
        },
        {
          date: 1664866800000,
          value: 1670,
        },
        {
          date: 1664870400000,
          value: 2,
        },
        {
          date: 1664874000000,
          value: 33,
        },
        {
          date: 1664877600000,
          value: 5,
        },
        {
          date: 1664881200000,
          value: 0,
        },
        {
          date: 1664884800000,
          value: 36,
        },
        {
          date: 1664888400000,
          value: 1,
        },
        {
          date: 1664892000000,
          value: 17,
        },
        {
          date: 1664895600000,
          value: 11,
        },
        {
          date: 1664899200000,
          value: 6,
        },
        {
          date: 1664902800000,
          value: 7,
        },
        {
          date: 1664906400000,
          value: 10,
        },
        {
          date: 1664910000000,
          value: 35,
        },
        {
          date: 1664913600000,
          value: 11,
        },
        {
          date: 1664917200000,
          value: 172,
        },
        {
          date: 1664920800000,
          value: 1600,
        },
        {
          date: 1664924400000,
          value: 13,
        },
        {
          date: 1664928000000,
          value: 0,
        },
        {
          date: 1664931600000,
          value: 10,
        },
        {
          date: 1664935200000,
          value: 7,
        },
        {
          date: 1664938800000,
          value: 0,
        },
        {
          date: 1664942400000,
          value: 0,
        },
        {
          date: 1664946000000,
          value: 4,
        },
        {
          date: 1664949600000,
          value: 194,
        },
        {
          date: 1664953200000,
          value: 1740,
        },
        {
          date: 1664956800000,
          value: 2,
        },
        {
          date: 1664960400000,
          value: 5,
        },
        {
          date: 1664964000000,
          value: 13,
        },
        {
          date: 1664967600000,
          value: 0,
        },
        {
          date: 1664971200000,
          value: 6,
        },
        {
          date: 1664974800000,
          value: 2,
        },
        {
          date: 1664978400000,
          value: 0,
        },
        {
          date: 1664982000000,
          value: 5,
        },
        {
          date: 1664985600000,
          value: 0,
        },
        {
          date: 1664989200000,
          value: 7,
        },
        {
          date: 1664992800000,
          value: 18,
        },
        {
          date: 1664996400000,
          value: 6,
        },
        {
          date: 1665000000000,
          value: 13,
        },
        {
          date: 1665003600000,
          value: 96,
        },
        {
          date: 1665007200000,
          value: 1666,
        },
        {
          date: 1665010800000,
          value: 1,
        },
        {
          date: 1665014400000,
          value: 0,
        },
        {
          date: 1665018000000,
          value: 10,
        },
        {
          date: 1665021600000,
          value: 0,
        },
        {
          date: 1665025200000,
          value: 0,
        },
        {
          date: 1665028800000,
          value: 4,
        },
        {
          date: 1665032400000,
          value: 0,
        },
        {
          date: 1665036000000,
          value: 327,
        },
        {
          date: 1665039600000,
          value: 1710,
        },
        {
          date: 1665043200000,
          value: 21,
        },
        {
          date: 1665046800000,
          value: 128,
        },
        {
          date: 1665050400000,
          value: 474,
        },
        {
          date: 1665054000000,
          value: 654,
        },
        {
          date: 1665057600000,
          value: 838,
        },
        {
          date: 1665061200000,
          value: 831,
        },
        {
          date: 1665064800000,
          value: 804,
        },
        {
          date: 1665068400000,
          value: 683,
        },
        {
          date: 1665072000000,
          value: 625,
        },
        {
          date: 1665075600000,
          value: 725,
        },
        {
          date: 1665079200000,
          value: 582,
        },
        {
          date: 1665082800000,
          value: 813,
        },
        {
          date: 1665086400000,
          value: 563,
        },
        {
          date: 1665090000000,
          value: 485,
        },
        {
          date: 1665093600000,
          value: 1641,
        },
        {
          date: 1665097200000,
          value: 1,
        },
        {
          date: 1665100800000,
          value: 16,
        },
        {
          date: 1665104400000,
          value: 190,
        },
        {
          date: 1665108000000,
          value: 6,
        },
        {
          date: 1665111600000,
          value: 0,
        },
        {
          date: 1665115200000,
          value: 0,
        },
        {
          date: 1665118800000,
          value: 0,
        },
        {
          date: 1665122400000,
          value: 210,
        },
        {
          date: 1665126000000,
          value: 1829,
        },
        {
          date: 1665129600000,
          value: 1,
        },
        {
          date: 1665133200000,
          value: 158,
        },
        {
          date: 1665136800000,
          value: 316,
        },
        {
          date: 1665140400000,
          value: 748,
        },
        {
          date: 1665144000000,
          value: 627,
        },
        {
          date: 1665147600000,
          value: 815,
        },
        {
          date: 1665151200000,
          value: 517,
        },
        {
          date: 1665154800000,
          value: 712,
        },
        {
          date: 1665158400000,
          value: 535,
        },
        {
          date: 1665162000000,
          value: 618,
        },
        {
          date: 1665165600000,
          value: 697,
        },
        {
          date: 1665169200000,
          value: 627,
        },
        {
          date: 1665172800000,
          value: 570,
        },
        {
          date: 1665176400000,
          value: 379,
        },
        {
          date: 1665180000000,
          value: 1731,
        },
        {
          date: 1665183600000,
          value: 0,
        },
        {
          date: 1665187200000,
          value: 10,
        },
        {
          date: 1665190800000,
          value: 218,
        },
        {
          date: 1665194400000,
          value: 0,
        },
        {
          date: 1665198000000,
          value: 0,
        },
        {
          date: 1665201600000,
          value: 6,
        },
        {
          date: 1665205200000,
          value: 0,
        },
        {
          date: 1665208800000,
          value: 300,
        },
        {
          date: 1665212400000,
          value: 1736,
        },
        {
          date: 1665216000000,
          value: 41,
        },
        {
          date: 1665219600000,
          value: 140,
        },
        {
          date: 1665223200000,
          value: 252,
        },
        {
          date: 1665226800000,
          value: 620,
        },
        {
          date: 1665230400000,
          value: 813,
        },
        {
          date: 1665234000000,
          value: 666,
        },
        {
          date: 1665237600000,
          value: 561,
        },
        {
          date: 1665241200000,
          value: 580,
        },
        {
          date: 1665244800000,
          value: 598,
        },
        {
          date: 1665248400000,
          value: 489,
        },
        {
          date: 1665252000000,
          value: 507,
        },
        {
          date: 1665255600000,
          value: 595,
        },
        {
          date: 1665259200000,
          value: 451,
        },
        {
          date: 1665262800000,
          value: 393,
        },
        {
          date: 1665266400000,
          value: 1627,
        },
        {
          date: 1665270000000,
          value: 12,
        },
        {
          date: 1665273600000,
          value: 0,
        },
        {
          date: 1665277200000,
          value: 155,
        },
        {
          date: 1665280800000,
          value: 0,
        },
        {
          date: 1665284400000,
          value: 0,
        },
        {
          date: 1665288000000,
          value: 0,
        },
        {
          date: 1665291600000,
          value: 4,
        },
        {
          date: 1665295200000,
          value: 230,
        },
        {
          date: 1665298800000,
          value: 1810,
        },
        {
          date: 1665302400000,
          value: 17,
        },
        {
          date: 1665306000000,
          value: 122,
        },
        {
          date: 1665309600000,
          value: 286,
        },
        {
          date: 1665313200000,
          value: 535,
        },
        {
          date: 1665316800000,
          value: 642,
        },
        {
          date: 1665320400000,
          value: 656,
        },
        {
          date: 1665324000000,
          value: 753,
        },
        {
          date: 1665327600000,
          value: 667,
        },
        {
          date: 1665331200000,
          value: 603,
        },
        {
          date: 1665334800000,
          value: 473,
        },
        {
          date: 1665338400000,
          value: 725,
        },
        {
          date: 1665342000000,
          value: 669,
        },
        {
          date: 1665345600000,
          value: 453,
        },
        {
          date: 1665349200000,
          value: 472,
        },
        {
          date: 1665352800000,
          value: 1683,
        },
        {
          date: 1665356400000,
          value: 0,
        },
        {
          date: 1665360000000,
          value: 0,
        },
        {
          date: 1665363600000,
          value: 197,
        },
        {
          date: 1665367200000,
          value: 1,
        },
        {
          date: 1665370800000,
          value: 1,
        },
        {
          date: 1665374400000,
          value: 0,
        },
        {
          date: 1665378000000,
          value: 0,
        },
        {
          date: 1665381600000,
          value: 340,
        },
        {
          date: 1665385200000,
          value: 1692,
        },
        {
          date: 1665388800000,
          value: 29,
        },
        {
          date: 1665392400000,
          value: 112,
        },
        {
          date: 1665396000000,
          value: 287,
        },
        {
          date: 1665399600000,
          value: 463,
        },
        {
          date: 1665403200000,
          value: 579,
        },
        {
          date: 1665406800000,
          value: 700,
        },
        {
          date: 1665410400000,
          value: 657,
        },
        {
          date: 1665414000000,
          value: 515,
        },
        {
          date: 1665417600000,
          value: 515,
        },
        {
          date: 1665421200000,
          value: 428,
        },
        {
          date: 1665424800000,
          value: 446,
        },
        {
          date: 1665428400000,
          value: 587,
        },
        {
          date: 1665432000000,
          value: 363,
        },
        {
          date: 1665435600000,
          value: 505,
        },
        {
          date: 1665439200000,
          value: 1596,
        },
        {
          date: 1665442800000,
          value: 0,
        },
        {
          date: 1665446400000,
          value: 0,
        },
        {
          date: 1665450000000,
          value: 195,
        },
        {
          date: 1665453600000,
          value: 0,
        },
        {
          date: 1665457200000,
          value: 0,
        },
        {
          date: 1665460800000,
          value: 0,
        },
        {
          date: 1665464400000,
          value: 1,
        },
        {
          date: 1665468000000,
          value: 240,
        },
        {
          date: 1665471600000,
          value: 1700,
        },
        {
          date: 1665475200000,
          value: 7,
        },
        {
          date: 1665478800000,
          value: 102,
        },
        {
          date: 1665482400000,
          value: 89,
        },
        {
          date: 1665486000000,
          value: 99,
        },
        {
          date: 1665489600000,
          value: 114,
        },
        {
          date: 1665493200000,
          value: 74,
        },
        {
          date: 1665496800000,
          value: 4,
        },
        {
          date: 1665500400000,
          value: 0,
        },
        {
          date: 1665504000000,
          value: 0,
        },
        {
          date: 1665507600000,
          value: 0,
        },
        {
          date: 1665511200000,
          value: 1,
        },
        {
          date: 1665514800000,
          value: 31,
        },
        {
          date: 1665518400000,
          value: 9,
        },
        {
          date: 1665522000000,
          value: 179,
        },
        {
          date: 1665525600000,
          value: 1600,
        },
        {
          date: 1665529200000,
          value: 0,
        },
        {
          date: 1665532800000,
          value: 4,
        },
        {
          date: 1665536400000,
          value: 10,
        },
        {
          date: 1665540000000,
          value: 3,
        },
        {
          date: 1665543600000,
          value: 0,
        },
        {
          date: 1665547200000,
          value: 0,
        },
        {
          date: 1665550800000,
          value: 0,
        },
        {
          date: 1665554400000,
          value: 340,
        },
        {
          date: 1665558000000,
          value: 1590,
        },
        {
          date: 1665561600000,
          value: 0,
        },
        {
          date: 1665565200000,
          value: 5,
        },
        {
          date: 1665568800000,
          value: 0,
        },
        {
          date: 1665572400000,
          value: 6,
        },
        {
          date: 1665576000000,
          value: 0,
        },
        {
          date: 1665579600000,
          value: 10,
        },
        {
          date: 1665583200000,
          value: 24,
        },
        {
          date: 1665586800000,
          value: 3,
        },
        {
          date: 1665590400000,
          value: 0,
        },
        {
          date: 1665594000000,
          value: 4,
        },
        {
          date: 1665597600000,
          value: 5,
        },
        {
          date: 1665601200000,
          value: 0,
        },
        {
          date: 1665604800000,
          value: 0,
        },
        {
          date: 1665608400000,
          value: 276,
        },
        {
          date: 1665612000000,
          value: 1507,
        },
        {
          date: 1665615600000,
          value: 0,
        },
        {
          date: 1665619200000,
          value: 0,
        },
        {
          date: 1665622800000,
          value: 0,
        },
        {
          date: 1665626400000,
          value: 7,
        },
        {
          date: 1665630000000,
          value: 0,
        },
        {
          date: 1665633600000,
          value: 2,
        },
        {
          date: 1665637200000,
          value: 0,
        },
        {
          date: 1665640800000,
          value: 290,
        },
        {
          date: 1665644400000,
          value: 1752,
        },
        {
          date: 1665648000000,
          value: 15,
        },
        {
          date: 1665651600000,
          value: 201,
        },
        {
          date: 1665655200000,
          value: 368,
        },
        {
          date: 1665658800000,
          value: 754,
        },
        {
          date: 1665662400000,
          value: 755,
        },
        {
          date: 1665666000000,
          value: 933,
        },
        {
          date: 1665669600000,
          value: 740,
        },
        {
          date: 1665673200000,
          value: 783,
        },
        {
          date: 1665676800000,
          value: 765,
        },
        {
          date: 1665680400000,
          value: 520,
        },
        {
          date: 1665684000000,
          value: 773,
        },
        {
          date: 1665687600000,
          value: 676,
        },
        {
          date: 1665691200000,
          value: 640,
        },
        {
          date: 1665694800000,
          value: 514,
        },
        {
          date: 1665698400000,
          value: 1641,
        },
        {
          date: 1665702000000,
          value: 10,
        },
        {
          date: 1665705600000,
          value: 0,
        },
        {
          date: 1665709200000,
          value: 216,
        },
        {
          date: 1665712800000,
          value: 0,
        },
        {
          date: 1665716400000,
          value: 0,
        },
        {
          date: 1665720000000,
          value: 3,
        },
        {
          date: 1665723600000,
          value: 0,
        },
        {
          date: 1665727200000,
          value: 400,
        },
        {
          date: 1665730800000,
          value: 1637,
        },
        {
          date: 1665734400000,
          value: 15,
        },
        {
          date: 1665738000000,
          value: 214,
        },
        {
          date: 1665741600000,
          value: 356,
        },
        {
          date: 1665745200000,
          value: 528,
        },
        {
          date: 1665748800000,
          value: 711,
        },
        {
          date: 1665752400000,
          value: 1050,
        },
        {
          date: 1665756000000,
          value: 653,
        },
        {
          date: 1665759600000,
          value: 738,
        },
        {
          date: 1665763200000,
          value: 596,
        },
        {
          date: 1665766800000,
          value: 683,
        },
        {
          date: 1665770400000,
          value: 558,
        },
        {
          date: 1665774000000,
          value: 626,
        },
        {
          date: 1665777600000,
          value: 688,
        },
        {
          date: 1665781200000,
          value: 605,
        },
        {
          date: 1665784800000,
          value: 1581,
        },
        {
          date: 1665788400000,
          value: 0,
        },
        {
          date: 1665792000000,
          value: 11,
        },
        {
          date: 1665795600000,
          value: 190,
        },
        {
          date: 1665799200000,
          value: 8,
        },
        {
          date: 1665802800000,
          value: 0,
        },
        {
          date: 1665806400000,
          value: 0,
        },
        {
          date: 1665810000000,
          value: 4,
        },
        {
          date: 1665813600000,
          value: 310,
        },
        {
          date: 1665817200000,
          value: 1720,
        },
        {
          date: 1665820800000,
          value: 27,
        },
        {
          date: 1665824400000,
          value: 139,
        },
        {
          date: 1665828000000,
          value: 317,
        },
        {
          date: 1665831600000,
          value: 604,
        },
        {
          date: 1665835200000,
          value: 682,
        },
        {
          date: 1665838800000,
          value: 777,
        },
        {
          date: 1665842400000,
          value: 831,
        },
        {
          date: 1665846000000,
          value: 519,
        },
        {
          date: 1665849600000,
          value: 571,
        },
        {
          date: 1665853200000,
          value: 502,
        },
        {
          date: 1665856800000,
          value: 709,
        },
        {
          date: 1665860400000,
          value: 629,
        },
        {
          date: 1665864000000,
          value: 595,
        },
        {
          date: 1665867600000,
          value: 480,
        },
        {
          date: 1665871200000,
          value: 1676,
        },
        {
          date: 1665874800000,
          value: 6,
        },
        {
          date: 1665878400000,
          value: 10,
        },
        {
          date: 1665882000000,
          value: 159,
        },
        {
          date: 1665885600000,
          value: 0,
        },
        {
          date: 1665889200000,
          value: 22,
        },
        {
          date: 1665892800000,
          value: 0,
        },
        {
          date: 1665896400000,
          value: 5,
        },
        {
          date: 1665900000000,
          value: 442,
        },
        {
          date: 1665903600000,
          value: 1600,
        },
        {
          date: 1665907200000,
          value: 68,
        },
        {
          date: 1665910800000,
          value: 107,
        },
        {
          date: 1665914400000,
          value: 300,
        },
        {
          date: 1665918000000,
          value: 530,
        },
        {
          date: 1665921600000,
          value: 862,
        },
        {
          date: 1665925200000,
          value: 796,
        },
        {
          date: 1665928800000,
          value: 735,
        },
        {
          date: 1665932400000,
          value: 695,
        },
        {
          date: 1665936000000,
          value: 643,
        },
        {
          date: 1665939600000,
          value: 648,
        },
        {
          date: 1665943200000,
          value: 639,
        },
        {
          date: 1665946800000,
          value: 554,
        },
        {
          date: 1665950400000,
          value: 788,
        },
        {
          date: 1665954000000,
          value: 471,
        },
        {
          date: 1665957600000,
          value: 1704,
        },
        {
          date: 1665961200000,
          value: 8,
        },
        {
          date: 1665964800000,
          value: 10,
        },
        {
          date: 1665968400000,
          value: 190,
        },
        {
          date: 1665972000000,
          value: 0,
        },
        {
          date: 1665975600000,
          value: 5,
        },
        {
          date: 1665979200000,
          value: 0,
        },
        {
          date: 1665982800000,
          value: 0,
        },
        {
          date: 1665986400000,
          value: 340,
        },
        {
          date: 1665990000000,
          value: 1694,
        },
        {
          date: 1665993600000,
          value: 32,
        },
        {
          date: 1665997200000,
          value: 102,
        },
        {
          date: 1666000800000,
          value: 288,
        },
        {
          date: 1666004400000,
          value: 517,
        },
        {
          date: 1666008000000,
          value: 640,
        },
        {
          date: 1666011600000,
          value: 576,
        },
        {
          date: 1666015200000,
          value: 534,
        },
        {
          date: 1666018800000,
          value: 527,
        },
        {
          date: 1666022400000,
          value: 466,
        },
        {
          date: 1666026000000,
          value: 422,
        },
        {
          date: 1666029600000,
          value: 365,
        },
        {
          date: 1666033200000,
          value: 579,
        },
        {
          date: 1666036800000,
          value: 405,
        },
        {
          date: 1666040400000,
          value: 399,
        },
        {
          date: 1666044000000,
          value: 1658,
        },
        {
          date: 1666047600000,
          value: 8,
        },
        {
          date: 1666051200000,
          value: 9,
        },
        {
          date: 1666054800000,
          value: 180,
        },
        {
          date: 1666058400000,
          value: 5,
        },
        {
          date: 1666062000000,
          value: 4,
        },
        {
          date: 1666065600000,
          value: 0,
        },
        {
          date: 1666069200000,
          value: 10,
        },
        {
          date: 1666072800000,
          value: 420,
        },
        {
          date: 1666076400000,
          value: 1510,
        },
        {
          date: 1666080000000,
          value: 1,
        },
        {
          date: 1666083600000,
          value: 10,
        },
        {
          date: 1666087200000,
          value: 7,
        },
        {
          date: 1666090800000,
          value: 20,
        },
        {
          date: 1666094400000,
          value: 18,
        },
        {
          date: 1666098000000,
          value: 0,
        },
        {
          date: 1666101600000,
          value: 8,
        },
        {
          date: 1666105200000,
          value: 8,
        },
        {
          date: 1666108800000,
          value: 16,
        },
        {
          date: 1666112400000,
          value: 0,
        },
        {
          date: 1666116000000,
          value: 19,
        },
        {
          date: 1666119600000,
          value: 12,
        },
        {
          date: 1666123200000,
          value: 6,
        },
        {
          date: 1666126800000,
          value: 165,
        },
        {
          date: 1666130400000,
          value: 1616,
        },
        {
          date: 1666134000000,
          value: 0,
        },
        {
          date: 1666137600000,
          value: 6,
        },
        {
          date: 1666141200000,
          value: 10,
        },
        {
          date: 1666144800000,
          value: 5,
        },
        {
          date: 1666148400000,
          value: 0,
        },
        {
          date: 1666152000000,
          value: 0,
        },
        {
          date: 1666155600000,
          value: 0,
        },
        {
          date: 1666159200000,
          value: 350,
        },
        {
          date: 1666162800000,
          value: 1585,
        },
        {
          date: 1666166400000,
          value: 1,
        },
        {
          date: 1666170000000,
          value: 0,
        },
        {
          date: 1666173600000,
          value: 0,
        },
        {
          date: 1666177200000,
          value: 8,
        },
        {
          date: 1666180800000,
          value: 7,
        },
        {
          date: 1666184400000,
          value: 3,
        },
        {
          date: 1666188000000,
          value: 0,
        },
        {
          date: 1666191600000,
          value: 0,
        },
        {
          date: 1666195200000,
          value: 13,
        },
        {
          date: 1666198800000,
          value: 5,
        },
        {
          date: 1666202400000,
          value: 11,
        },
        {
          date: 1666206000000,
          value: 0,
        },
        {
          date: 1666209600000,
          value: 7,
        },
        {
          date: 1666213200000,
          value: 269,
        },
        {
          date: 1666216800000,
          value: 1513,
        },
        {
          date: 1666220400000,
          value: 0,
        },
        {
          date: 1666224000000,
          value: 0,
        },
        {
          date: 1666227600000,
          value: 0,
        },
        {
          date: 1666231200000,
          value: 5,
        },
        {
          date: 1666234800000,
          value: 0,
        },
        {
          date: 1666238400000,
          value: 6,
        },
        {
          date: 1666242000000,
          value: 0,
        },
        {
          date: 1666245600000,
          value: 304,
        },
        {
          date: 1666249200000,
          value: 1724,
        },
        {
          date: 1666252800000,
          value: 40,
        },
        {
          date: 1666256400000,
          value: 220,
        },
        {
          date: 1666260000000,
          value: 365,
        },
        {
          date: 1666263600000,
          value: 595,
        },
        {
          date: 1666267200000,
          value: 888,
        },
        {
          date: 1666270800000,
          value: 975,
        },
        {
          date: 1666274400000,
          value: 711,
        },
        {
          date: 1666278000000,
          value: 882,
        },
        {
          date: 1666281600000,
          value: 859,
        },
        {
          date: 1666285200000,
          value: 574,
        },
        {
          date: 1666288800000,
          value: 645,
        },
        {
          date: 1666292400000,
          value: 626,
        },
        {
          date: 1666296000000,
          value: 683,
        },
        {
          date: 1666299600000,
          value: 628,
        },
        {
          date: 1666303200000,
          value: 1710,
        },
        {
          date: 1666306800000,
          value: 0,
        },
        {
          date: 1666310400000,
          value: 20,
        },
        {
          date: 1666314000000,
          value: 160,
        },
        {
          date: 1666317600000,
          value: 0,
        },
        {
          date: 1666321200000,
          value: 4,
        },
        {
          date: 1666324800000,
          value: 5,
        },
        {
          date: 1666328400000,
          value: 120,
        },
        {
          date: 1666332000000,
          value: 553,
        },
        {
          date: 1666335600000,
          value: 1624,
        },
        {
          date: 1666339200000,
          value: 11,
        },
        {
          date: 1666342800000,
          value: 150,
        },
        {
          date: 1666346400000,
          value: 434,
        },
        {
          date: 1666350000000,
          value: 578,
        },
        {
          date: 1666353600000,
          value: 680,
        },
        {
          date: 1666357200000,
          value: 749,
        },
        {
          date: 1666360800000,
          value: 713,
        },
        {
          date: 1666364400000,
          value: 547,
        },
        {
          date: 1666368000000,
          value: 649,
        },
        {
          date: 1666371600000,
          value: 498,
        },
        {
          date: 1666375200000,
          value: 689,
        },
        {
          date: 1666378800000,
          value: 686,
        },
        {
          date: 1666382400000,
          value: 647,
        },
        {
          date: 1666386000000,
          value: 622,
        },
        {
          date: 1666389600000,
          value: 1564,
        },
        {
          date: 1666393200000,
          value: 17,
        },
        {
          date: 1666396800000,
          value: 10,
        },
        {
          date: 1666400400000,
          value: 176,
        },
        {
          date: 1666404000000,
          value: 6,
        },
        {
          date: 1666407600000,
          value: 6,
        },
        {
          date: 1666411200000,
          value: 4,
        },
        {
          date: 1666414800000,
          value: 0,
        },
        {
          date: 1666418400000,
          value: 334,
        },
        {
          date: 1666422000000,
          value: 1703,
        },
        {
          date: 1666425600000,
          value: 10,
        },
        {
          date: 1666429200000,
          value: 199,
        },
        {
          date: 1666432800000,
          value: 441,
        },
        {
          date: 1666436400000,
          value: 756,
        },
        {
          date: 1666440000000,
          value: 542,
        },
        {
          date: 1666443600000,
          value: 675,
        },
        {
          date: 1666447200000,
          value: 604,
        },
        {
          date: 1666450800000,
          value: 685,
        },
        {
          date: 1666454400000,
          value: 609,
        },
        {
          date: 1666458000000,
          value: 723,
        },
        {
          date: 1666461600000,
          value: 491,
        },
        {
          date: 1666465200000,
          value: 606,
        },
        {
          date: 1666468800000,
          value: 589,
        },
        {
          date: 1666472400000,
          value: 548,
        },
        {
          date: 1666476000000,
          value: 1672,
        },
        {
          date: 1666479600000,
          value: 3,
        },
        {
          date: 1666483200000,
          value: 10,
        },
        {
          date: 1666486800000,
          value: 173,
        },
        {
          date: 1666490400000,
          value: 0,
        },
        {
          date: 1666494000000,
          value: 0,
        },
        {
          date: 1666497600000,
          value: 0,
        },
        {
          date: 1666501200000,
          value: 0,
        },
        {
          date: 1666504800000,
          value: 443,
        },
        {
          date: 1666508400000,
          value: 1594,
        },
        {
          date: 1666512000000,
          value: 22,
        },
        {
          date: 1666515600000,
          value: 135,
        },
        {
          date: 1666519200000,
          value: 353,
        },
        {
          date: 1666522800000,
          value: 538,
        },
        {
          date: 1666526400000,
          value: 854,
        },
        {
          date: 1666530000000,
          value: 728,
        },
        {
          date: 1666533600000,
          value: 675,
        },
        {
          date: 1666537200000,
          value: 762,
        },
        {
          date: 1666540800000,
          value: 619,
        },
        {
          date: 1666544400000,
          value: 613,
        },
        {
          date: 1666548000000,
          value: 632,
        },
        {
          date: 1666551600000,
          value: 561,
        },
        {
          date: 1666555200000,
          value: 860,
        },
        {
          date: 1666558800000,
          value: 633,
        },
        {
          date: 1666562400000,
          value: 1508,
        },
        {
          date: 1666566000000,
          value: 2,
        },
        {
          date: 1666569600000,
          value: 10,
        },
        {
          date: 1666573200000,
          value: 174,
        },
        {
          date: 1666576800000,
          value: 1,
        },
        {
          date: 1666580400000,
          value: 0,
        },
        {
          date: 1666584000000,
          value: 0,
        },
        {
          date: 1666587600000,
          value: 0,
        },
        {
          date: 1666591200000,
          value: 360,
        },
        {
          date: 1666594800000,
          value: 1670,
        },
        {
          date: 1666598400000,
          value: 18,
        },
        {
          date: 1666602000000,
          value: 165,
        },
        {
          date: 1666605600000,
          value: 237,
        },
        {
          date: 1666609200000,
          value: 439,
        },
        {
          date: 1666612800000,
          value: 529,
        },
        {
          date: 1666616400000,
          value: 700,
        },
        {
          date: 1666620000000,
          value: 596,
        },
        {
          date: 1666623600000,
          value: 600,
        },
        {
          date: 1666627200000,
          value: 446,
        },
        {
          date: 1666630800000,
          value: 413,
        },
        {
          date: 1666634400000,
          value: 487,
        },
        {
          date: 1666638000000,
          value: 361,
        },
        {
          date: 1666641600000,
          value: 390,
        },
        {
          date: 1666645200000,
          value: 1564,
        },
        {
          date: 1666648800000,
          value: 18,
        },
        {
          date: 1666652400000,
          value: 10,
        },
        {
          date: 1666656000000,
          value: 170,
        },
        {
          date: 1666659600000,
          value: 4,
        },
        {
          date: 1666663200000,
          value: 0,
        },
        {
          date: 1666666800000,
          value: 0,
        },
        {
          date: 1666670400000,
          value: 0,
        },
        {
          date: 1666674000000,
          value: 440,
        },
        {
          date: 1666677600000,
          value: 1490,
        },
        {
          date: 1666681200000,
          value: 6,
        },
        {
          date: 1666684800000,
          value: 11,
        },
        {
          date: 1666688400000,
          value: 11,
        },
        {
          date: 1666692000000,
          value: 16,
        },
        {
          date: 1666695600000,
          value: 0,
        },
        {
          date: 1666699200000,
          value: 16,
        },
        {
          date: 1666702800000,
          value: 13,
        },
        {
          date: 1666706400000,
          value: 12,
        },
        {
          date: 1666710000000,
          value: 17,
        },
        {
          date: 1666713600000,
          value: 18,
        },
        {
          date: 1666717200000,
          value: 6,
        },
        {
          date: 1666720800000,
          value: 12,
        },
        {
          date: 1666724400000,
          value: 34,
        },
        {
          date: 1666728000000,
          value: 363,
        },
        {
          date: 1666731600000,
          value: 1410,
        },
        {
          date: 1666735200000,
          value: 0,
        },
        {
          date: 1666738800000,
          value: 8,
        },
        {
          date: 1666742400000,
          value: 20,
        },
        {
          date: 1666746000000,
          value: 9,
        },
        {
          date: 1666749600000,
          value: 0,
        },
        {
          date: 1666753200000,
          value: 0,
        },
        {
          date: 1666756800000,
          value: 0,
        },
        {
          date: 1666760400000,
          value: 350,
        },
        {
          date: 1666764000000,
          value: 1592,
        },
        {
          date: 1666767600000,
          value: 0,
        },
        {
          date: 1666771200000,
          value: 0,
        },
        {
          date: 1666774800000,
          value: 0,
        },
        {
          date: 1666778400000,
          value: 6,
        },
        {
          date: 1666782000000,
          value: 0,
        },
        {
          date: 1666785600000,
          value: 0,
        },
        {
          date: 1666789200000,
          value: 0,
        },
        {
          date: 1666792800000,
          value: 8,
        },
        {
          date: 1666796400000,
          value: 0,
        },
        {
          date: 1666800000000,
          value: 13,
        },
        {
          date: 1666803600000,
          value: 12,
        },
        {
          date: 1666807200000,
          value: 0,
        },
        {
          date: 1666810800000,
          value: 4,
        },
        {
          date: 1666814400000,
          value: 293,
        },
        {
          date: 1666818000000,
          value: 1484,
        },
        {
          date: 1666821600000,
          value: 3,
        },
        {
          date: 1666825200000,
          value: 0,
        },
        {
          date: 1666828800000,
          value: 11,
        },
        {
          date: 1666832400000,
          value: 4,
        },
        {
          date: 1666836000000,
          value: 0,
        },
        {
          date: 1666839600000,
          value: 0,
        },
        {
          date: 1666843200000,
          value: 0,
        },
        {
          date: 1666846800000,
          value: 490,
        },
        {
          date: 1666850400000,
          value: 1554,
        },
        {
          date: 1666854000000,
          value: 23,
        },
        {
          date: 1666857600000,
          value: 162,
        },
        {
          date: 1666861200000,
          value: 398,
        },
        {
          date: 1666864800000,
          value: 601,
        },
        {
          date: 1666868400000,
          value: 739,
        },
        {
          date: 1666872000000,
          value: 853,
        },
        {
          date: 1666875600000,
          value: 765,
        },
        {
          date: 1666879200000,
          value: 775,
        },
        {
          date: 1666882800000,
          value: 639,
        },
        {
          date: 1666886400000,
          value: 644,
        },
        {
          date: 1666890000000,
          value: 666,
        },
        {
          date: 1666893600000,
          value: 718,
        },
        {
          date: 1666897200000,
          value: 533,
        },
        {
          date: 1666900800000,
          value: 722,
        },
        {
          date: 1666904400000,
          value: 1442,
        },
        {
          date: 1666908000000,
          value: 7,
        },
        {
          date: 1666911600000,
          value: 20,
        },
        {
          date: 1666915200000,
          value: 178,
        },
        {
          date: 1666918800000,
          value: 6,
        },
        {
          date: 1666922400000,
          value: 4,
        },
        {
          date: 1666926000000,
          value: 3,
        },
        {
          date: 1666929600000,
          value: 0,
        },
        {
          date: 1666933200000,
          value: 404,
        },
        {
          date: 1666936800000,
          value: 1630,
        },
        {
          date: 1666940400000,
          value: 11,
        },
        {
          date: 1666944000000,
          value: 224,
        },
        {
          date: 1666947600000,
          value: 373,
        },
        {
          date: 1666951200000,
          value: 543,
        },
        {
          date: 1666954800000,
          value: 698,
        },
        {
          date: 1666958400000,
          value: 798,
        },
        {
          date: 1666962000000,
          value: 715,
        },
        {
          date: 1666965600000,
          value: 658,
        },
        {
          date: 1666969200000,
          value: 594,
        },
        {
          date: 1666972800000,
          value: 571,
        },
        {
          date: 1666976400000,
          value: 513,
        },
        {
          date: 1666980000000,
          value: 688,
        },
        {
          date: 1666983600000,
          value: 529,
        },
        {
          date: 1666987200000,
          value: 520,
        },
        {
          date: 1666990800000,
          value: 1533,
        },
        {
          date: 1666994400000,
          value: 0,
        },
        {
          date: 1666998000000,
          value: 14,
        },
        {
          date: 1667001600000,
          value: 197,
        },
        {
          date: 1667005200000,
          value: 0,
        },
        {
          date: 1667008800000,
          value: 0,
        },
        {
          date: 1667012400000,
          value: 0,
        },
        {
          date: 1667016000000,
          value: 0,
        },
        {
          date: 1667019600000,
          value: 520,
        },
        {
          date: 1667023200000,
          value: 1504,
        },
        {
          date: 1667026800000,
          value: 77,
        },
        {
          date: 1667030400000,
          value: 152,
        },
        {
          date: 1667034000000,
          value: 422,
        },
        {
          date: 1667037600000,
          value: 603,
        },
        {
          date: 1667041200000,
          value: 705,
        },
        {
          date: 1667044800000,
          value: 848,
        },
        {
          date: 1667048400000,
          value: 765,
        },
        {
          date: 1667052000000,
          value: 729,
        },
        {
          date: 1667055600000,
          value: 617,
        },
        {
          date: 1667059200000,
          value: 582,
        },
        {
          date: 1667062800000,
          value: 728,
        },
        {
          date: 1667066400000,
          value: 723,
        },
        {
          date: 1667070000000,
          value: 562,
        },
        {
          date: 1667073600000,
          value: 686,
        },
        {
          date: 1667077200000,
          value: 1481,
        },
        {
          date: 1667080800000,
          value: 10,
        },
        {
          date: 1667084400000,
          value: 22,
        },
        {
          date: 1667088000000,
          value: 154,
        },
        {
          date: 1667091600000,
          value: 0,
        },
        {
          date: 1667095200000,
          value: 0,
        },
        {
          date: 1667098800000,
          value: 7,
        },
        {
          date: 1667102400000,
          value: 8,
        },
        {
          date: 1667106000000,
          value: 430,
        },
        {
          date: 1667109600000,
          value: 1608,
        },
        {
          date: 1667113200000,
          value: 17,
        },
        {
          date: 1667116800000,
          value: 177,
        },
        {
          date: 1667120400000,
          value: 330,
        },
        {
          date: 1667124000000,
          value: 640,
        },
        {
          date: 1667127600000,
          value: 897,
        },
        {
          date: 1667131200000,
          value: 830,
        },
        {
          date: 1667134800000,
          value: 801,
        },
        {
          date: 1667138400000,
          value: 721,
        },
        {
          date: 1667142000000,
          value: 592,
        },
        {
          date: 1667145600000,
          value: 693,
        },
        {
          date: 1667149200000,
          value: 599,
        },
        {
          date: 1667152800000,
          value: 592,
        },
        {
          date: 1667156400000,
          value: 656,
        },
        {
          date: 1667160000000,
          value: 653,
        },
        {
          date: 1667163600000,
          value: 1500,
        },
        {
          date: 1667167200000,
          value: 0,
        },
        {
          date: 1667170800000,
          value: 13,
        },
        {
          date: 1667174400000,
          value: 184,
        },
        {
          date: 1667178000000,
          value: 0,
        },
        {
          date: 1667181600000,
          value: 0,
        },
        {
          date: 1667185200000,
          value: 6,
        },
        {
          date: 1667188800000,
          value: 0,
        },
        {
          date: 1667192400000,
          value: 550,
        },
        {
          date: 1667196000000,
          value: 1486,
        },
        {
          date: 1667199600000,
          value: 11,
        },
        {
          date: 1667203200000,
          value: 132,
        },
        {
          date: 1667206800000,
          value: 291,
        },
        {
          date: 1667210400000,
          value: 523,
        },
        {
          date: 1667214000000,
          value: 777,
        },
        {
          date: 1667217600000,
          value: 710,
        },
        {
          date: 1667221200000,
          value: 611,
        },
        {
          date: 1667224800000,
          value: 526,
        },
        {
          date: 1667228400000,
          value: 510,
        },
        {
          date: 1667232000000,
          value: 574,
        },
        {
          date: 1667235600000,
          value: 573,
        },
        {
          date: 1667239200000,
          value: 495,
        },
        {
          date: 1667242800000,
          value: 451,
        },
        {
          date: 1667246400000,
          value: 457,
        },
        {
          date: 1667250000000,
          value: 1562,
        },
        {
          date: 1667253600000,
          value: 10,
        },
        {
          date: 1667257200000,
          value: 22,
        },
        {
          date: 1667260800000,
          value: 183,
        },
        {
          date: 1667264400000,
          value: 4,
        },
        {
          date: 1667268000000,
          value: 3,
        },
        {
          date: 1667271600000,
          value: 0,
        },
        {
          date: 1667275200000,
          value: 0,
        },
        {
          date: 1667278800000,
          value: 440,
        },
        {
          date: 1667282400000,
          value: 1504,
        },
        {
          date: 1667286000000,
          value: 3,
        },
        {
          date: 1667289600000,
          value: 21,
        },
        {
          date: 1667293200000,
          value: 0,
        },
        {
          date: 1667296800000,
          value: 0,
        },
        {
          date: 1667300400000,
          value: 15,
        },
        {
          date: 1667304000000,
          value: 15,
        },
        {
          date: 1667307600000,
          value: 0,
        },
        {
          date: 1667311200000,
          value: 0,
        },
        {
          date: 1667314800000,
          value: 0,
        },
        {
          date: 1667318400000,
          value: 10,
        },
        {
          date: 1667322000000,
          value: 5,
        },
        {
          date: 1667325600000,
          value: 35,
        },
        {
          date: 1667329200000,
          value: 8,
        },
        {
          date: 1667332800000,
          value: 344,
        },
        {
          date: 1667336400000,
          value: 1430,
        },
        {
          date: 1667340000000,
          value: 0,
        },
        {
          date: 1667343600000,
          value: 0,
        },
        {
          date: 1667347200000,
          value: 10,
        },
        {
          date: 1667350800000,
          value: 4,
        },
        {
          date: 1667354400000,
          value: 0,
        },
        {
          date: 1667358000000,
          value: 4,
        },
        {
          date: 1667361600000,
          value: 0,
        },
        {
          date: 1667365200000,
          value: 533,
        },
        {
          date: 1667368800000,
          value: 1409,
        },
        {
          date: 1667372400000,
          value: 3,
        },
        {
          date: 1667376000000,
          value: 7,
        },
        {
          date: 1667379600000,
          value: 0,
        },
        {
          date: 1667383200000,
          value: 5,
        },
        {
          date: 1667386800000,
          value: 6,
        },
        {
          date: 1667390400000,
          value: 85,
        },
        {
          date: 1667394000000,
          value: 0,
        },
        {
          date: 1667397600000,
          value: 0,
        },
        {
          date: 1667401200000,
          value: 0,
        },
        {
          date: 1667404800000,
          value: 5,
        },
        {
          date: 1667408400000,
          value: 7,
        },
        {
          date: 1667412000000,
          value: 4,
        },
        {
          date: 1667415600000,
          value: 7,
        },
        {
          date: 1667419200000,
          value: 445,
        },
        {
          date: 1667422800000,
          value: 1498,
        },
        {
          date: 1667426400000,
          value: 0,
        },
        {
          date: 1667430000000,
          value: 0,
        },
        {
          date: 1667433600000,
          value: 0,
        },
        {
          date: 1667437200000,
          value: 11,
        },
        {
          date: 1667440800000,
          value: 7,
        },
        {
          date: 1667444400000,
          value: 0,
        },
        {
          date: 1667448000000,
          value: 7,
        },
        {
          date: 1667451600000,
          value: 490,
        },
        {
          date: 1667455200000,
          value: 1540,
        },
        {
          date: 1667458800000,
          value: 14,
        },
        {
          date: 1667462400000,
          value: 140,
        },
        {
          date: 1667466000000,
          value: 358,
        },
        {
          date: 1667469600000,
          value: 570,
        },
        {
          date: 1667473200000,
          value: 889,
        },
        {
          date: 1667476800000,
          value: 776,
        },
        {
          date: 1667480400000,
          value: 700,
        },
        {
          date: 1667484000000,
          value: 665,
        },
        {
          date: 1667487600000,
          value: 773,
        },
        {
          date: 1667491200000,
          value: 585,
        },
        {
          date: 1667494800000,
          value: 733,
        },
        {
          date: 1667498400000,
          value: 690,
        },
        {
          date: 1667502000000,
          value: 553,
        },
        {
          date: 1667505600000,
          value: 653,
        },
        {
          date: 1667509200000,
          value: 1445,
        },
        {
          date: 1667512800000,
          value: 7,
        },
        {
          date: 1667516400000,
          value: 20,
        },
        {
          date: 1667520000000,
          value: 209,
        },
        {
          date: 1667523600000,
          value: 0,
        },
        {
          date: 1667527200000,
          value: 7,
        },
        {
          date: 1667530800000,
          value: 11,
        },
        {
          date: 1667534400000,
          value: 9,
        },
        {
          date: 1667538000000,
          value: 410,
        },
        {
          date: 1667541600000,
          value: 1630,
        },
        {
          date: 1667545200000,
          value: 8,
        },
        {
          date: 1667548800000,
          value: 110,
        },
        {
          date: 1667552400000,
          value: 352,
        },
        {
          date: 1667556000000,
          value: 764,
        },
        {
          date: 1667559600000,
          value: 638,
        },
        {
          date: 1667563200000,
          value: 1011,
        },
        {
          date: 1667566800000,
          value: 819,
        },
        {
          date: 1667570400000,
          value: 653,
        },
        {
          date: 1667574000000,
          value: 733,
        },
        {
          date: 1667577600000,
          value: 555,
        },
        {
          date: 1667581200000,
          value: 819,
        },
        {
          date: 1667584800000,
          value: 692,
        },
        {
          date: 1667588400000,
          value: 692,
        },
        {
          date: 1667592000000,
          value: 619,
        },
        {
          date: 1667595600000,
          value: 1541,
        },
        {
          date: 1667599200000,
          value: 0,
        },
        {
          date: 1667602800000,
          value: 20,
        },
        {
          date: 1667606400000,
          value: 194,
        },
        {
          date: 1667610000000,
          value: 0,
        },
        {
          date: 1667613600000,
          value: 1,
        },
        {
          date: 1667617200000,
          value: 0,
        },
        {
          date: 1667620800000,
          value: 3,
        },
        {
          date: 1667624400000,
          value: 510,
        },
        {
          date: 1667628000000,
          value: 1520,
        },
        {
          date: 1667631600000,
          value: 4,
        },
        {
          date: 1667635200000,
          value: 134,
        },
        {
          date: 1667638800000,
          value: 477,
        },
        {
          date: 1667642400000,
          value: 580,
        },
        {
          date: 1667646000000,
          value: 822,
        },
        {
          date: 1667649600000,
          value: 836,
        },
        {
          date: 1667653200000,
          value: 756,
        },
        {
          date: 1667656800000,
          value: 591,
        },
        {
          date: 1667660400000,
          value: 708,
        },
        {
          date: 1667664000000,
          value: 659,
        },
        {
          date: 1667667600000,
          value: 651,
        },
        {
          date: 1667671200000,
          value: 733,
        },
        {
          date: 1667674800000,
          value: 753,
        },
        {
          date: 1667678400000,
          value: 783,
        },
        {
          date: 1667682000000,
          value: 1419,
        },
        {
          date: 1667685600000,
          value: 3,
        },
        {
          date: 1667689200000,
          value: 20,
        },
        {
          date: 1667692800000,
          value: 176,
        },
        {
          date: 1667696400000,
          value: 0,
        },
        {
          date: 1667700000000,
          value: 4,
        },
        {
          date: 1667703600000,
          value: 0,
        },
        {
          date: 1667707200000,
          value: 0,
        },
        {
          date: 1667710800000,
          value: 430,
        },
        {
          date: 1667714400000,
          value: 1596,
        },
        {
          date: 1667718000000,
          value: 2,
        },
        {
          date: 1667721600000,
          value: 107,
        },
        {
          date: 1667725200000,
          value: 412,
        },
        {
          date: 1667728800000,
          value: 610,
        },
        {
          date: 1667732400000,
          value: 655,
        },
        {
          date: 1667736000000,
          value: 845,
        },
        {
          date: 1667739600000,
          value: 764,
        },
        {
          date: 1667743200000,
          value: 505,
        },
        {
          date: 1667746800000,
          value: 773,
        },
        {
          date: 1667750400000,
          value: 545,
        },
        {
          date: 1667754000000,
          value: 568,
        },
        {
          date: 1667757600000,
          value: 776,
        },
        {
          date: 1667761200000,
          value: 645,
        },
        {
          date: 1667764800000,
          value: 703,
        },
        {
          date: 1667768400000,
          value: 1533,
        },
        {
          date: 1667772000000,
          value: 0,
        },
        {
          date: 1667775600000,
          value: 20,
        },
        {
          date: 1667779200000,
          value: 190,
        },
        {
          date: 1667782800000,
          value: 8,
        },
        {
          date: 1667786400000,
          value: 6,
        },
        {
          date: 1667790000000,
          value: 0,
        },
        {
          date: 1667793600000,
          value: 0,
        },
        {
          date: 1667797200000,
          value: 543,
        },
        {
          date: 1667800800000,
          value: 1496,
        },
        {
          date: 1667804400000,
          value: 20,
        },
        {
          date: 1667808000000,
          value: 137,
        },
        {
          date: 1667811600000,
          value: 305,
        },
        {
          date: 1667815200000,
          value: 481,
        },
        {
          date: 1667818800000,
          value: 632,
        },
        {
          date: 1667822400000,
          value: 729,
        },
        {
          date: 1667826000000,
          value: 724,
        },
        {
          date: 1667829600000,
          value: 431,
        },
        {
          date: 1667833200000,
          value: 500,
        },
        {
          date: 1667836800000,
          value: 565,
        },
        {
          date: 1667840400000,
          value: 382,
        },
        {
          date: 1667844000000,
          value: 556,
        },
        {
          date: 1667847600000,
          value: 352,
        },
        {
          date: 1667851200000,
          value: 648,
        },
        {
          date: 1667854800000,
          value: 1394,
        },
        {
          date: 1667858400000,
          value: 14,
        },
        {
          date: 1667862000000,
          value: 24,
        },
        {
          date: 1667865600000,
          value: 195,
        },
        {
          date: 1667869200000,
          value: 7,
        },
        {
          date: 1667872800000,
          value: 0,
        },
        {
          date: 1667876400000,
          value: 0,
        },
        {
          date: 1667880000000,
          value: 1,
        },
        {
          date: 1667883600000,
          value: 440,
        },
        {
          date: 1667887200000,
          value: 1494,
        },
        {
          date: 1667890800000,
          value: 6,
        },
        {
          date: 1667894400000,
          value: 6,
        },
        {
          date: 1667898000000,
          value: 11,
        },
        {
          date: 1667901600000,
          value: 9,
        },
        {
          date: 1667905200000,
          value: 0,
        },
        {
          date: 1667908800000,
          value: 5,
        },
        {
          date: 1667912400000,
          value: 6,
        },
        {
          date: 1667916000000,
          value: 0,
        },
        {
          date: 1667919600000,
          value: 8,
        },
        {
          date: 1667923200000,
          value: 0,
        },
        {
          date: 1667926800000,
          value: 25,
        },
        {
          date: 1667930400000,
          value: 4,
        },
        {
          date: 1667934000000,
          value: 8,
        },
        {
          date: 1667937600000,
          value: 358,
        },
        {
          date: 1667941200000,
          value: 1410,
        },
        {
          date: 1667944800000,
          value: 4,
        },
        {
          date: 1667948400000,
          value: 0,
        },
        {
          date: 1667952000000,
          value: 20,
        },
        {
          date: 1667955600000,
          value: 5,
        },
        {
          date: 1667959200000,
          value: 0,
        },
        {
          date: 1667962800000,
          value: 0,
        },
        {
          date: 1667966400000,
          value: 544,
        },
        {
          date: 1667970000000,
          value: 1390,
        },
        {
          date: 1667973600000,
          value: 0,
        },
        {
          date: 1667977200000,
          value: 2,
        },
        {
          date: 1667980800000,
          value: 0,
        },
        {
          date: 1667984400000,
          value: 0,
        },
        {
          date: 1667988000000,
          value: 1,
        },
        {
          date: 1667991600000,
          value: 0,
        },
        {
          date: 1667995200000,
          value: 12,
        },
        {
          date: 1667998800000,
          value: 4,
        },
        {
          date: 1668002400000,
          value: 10,
        },
        {
          date: 1668006000000,
          value: 8,
        },
        {
          date: 1668009600000,
          value: 18,
        },
        {
          date: 1668013200000,
          value: 4,
        },
        {
          date: 1668016800000,
          value: 0,
        },
        {
          date: 1668020400000,
          value: 440,
        },
        {
          date: 1668024000000,
          value: 1343,
        },
        {
          date: 1668027600000,
          value: 8,
        },
        {
          date: 1668031200000,
          value: 0,
        },
        {
          date: 1668034800000,
          value: 1,
        },
        {
          date: 1668038400000,
          value: 4,
        },
        {
          date: 1668042000000,
          value: 5,
        },
        {
          date: 1668045600000,
          value: 4,
        },
        {
          date: 1668049200000,
          value: 3,
        },
        {
          date: 1668052800000,
          value: 494,
        },
        {
          date: 1668056400000,
          value: 1547,
        },
        {
          date: 1668060000000,
          value: 4,
        },
        {
          date: 1668063600000,
          value: 15,
        },
        {
          date: 1668067200000,
          value: 82,
        },
        {
          date: 1668070800000,
          value: 54,
        },
        {
          date: 1668074400000,
          value: 186,
        },
        {
          date: 1668078000000,
          value: 274,
        },
        {
          date: 1668081600000,
          value: 341,
        },
        {
          date: 1668085200000,
          value: 207,
        },
        {
          date: 1668088800000,
          value: 168,
        },
        {
          date: 1668092400000,
          value: 123,
        },
        {
          date: 1668096000000,
          value: 167,
        },
        {
          date: 1668099600000,
          value: 195,
        },
        {
          date: 1668103200000,
          value: 182,
        },
        {
          date: 1668106800000,
          value: 581,
        },
        {
          date: 1668110400000,
          value: 1570,
        },
        {
          date: 1668114000000,
          value: 26,
        },
        {
          date: 1668117600000,
          value: 20,
        },
        {
          date: 1668121200000,
          value: 170,
        },
        {
          date: 1668124800000,
          value: 0,
        },
        {
          date: 1668128400000,
          value: 12,
        },
        {
          date: 1668132000000,
          value: 0,
        },
        {
          date: 1668135600000,
          value: 0,
        },
        {
          date: 1668139200000,
          value: 590,
        },
        {
          date: 1668142800000,
          value: 1444,
        },
        {
          date: 1668146400000,
          value: 4,
        },
        {
          date: 1668150000000,
          value: 0,
        },
        {
          date: 1668153600000,
          value: 0,
        },
        {
          date: 1668157200000,
          value: 14,
        },
        {
          date: 1668160800000,
          value: 0,
        },
        {
          date: 1668164400000,
          value: 12,
        },
        {
          date: 1668168000000,
          value: 5,
        },
        {
          date: 1668171600000,
          value: 6,
        },
        {
          date: 1668175200000,
          value: 5,
        },
        {
          date: 1668178800000,
          value: 11,
        },
        {
          date: 1668182400000,
          value: 0,
        },
        {
          date: 1668186000000,
          value: 8,
        },
        {
          date: 1668189600000,
          value: 0,
        },
        {
          date: 1668193200000,
          value: 494,
        },
        {
          date: 1668196800000,
          value: 1284,
        },
        {
          date: 1668200400000,
          value: 4,
        },
        {
          date: 1668204000000,
          value: 24,
        },
        {
          date: 1668207600000,
          value: 180,
        },
        {
          date: 1668211200000,
          value: 0,
        },
        {
          date: 1668214800000,
          value: 7,
        },
        {
          date: 1668218400000,
          value: 0,
        },
        {
          date: 1668222000000,
          value: 0,
        },
        {
          date: 1668225600000,
          value: 480,
        },
        {
          date: 1668229200000,
          value: 1550,
        },
        {
          date: 1668232800000,
          value: 0,
        },
        {
          date: 1668236400000,
          value: 22,
        },
        {
          date: 1668240000000,
          value: 139,
        },
        {
          date: 1668243600000,
          value: 341,
        },
        {
          date: 1668247200000,
          value: 616,
        },
        {
          date: 1668250800000,
          value: 651,
        },
        {
          date: 1668254400000,
          value: 876,
        },
        {
          date: 1668258000000,
          value: 723,
        },
        {
          date: 1668261600000,
          value: 644,
        },
        {
          date: 1668265200000,
          value: 437,
        },
        {
          date: 1668268800000,
          value: 544,
        },
        {
          date: 1668272400000,
          value: 538,
        },
        {
          date: 1668276000000,
          value: 573,
        },
        {
          date: 1668279600000,
          value: 975,
        },
        {
          date: 1668283200000,
          value: 1674,
        },
        {
          date: 1668286800000,
          value: 80,
        },
        {
          date: 1668290400000,
          value: 20,
        },
        {
          date: 1668294000000,
          value: 170,
        },
        {
          date: 1668297600000,
          value: 0,
        },
        {
          date: 1668301200000,
          value: 7,
        },
        {
          date: 1668304800000,
          value: 0,
        },
        {
          date: 1668308400000,
          value: 0,
        },
        {
          date: 1668312000000,
          value: 610,
        },
        {
          date: 1668315600000,
          value: 1433,
        },
        {
          date: 1668319200000,
          value: 0,
        },
        {
          date: 1668322800000,
          value: 9,
        },
        {
          date: 1668326400000,
          value: 106,
        },
        {
          date: 1668330000000,
          value: 262,
        },
        {
          date: 1668333600000,
          value: 581,
        },
        {
          date: 1668337200000,
          value: 636,
        },
        {
          date: 1668340800000,
          value: 741,
        },
        {
          date: 1668344400000,
          value: 614,
        },
        {
          date: 1668348000000,
          value: 559,
        },
        {
          date: 1668351600000,
          value: 581,
        },
        {
          date: 1668355200000,
          value: 662,
        },
        {
          date: 1668358800000,
          value: 460,
        },
        {
          date: 1668362400000,
          value: 765,
        },
        {
          date: 1668366000000,
          value: 1077,
        },
        {
          date: 1668369600000,
          value: 1553,
        },
        {
          date: 1668373200000,
          value: 57,
        },
        {
          date: 1668376800000,
          value: 20,
        },
        {
          date: 1668380400000,
          value: 190,
        },
        {
          date: 1668384000000,
          value: 0,
        },
        {
          date: 1668387600000,
          value: 0,
        },
        {
          date: 1668391200000,
          value: 0,
        },
        {
          date: 1668394800000,
          value: 4,
        },
        {
          date: 1668398400000,
          value: 514,
        },
        {
          date: 1668402000000,
          value: 1520,
        },
        {
          date: 1668405600000,
          value: 4,
        },
        {
          date: 1668409200000,
          value: 3,
        },
        {
          date: 1668412800000,
          value: 86,
        },
        {
          date: 1668416400000,
          value: 227,
        },
        {
          date: 1668420000000,
          value: 483,
        },
        {
          date: 1668423600000,
          value: 570,
        },
        {
          date: 1668427200000,
          value: 673,
        },
        {
          date: 1668430800000,
          value: 412,
        },
        {
          date: 1668434400000,
          value: 535,
        },
        {
          date: 1668438000000,
          value: 430,
        },
        {
          date: 1668441600000,
          value: 407,
        },
        {
          date: 1668445200000,
          value: 505,
        },
        {
          date: 1668448800000,
          value: 541,
        },
        {
          date: 1668452400000,
          value: 747,
        },
        {
          date: 1668456000000,
          value: 1547,
        },
        {
          date: 1668459600000,
          value: 32,
        },
        {
          date: 1668463200000,
          value: 12,
        },
        {
          date: 1668466800000,
          value: 190,
        },
        {
          date: 1668470400000,
          value: 0,
        },
        {
          date: 1668474000000,
          value: 17,
        },
        {
          date: 1668477600000,
          value: 0,
        },
        {
          date: 1668481200000,
          value: 5,
        },
        {
          date: 1668484800000,
          value: 590,
        },
        {
          date: 1668488400000,
          value: 1340,
        },
        {
          date: 1668492000000,
          value: 7,
        },
        {
          date: 1668495600000,
          value: 21,
        },
        {
          date: 1668499200000,
          value: 81,
        },
        {
          date: 1668502800000,
          value: 140,
        },
        {
          date: 1668506400000,
          value: 79,
        },
        {
          date: 1668510000000,
          value: 124,
        },
        {
          date: 1668513600000,
          value: 31,
        },
        {
          date: 1668517200000,
          value: 15,
        },
        {
          date: 1668520800000,
          value: 11,
        },
        {
          date: 1668524400000,
          value: 4,
        },
        {
          date: 1668528000000,
          value: 8,
        },
        {
          date: 1668531600000,
          value: 4,
        },
        {
          date: 1668535200000,
          value: 26,
        },
        {
          date: 1668538800000,
          value: 375,
        },
        {
          date: 1668542400000,
          value: 1257,
        },
        {
          date: 1668546000000,
          value: 0,
        },
        {
          date: 1668549600000,
          value: 4,
        },
        {
          date: 1668553200000,
          value: 10,
        },
        {
          date: 1668556800000,
          value: 0,
        },
        {
          date: 1668560400000,
          value: 8,
        },
        {
          date: 1668564000000,
          value: 0,
        },
        {
          date: 1668567600000,
          value: 0,
        },
        {
          date: 1668571200000,
          value: 540,
        },
        {
          date: 1668574800000,
          value: 1403,
        },
        {
          date: 1668578400000,
          value: 0,
        },
        {
          date: 1668582000000,
          value: 11,
        },
        {
          date: 1668585600000,
          value: 0,
        },
        {
          date: 1668589200000,
          value: 0,
        },
        {
          date: 1668592800000,
          value: 0,
        },
        {
          date: 1668596400000,
          value: 0,
        },
        {
          date: 1668600000000,
          value: 4,
        },
        {
          date: 1668603600000,
          value: 0,
        },
        {
          date: 1668607200000,
          value: 6,
        },
        {
          date: 1668610800000,
          value: 7,
        },
        {
          date: 1668614400000,
          value: 0,
        },
        {
          date: 1668618000000,
          value: 0,
        },
        {
          date: 1668621600000,
          value: 4,
        },
        {
          date: 1668625200000,
          value: 466,
        },
        {
          date: 1668628800000,
          value: 1304,
        },
        {
          date: 1668632400000,
          value: 4,
        },
        {
          date: 1668636000000,
          value: 10,
        },
        {
          date: 1668639600000,
          value: 0,
        },
        {
          date: 1668643200000,
          value: 4,
        },
        {
          date: 1668646800000,
          value: 0,
        },
        {
          date: 1668650400000,
          value: 0,
        },
        {
          date: 1668654000000,
          value: 0,
        },
        {
          date: 1668657600000,
          value: 690,
        },
        {
          date: 1668661200000,
          value: 1353,
        },
        {
          date: 1668664800000,
          value: 10,
        },
        {
          date: 1668668400000,
          value: 22,
        },
        {
          date: 1668672000000,
          value: 196,
        },
        {
          date: 1668675600000,
          value: 373,
        },
        {
          date: 1668679200000,
          value: 705,
        },
        {
          date: 1668682800000,
          value: 1043,
        },
        {
          date: 1668686400000,
          value: 967,
        },
        {
          date: 1668690000000,
          value: 823,
        },
        {
          date: 1668693600000,
          value: 719,
        },
        {
          date: 1668697200000,
          value: 688,
        },
        {
          date: 1668700800000,
          value: 793,
        },
        {
          date: 1668704400000,
          value: 547,
        },
        {
          date: 1668708000000,
          value: 698,
        },
        {
          date: 1668711600000,
          value: 1223,
        },
        {
          date: 1668715200000,
          value: 1692,
        },
        {
          date: 1668718800000,
          value: 126,
        },
        {
          date: 1668722400000,
          value: 37,
        },
        {
          date: 1668726000000,
          value: 180,
        },
        {
          date: 1668729600000,
          value: 8,
        },
        {
          date: 1668733200000,
          value: 7,
        },
        {
          date: 1668736800000,
          value: 0,
        },
        {
          date: 1668740400000,
          value: 123,
        },
        {
          date: 1668744000000,
          value: 720,
        },
        {
          date: 1668747600000,
          value: 1465,
        },
        {
          date: 1668751200000,
          value: 0,
        },
        {
          date: 1668754800000,
          value: 27,
        },
        {
          date: 1668758400000,
          value: 207,
        },
        {
          date: 1668762000000,
          value: 387,
        },
        {
          date: 1668765600000,
          value: 648,
        },
        {
          date: 1668769200000,
          value: 754,
        },
        {
          date: 1668772800000,
          value: 1013,
        },
        {
          date: 1668776400000,
          value: 759,
        },
        {
          date: 1668780000000,
          value: 677,
        },
        {
          date: 1668783600000,
          value: 929,
        },
        {
          date: 1668787200000,
          value: 599,
        },
        {
          date: 1668790800000,
          value: 674,
        },
        {
          date: 1668794400000,
          value: 588,
        },
        {
          date: 1668798000000,
          value: 1534,
        },
        {
          date: 1668801600000,
          value: 1548,
        },
        {
          date: 1668805200000,
          value: 118,
        },
        {
          date: 1668808800000,
          value: 32,
        },
        {
          date: 1668812400000,
          value: 180,
        },
        {
          date: 1668816000000,
          value: 6,
        },
        {
          date: 1668819600000,
          value: 4,
        },
        {
          date: 1668823200000,
          value: 0,
        },
        {
          date: 1668826800000,
          value: 14,
        },
        {
          date: 1668830400000,
          value: 728,
        },
        {
          date: 1668834000000,
          value: 1320,
        },
        {
          date: 1668837600000,
          value: 6,
        },
        {
          date: 1668841200000,
          value: 30,
        },
        {
          date: 1668844800000,
          value: 146,
        },
        {
          date: 1668848400000,
          value: 369,
        },
        {
          date: 1668852000000,
          value: 772,
        },
        {
          date: 1668855600000,
          value: 683,
        },
        {
          date: 1668859200000,
          value: 835,
        },
        {
          date: 1668862800000,
          value: 848,
        },
        {
          date: 1668866400000,
          value: 651,
        },
        {
          date: 1668870000000,
          value: 660,
        },
        {
          date: 1668873600000,
          value: 736,
        },
        {
          date: 1668877200000,
          value: 592,
        },
        {
          date: 1668880800000,
          value: 635,
        },
        {
          date: 1668884400000,
          value: 937,
        },
        {
          date: 1668888000000,
          value: 1706,
        },
        {
          date: 1668891600000,
          value: 69,
        },
        {
          date: 1668895200000,
          value: 15,
        },
        {
          date: 1668898800000,
          value: 23,
        },
        {
          date: 1668902400000,
          value: 9,
        },
        {
          date: 1668906000000,
          value: 5,
        },
        {
          date: 1668909600000,
          value: 24,
        },
        {
          date: 1668913200000,
          value: 628,
        },
        {
          date: 1668916800000,
          value: 1426,
        },
        {
          date: 1668920400000,
          value: 10,
        },
        {
          date: 1668924000000,
          value: 10,
        },
        {
          date: 1668927600000,
          value: 137,
        },
        {
          date: 1668931200000,
          value: 333,
        },
        {
          date: 1668934800000,
          value: 409,
        },
        {
          date: 1668938400000,
          value: 498,
        },
        {
          date: 1668942000000,
          value: 563,
        },
        {
          date: 1668945600000,
          value: 560,
        },
        {
          date: 1668949200000,
          value: 366,
        },
        {
          date: 1668952800000,
          value: 366,
        },
        {
          date: 1668956400000,
          value: 312,
        },
        {
          date: 1668960000000,
          value: 873,
        },
        {
          date: 1668963600000,
          value: 825,
        },
        {
          date: 1668967200000,
          value: 1059,
        },
        {
          date: 1668970800000,
          value: 1437,
        },
        {
          date: 1668974400000,
          value: 47,
        },
        {
          date: 1668978000000,
          value: 31,
        },
        {
          date: 1668981600000,
          value: 183,
        },
        {
          date: 1668985200000,
          value: 9,
        },
        {
          date: 1668988800000,
          value: 6,
        },
        {
          date: 1668992400000,
          value: 0,
        },
        {
          date: 1668996000000,
          value: 0,
        },
        {
          date: 1668999600000,
          value: 551,
        },
        {
          date: 1669003200000,
          value: 1510,
        },
        {
          date: 1669006800000,
          value: 4,
        },
        {
          date: 1669010400000,
          value: 8,
        },
        {
          date: 1669014000000,
          value: 5,
        },
        {
          date: 1669017600000,
          value: 0,
        },
        {
          date: 1669021200000,
          value: 0,
        },
        {
          date: 1669024800000,
          value: 36,
        },
        {
          date: 1669028400000,
          value: 0,
        },
        {
          date: 1669032000000,
          value: 17,
        },
        {
          date: 1669035600000,
          value: 15,
        },
        {
          date: 1669039200000,
          value: 0,
        },
        {
          date: 1669042800000,
          value: 0,
        },
        {
          date: 1669046400000,
          value: 6,
        },
        {
          date: 1669050000000,
          value: 0,
        },
        {
          date: 1669053600000,
          value: 430,
        },
        {
          date: 1669057200000,
          value: 1354,
        },
        {
          date: 1669060800000,
          value: 4,
        },
        {
          date: 1669064400000,
          value: 31,
        },
        {
          date: 1669068000000,
          value: 185,
        },
        {
          date: 1669071600000,
          value: 0,
        },
        {
          date: 1669075200000,
          value: 15,
        },
        {
          date: 1669078800000,
          value: 0,
        },
        {
          date: 1669082400000,
          value: 13,
        },
        {
          date: 1669086000000,
          value: 620,
        },
        {
          date: 1669089600000,
          value: 1324,
        },
        {
          date: 1669093200000,
          value: 0,
        },
        {
          date: 1669096800000,
          value: 60,
        },
        {
          date: 1669100400000,
          value: 6,
        },
        {
          date: 1669104000000,
          value: 40,
        },
        {
          date: 1669107600000,
          value: 62,
        },
        {
          date: 1669111200000,
          value: 70,
        },
        {
          date: 1669114800000,
          value: 111,
        },
        {
          date: 1669118400000,
          value: 0,
        },
        {
          date: 1669122000000,
          value: 9,
        },
        {
          date: 1669125600000,
          value: 4,
        },
        {
          date: 1669129200000,
          value: 10,
        },
        {
          date: 1669132800000,
          value: 21,
        },
        {
          date: 1669136400000,
          value: 23,
        },
        {
          date: 1669140000000,
          value: 544,
        },
        {
          date: 1669143600000,
          value: 1266,
        },
        {
          date: 1669147200000,
          value: 6,
        },
        {
          date: 1669150800000,
          value: 0,
        },
        {
          date: 1669154400000,
          value: 21,
        },
        {
          date: 1669158000000,
          value: 0,
        },
        {
          date: 1669161600000,
          value: 13,
        },
        {
          date: 1669165200000,
          value: 9,
        },
        {
          date: 1669168800000,
          value: 0,
        },
        {
          date: 1669172400000,
          value: 540,
        },
        {
          date: 1669176000000,
          value: 1408,
        },
        {
          date: 1669179600000,
          value: 8,
        },
        {
          date: 1669183200000,
          value: 7,
        },
        {
          date: 1669186800000,
          value: 0,
        },
        {
          date: 1669190400000,
          value: 1,
        },
        {
          date: 1669194000000,
          value: 0,
        },
        {
          date: 1669197600000,
          value: 0,
        },
        {
          date: 1669201200000,
          value: 7,
        },
        {
          date: 1669204800000,
          value: 0,
        },
        {
          date: 1669208400000,
          value: 23,
        },
        {
          date: 1669212000000,
          value: 11,
        },
        {
          date: 1669215600000,
          value: 23,
        },
        {
          date: 1669219200000,
          value: 7,
        },
        {
          date: 1669222800000,
          value: 0,
        },
        {
          date: 1669226400000,
          value: 469,
        },
        {
          date: 1669230000000,
          value: 1322,
        },
        {
          date: 1669233600000,
          value: 10,
        },
        {
          date: 1669237200000,
          value: 4,
        },
        {
          date: 1669240800000,
          value: 0,
        },
        {
          date: 1669244400000,
          value: 11,
        },
        {
          date: 1669248000000,
          value: 5,
        },
        {
          date: 1669251600000,
          value: 6,
        },
        {
          date: 1669255200000,
          value: 0,
        },
        {
          date: 1669258800000,
          value: 710,
        },
        {
          date: 1669262400000,
          value: 1347,
        },
        {
          date: 1669266000000,
          value: 1,
        },
        {
          date: 1669269600000,
          value: 72,
        },
        {
          date: 1669273200000,
          value: 314,
        },
        {
          date: 1669276800000,
          value: 570,
        },
        {
          date: 1669280400000,
          value: 759,
        },
        {
          date: 1669284000000,
          value: 739,
        },
        {
          date: 1669287600000,
          value: 825,
        },
        {
          date: 1669291200000,
          value: 905,
        },
        {
          date: 1669294800000,
          value: 547,
        },
        {
          date: 1669298400000,
          value: 732,
        },
        {
          date: 1669302000000,
          value: 534,
        },
        {
          date: 1669305600000,
          value: 607,
        },
        {
          date: 1669309200000,
          value: 670,
        },
        {
          date: 1669312800000,
          value: 1159,
        },
        {
          date: 1669316400000,
          value: 1484,
        },
        {
          date: 1669320000000,
          value: 81,
        },
        {
          date: 1669323600000,
          value: 41,
        },
        {
          date: 1669327200000,
          value: 197,
        },
        {
          date: 1669330800000,
          value: 16,
        },
      ];
      let netWorkService = new NetworkService();
      for(let d of datas){
        // console.log(d);
        const input = {
                        id: "",
                        name: "",
                        path: "",
                        currentValue: d.value,
                        unit: "",
                        dataType: InputDataEndpointDataType.Real,
                        type: InputDataEndpointType.Other,
                        nodeTypeName: "BmsEndpoint"// should be SpinalBmsEndpoint.nodeTypeName || 'BmsEndpoint'
                    };
        await netWorkService.updateEndpoint(model,input,d.date);

      }
      console.log("done");
    },
  },

  filters: {
    filterValue(value) {
      if (typeof value == "string" && value != "") {
        return value;
      } else if (typeof value !== "undefined") {
        const isBoolean = typeof value === "boolean";
        if (isBoolean) return value.toString().toUpperCase();
        if (value.toString().trim().length === 0) return "NULL";
        return value.toFixed(2);
      } else return "NULL";
    },
  },
};
</script>

<style scoped>
/* .control-endpoint-box {
  width: 30%;
  margin: 10px;
  height: 10%;
} */

/* .div__content {
  display: flex;
  flex-direction: row;
  background-color: #f9f9f9;
  align-items: center;
  padding: 4px;
  height: fit-content;
  border: 2px solid #eaeef0;
  border-radius: 17px;
} */
.relative {
  min-height: inherit;
}
.div__rectangle {
  width: 10px;
  height: 30px;
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 5px;
  /* min-height: inherit; */
}
/* .stat-card {
  margin: 4px;
  border-radius: 10px;
  width: 100%;
} */
.data-table-item-btn-container {
  flex-direction: row;
  display: flex;
  opacity: 0;
  /* transition: opacity 1s left 5s linear; */
  transition: opacity 0.5s linear, left 0.2s linear;
  /* transition: left 0.2s linear; */
  overflow: hidden;
  position: relative;
  left: 0px;
  width: 0;
  /* min-width: 1px; */
  min-width: 20%;
  margin-left: 0;
}

.data-table-item:hover .data-table-item-btn-container {
  width: fit-content;
  opacity: 1;
  position: relative;
  left: 20px;
  margin-left: 20px;
  /* max-width: 20%; */
}

.v-list-item__title {
  display: flex;
  flex-direction: row;
  align-items: center;
}
/* .data-table-item{
  margin: 4px;
  border-radius: 10px;
  width: 100%;
} */

.data-table-item {
  display: flex;
  flex-direction: row;
  background-color: #f9f9f9;
  /* justify-content: flex-start; */
  align-items: center;
  padding: 4px;
  height: fit-content;
  border: 2px solid #eaeef0;
  border-radius: 17px;
  margin-top: 4px;
  width: 100%;
}
.v-list-item-content {
  max-width: 60%;
}
.value {
  letter-spacing: 1.5px;
  color: #14202c;
  opacity: 1;
  font-size: 20px;
}
.unit {
  margin-left: 2px;
  letter-spacing: 1.5px;
  color: #14202c;
  opacity: 1;
  font-size: 10px;
}
.name {
  color: #949da6;
  letter-spacing: 1.1px;
  margin-left: 6px;
}
</style>
