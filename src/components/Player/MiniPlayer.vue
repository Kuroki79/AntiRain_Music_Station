<template>
  <transition
    :css="false"
    v-on:enter="enter"
    v-on:leave="leave"
  >
    <div class="mini-player" v-show="this.getMiniScreen">
      <div class="player-wrapper">
        <div class="player-left" @click="showNormalPlayer">
          <img :src="getCurrentSong.al.picUrl" alt="" ref="cd">
          <div class="player-title">
            <h3>{{ getCurrentSong.name }}</h3>
            <p>{{ getCurrentSong.singer }}</p>
          </div>
        </div>
        <div class="player-right">
          <div class="play" @click="play" ref="play"></div>
          <div class="list" @click.stop="showList"></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Velocity from 'velocity-animate';
import 'velocity-animate/velocity.ui';
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'MiniPlayer',
  methods: {
    ...mapActions([
      'setFullScreen',
      'setMiniPlayer',
      'setPlaying',
      'setMiniList'
    ]),
    showList () {
      // 调用父组件Player的showList，然后showList调用迷你播放器歌曲列表的显示方法
      // 经由父组件将方法传递给同级组件的MiniPlayerList
      // this.$emit('showList');
      // 操作全局数据
      this.setMiniList(true);
    },
    showNormalPlayer () {
      this.setFullScreen(true);
      this.setMiniPlayer(false);
    },
    enter (el, done) {
      // 利用Velocity执行动画
      Velocity(el, 'transition.bounceUpIn', { duration: 800 }, function () {
        // 当动画结束时告知Vue动画执行完毕
        done();
      });
    },
    leave (el, done) {
      // 利用Velocity执行动画
      Velocity(el, 'transition.bounceDownOut', { duration: 800 }, function () {
        // 当动画结束时告知Vue动画执行完毕
        done();
      });
    },
    play () {
      // 将播放状态取反
      this.setPlaying(!this.getPlaying);
    }
  },
  computed: {
    ...mapGetters([
      'getMiniScreen',
      'getPlaying',
      'getCurrentSong'
    ])
  },
  watch: {
    // 监听播放状态
    getPlaying (newValue, oldValue) {
      if (newValue) {
        // 当播放被改动时（newValue不为undefined，说明按钮被单击了）
        // 给相应元素添加类名切换图片和执行动画
        this.$refs.play.classList.add('active');
        this.$refs.cd.classList.add('active');
      } else {
        // 否则就删除类名将元素切换回原来的状态
        this.$refs.play.classList.remove('active');
        this.$refs.cd.classList.remove('active');
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../assets/css/variable";
@import "../../assets/css/mixin";
  .mini-player{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 150px;
    @include bg_color();
    .player-wrapper{
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .player-left{
        display: flex;
        padding-left: 30px;
        img{
          width: 100px;
          height: 100px;
          border-radius: 50%;
          margin-right: 20px;
          animation: sport 4s linear infinite;
          animation-play-state: paused;
          &.active{
            animation-play-state: running;
          }
        }
        .player-title{
          display: flex;
          flex-direction: column;
          justify-content: center;
          color: #fff;
          h3{
            @include font_size($font_medium);
          }
          p{
            @include font_size($font_medium_s);
          }
        }
      }
      .player-right{
        display: flex;
        align-items: center;
        .play{
          width: 84px;
          height: 84px;
          @include bg_img('../../assets/images/play');
          &.active{
            @include bg_img('../../assets/images/pause');
          }
        }
        .list{
          margin-left: 20px;
          width: 120px;
          height: 120px;
          @include bg_img('../../assets/images/list');
        }
      }
    }
  }
@keyframes sport {
  from{
    transform: rotate(0deg);
  }
  to{
    transform: rotate(360deg);
  }
}
</style>
