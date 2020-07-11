<template>
  <transition appear>
    <div class="account">
      <AccountHeader @switchItem="switchItem" @fatherLogin="fatherLogin"></AccountHeader>
      <AccountBottom :switchNum="switchNum"></AccountBottom>
      <transition
        enter-class="my-enter"
        enter-to-class="my-enter-to"
        enter-active-class="my-enter-active"
        leave-class="my-leave"
        leave-to-class="my-leave-to"
        leave-active-class="my-leave-active"
      >
        <AccountLogin v-show="isShowLogin"></AccountLogin>
      </transition>
    </div>
  </transition>
</template>

<script>
import AccountHeader from '../components/Account/AccountHeader';
import AccountBottom from '../components/Account/AccountBottom';
import MetaInfo from '../../vue-meta-info';
import AccountLogin from '../components/Account/AccountLogin';
import { mapGetters } from 'vuex';

export default {
  name: 'Account',
  metaInfo: MetaInfo.account,
  computed: {
    ...mapGetters([
      'getLogging'
    ])
  },
  components: {
    AccountLogin,
    AccountHeader,
    AccountBottom
  },
  data: function () {
    return {
      switchNum: 0,
      isShowLogin: false
    };
  },
  methods: {
    switchItem (value) {
      this.switchNum = value;
    },
    fatherLogin () {
      // console.log('???');
      this.isShowLogin = !this.isShowLogin;
      if (this.getLogging) {
        this.$router.push('/account/user');
      }
    }
  }
};
</script>

<style scoped lang="scss">
  @import "../assets/css/variable";
  @import "../assets/css/mixin";

  .account {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    @include bg_sub_color();
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

  .my-enter {
    /*transform: translateY(-100%);*/
    opacity: 0;
  }

  .my-enter-to {
    /*transform: translateY(0%);*/
    opacity: 1;
  }

  .my-enter-active {
    transition: all .6s;
  }

  .my-leave {
    /*transform: translateY(0%);*/
    opacity: 1;
  }

  .my-leave-to {
    /*transform: translateY(-100%);*/
    opacity: 0;
  }

  .my-leave-active {
    transition: all .6s;
  }
</style>
