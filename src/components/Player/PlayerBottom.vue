<template>
    <div class="player-bottom">
      <div class="bottom-progress">
        <span ref="eleCurrentTime">00:00</span>
        <div class="progress-bar" @click="progressClick" ref="progressBar">
          <div class="progress-line" ref="progressLine">
            <div class="progress-dot"></div>
          </div>
        </div>
        <span ref="eleTotalTime">00:00</span>
      </div>
      <div class="bottom-control">
        <div class="mode loop" @click="mode" ref="mode"></div>
        <div class="prev" @click="prev"></div>
        <div class="play" @click="play" ref="play"></div>
        <div class="next" @click="next"></div>
        <div class="favorite" @click="favorite" :class="{'active': isFavorite(getCurrentSong)}"></div>
        <div class="volume volume-3" @click="volumeClick" ref="volume"></div>
      </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import modeType from '../../store/modeType';
import { formartTime } from '../../tools/tools';

export default {
  name: 'PlayerBottom',
  data: function () {
    return {
      volumeGrade: [0, 0.25, 0.5, 1],
      currentVolumeNum: 0
    };
  },
  methods: {
    ...mapActions([
      'setPlaying',
      'setModeType',
      'setCurrentIndex',
      'setCurrentTime',
      'setFavoriteSong',
      'setAudioVolume'
    ]),
    play () {
      this.setPlaying(!this.getPlaying);
    },
    mode () {
      if (this.getModeType === modeType.loop) {
        this.setModeType(modeType.one);
      } else if (this.getModeType === modeType.one) {
        this.setModeType(modeType.random);
      } else if (this.getModeType === modeType.random) {
        this.setModeType(modeType.loop);
      }
    },
    prev () {
      // 如果显示了警告信息就不允许切换歌曲
      if (this.isShowWarning) { return; }
      this.setCurrentIndex(this.getCurrentIndex - 1);
    },
    next () {
      // 如果显示了警告信息就不允许切换歌曲
      if (this.isShowWarning) { return; }
      this.setCurrentIndex(this.getCurrentIndex + 1);
    },
    progressClick (e) {
      // 1.计算进度条的位置
      // const normalLeft = e.target.offsetLeft;
      // 解决单击进度条进度跳转的位置不对的问题：往当前进度前面单击的时候，单击的不是背景，而是前景，所以e.target获取的就是前景
      const normalLeft = this.$refs.progressBar.offsetLeft;
      console.log(normalLeft);
      const eventLeft = e.pageX;
      const clickLeft = eventLeft - normalLeft;
      // const progressWidth = e.target.offsetWidth;
      const progressWidth = this.$refs.progressBar.offsetWidth;
      const value = clickLeft / progressWidth;
      this.$refs.progressLine.style.width = value * 100 + '%';

      // 2.计算当前应该从什么地方开始播放
      const currentTime = this.totalTime * value;
      // console.log(currentTime);
      this.setCurrentTime(currentTime);
    },
    volumeClick () {
      // 根据索引获取对应的数值赋值给音量
      this.setAudioVolume(this.volumeGrade[this.currentVolumeNum]);
      // 根据索引改变音量图标
      if (this.currentVolumeNum === 0) {
        this.$refs.volume.className = 'volume volume-mute';
      } else if (this.currentVolumeNum === 1) {
        this.$refs.volume.className = 'volume volume-1';
      } else if (this.currentVolumeNum === 2) {
        this.$refs.volume.className = 'volume volume-2';
      } else if (this.currentVolumeNum === 3) {
        this.$refs.volume.className = 'volume volume-3';
      }
      this.currentVolumeNum++;
      // 当索引大于数组长度时，从0开始递增
      if (this.currentVolumeNum > this.volumeGrade.length - 1) {
        this.currentVolumeNum = 0;
      }
    },
    isFavorite (song) {
      // console.log(this.getFavoriteList);
      const result = this.getFavoriteList.find(function (currentValue) {
        return currentValue.id === song.id;
      });
      return result !== undefined;
    },
    favorite () {
      this.setFavoriteSong(this.getCurrentSong);
    }
  },
  computed: {
    ...mapGetters([
      'getPlaying',
      'getModeType',
      'getCurrentIndex',
      'getCurTime',
      'getCurrentSong',
      'getFavoriteList'
    ])
  },
  watch: {
    getPlaying (newValue, oldValue) {
      if (newValue) {
        this.$refs.play.classList.add('active');
      } else {
        this.$refs.play.classList.remove('active');
      }
    },
    getModeType (newValue, oldValue) {
      if (newValue === modeType.loop) {
        this.$refs.mode.classList.remove('random');
        this.$refs.mode.classList.add('loop');
      } else if (newValue === modeType.one) {
        this.$refs.mode.classList.remove('loop');
        this.$refs.mode.classList.add('one');
      } else if (newValue === modeType.random) {
        this.$refs.mode.classList.remove('one');
        this.$refs.mode.classList.add('random');
      }
    },
    totalTime (newValue, oldValue) {
      const time = formartTime(newValue);
      this.$refs.eleTotalTime.innerHTML = time.minute + ':' + time.second;
    },
    currentTime (newValue, oldValue) {
      // 1.格式化当前播放的时间
      const time = formartTime(newValue);
      this.$refs.eleCurrentTime.innerHTML = time.minute + ':' + time.second;
      // 2.根据当前播放的时间计算比例
      const value = newValue / this.totalTime * 100;
      this.$refs.progressLine.style.width = value + '%';
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
  .player-bottom{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    .bottom-progress{
      width: 80%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span{
        @include font_size($font_small);
        //@include font_color();
        color: #fff;
      }
      .progress-bar{
        width: 100%;
        margin: 0 10px;
        height: 10px;
        background: #ccc;
        border-radius: 10px;
        .progress-line{
          width: 0%;
          height: 100%;
          background: #fff;
          border-radius: 10px;
          position: relative;
          .progress-dot{
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #fff;
            position: absolute;
            left: 97%;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
    }
    .bottom-control{
      width: 80%;
      margin: 0 auto;
      padding: 50px 100px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      div{
        width: 84px;
        height: 84px;
      }
      .mode{
        &.loop{
          @include bg_img('../../assets/images/loop');
        }
        &.one{
          @include bg_img('../../assets/images/one');
        }
        &.random{
          @include bg_img('../../assets/images/shuffle');
        }
      }
      .prev{
        @include bg_img('../../assets/images/prev');
      }
      .play{
        @include bg_img('../../assets/images/play');
        &.active{
          @include bg_img('../../assets/images/pause');
        }
      }
      .next{
        @include bg_img('../../assets/images/next');
      }
      .favorite{
        @include bg_img('../../assets/images/un_favorite');
        &.active{
          @include bg_img('../../assets/images/favorite');
        }
      }
      .volume{
        &.volume-mute{
          @include bg_img('../../assets/images/volume_mute');
        }
        &.volume-1{
          @include bg_img('../../assets/images/volume_1');
        }
        &.volume-2{
          @include bg_img('../../assets/images/volume_2');
        }
        &.volume-3{
          @include bg_img('../../assets/images/volume_3');
        }
      }
    }
  }
</style>
