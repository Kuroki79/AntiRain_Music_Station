<template>
  <div id="wrapper" ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll';
export default {
  name: 'BScrollView',
  props: {
    /**
     * 1 滚动的时候会派发scroll事件，会截流。
     * 2 滚动的时候实时派发scroll事件，不会截流。
     * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
     */
    probeType: {
      type: Number,
      default: 1
    },
    /**
     * 点击列表是否派发click事件
     */
    click: {
      type: Boolean,
      default: true
    },
    /**
     * 是否开启横向滚动
     */
    scrollX: {
      type: Boolean,
      default: false
    },
    /**
     * 是否派发滚动事件
     */
    listenScroll: {
      type: Boolean,
      default: false
    },
    /**
     * 列表的数据
     */
    data: {
      type: Array,
      default: null
    },
    /**
     * 是否派发滚动到底部的事件，用于上拉加载
     */
    pullup: {
      type: Boolean,
      default: false
    },
    /**
     * 是否派发顶部下拉的事件，用于下拉刷新
     */
    pulldown: {
      type: Boolean,
      default: false
    },
    /**
     * 是否派发列表滚动开始的事件
     */
    beforeScroll: {
      type: Boolean,
      default: false
    },
    /**
     * 当数据更新后，刷新scroll的延时。
     */
    refreshDelay: {
      type: Number,
      default: 20
    }
  },
  mounted () {
    // 初始化better-scroll
    this._initScroll();
    // 注意点：由于推荐页面的数据是从网络获取的，所以当刚进入页面时，BScroll组件无法获取正确的maxScrollY
    // 等待五秒后刷新BScroll组件，以重新获取maxScrollY
    // 利用观察者对象监听子节点内容是否发生变化来刷新BScroll组件
    // 1.创建一个观察者对象
    /*
    * MutationObserver构造函数只要监听到了指定内容发生了变化，就会执行传入的回调函数
    * mutationList：发生变化的数组
    * observer：观察者对象
    * */
    const observer = new MutationObserver((mutationList, observer) => {
      // console.log(mutationList);
      // console.log('----------');
      // console.log(this.scroll.maxScrollY);
      this.refresh();
      // console.log('刷新BScroll组件');
      // console.log(this.scroll.maxScrollY);
    });
    // 2.告诉观察者对象我们需要观察什么内容
    const config = {
      childList: true, // 观察目标子节点的变化，是否有添加或者删除
      subtree: true, // 观察后代节点，默认为 false
      attributeFilter: ['height', 'offsetHeight'] // 观察特定属性
    };
    // 3.告诉观察者对象，我们需要观察谁，需要观察什么内容
    /*
    * 第一个参数：告诉观察者对象我们需要观察谁
    * 第二个参数：告诉观察者对象我们需要观察什么内容
    * */
    observer.observe(this.$refs.wrapper, config);
  },
  methods: {
    _initScroll () {
      if (!this.$refs.wrapper) {
        return;
      }
      // better-scroll的初始化
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click,
        scrollX: this.scrollX
      });

      // 是否派发滚动事件
      if (this.listenScroll) {
        this.scroll.on('scroll', (pos) => {
          this.$emit('scroll', pos);
        });
      }

      // 是否派发滚动到底部事件，用于上拉加载
      if (this.pullup) {
        this.scroll.on('scrollEnd', () => {
          // 滚动到底部
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
            this.$emit('scrollToEnd');
          }
        });
      }

      // 是否派发顶部下拉事件，用于下拉刷新
      if (this.pulldown) {
        this.scroll.on('touchend', (pos) => {
          // 下拉动作
          if (pos.y > 50) {
            this.$emit('pulldown');
          }
        });
      }

      // 是否派发列表滚动开始的事件
      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll');
        });
      }
    },
    disable () {
      // 代理better-scroll的disable方法
      this.scroll && this.scroll.disable();
    },
    enable () {
      // 代理better-scroll的enable方法
      this.scroll && this.scroll.enable();
    },
    refresh () {
      // 代理better-scroll的refresh方法
      this.scroll && this.scroll.refresh();
    },
    scrollTo () {
      // 代理better-scroll的scrollTo方法
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    scrollToElement () {
      // 代理better-scroll的scrollToElement方法
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    },
    scrollIng (fn) {
      this.scroll.on('scroll', (pos) => {
        fn(pos);
      });
    },
    scrollEnd (fn) {
      this.scroll.on('scrollEnd', (pos) => {
        fn(pos);
      });
    },
    scrollStart (fn) {
      this.scroll.on('scrollStart', () => {
        fn();
      });
    },
    scrollTouchEnd (fn) {
      this.scroll.on('touchEnd', (pos) => {
        fn(pos);
      });
    },
    scrollBeforeStart (fn) {
      this.scroll.on('beforeScrollStart', (pos) => {
        fn(pos);
      });
    }
  },
  watch: {
    // 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常
    data () {
      setTimeout(() => {
        this.refresh();
      }, this.refreshDelay);
    }
  }
};
</script>

<style scoped>
  #wrapper{
    width: 100%;
    height: 100%;
  }
</style>
