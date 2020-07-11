<template>
  <swiper :options="swiperOption" class="banner">
    <!-- slides -->
    <swiper-slide class="cd">
      <div class="cd-warpper" ref="cdWrapper">
        <img :src="getCurrentSong.al.picUrl" alt="">
      </div>
      <p>{{ getFirstLyric() }}</p>
    </swiper-slide>
    <swiper-slide class="lyric" ref="lyric">
      <BScrollView ref="scrollView">
        <ul>
          <li v-for="(value, key) in getCurrentLyric" :key="key" :class="{'active': currentLineNum === key}">{{ value | exclusion }}</li>
        </ul>
      </BScrollView>
    </swiper-slide>
    <!-- Optional controls -->
    <div class="swiper-pagination"  slot="pagination"></div>
  </swiper>
</template>

<script>
import BScrollView from '../BScrollView';
import 'swiper/dist/css/swiper.css';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import { mapGetters } from 'vuex';
export default {
  name: 'PlayerMiddle',
  data: function () {
    return {
      swiperOption: {
        // 所有的参数同 swiper 官方 api 参数
        // 如果需要分页器
        pagination: {
          el: '.swiper-pagination',
          bulletClass: 'my-bullet',
          bulletActiveClass: 'my-bullet-active'
        },
        observer: true,
        observeParents: true,
        observeSlideChildren: true
      },
      currentLineNum: '0',
      lastLyricTime: null
    };
  },
  components: {
    swiper,
    swiperSlide,
    BScrollView
  },
  computed: {
    ...mapGetters([
      'getPlaying',
      'getCurrentSong',
      'getCurrentLyric'
    ])
  },
  filters: {
    // 排除isScroll的输出
    exclusion: (value) => {
      if (typeof value === 'boolean') {
        return '';
      } else {
        return value;
      }
    }
  },
  watch: {
    getPlaying (newValue, oldValue) {
      if (newValue) {
        // 音乐播放时为元素添加类名，专辑封面执行动画
        this.$refs.cdWrapper.classList.add('active');
      } else {
        // 否则就删除添加的类名
        this.$refs.cdWrapper.classList.remove('active');
      }
    },
    // 监听当前播放时间
    currentTime (newValue, oldValue) {
      // console.log(newValue);
      /*
      // 1.高亮歌词同步
      const lineNum = Math.floor(newValue) + '';
      // 取出对应的歌词
      const result = this.getCurrentLyric[lineNum];
      // console.log(result);
      // console.log(this.getCurrentLyric);
      // 如果有对应的歌词
      if (result !== undefined && result !== '') {
        // 更改lineNum
        this.currentLineNum = lineNum;
        // 只有当歌词行号发生改变了才同步歌词的滚动
        // 2.歌词滚动同步
        const currentLyricTop = document.querySelector('li.active').offsetTop;
        const lyricHeight = this.$refs.lyric.$el.offsetHeight;
        // console.log(lyricHeight);
        // console.log(currentLyricTop);
        // console.log(document.querySelector('li.active'));
        if (currentLyricTop > lyricHeight / 2) {
          // console.log('开始滚动');
          this.$refs.scrollView.scrollTo(0, lyricHeight / 2 - currentLyricTop, 100);
        }
      }
      // 否则就不更改lineNum
       */
      // console.log(this.getCurrentLyric.isScroll);
      // console.log(this.getCurrentLyric);
      // console.log(Math.floor(newValue), parseInt(this.lastLyricTime));
      // 判断歌词是否支持滚动，同时当前播放时间必须得小于歌词最大支持的时间
      if (this.getCurrentLyric.isScroll && Math.floor(newValue) <= parseInt(this.lastLyricTime)) {
        const lineNum = Math.floor(newValue) + '';
        this.currentLineNum = this.getActiveLineNum(lineNum);
        // 2.歌词滚动同步
        const currentLyricTop = document.querySelector('li.active').offsetTop;
        const lyricHeight = this.$refs.lyric.$el.offsetHeight;
        // console.log(currentLyricTop, lyricHeight / 2);
        if (currentLyricTop > lyricHeight / 2) {
          this.$refs.scrollView.scrollTo(0, lyricHeight / 2 - currentLyricTop, 100);
        } else {
          // 解决歌词滚动回退的问题：当歌词列表的滚动距离小于歌词列表的一半时，复位滚动距离
          this.$refs.scrollView.scrollTo(0, 0, 100);
        }
      }
    },
    // 监听歌词
    getCurrentLyric (newValue, oldValue) {
      let lastLyricTime = null;
      // 遍历歌词取出最后一个歌词的时间
      for (const key in newValue) {
        // 当遍历到isScroll属性时跳出循环
        if (key === 'isScroll') { break; }
        lastLyricTime = key;
      }
      this.lastLyricTime = lastLyricTime;
      // 遍历歌词取出第一个歌词的时间
      for (const key in newValue) {
        // 判断歌词是否支持滚动
        if (this.getCurrentLyric.isScroll) {
          // 取出第一个key(歌词时间)存放到currentLineNum中
          this.currentLineNum = key;
        }
        // 跳出方法
        return;
      }
    }
  },
  methods: {
    getFirstLyric () {
      for (const key in this.getCurrentLyric) {
        return this.getCurrentLyric[key];
      }
    },
    getActiveLineNum (lineNum) {
      if (lineNum < 0) {
        return this.currentLineNum;
      }
      // 取得相应的歌词
      const result = this.getCurrentLyric[lineNum + ''];
      // console.log(result);
      // 判断取得的歌词是否为undefined或者为空
      if (result === undefined || result === '') {
        // 如果条件成立，就将行号减一
        lineNum--;
        // 然后再将减一之后的lineNum传给这个方法，形成递归
        return this.getActiveLineNum(lineNum);
      } else {
        // 不成立就将行号变成字符串返回出去
        return lineNum + '';
      }
    }
  },
  props: {
    currentTime: {
      type: Number,
      default: 0,
      required: true
    }
  }
};
</script>

<style scoped lang="scss">
  @import "../../assets/css/variable";
  @import "../../assets/css/mixin";
  .banner{
    position: fixed;
    top: 150px;
    bottom: 250px;
    right: 0;
    left: 0;
    .cd{
      .cd-warpper{
        display: block;
        margin: 0 auto;
        width: 500px;
        height: 500px;
        border-radius: 50%;
        border: 30px solid #fff;
        overflow: hidden;
        animation: sport 4s linear infinite;
        animation-play-state: paused;
        &.active{
          animation-play-state: running;
        }
        img{
          width: 100%;
          height: 100%;
        }
      }
      p{
        text-align: center;
        @include font_size($font_medium);
        @include font_color();
        margin-top: 50px;
      }
    }
    .lyric{
      li{
        text-align: center;
        @include font_size($font_medium);
        @include font_color();
        margin: 10px 0;
        &:last-of-type{
          padding-bottom: 50%;
        }
        &.active{
          color: #fff;
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

<style lang="scss">
  @import "../../assets/css/mixin";
  .banner{
    .my-bullet{
      display: inline-block;
      width: 20px;
      height: 20px;
      border-radius: 10px;
      background: #fff;
      margin: 0 20px;
    }

    .my-bullet-active{
      @include bg_color();
      width: 60px;
    }
  }
</style>
