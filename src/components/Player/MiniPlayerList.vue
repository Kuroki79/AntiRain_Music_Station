<template>
  <transition
    :css="false"
    v-on:enter="enter"
    v-on:leave="leave"
    >
    <div class="list-player" v-show="this.getShowMiniList">
      <div class="list-wrapper">
        <div class="player-top">
          <div class="top-left">
            <div class="mode loop" @click="mode" ref="mode"></div>
            <p v-if="this.getModeType === 0">顺序播放</p>
            <p v-else-if="this.getModeType === 1">单曲循环</p>
            <p v-else>随机播放</p>
          </div>
          <div class="top-right">
            <div class="del" @click="delAll"></div>
          </div>
        </div>
        <div class="player-middle">
          <BScrollView ref="scrollView">
            <ul ref="play">
              <li class="item" v-for="(value, index) in getSongs" :key="value.id" @click="selectMusic(index)">
                <div class="item-left">
                  <div class="item-play" @click.stop="play" v-show="getCurrentIndex === index"></div>
                  <p>{{ value.name }}</p>
                </div>
                <div class="item-right">
                  <div class="item-favorite" @click.stop="favorite(value)" :class="{'active': isFavorite(value)}"></div>
                  <div class="item-del" @click.stop="del(index)"></div>
                </div>
              </li>
            </ul>
          </BScrollView>
        </div>
        <div class="player-bottom">
          <p @click.stop="hidden">关闭</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Velocity from 'velocity-animate';
import 'velocity-animate/velocity.ui';
// import ScrollView from '../ScrollView';
import BScrollView from '../BScrollView';
import modeType from '../../store/modeType';
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'MiniPlayerList',
  components: {
    // ScrollView
    BScrollView
  },
  methods: {
    ...mapActions([
      'setPlaying',
      'setModeType',
      'setMiniList',
      'setDelSong',
      'setCurrentIndex',
      'setFavoriteSong'
    ]),
    show () {
      this.isShow = true;
    },
    hidden () {
      this.setMiniList(false);
    },
    enter (el, done) {
      Velocity(el, 'transition.perspectiveUpIn', { duration: 800 }, function () {
        done();
      });
    },
    leave (el, done) {
      Velocity(el, 'transition.perspectiveUpOut', { duration: 800 }, function () {
        done();
      });
    },
    play () {
      this.setPlaying(!this.getPlaying);
    },
    mode () {
      // 判断当前模式属于哪一种，然后按照顺序修改全局数据中的模式
      if (this.getModeType === modeType.loop) {
        this.setModeType(modeType.one);
      } else if (this.getModeType === modeType.one) {
        this.setModeType(modeType.random);
      } else if (this.getModeType === modeType.random) {
        this.setModeType(modeType.loop);
      }
    },
    // 删除单个歌曲
    del (index) {
      this.setDelSong(index);
    },
    // 删除所有歌曲
    delAll () {
      this.setDelSong();
    },
    selectMusic (index) {
      this.setCurrentIndex(index);
    },
    isFavorite (song) {
      // 遍历收藏列表寻找当前歌曲是否有对应的
      const result = this.getFavoriteList.find(function (currentValue) {
        return currentValue.id === song.id;
      });
      // 倘若没有对应的歌曲就说明收藏列表中没有这首歌，所以返回false，有则返回true
      return result !== undefined;
    },
    favorite (song) {
      // 将当前歌曲添加到收藏列表中
      this.setFavoriteSong(song);
    }
  },
  computed: {
    ...mapGetters([
      'getPlaying',
      'getModeType',
      'getShowMiniList',
      'getSongs',
      'getCurrentIndex',
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
      // 判断模式属于哪一种，然后按照顺序切换元素的类名
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
    // 监听迷你播放器列表的显示和隐藏
    getShowMiniList (newValue, oldValue) {
      // 组件刚创建时数据就被创建了，但是刚创建时组件还有显示出来，没有显示出来就没有高度，
      // 没有高度，BScroll就不能计算滚动范围
      // 当迷你播放列表显示时，刷新BScroll组件以获取最大滚动的范围
      if (newValue) {
        this.$refs.scrollView.refresh();
      }
    }
  }
};
</script>

<style scoped lang="scss">
  @import "../../assets/css/variable";
  @import "../../assets/css/mixin";

  .list-player {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    @include bg_sub_color();

    .list-wrapper {
      .player-top {
        width: 100%;
        height: 100px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .top-left {
          display: flex;
          align-items: center;
          padding-left: 20px;
          .mode {
            width: 56px;
            height: 56px;
            margin-right: 20px;
            &.loop{
              @include bg_img('../../assets/images/small_loop');
            }
            &.one{
              @include bg_img('../../assets/images/small_one');
            }
            &.random{
              @include bg_img('../../assets/images/small_shuffle');
            }
          }
          p{
            @include font_size($font_medium_s);
            @include font_color();
          }
        }

        .top-right {
          .del{
            width: 84px;
            height: 84px;
            @include bg_img('../../assets/images/small_del');
          }
        }
      }
      .player-middle{
        height: 700px;
        overflow: hidden;
        ul{
          &.active{
            .item{
              .item-play{
                @include bg-img('../../assets/images/small_pause');
              }
            }
          }
        }
        .item{
          border-top: 1px solid #ccc;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 100px;
          padding: 0 20px;
          box-sizing: border-box;
          .item-left{
            display: flex;
            align-items: center;
            .item-play{
              width: 56px;
              height: 56px;
              margin-right: 20px;
              @include bg-img('../../assets/images/small_play');
            }
            p{
              @include font_size($font_medium_s);
              @include font_color();
            }
          }
          .item-right{
            display: flex;
            align-items: center;
            .item-favorite{
              width: 56px;
              height: 56px;
              @include bg_img('../../assets/images/small_un_favorite');
              &.active{
                @include bg_img('../../assets/images/small_favorite');
              }
            }
            .item-del{
              width: 52px;
              height: 52px;
              margin-left: 20px;
              @include bg_img('../../assets/images/small_close');
            }
          }
        }
      }
      .player-bottom{
        width: 100%;
        height: 100px;
        line-height: 100px;
        @include bg_color();
        p{
          text-align: center;
          color: #fff;
          @include font_size($font_medium);
        }
      }
    }
  }
</style>
