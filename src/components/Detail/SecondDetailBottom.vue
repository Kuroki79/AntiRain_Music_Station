<template>
  <ul class="detail-bottom">
    <li class="bottom-top" @click="selectAllMusic">
      <div class="bottom-icon"></div>
      <div class="bottom-title">播放全部</div>
    </li>
    <!--<li v-for="value in playlist" :key="value.id" :class="{ 'item': true }" @click="selectMusic(value.id)">
      <h3>{{ value.name }}</h3>
      <p>{{ value.al.name }} - {{ value.ar[0].name }}</p>
    </li>-->
    <li v-for="value in temp" :key="value.id" :class="{ 'item': true }" @click="selectMusic(value.id)">
      <h3>{{ value.name }}</h3>
      <p>{{ value.al.name }} - {{ value.ar[0].name }}</p>
    </li>
  </ul>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'DetailBottom',
  props: {
    playlist: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  data: function () {
    return {
      isLotSong: false,
      songIdList: [],
      temp: []
    };
  },
  computed: {
    ...mapGetters([
      'getSongs'
    ])
  },
  methods: {
    // 局部Actions：将action方法注册到this中
    ...mapActions([
      'setFullScreen',
      'setSongDetail',
      'setPlaying',
      'setPlayAll',
      'setPlayOwn'
    ]),
    // 播放单个歌曲
    selectMusic (id) {
      // this.$store.dispatch('setFullScreen', true);
      // 调用公共仓库（Vuex）的setFullScreen Action方法显示NormalPlayer组件
      this.setFullScreen(true);
      this.setSongDetail([id]);
      // 将播放单个歌曲的标识设置为true（通过这个flag来告诉Player当用户单击歌曲的时候应该同时播放歌曲）
      this.setPlayOwn(true);
    },
    // 播放全部歌曲
    selectAllMusic () {
      this.setFullScreen(true);
      console.log(this.playlist);
      // 判断歌曲信息是否需要分批处理
      if (this.isLotSong) {
        console.log('分批获取的歌曲');
      } else {
        console.log('直接获取的歌曲');
        // console.log(ids);
        // 获取的歌曲信息交给setSongDetail处理
        // this.setSongDetail({ ids: ids, flag: false });
        this.songIdList = this.playlist;
      }
      // 将播放全部的标识设置为true（通过这个flag来告诉Player当用户单击播放全部的时候应该同时播放歌曲）
      this.setPlayAll(true);
    }
  },
  watch: {
    playlist: function (newValue, oldValue) {
      console.log(newValue);
    }
  }
};
</script>

<style scoped lang="scss">
  @import "../../assets/css/variable";
  @import "../../assets/css/mixin";
  .detail-bottom{
    width: 100%;
    li{
      width: 100%;
      /*height: 100px;*/
      padding: 20px;
      box-sizing: border-box;
      @include bg_sub_color();
      border-bottom: 1px solid #ccc;
    }
    .bottom-top{
      display: flex;
      align-items: center;
      border-top-left-radius: 50px;
      border-top-right-radius: 50px;
      .bottom-icon{
        width: 60px;
        height: 60px;
        margin-right: 20px;
        @include bg_img('../../assets/images/small_play')
      }
      .bottom-title{
        @include font_size($font_large);
        @include font_color();
      }
    }
    .item{
      h3{
        @include font_color();
        @include font_size($font_medium);
      }
      p{
        @include font_color();
        @include font_size($font_small);
        margin-top: 10px;
        opacity: 0.8;
      }
    }
    .un-usable{
      color: #666666;
      background: black;
    }
  }
</style>
