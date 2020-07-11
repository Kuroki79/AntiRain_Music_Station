<template>
  <ul class="song-list">
    <li v-for="value in newSongs" :key="value.id" class="item" @click="selectMusic(value.id)">
      <img v-lazy="value.al.picUrl" alt="">
      <div>
        <h3>{{ value.name }}</h3>
        <p>{{ value.singer }}</p>
      </div>
    </li>
  </ul>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'SongListItem',
  methods: {
    ...mapActions([
      'setFullScreen',
      'setSongDetail',
      'setPlayOwn'
    ]),
    selectMusic (id) {
      // 单击音乐时显示普通播放界面
      this.setFullScreen(true);
      this.setSongDetail({ ids: [id], flag: false });
      this.setPlayOwn(true);
    }
  },
  props: {
    // 接收最新歌曲数据
    newSongs: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  created () {
    // console.log(this.newSongs);
  }
};
</script>

<style scoped lang="scss">
  @import "../assets/css/variable";
  @import "../assets/css/mixin";
  .song-list {
    width: 100%;
    .item {
      display: flex;
      height: 200px;
      align-items: center;
      padding: 0 20px;
      margin-bottom: 20px;
      border-bottom: 1px solid #ccc;
      img{
        width: 150px;
        height: 150px;
        border-radius: 20px;
        margin-right: 20px;
      }
      div{
        h3{
          width: 100%;
          @include font_size($font_large);
          @include font_color();
          @include no-wrap();
        }
        p{
          @include font_size($font_small);
          @include font_color();
          @include no-wrap();
          opacity: 0.6;
          margin-top: 20px;
        }
      }
    }
  }
</style>
