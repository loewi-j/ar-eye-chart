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
      logoFlag: false,
      t: 0,
      grid: [],
      frame: 1,
      particles: 0
    }
  },
  props: {
    type: Number,
    time: Number,
    score: Number,

  },
  watch: {
    type(event) {
      this.fireworkStop()
      // console.log(this.particles)
      // this.stage.removeChild(this.particles)
      if (this.scale > 0.2)
        this.scale -= 0.05
      this.text.scaleX = this.scale;
      this.text.scaleY = this.scale;
      this.text.rotation = this.rotationList[this.type]
      // this.stage.addChild(this.text)

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
      createjs.Ticker.setFPS(20);
      this.firework()

      this.stage.update()
    },
    tick(event) {
      if (this.logo.scaleX >= 2.2 || this.logo.scaleX <= 1.9)
        this.logoFlag = !this.logoFlag
      if (this.logoFlag) {
        this.logo.scaleX = this.logo.scaleX + 0.017;
        this.logo.scaleY = this.logo.scaleY + 0.017;
      } else {
        this.logo.scaleX = this.logo.scaleX - 0.017;
        this.logo.scaleY = this.logo.scaleY - 0.017;

      }
      this.stage.update(event); // important!!
    },
    play(event) {
      this.clear()
      this.scale = 1
      createjs.Ticker.off("tick");
      createjs.Ticker.on("tick", this.tickFireWork);

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
    fireworkPlay() {
      this.stage.removeChild(this.text)
      this.stage.addChild(this.particles);
    },
    fireworkStop() {
      console.log('stop---')
      this.stage.removeChild(this.particles)
      this.stage.addChild(this.text);
    },

    firework() {
      this.grid = this.buildGrid();
      // let clear = this.stage.addChild(new createjs.Shape());
      this.particles = new createjs.Container()
      // createjs.Ticker.setFPS(20);
    },
    buildGrid() {
      let grid = [];
      for (let x = 0; x < 1; x++) {
        let col = grid[x] = [];
        for (let y = 0; y < 3; y++) {
          col[y] = this.rnd() < 0.3 ? {
            shape: this.rnd(3),
            note: this.rnd(5),
            color: '#4f68b0',
            value: y / (5 - 1)
          } : null;
        }
      }
      return grid;
    },
    tickFireWork(event) {
      // this.t += event.delta;
      this.drawFrame(this.grid[0]);
      // this.nextT = this.t + 200;
      // this.stage.update(event);
      this.update(event.delta / 4);
    },
    update(m) {
      const w = this.stage.canvas.width
      const h = this.stage.canvas.height
      const r = 16

      let parts = this.particles.children;
      for (let i = parts.length - 1; i >= 0; i--) {
        let p = parts[i];
        if (p.alpha < 1) {
          p.alpha += 0.01;
        }
        p.x += p.velX;
        p.velX *= 0.95;
        p.velY *= 0.95;
        p.y += p.velY;
        p.rotation += p.velR;
        p.velY += 0.15;
        p.regX += p.velRegX;
        p.alpha -= 0.03;
        if (p.alpha < 0 || p.y > h + r || p.x < -r || p.x > w + r) {
          parts.splice(i, 1);
        }
      }
      this.stage.update();
    },

    drawFrame(col) {
      for (let row = 0; row < col.length; row++) {
        let o = col[row];
        if (!o) {
          continue;
        }
        let shape = new createjs.Shape();
        this.drawShape(shape.graphics, o.color, o.shape);
        this.particles.addChild(shape);

        shape.x = 200;
        shape.y = 200;
        shape.alpha = this.rnd(0.5, 1);
        let a = this.rnd(Math.PI * 2);
        shape.velX = Math.cos(a) * (5 + this.rnd(20));
        shape.velY = Math.sin(a) * (5 + this.rnd(20));
        shape.velRegX = this.rnd(-1.5, 1.5);
        shape.velR = this.rnd(-10, 10);
      }
    },

    drawShape(g, color, shape) {
      const r = 14
      g.c().f(color);
      if (false && shape === 0) {
        g.dc(r, 0, r * 0.6);
      } else if (false && shape === 1) {
        g.dr(-r * 0.5, -r * 0.5, r, r);
      } else {
        g.dp(0, 0.2 * this.rnd(r * -2, r * 2), r, 5, 0.6);
      }
    },

    rnd(min, max) {
      if (max === undefined) {
        max = min;
        min = 0;
      }
      if (max === undefined) {
        max = 1;
      }
      return min + Math.random() * (max - min);
    }
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
