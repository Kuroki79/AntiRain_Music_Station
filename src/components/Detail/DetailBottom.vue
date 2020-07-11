<template>
  <ul class="detail-bottom">
    <li class="bottom-top" @click="selectAllMusic">
      <div class="bottom-icon"></div>
      <div class="bottom-title">播放全部</div>
    </li>
    <li v-for="value in songList" :key="value.id" :class="{ 'item': true }" @click="selectMusic(value.id)">
      <h3>{{ value.name }}</h3>
      <p>{{ value.al.name }} - {{ value.ar[0].name }}</p>
    </li>
  </ul>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'DetailBottom',
  data: function () {
    return {
      songList: {}
    };
  },
  props: {
    playlist: {
      type: Array,
      default: () => [],
      required: true
    },
    isLotSong: {
      type: Boolean,
      default: false,
      required: false
    }
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
      if (!this.isLotSong) {
        // console.log(id);
        this.setSongDetail({ ids: [id], flag: false });
      }
      // 将播放单个歌曲的标识设置为true（通过这个flag来告诉Player当用户单击歌曲的时候应该同时播放歌曲）
      this.setPlayOwn(true);
    },
    // 播放全部歌曲
    selectAllMusic () {
      this.setFullScreen(true);
      // console.log(this.playlist);
      // console.log(this.isLotSong);
      if (!this.isLotSong) {
        // 遍历播放列表并取出每个歌曲的ID信息保存到ids中
        // console.log(this.songList);
        const ids = this.songList.map(function (item) {
          // console.log(item);
          return item.id;
        });
        // console.log(ids);
        // 获取的歌曲信息交给setSongDetail处理
        this.setSongDetail({ ids: ids, flag: false });
      }
      // 将播放全部的标识设置为true（通过这个flag来告诉Player当用户单击播放全部的时候应该同时播放歌曲）
      this.setPlayAll(true);
    }
  },
  watch: {
    getSongs: function (newValue, oldValue) {
      this.$nextTick(() => {
        if (this.isLotSong) {
          // console.log(newValue);
          this.songList = newValue;
        }
      });
    },
    playlist: function (newValue, oldValue) {
      this.$nextTick(() => {
        if (!this.isLotSong) {
          // console.log(newValue);
          this.songList = newValue;
        }
      });
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
