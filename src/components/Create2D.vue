<template>
  <div>
    <canvas ref="create" id="create" height="400" width="400"/>
    <p class="help-text">
      <b>☪ How to train your model? ☪</b><br/>
      Click to add the current camera <br/>
      view as an example for that control</p>
  </div>
</template>

<script>
import * as tf from '@tensorflow/tfjs';
import bg from '@/assets/img/camBG.jpg'

export default {
  name: 'Create2D',
  data() {
    return {
      stage: null,
      text: null,
      over: null,
      timeDisc: null,
      scoreDisc: null,
      button: null,
      rotationList: [270, 180, 90, 0],
      logo: null,
      bgImg: null,
      scale: 1,
      logoFlag: false
    }
  },
  props: {
    type: Number,
    time: Number,
    score: Number,

  },
  watch: {
    type(event) {
      if (this.scale > 0.2)
        this.scale -= 0.05
      this.text.scaleX = this.scale;
      this.text.scaleY = this.scale;
      this.text.rotation = this.rotationList[this.type]
      this.scoreDisc.text = '得分：' + this.score
      this.stage.update();
    },
    time(event) {
      this.timeDisc.text = '倒计时：' + this.time + 's'
      this.stage.update();

    }
  },
  //  这里主要不能放在 created() 里
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.stage = new createjs.Stage(this.$refs.create)

      this.text = new createjs.Text("AR 视力表游戏", "40px Arial", "#777")
      this.text.x = 75
      this.text.y = 100
      this.stage.addChild(this.text)

      //加载图片
      const logo = new Image();
      logo.src = require('@/assets/logo.png');
      logo.width = 200
      logo.height = 200
      logo.onload = this.handleLogoLoad;
      this.intervalId = setInterval(this.Timing, 1000);

      createjs.Ticker.on("tick", this.tick);
      createjs.Ticker.setFPS(30);

      this.stage.update()
    },
    tick(event) {
      if (this.logo.scaleX >= 2.2 || this.logo.scaleX <= 1.9)
        this.logoFlag = !this.logoFlag
      if (this.logoFlag) {
        this.logo.scaleX = this.logo.scaleX + 0.01;
        this.logo.scaleY = this.logo.scaleY + 0.01;
      } else {
        this.logo.scaleX = this.logo.scaleX - 0.01;
        this.logo.scaleY = this.logo.scaleY - 0.01;

      }
      this.stage.update(event); // important!!
    },
    play(event) {
      this.clear()
      this.scale = 1

      //加载图片
      const bgImg = new Image();
      bgImg.src = require('@/assets/img/camBG.jpg');
      bgImg.width = 20
      bgImg.height = 20
      bgImg.onload = this.handleImageLoad;

      //加载视力图
      this.text = new createjs.Text("E", "140px Arial", "#777")
      this.text.regX = 50
      this.text.regY = 60
      this.text.x = 200
      this.text.y = 200
      this.text.scaleX = this.scale;
      this.text.scaleY = this.scale;
      this.stage.addChild(this.text)

      //加载倒计时及分数
      this.timeDisc = new createjs.Text(`Remaining: ${this.time}s`, "18px Arial", "#534a92")
      this.timeDisc.x = 300
      this.timeDisc.y = 10
      this.stage.addChild(this.timeDisc)

      this.scoreDisc = new createjs.Text(`Score: 0`, "18px Arial", "#534a92")
      this.scoreDisc.x = 300
      this.scoreDisc.y = 40
      this.stage.addChild(this.scoreDisc)

      this.stage.update(event);
    },

    timeOut(event) {
      this.clear()

      this.over = new createjs.Text("Game over！", "40px Arial", "#777")
      this.over.x = 100
      this.over.y = 110
      this.stage.addChild(this.over)

      this.scoreDisc = new createjs.Text(`Your score: ${this.score}`, "18px Arial", "#534a92")
      this.scoreDisc.x = 140
      this.scoreDisc.y = 170
      this.stage.addChild(this.scoreDisc)

      //按钮
      this.button = new createjs.Container();  //定义按钮
      let reck2 = new createjs.Shape();
      this.text = new createjs.Text(`Play again`, "18px Arial", "#534a92")
      this.text.x = 160
      this.text.y = 265
      reck2.alpha = 0.6;
      reck2.graphics.beginFill("#afc3ea") //添加按钮颜色
      reck2.graphics.drawRoundRect(130, 250, 140, 50, 5);//设定显示大小
      reck2.graphics.endFill();
      this.button.addChild(reck2);
      this.button.addChild(this.text);

      //点击事件
      const _this = this
      this.button.addEventListener("click", function (event) {
        // _this.play()
        _this.$emit('playAgain')
      })
      this.stage.addChild(this.button);//添加到画布

      this.stage.update(event);

    },
    handleImageLoad(event) {

      this.bgImg = new createjs.Bitmap(event.target);
      this.bgImg.x = 3
      this.bgImg.y = 290
      this.bgImg.scaleX = 0.17;
      this.bgImg.scaleY = 0.17;
      this.stage.addChild(this.bgImg)
      this.stage.update()

    },
    handleLogoLoad(event) {

      this.logo = new createjs.Bitmap(event.target);
      this.logo.regX = 24
      this.logo.regY = 24
      this.logo.x = 200
      this.logo.y = 240
      this.logo.scaleX = 2;
      this.logo.scaleY = 2;
      this.stage.addChild(this.logo)
      this.stage.update()

    },
    clear(event) {
      this.stage.removeChild(this.text)
      this.stage.removeChild(this.over)
      this.stage.removeChild(this.logo)
      this.stage.removeChild(this.scoreDisc)
      this.stage.removeChild(this.timeDisc)
      this.stage.removeChild(this.bgImg)
      this.stage.removeChild(this.button)

      this.stage.update(event);

    },
  }
}
</script>

<style scoped>
#create {
  padding: 20px;
  border: 2px dashed var(--purple);

}

.help-text {
  color: var(--purple);
}

.help-text b {
  font-size: 24px;
  line-height: 40px;
}
</style>
