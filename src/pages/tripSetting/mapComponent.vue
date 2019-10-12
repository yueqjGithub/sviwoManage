<template>
  <div class="drawerCustom">
    <p style="color: red;">*若绘制多个区域，默认最后一个绘制的区域*图中红色区域为上次保存区域时绘制的区域</p>
    <div id="mapContent"></div>
    <el-row>
      <el-button type="primary" size="mini" @click="save">保存</el-button>
      <el-button @click="clear" type="primary" size="mini">清除</el-button>
    </el-row>
  </div>
</template>

<script>
import AMap from 'AMap'
export default {
  name: "mapComponent",
  props: ['type', 'areaPath'],
  data () {
    let map = ''
    let mouseTool = ''
    return {
      map,
      mouseTool,
      mapPath: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    clear () { // 清除的时候必须清除掉父组件中的围栏
      this.mapPath = []
      let vm = this
      vm.mouseTool.close(true)
      vm.init()
      vm.$emit('sub', [])
    },
    init () {
      let vm = this
      vm.map = new AMap.Map("mapContent", {
        zoom: 9,
        center: [104.065757,30.535266],
        resizeEnable: true
      })
      vm.mouseTool = new AMap.MouseTool(vm.map)
      vm.mouseTool.polygon({
        fillColor:'#00b0ff',
        strokeColor:'#80d8ff'
        //同Polygon的Option设置
      })
      vm.mouseTool.on('draw',function(e){
        vm.mapPath[0] = e.obj.B.path
      })
      // 修改流程下
      if (vm.type === 2) {
        let path = vm.areaPath
        let polygon = new AMap.Polygon({
          path: path,
          strokeColor: "#BDB76B",
          strokeWeight: 6,
          strokeOpacity: 0.2,
          fillOpacity: 0.4,
          fillColor: '#FF0000',
          zIndex: 49,
        })
        vm.map.add(polygon)
        vm.map.setFitView([ polygon ])
      }
    },
    save () {
      let vm = this
      vm.$emit('sub', vm.mapPath)
      vm.$emit('close')
    }
  }
}
</script>

<style scoped>
#mapContent{
  width: 100%;
  height: 70vh;
}
</style>
