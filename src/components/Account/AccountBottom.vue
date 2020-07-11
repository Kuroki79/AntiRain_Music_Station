<template>
    <div class="account-bottom">
      <div class="bottom-play">
        <span></span>
        <span @click="selectAllMusic">播放全部</span>
      </div>
      <div class="bottom-wrapper">
        <BScrollView>
          <SongListItem :new-songs="switchNum === 0 ? getFavoriteList : getHistoryList"></SongListItem>
        </BScrollView>
      </div>
    </div>
</template>

<script>
// import ScrollView from '../ScrollView';
import BScrollView from '../BScrollView';
import SongListItem from '../SongListItem';
import { mapGetters, mapActions, mapMutations } from 'vuex';
export default {
  name: 'AccountBottom',
  components: {
    // ScrollView,
    SongListItem,
    BScrollView
  },
  methods: {
    ...mapActions([
      'setFullScreen',
      'setSongDetail',
      'setCurrentIndex',
      'setPlayAll'
    ]),
    ...mapMutations([
      'SET_SONG_DETAIL'
    ]),
    // 播放全部歌曲
    selectAllMusic () {
      // let ids = [];
      if (this.switchNum === 0) {
        // 遍历播放列表并取出每个歌曲的ID信息保存到ids中
        // ids = this.getFavoriteList.map(function (item) {
        //   return item.id;
        // });
        this.SET_SONG_DETAIL({ list: this.getFavoriteList, flag: false });
      } else {
        // 遍历播放列表并取出每个歌曲的ID信息保存到ids中
        // ids = this.getHistoryList.map(function (item) {
        //   return item.id;
        // });
        this.SET_SONG_DETAIL({ list: this.getHistoryList, flag: false });
      }
      this.setFullScreen(true);
      this.setPlayAll(true);
      this.setCurrentIndex(0);
    }
  },
  computed: {
    ...mapGetters([
      'getFavoriteList',
      'getHistoryList'
    ])
  },
  props: {
    switchNum: {
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
.account-bottom{
  position: fixed;
  top: 100px;
  bottom: 0;
  left: 0;
  right: 0;
  .bottom-play{
    width: 260px;
    height: 60px;
    margin: 20px auto;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #fff;
    @include border_color();
    border-radius: 30px;
    span{
      display: inline-block;
      &:nth-of-type(1){
        width: 46px;
        height: 46px;
        @include bg-img('../../assets/images/small_play');
        margin-right: 20px;
      }
    }
  }
  .bottom-wrapper{
    position: fixed;
    top: 200px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
  }
}
</style>
