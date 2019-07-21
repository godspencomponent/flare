<template>
  <div class="component">
    <canvas
      :ref="canvasId"
      id="canvas"
    ></canvas>

  </div>
</template>

<script>
  import {VueExtend, Util} from 'godspen-lib'
  import FlareExample from './assets/flare'

  export default {
    mixins: [VueExtend.mixin],
    name: 'flare',
    label: process.env.LABEL,
    style: process.env.STYLE,
    data () {
      return {
        canvasId: 'cid' // this.$parent.nodeInfo
      }
    },
    props: {
      // 文本框输入
      flr: {
        type: String,
        editor: {
          type: 'file',
          label: '动画文件',
          desc: 'flr动画文件'
        },
        default: 'https://godspen.oss-cn-shanghai.aliyuncs.com/godspen/resource/good.flr'
      },
      // 点击事件
      animation: {
        type: String,
        default: 'success',
        editor: {
          label: '默认动画',
        }
      }
    },
    /**
    * 编辑器配置面板内的自定义方法
    */
    editorMethods: {
      setAnimationName: {
        label: '设置动画',
        params: [{
          label: '设置动画',
          desc: '设置动画',
          type: 'string',
          default: ''
        }]
      }
    },
    async mounted () {
      var canvas = this.$refs[this.canvasId]
      await Util.loadJs('https://godspen.oss-cn-shanghai.aliyuncs.com/godspen/resource/Flare.js')
      await Util.loadJs('https://godspen.oss-cn-shanghai.aliyuncs.com/godspen/resource/gl-matrix.js')

      this.flareExample = new FlareExample(canvas, () => {
        this.sizeChange()
        this.flareExample.setAnimationName(this.animation)
        this.flareExample.load(this.flr, function (error) {
          if (error) {
            console.log('failed to load actor file...', error)
          }
        })
      })
      window.kk = this.flareExample
    },
    methods: {
      setAnimationName (name) {
        this.flareExample.setAnimationName(name)
      },
      sizeChange () {
        var canvas = this.$refs[this.canvasId]
        var canvasSize = canvas.getBoundingClientRect()
        this.flareExample.setSize(canvasSize.width * 2, canvasSize.height * 2)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .component {
    width: 300px;
    height: 400px;
    // border: 1px solid red;
    position: relative;

    canvas {
      margin: 0;
      padding: 0;
      height: 100%;
      width: 100%;
    }
  }
</style>
