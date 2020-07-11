<template>
  <div class="rank">
    <!--将需要和顶部有间隙的元素放置到一个容器(给容器添加指定的样式)中，以解决IOS系统中头部(Header)的覆盖问题-->
    <!--原因：路由的出口在歌手界面中，而整个歌手界面设置了顶部的间隙（top: 184px），结果就导致跳转之后的界面也有顶部的间隙-->
    <div class="rank-wrapper">
      <BScrollView>
        <ul>
          <li v-for="(value, key) in category.titles" :key="key">
            <h3 class="group-title">{{ value }}</h3>
            <ul class="normal-group" v-if="value === '官方榜'">
              <li v-for="obj in category[key]" :key="obj.rank.id" @click.stop="selectedItem(obj.id)">
                <div class="rank-left">
                  <img v-lazy="obj.rank.coverImgUrl" alt="">
                  <p>{{ obj.rank.updateFrequency }}</p>
                </div>
                <div class="rank-right">
                  <p v-for="(song, index) in obj.rank.tracks" :key="song.first">{{ index }}. {{ song.first }}-{{ song.second }} </p>
                </div>
              </li>
            </ul>
            <ul class="other-group" v-else>
              <li v-for="obj in category[key]" :key="obj.rank.id" @click.stop="selectedItem(obj.id)">
                <div class="rank-top">
                  <img v-lazy="obj.rank.coverImgUrl" alt="">
                  <p>{{ obj.rank.updateFrequency }}</p>
                </div>
                <div class="rank-bottom">
                  <p>{{ obj.rank.name }}</p>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </BScrollView>
    </div>
    <transition>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { getTopListDetail } from '../api';
// import ScrollView from '../components/ScrollView';
import BScrollView from '../components/BScrollView';
import MetaInfo from '../../vue-meta-info';

export default {
  name: 'Rank',
  metaInfo: MetaInfo.rank,
  data: function () {
    return {
      category: {}
    };
  },
  methods: {
    selectedItem (id) {
      this.$router.push(`/rank/detail/${id}/rank`);
    }
  },
  components: {
    // ScrollView
    BScrollView
  },
  created () {
    // 获取排行榜数据
    getTopListDetail()
      .then((data) => {
        // console.log(data);
        this.category = data;
      })
      .catch(function (err) {
        console.log(err);
      });
  }
};
</script>

<style scoped lang="scss">
  @import "../assets/css/variable";
  @import "../assets/css/mixin";
  .rank{
    width: 100%;
    height: 100%;
    .rank-wrapper{
      position: fixed;
      left: 0;
      right: 0;
      top: 184px;
      bottom: 0;
      overflow: hidden;
      @include bg_sub_color();
    }
    .group-title{
      padding: 10px 20px;
      @include font_color();
      @include font_size($font_large);
      font-weight: bold;
    }
    .normal-group{
      li{
        display: flex;
        align-items: center;
        padding: 10px 20px;
        box-sizing: border-box;
        .rank-left{
          position: relative;
          img{
            width: 200px;
            height: 200px;
            border-radius: 10px;
          }
          p{
            position: absolute;
            left: 10px;
            bottom: 10px;
            color: #fff;
            @include font_size($font_medium_s);
          }
        }
        .rank-right{
          margin-right: 20px;
          p{
            @include font_color();
            @include font_size($font_medium_s);
            padding: 10px 10px;
          }
        }
      }
    }
    .other-group{
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      li{
        padding: 10px 20px;
        box-sizing: border-box;
        .rank-top{
          position: relative;
          img{
            width: 200px;
            height: 200px;
            border-radius: 10px;
          }
          p{
            position: absolute;
            left: 10px;
            bottom: 10px;
            color: #fff;
            @include font_size($font_medium_s);
          }
        }
        .rank-bottom{
          width: 200px;
          @include no-wrap();
          p{
            padding: 10px 0;
            @include font_color();
            @include font_size($font_medium_s);
          }
        }
      }
    }
  }

  .v-enter {
    transform: translateX(100%);
    opacity: 0;
  }

  .v-enter-to {
    transform: translateX(0%);
    opacity: 1;
  }

  .v-enter-active {
    transition: all .6s;
  }

  .v-leave {
    transform: translateX(0%);
    opacity: 1;
  }

  .v-leave-to {
    transform: translateX(100%);
    opacity: 0;
  }

  .v-leave-active {
    transition: all .6s;
  }
</style>
