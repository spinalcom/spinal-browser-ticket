<template>
<div class="_content">
    
    <input v-if="this.dataType == 'Float' || this.dataType == 'Long' || this.dataType=='Double' || this.dataType=='Real'" type="range" :min="min" :max="max" class="slider" step="0.1" id="myRange" v-model="value">
    <input v-if="IntegerType()" type="range" :min="min" :max="max" class="slider" v-model="value">
    <select v-if="EnumType()" v-model="value">
        <option v-for="item in this.config.enumeration" :key="item.name"> {{item.name}} </option>
    </select>

    <p class ="value" align="center">
        value : {{value}}
    </p>
    

    <el-button  
         v-on:click="validate()" class = "_button">
         OK
    </el-button>
    
</div>

</template>


<script>


export default {
    name: "value-config",
    props: {config:{} , dataType:{} },

    data(){
        return {
            value: undefined,
            min: undefined,
            max: undefined,
        };
    },

    mounted() {
        
        if(this.FloatType() || this.IntegerType()){
            this.min=this.config.min.value;
            this.max= this.config.max.value;
        }
    },

    methods: {
        validate(){
            //this.$parent.endpoint.currentValue.set(this.value);
            this.$emit("globalValue",this.value);
            this.$parent.isModalVisible = false;
        },
        FloatType(){
            return this.dataType == 'Float'  || this.dataType=='Double' || this.dataType=='Real' ;
        },
        IntegerType(){
            return this.dataType == 'Unsigned' || this.dataType == 'Unsigned8' || this.dataType == 'Unsigned16' || this.dataType == 'Unsigned32'
            || this.dataType == 'Integer' || this.dataType == 'Integer16' || this.dataType == 'Long'
        },
        EnumType(){
            return this.dataType== 'Enum';
        }
    }

}

</script>

<style scoped>
._content {
   position:absolute;
   top: 140px;
   border:1px solid black;
   width: 25%;
   height: 125px;
   
   background-color: rgb(255, 255, 255);
   display: flex;
   justify-content: center;
   overflow: hidden;
   overflow-y: auto;
   z-index: 1;
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
    width : 100%;
}

</style>