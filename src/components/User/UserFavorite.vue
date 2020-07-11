<template>
  <div class="user-favorite">
    <div class="favorite-top">
      <h3>个人歌单</h3>
    </div>
    <div class="favorite-list">
      <BScrollView>
        <ul>
          <li class="item" v-for="value in userPlayList" :key="value.id" @click.stop="selectItem(value.id)">
            <img v-lazy="value.coverImgUrl" alt="">
            <p>{{ value.name }}</p>
          </li>
        </ul>
      </BScrollView>
    </div>
  </div>
</template>

<script>
import BScrollView from '../BScrollView';
export default {
  name: 'UserFavorite',
  methods: {
    selectItem (id) {
      this.$emit('fatherSelectItem', id);
    }
  },
  props: {
    userPlayList: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  components: {
    BScrollView
  }
};
</script>

<style scoped lang="scss">
  @import "../../assets/css/variable";
  @import "../../assets/css/mixin";
.user-favorite{
  @include bg_sub_color();
  .favorite-top{
    width: 100%;
    height: 84px;
    line-height: 84px;
    @include bg_sub_color();
    border-bottom: 1px solid #ccc;
    padding: 0 20px;
    h3{
      @include font_size($font_large);
      font-weight: bold;
      @include font_color();
    }
  }
  .favorite-list{
    overflow: hidden;
    position: fixed;
    left: 0;
    right: 0;
    top: 480px;
    bottom: 0;
    ul{
      width: 100%;
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      padding: 20px 0;
      .item{
        width: 200px;
        padding-bottom: 20px;
        img{
          width: 200px;
          height: 200px;
          border-radius: 20px;
          margin-bottom: 10px;
        }
        p{
          @include clamp(2);
          @include font_color();
          @include font_size($font_medium_s);
          text-align: center;
        }
      }
    }
  }
}
</style>
