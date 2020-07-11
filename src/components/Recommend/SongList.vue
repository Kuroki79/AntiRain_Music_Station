<template>
    <div class="song">
      <div class="song-top">
        <h3>最新音乐</h3>
      </div>
      <SongListItem :newSongs="newSongs"></SongListItem>
    </div>
</template>

<script>
import SongListItem from '../SongListItem';
export default {
  name: 'SongList',
  props: {
    // 接收最新歌曲数据
    newSongs: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  components: {
    SongListItem
  }
};
</script>

<style scoped lang="scss">
  @import "../../assets/css/variable";
  @import "../../assets/css/mixin";
  .song {
    width: 100%;
    @include bg_sub_color();

    .song-top {
      width: 100%;
      height: 84px;
      line-height: 84px;
      @include bg_sub_color();
      border-bottom: 1px solid #ccc;
      padding: 0 20px;

      h3 {
        @include font_size($font_large);
        font-weight: bold;
        @include font_color();
      }
    }
  }
</style>
