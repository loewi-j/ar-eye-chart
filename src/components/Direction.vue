<template>
  <div class="panel joystick-panel">

    <div class="panel-row panel-row-top">
      <div class="panel-cell panel-cell-left panel-cell-fill">
      </div><!-- ./panel-cell -->
      <div class="panel-cell panel-cell-center">
        <div class="thumb-box">
          <div class="thumb-box-outer">
            <div class="thumb-box-inner">
              <canvas class="thumb" width=224 height=224 id="up-thumb"></canvas>
            </div>
          </div>
          <p>
            <button class="record-button" id="up" @click="addExample(0)"><span>Add Sample</span></button>
          </p>
        </div>
      </div><!-- ./panel-cell -->

      <div class="panel-cell panel-cell-right panel-cell-fill">
      </div><!-- ./panel-cell -->

    </div><!-- /.panel-row -->
    <div class="panel-row panel-row-middle">
      <div class="panel-cell panel-cell-left">
        <div class="thumb-box">
          <div class="thumb-box-outer">
            <div class="thumb-box-inner">
              <canvas class="thumb" width=224 height=224 id="left-thumb"></canvas>
            </div>
          </div>
          <p>
            <button class="record-button" id="left" @click="addExample(1)"><span>Add Sample</span></button>
          </p>
        </div>
      </div><!-- ./panel-cell -->

      <div class="panel-cell panel-cell-center panel-cell-fill">
        <img height="128" width="128" :src="drag"/>
      </div><!-- ./panel-cell -->

      <div class="panel-cell panel-cell-right">
        <div class="thumb-box">
          <div class="thumb-box-outer">
            <div class="thumb-box-inner">
              <canvas class="thumb" width=224 height=224 id="right-thumb"></canvas>
            </div>
          </div>
          <p>
            <button class="record-button" id="right" @click="addExample(3)"><span>Add Sample</span></button>
          </p>
        </div>
      </div><!-- ./panel-cell -->

    </div><!-- /.panel-row -->

    <div class="panel-row panel-row-bottom">

      <div class="panel-cell panel-cell-left panel-cell-fill">
      </div><!-- ./panel-cell -->

      <div class="panel-cell panel-cell-center">
        <div class="thumb-box">
          <div class="thumb-box-outer">
            <div class="thumb-box-inner">
              <canvas class="thumb" width=224 height=224 id="down-thumb"></canvas>
            </div>
          </div>
          <p>
            <button class="record-button" id="down" @click="addExample(2)"><span>Add Sample</span></button>
          </p>
        </div>
      </div><!-- ./panel-cell -->

      <div class="panel-cell panel-cell-right panel-cell-fill">
      </div><!-- ./panel-cell -->

    </div><!-- /.panel-row -->


  </div><!-- /.panel -->

</template>

<script>
import drag from '@/assets/img/drag_flat.png'
import * as tf from "@tensorflow/tfjs";

export default {
  name: "Direction",
  data() {
    return {
      drag: drag,
      rotationList: ['up', 'left', 'down', 'right'],

    }
  },
  props: {
    video: HTMLVideoElement
  },
  methods: {
    addExample(elementId) {
      const canvas = document.getElementById(`${this.rotationList[elementId]}-thumb`)
      console.log(canvas)
      let context = canvas.getContext("2d")
      context.drawImage(this.video, 0, 0, 224, 224);

      this.$emit('addExample', elementId)
    },
  }
}
</script>

<style scoped>
.panel {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 0;
}
.panel:first-child {
  padding: 0 22px 0 13px;
  width: 420px;
}
.panel:last-child {
  padding: 0 9px 0 22px;
  /*width: 353px;*/
}
.panel-row {
  display: flex;
  flex-direction: row;
}
.panel-cell {
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  justify-content: center;
  position: relative;
}
.panel-cell-fill {
  flex-grow: 1;
}
.panel-cell p {
  color: #8b8b8b;
  font-size: 10px;
  margin: 0;
  padding: 0;
  text-align: center;
}
.controller-panels button {
  background: none;
  border: none;
  box-sizing: border-box;
  cursor: pointer;
  margin: 0;
  padding: 0;
}
.thumb-box {
  display: inline-block;
}
.panel-row-middle .thumb-box {
  margin-top: 18px;
}
.thumb-box-outer {
  background: var(--pink);
  /*border: 1px solid var(--blue);*/
  border-radius: 4px;
  box-sizing: border-box;
  display: inline-block;
  padding: 9px;
  position: relative;
  transition: box-shadow 0.3s;
}
[data-active="up"] .panel-row-top .thumb-box-outer,
[data-active="down"] .panel-row-bottom .thumb-box-outer,
[data-active="left"] .panel-cell-left .thumb-box-outer,
[data-active="right"] .panel-cell-right .thumb-box-outer {
  box-shadow: 0 0 4px 4px #ffaa00;
}
.thumb-box-inner {
  border: 1px solid var(--blue);
  border-radius: 4px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  overflow: hidden;
  width: 66px;
}
.thumb {
  height: 66px;
  transform: scaleX(-1);
}
.thumb-box .record-button {
  /*background: -webkit-linear-gradient(to right, var(--pink), var(--blue));*/
  /*background: linear-gradient(to right, var(--pink),var(--blue));*/
  background-color: var(--blue);
  color: #eaeaea;
  margin: 5px;
  padding: 10px;
}
.thumb-box .record-button span {
  border-radius: 5px;
  bottom: 1px;
  display: block;
  font-size: 10px;
}
.panel-cell-center img {
  margin: 1rem;
}
</style>