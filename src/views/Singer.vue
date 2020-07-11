<template>
  <div class="singer">
    <!--将需要和顶部有间隙的元素放置到一个容器(给容器添加指定的样式)中，以解决IOS系统中头部(Header)的覆盖问题-->
    <!--原因：路由的出口在歌手界面中，而整个歌手界面设置了顶部的间隙（top: 184px），结果就导致跳转之后的界面也有顶部的间隙-->
    <div class="singer-wrapper">
      <BScrollView ref="scrollView" :probe-type="3">
        <ul class="list-wrapper">
          <li class="list-group" v-for="(value, index) in list" :key="index" ref="group">
            <h2 class="group-title">{{ keys[index] }}</h2>
            <ul>
              <li class="group-item" v-for="obj in list[index]" :key="obj.id" @click.stop="switchSinger(obj.id)">
                <img v-lazy="obj.img1v1Url"/>
                <p>{{ obj.name }}</p>
              </li>
            </ul>
          </li>
        </ul>
      </BScrollView>
      <ul class="list-keys">
        <!--      <li v-for="(key, index) in keys" :class="{'active': currentIndex === index}" :key="key" @click.stop="keyDown(index)">{{ key }}</li>-->
        <li
          v-for="(key, index) in keys"
          :class="{'active': currentIndex === index}"
          :key="key"
          :data-index="index"
          @touchstart.stop.prevent="touchstart"
          @touchmove.stop.prevent="touchmove"
        >{{ key }}</li>
      </ul>
      <div class="fix-title" v-show="fixTitle !== ''" ref="fixTitle">
        {{ fixTitle }}
      </div>
    </div>
    <transition>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
// import ScrollView from '../components/ScrollView';
import BScrollView from '../components/BScrollView';
import { getAllArtists } from '../api/index';
import MetaInfo from '../../vue-meta-info';
export default {
  name: 'Singer',
  metaInfo: MetaInfo.singer,
  data: function () {
    return {
      keys: [],
      list: [],
      groupsTop: [],
      currentIndex: 0,
      beginOffsetY: 0,
      moveOffsetY: 0,
      scrollY: 0,
      fixTitleHeight: 0,
      fixTitleOffsetY: 0
    };
  },
  computed: {
    fixTitle () {
      if (this.scrollY >= 0) {
        return '';
      } else {
        return this.keys[this.currentIndex];
      }
    }
  },
  methods: {
    _keyDown (index) {
      this.currentIndex = index;
      // console.log(index);
      let offsetY = this.groupsTop[index];
      // console.log(offsetY);
      this.$refs.scrollView.scrollTo(0, -offsetY, 100);
    },
    touchstart (e) {
      // console.log(e.target.dataset.index);
      // 获取触发事件元素绑定的index
      let index = parseInt(e.target.dataset.index);
      // 将index传递到_keyDown方法中执行滚动事件
      this._keyDown(index);
      // 获取触摸的起始位置
      this.beginOffsetY = e.touches[0].pageY;
    },
    touchmove (e) {
      // 获取手指触摸移动时的位置
      this.moveOffsetY = e.touches[0].pageY;
      // (移动时的位置 - 起始位置) / 每个元素的高度 = 触摸移动了多少个元素
      let offsetY = (this.moveOffsetY - this.beginOffsetY) / e.target.offsetHeight;
      // console.log(offsetY);
      // 将触发事件元素绑定的index和偏移量相加得到最终的index
      let index = parseInt(e.target.dataset.index) + Math.floor(offsetY);
      // console.log(index);
      // 判断index是否小于0或大于所有关键字的个数
      if (index < 0) {
        index = 0;
      } else if (index > this.keys.length - 1) {
        index = this.keys.length - 1;
      }
      // 将index传递到_keyDown方法中执行滚动事件
      this._keyDown(index);
    },
    // 歌手被单击时触发的事件
    switchSinger (id) {
      // 手动更改路由地址
      this.$router.push(`/singer/detail/${id}/singer`);
    }
  },
  components: {
    // ScrollView
    BScrollView
  },
  created () {
    // 获取所有热门歌手的信息
    getAllArtists()
      .then((result) => {
        // console.log(result);
        this.keys = result.keys;
        this.list = result.list[0];
        // console.log(this.list);
      })
      .catch(function (err) {
        console.log(err);
      });
  },
  watch: {
    // 监听热门歌手数据
    list: function (newValue, oldValue) {
      // console.log(this.$refs.group);
      // 注意店：watch只能监听数据的变化，数据变化的时候不一定已经渲染完了
      //        所以为了保证是渲染完成之后再去获取，我们可以借助Vue的$nextTick方法来实现。
      //        也就是说在$nextTick回调函数中一定能拿到渲染完成之后的数据，
      //        因为$nextTick的回调函数只有渲染完成之后才会执行
      this.$nextTick(() => {
        // console.log(this.$refs.group);
        // 当热门歌手数据渲染完成时，保存所有分类区域的offsetTop到数组中
        this.$refs.group.forEach((group) => {
          this.groupsTop.push(group.offsetTop);
        });
        // console.log(this.groupsTop);
      });
    },
    fixTitle (newValue, oldValue) {
      this.$nextTick(() => {
        // console.log('suck');
        // console.log(this.$refs.fixTitle.offsetHeight);
        // 当元素加载完成时保存标题部分的高度
        this.fixTitleHeight = this.$refs.fixTitle.offsetHeight;
        // console.log(this.fixTitleHeight);
      });
    }
  },
  mounted () {
    this.$refs.scrollView.scrollIng((pos) => {
      // console.log(y);
      // 保存滚动出去的距离
      this.scrollY = pos.y;
      // 处理第一个区域
      if (pos.y >= 0) {
        this.currentIndex = 0;
        return;
      }
      // 处理中间区域
      for (let i = 0; i < this.groupsTop.length - 1; i++) {
        let preTop = this.groupsTop[i];
        let nextTop = this.groupsTop[i + 1];
        if (-pos.y >= preTop && -pos.y <= nextTop) {
          this.currentIndex = i;
          // 1.用下一组标题的偏移位 + -当前滚动出去的距离
          // 注意点：向上滚动时，y是负值
          let diffOffsetY = nextTop + pos.y;
          // 要是无法理解，把下面一行代码执行一下就明白了
          // console.log(diffOffsetY);
          let fixTitleOffsetY = 0;
          // 2.判断计算的结果是否是 0 ~ 分组标题高度的值
          if (diffOffsetY >= 0 && diffOffsetY <= this.fixTitleHeight) {
            // 当前视口(路由视口)顶部与下一组标题的顶部的距离 - 标题区域的高度 = 标题区域被挤出时的偏移位
            fixTitleOffsetY = diffOffsetY - this.fixTitleHeight;
          } else {
            // 如果不在范围内就复位成0
            fixTitleOffsetY = 0;
          }
          // 判断要移动的距离是否和标题区域的高度相等
          // (fixTitleOffsetY是否已经等于了fixTitle的高度，如果相等就没必要继续进行位移操作了)
          if (fixTitleOffsetY === this.fixTitleHeight) {
            // 如果相等就跳出
            return;
          }
          // 保存当前需要移动的距离
          this.fixTitleOffsetY = fixTitleOffsetY;
          // 根据得到的移动距离来进行位移
          this.$refs.fixTitle.style.transform = `translateY(${fixTitleOffsetY}px)`;
          return;
        }
      }
      // 处理最后一个区域
      this.currentIndex = this.groupsTop.length - 1;
    });
  },
  beforeDestroy () {
    this.$refs.scrollView.scrollTo(0, 0, 0);
    this.$refs.scrollView.disable();
  }
};
</script>

<style scoped lang="scss">
  @import "../assets/css/variable";
  @import "../assets/css/mixin";
  .singer{
    width: 100%;
    height: 100%;
    .singer-wrapper{
      position: fixed;
      top: 184px;
      bottom: 0;
      left: 0;
      right: 0;
      @include bg_sub_color();
      overflow: hidden;
    }
    .list-wrapper{
      width: 100%;
      .list-group{
        .group-title{
          @include bg_color();
          @include font_size($font_medium);
          color: #fff;
          padding: 10px 20px;
          box-sizing: border-box;
        }
        .group-item{
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding: 10px 20px;
          border-bottom: 1px solid #fff;
          img{
            width: 100px;
            height: 100px;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 20px;
          }
          p{
            @include font_size($font_medium);
            @include font_color();
          }
        }
      }
    }
    .list-keys{
      position: fixed;
      right: 10px;
      top: 58%;
      transform: translateY(-50%);
      li{
        @include font_color();
        @include font_size($font_medium_s);
        padding: 3px 0;
        &.active{
          text-shadow: 0 0 10px #000;
        }
      }
    }
    .fix-title{
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      padding: 10px 20px;
      box-sizing: border-box;
      @include font_size($font_medium);
      @include bg_color();
      color: #fff;
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
