<template>
  <Header class="header">
    <div slot="left" class="header-left" @click.stop="back"></div>
    <p slot="center" class="header-title">个人中心</p>
    <div slot="right" class="header-right" @click.stop="logout"></div>
  </Header>
</template>

<script>
import Header from '../Header';
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'UserHeader',
  data: function () {
    return {
      isShowMenu: false
    };
  },
  components: {
    Header
  },
  computed: {
    ...mapGetters([
      'getUserProfile',
      'getLogging'
    ])
  },
  methods: {
    ...mapActions([
      'setLogging',
      'setUserProfile'
    ]),
    back () {
      if (this.getLogging) {
        this.$router.push('/recommend');
      } else {
        window.history.back();
      }
    },
    logout () {
      console.log('注销账户');
      this.setUserProfile({});
      this.setLogging(false);
      window.history.back();
    }
  }
};
</script>

<style scoped lang="scss">
  @import "../../assets/css/variable";
  @import "../../assets/css/mixin";
  .header{
    position: relative;
    z-index: 999;
    .header-left{
      @include bg_img('../../assets/images/back');
    }
    .header-right{
      position: relative;
      @include bg_img('../../assets/images/logout');
      /*.more-menu{
        width: 150px;
        height: 75px;
        border: 1px solid #ccc;
        @include bg_sub_color();
        position: absolute;
        left: -68px;
        top: 92px;
        border-radius: 10px;
        li{
          width: 100%;
          height: 100%;
          line-height: 75px;
          text-align: center;
          @include font_size($font_medium);
          @include font_color();
        }
      }*/
    }
    .header-title{
      text-align: center;
      line-height: 100px;
      color: #fff;
      font-weight: bold;
      @include font_size($font_medium);
      @include no-wrap();
    }
  }
  /*.v-enter {
    opacity: 0;
  }

  .v-enter-to {
    opacity: 1;
  }

  .v-enter-active {
    transition: all .6s;
  }

  .v-leave {
    opacity: 1;
  }

  .v-leave-to {
    opacity: 0;
  }

  .v-leave-active {
    transition: all .6s;
  }*/
</style>
