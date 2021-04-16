<template>
<div class="_content">
    
    <input v-if="this.dataType == 'float' || this.dataType == 'Long' || this.dataType=='Double' || this.dataType=='Real'" type="range" :min="min" :max="max" class="slider" step="0.1" id="myRange" v-model="value">
    <input v-else type="range" :min="min" :max="max" class="slider" id="myRange" v-model="value">

    value : {{value}}

    <el-button  
         v-on:click="validate()" class = "_button">
         OK
    </el-button>
    
</div>

</template>


<script>


export default {
    name: "value-config",
    props: { endpoint:{} , config:{} , dataType:{} },

    data(){
        return {
            value: undefined,
            min: undefined,
            max: undefined,
        };
    },

    mounted() {
        this.value = this.endpoint.currentValue.get();
        this.min=this.config.min.value;
        this.max= this.config.max.value;
        console.log(this.dataType);
        


    },

    methods: {
        validate(){
            this.$parent.endpoint.currentValue.set(this.value);
            this.$parent.isModalVisible = false;
        }
    }

}

</script>

<style scoped>
._content {
   position:absolute;
   border:1px solid black;
   width: 40%;
   height: 100px;
   background-color: white;
   display: flex;
   justify-content: center;
   flex-wrap: wrap;
   overflow: hidden;
   overflow-y: auto;
}

._button {
    
    justify-content: center;
    display: inline-block;
    margin-left: 20px;
    height: 30px;
    width: 40px;
    padding: 10px;
}


</style>