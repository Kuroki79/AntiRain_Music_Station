<template>
  <div class="player">
    <NormalPlayer :totalTime="totalTime" :currentTime="currentTime" :isShowWarning="isShowWarning"></NormalPlayer>
    <MiniPlayer></MiniPlayer>
    <MiniPlayerList ref="listPlayer"></MiniPlayerList>
    <audio :src="getCurrentSong.url" ref="audio" preload="auto" @timeupdate="timeupdate" @ended="end"></audio>
    <transition>
      <div class="warning-message" ref="warning" v-show="isShowWarning">
        <p>歌曲未授权或其他原因，导致无法播放！</p>
      </div>
    </transition>
  </div>
</template>

<script>
import NormalPlayer from '../components/Player/NormalPlayer';
import MiniPlayer from '../components/Player/MiniPlayer';
import MiniPlayerList from '../components/Player/MiniPlayerList';
import modeType from '../store/modeType';
import { getRandomIntInclusive, setLocalStorage, getLocalStorage } from '../tools/tools';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Player',
  components: {
    NormalPlayer,
    MiniPlayer,
    MiniPlayerList
  },
  data () {
    return {
      totalTime: 0,
      currentTime: 0,
      audioVolume: 1,
      isShowWarning: false
    };
  },
  methods: {
    ...mapActions([
      // 'setCurrentTime',
      'setCurrentIndex',
      'setFavoriteList',
      'setHistorySong',
      'setHistoryList',
      'setPlaying',
      'setPlayAll',
      'setPlayOwn'
    ]),
    timeupdate (e) {
      // console.log(e.target.currentTime);
      // this.setCurrentTime(e.target.currentTime);
      this.currentTime = e.target.currentTime;
    },
    end () {
      // console.log('end');
      if (this.getModeType === modeType.loop) {
        this.setCurrentIndex(this.getCurrentIndex + 1);
      } else if (this.getModeType === modeType.one) {
        this.$refs.audio.play();
      } else if (this.getModeType === modeType.random) {
        const index = getRandomIntInclusive(0, this.getSongs.length - 1);
        this.setCurrentIndex(index);
      }
    }
  },
  computed: {
    ...mapGetters([
      'getCurrentSong',
      'getPlaying',
      'getCurrentIndex',
      'getCurTime',
      'getModeType',
      'getSongs',
      'getFavoriteList',
      'getHistoryList',
      'getAudioVolume',
      'getPlayAll',
      'getPlayOwn'
    ])
  },
  watch: {
    getPlaying (newValue, oldValue) {
      // console.log(this.getCurrentSong);
      if (newValue) {
        // 将歌曲添加到历史列表中
        this.setHistorySong(this.getCurrentSong);
        // console.log(this.getCurrentSong.usable);
        // 判断歌曲是否可用
        if (this.getCurrentSong.usable) {
          // 然后使audio元素播放歌曲
          this.$refs.audio.play();
        } else {
          this.$refs.audio.pause();
          // 显示警告信息
          this.isShowWarning = true;
          // 判断timer是否存在
          // eslint-disable-next-line no-use-before-define
          if (timer) {
            console.log('停止计时器');
            // 存在就停止上一个定时器
            // eslint-disable-next-line no-use-before-define
            clearTimeout(timer);
          }
          // 创建一个3秒的定时器
          var timer = setTimeout(() => {
            // 3秒之后隐藏警告信息
            this.isShowWarning = false;
          }, 3000);
        }
      } else {
        this.$refs.audio.pause();
      }
    },
    // 监听歌曲切换时
    getCurrentIndex (newValue, oldValue) {
      /*
        * 注意点：在IOS系统中不会自动加载歌曲，所以oncanplay不会自动执行
        *        在PC端和Android端，系统会自动加载歌曲，所以oncanplay会自动被执行
        *
        * 解决方案：如何监听IOS中audio的歌曲是否已经准备好了，通过ondurationchange事件来监听
        *          ondurationchange事件什么时候执行：当歌曲加载完成之后执行，因为只有歌曲加载完成之后才能获取到歌曲的总时长
        * */
      // console.log(this.getCurrentSong);
      // console.log('歌曲切换');
      // 判断要播放的歌曲是否可用
      if (!this.getCurrentSong.usable) {
        // 不可用就暂停上一首正在播放的歌曲，将播放状态设置为暂停，然后跳出方法
        // console.log('歇逼');
        // 暂停播放
        this.$refs.audio.pause();
        // 显示警告信息
        this.isShowWarning = true;
        // 判断timer是否存在
        // eslint-disable-next-line no-use-before-define
        if (timer) {
          console.log('停止计时器');
          // 存在就停止上一个定时器
          // eslint-disable-next-line no-use-before-define
          clearTimeout(timer);
        }
        // 创建一个3秒的定时器
        var timer = setTimeout(() => {
          // 3秒之后隐藏警告信息
          this.isShowWarning = false;
          // 并切换到下一首歌
          this.setCurrentIndex(this.getCurrentIndex + 1);
        }, 3000);
        return;
      }
      // 监听audio是否可以播放了
      this.$refs.audio.ondurationchange = () => {
        // console.log('oncanplay');
        // 获取audio元素歌曲的总时长
        this.totalTime = this.$refs.audio.duration;
        // 判断播放状态
        if (this.getPlaying) {
          // 如果在播放状态下切换歌曲就将歌曲添加到历史列表中
          this.setHistorySong(this.getCurrentSong);
          console.log('播放歌曲');
          // 然后使audio元素播放歌曲
          this.$refs.audio.play();
        } else {
          // 否则就暂停歌曲
          this.$refs.audio.pause();
        }
      };
    },
    getCurTime (newValue, oldValue) {
      this.$refs.audio.currentTime = newValue;
    },
    getFavoriteList (newValue, oldValue) {
      setLocalStorage('favoriteList', newValue);
    },
    getHistoryList (newValue, oldValue) {
      setLocalStorage('historyList', newValue);
    },
    // 监听音量变化
    getAudioVolume (newValue, oldValue) {
      this.$refs.audio.volume = newValue;
    }
  },
  created () {
    const favoriteList = getLocalStorage('favoriteList');
    const historyList = getLocalStorage('historyList');
    if (favoriteList !== null) {
      this.setFavoriteList(favoriteList);
    }
    if (historyList !== null) {
      this.setHistoryList(historyList);
    }
  },
  mounted () {
    this.$refs.audio.ondurationchange = () => {
      this.totalTime = this.$refs.audio.duration;
      // console.log('歌曲可以播放了');
      // 当用户点击播放全部或单击歌曲的时候，立即播放音乐
      if (this.getPlayAll || this.getPlayOwn) {
        // console.log('播放全部');
        // 设置状态为播放
        this.setPlaying(true);
        // 播放歌曲
        this.$refs.audio.play();
        // 复位播放全部的flag
        this.setPlayAll(false);
      }
    };
  }
};
</script>

<style scoped lang="scss">
  @import '../assets/css/variable';
  @import '../assets/css/mixin';

  .warning-message {
    width: 50%;
    height: 100px;
    border: 1px solid #ccc;
    border-radius: 10px;
    @include bg_sub_color();
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 10px;
    p{
      @include font_color();
      @include font_size($font_medium)
    }
  }

  .v-enter {
    opacity: 0;
  }

  .v-enter-to {
    opacity: 1;
  }

  .v-enter-active {
    transition: all .6s;
  }

  .v-leave {
    opacity: 1;
  }

  .v-leave-to {
    opacity: 0;
  }

  .v-leave-active {
    transition: all .6s;
  }
</style>
