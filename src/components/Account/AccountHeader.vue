<template>
  <div>
    <Header class="header">
      <div slot="left" class="header-left" @click.stop="back"></div>
      <ul slot="center" class="header-tab">
        <li :class="{'active': switchNum === 0}" @click.stop="switchItem(0)">我喜欢的</li>
        <li :class="{'active': switchNum === 1}" @click.stop="switchItem(1)">最近听的</li>
      </ul>
      <div slot="right" class="header-right" @click.stop="login"></div>
    </Header>
  </div>
</template>

<script>
import Header from '../Header';
import { mapGetters } from 'vuex';
export default {
  name: 'AccountHeader',
  data: function () {
    return {
      switchNum: 0,
      isShowMenu: false
    };
  },
  computed: {
    ...mapGetters([
      'getUserProfile'
    ])
  },
  methods: {
    back () {
      window.history.back();
    },
    switchItem (value) {
      this.switchNum = value;
      this.$emit('switchItem', value);
    },
    login () {
      this.$emit('fatherLogin');
    }
  },
  components: {
    Header
  },
  created () {
    // console.log('suck');
  }
};
</script>

<style scoped lang="scss">
  @import "../../assets/css/variable";
  @import "../../assets/css/mixin";
  .header{
    .header-left{
      @include bg_img('../../assets/images/back');
    }
    .header-right{
      @include bg_img('../../assets/images/login');
    }
    .header-tab{
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-weight: bold;
      border: 1px solid #fff;
      border-radius: 10px;
      @include font_size($font_medium);
      @include no-wrap();
      height: 60px;
      margin-top: 20px;
      li{
        height: 60px;
        line-height: 60px;
        padding: 0 20px;
        &:nth-of-type(1){
          border-right: 1px solid #fff;
        }
        &.active{
          background: rgba(255, 255, 255, .3);
        }
      }
    }
  }
</style>
