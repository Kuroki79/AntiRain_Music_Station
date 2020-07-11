<template>
  <transition
    :css="false"
    v-on:enter="enter"
    v-on:leave="leave"
  >
    <div class="normal-player" v-show="this.getFullScreen">
      <div class="player-wrapper">
        <PlayerHeader></PlayerHeader>
        <PlayerMiddle :currentTime="currentTime"></PlayerMiddle>
        <PlayerBottom :totalTime="totalTime" :currentTime="currentTime" :isShowWarning="isShowWarning"></PlayerBottom>
      </div>
      <div class="player-bg">
        <img :src="getCurrentSong.al.picUrl" alt="">
      </div>
    </div>
  </transition>
</template>

<script>
import PlayerHeader from './PlayerHeader';
import PlayerMiddle from './PlayerMiddle';
import PlayerBottom from './PlayerBottom';
import Velocity from 'velocity-animate';
import 'velocity-animate/velocity.ui';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'NormalPlayer',
  components: {
    PlayerHeader,
    PlayerMiddle,
    PlayerBottom
  },
  methods: {
    ...mapActions([
      'setSongLyric'
    ]),
    enter (el, done) {
      Velocity(el, 'transition.shrinkIn', { duration: 800 }, function () {
        done();
      });
    },
    leave (el, done) {
      Velocity(el, 'transition.bounceDownOut', { duration: 800 }, function () {
        done();
      });
    }
  },
  computed: {
    // 局部getters：将getter方法注册到this中
    ...mapGetters([
      'getFullScreen',
      'getCurrentSong'
    ])
  },
  watch: {
    // 监视歌曲是否切换
    getCurrentSong (newValue, oldValue) {
      // console.log(newValue);
      // console.log(newValue);
      // 判断歌曲的id是否为空(保存的歌曲已经为空)
      if (newValue.id === '') {
        // 为空就直接跳出方法
        return;
      }
      // 否则就获取歌曲的歌词
      this.setSongLyric(newValue.id);
    }
  },
  props: {
    totalTime: {
      type: Number,
      default: 0,
      required: true
    },
    currentTime: {
      type: Number,
      default: 0,
      required: true
    },
    isShowWarning: {
      type: Boolean,
      default: false,
      required: true
    }
  }
};
</script>

<style scoped lang="scss">
  @import "../../assets/css/variable";
  @import "../../assets/css/mixin";
.normal-player{
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  @include bg_sub_color();
  .player-wrapper{
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
  .player-bg{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    img{
      height: 100%;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      filter: blur(10px);
    }
  }
}
</style>
