<template>
  <div id="app">
    <section>
      <!--    提示信息-->
      <div class="console">
        <p id="modelInfo" v-show="loadingInfoShow">model is loading...</p>
        <p id="webcamInfo" v-show="webcamInfoShow">waiting for webcam...</p>
        <p v-show="!webcamInfoShow & !loadingInfoShow">&nbsp;</p>
      </div>

      <video autoplay playsinline muted ref="webcam" width="300" height="300"></video>

      <div>
        <button id="train" @click="train">Train</button>
        <button id="play" @click="play">Play</button>
      </div>
      <div class="console">
        <p>{{ console }}</p>
      </div>
    </section>

    <section id="game">
      <create2-d
          ref="cam"
          @playAgain="playAgain"
          :time="intervalTime"
          :score="score"
          :type="type"/>
    </section>

    <section>
      <direction
          :video="this.$refs.webcam"
          @addExample="addExample"/>
    </section>
  </div>
</template>

<script>
import * as tf from '@tensorflow/tfjs'
//使用ImageNet 数据库中的标签对图像进行分类。
import * as mobilenet from '@tensorflow-models/mobilenet'
//这个包提供了一个使用 K-最近邻算法创建分类器的实用程序。可用于迁移学习。
import * as knnClassifier from '@tensorflow-models/knn-classifier'
import Create2D from '@/components/Create2D.vue'
import Direction from "@/components/Direction";

export default {
  name: "WebCam",
  components: {
    Direction,
    Create2D
  },
  data() {
    return {
      loadingInfoShow: true,
      webcamInfoShow: false,
      trainFinish: false,
      classifier: null,
      net: null,
      type: null,
      console: '',
      activationList: [],
      intervalId: [],
      intervalTime: 5,
      score: 0
    }
  },
  mounted() {
    this.classifier = knnClassifier.create();
    this.init();

  },
  methods: {
    init() {
      this.loadModel().then(_ => {
        this.loadWebcam();
      }).catch(err => {
        console.log(err)
      })
    },
    async train() {
      if (this.activationList.length !== 0) {
        this.console = 'Training...'
        this.activationList.map(async item => {
          this.classifier.addExample(item.activation, item.elementId);
          this.classifier.addExample(item.activation, item.elementId);
          this.classifier.addExample(item.activation, item.elementId);
        })
        this.console = 'Complete the training!'
        this.trainFinish = true
      } else {
        this.console = 'Add some examples before training!'
      }
    },

    play() {
      if (this.trainFinish) {
        this.$refs.cam.play()
        this.bindPlaying();
        this.intervalId = setInterval(this.Timing, 1000);
      }
      else {
        this.console = 'Please train the model first!'
      }
    },
    // load model
    async loadModel() {
      this.net = await mobilenet.load();
      this.loadingInfoShow = false
    },
    // load webcam
    async loadWebcam() {
      this.webcamInfoShow = true
      //调用手机摄像头
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia || navigator.msGetUserMedia;

      // if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      if (navigator.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: "user"
          }
        }).then(stream => {
          window.stream = stream;
          this.$refs.webcam.srcObject = stream;
          return new Promise((resolve, reject) => {
            this.$refs.webcam.onloadedmetadata = () => {
              resolve();
              this.webcamInfoShow = false
            };
          });
        });
      }
    },

    addExample(elementId) {
      this.activationList.push(
          {'activation': this.net.infer(this.$refs.webcam, "conv_preds"), 'elementId': elementId}
      );
    },

    Timing() {
      if (this.intervalTime === 0) {
        //清除屏幕，显示结果
        this.timeOut()
        //清除计时函数
        clearInterval(this.intervalId);
        this.intervalTime++;
      }
      this.intervalTime--;
    },

    timeOut() {
      this.$refs.cam.timeOut()

    },
    async bindPlaying() {
      this.intervalTime = 5;
      this.type = this.randomNum(0, 3)

      while (this.intervalTime !== 0) {
        if (this.classifier.getNumClasses() > 0) {
          // get the activation from mobilenet from the webcam.
          const activation = this.net.infer(this.$refs.webcam, "conv_preds");
          // get the most likely class and confidences from the classifier module.
          const result = await this.classifier.predictClass(activation);
          const classes = ["up", "left", "down", "right"];
          this.console = `prediction: ${classes[result.classIndex]}\n`;
          if (result.classIndex === this.type) {
            this.score++
            // 庆祝动画
            this.$refs.cam.fireworkPlay()
            // 继续游戏
            setTimeout(async () =>{
              this.$refs.cam.fireworkStop()
              await this.bindPlaying();
            }, 500);
            break;
          }
        }
        await tf.nextFrame();
      }
    },
    playAgain() {
      this.score = 0
      this.play()
    },
    //生成从minNum到maxNum的随机数
    randomNum(minNum, maxNum) {
      switch (arguments.length) {
        case 1:
          return parseInt(Math.random() * minNum + 1, 10);
          break;
        case 2:
          return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
          break;
        default:
          return 0;
          break;
      }
    }

  }
}
</script>

<style scoped>
video {
  margin: 0 auto;
  /*border: 1px solid var(--purple);*/
  /*!*padding: 0 40px;*!*/
  /*border-radius: 200px;*/
  /*background-color: var(--pink);*/
}

button {
  margin: 0 1rem;
}

#app {
  display: flex;
  margin-top: 3rem;
}

#app section {
  flex: 1;
  text-align: center;
}

.console {
  color: var(--purple);
}
</style>