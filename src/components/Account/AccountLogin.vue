<template>
  <div class="account-login">
    <form action="" class="user-form">
      <p>
        <label>
          邮箱：
          <input type="text" v-model="userEmail">
        </label>
      </p>
      <p>
        <label>
          密码：
          <input type="password" v-model="userPwd">
        </label>
      </p>
      <p class="tips" v-show="isShowTips" ref="tips">{{ msg }}</p>
      <input type="submit" @click.prevent="login" value="登录">
    </form>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { getEmailLogin } from '../../api';
import { mapActions, mapGetters } from 'vuex';
import { getCookie, setCookie } from '../../tools/tools';

export default {
  name: 'AccountLogin',
  data: function () {
    return {
      userEmail: '',
      userPwd: '',
      isShowTips: false,
      msg: ''
    };
  },
  computed: {
    ...mapGetters([
      'getLogging'
    ])
  },
  methods: {
    ...mapActions([
      'setUserProfile',
      'setLogging'
    ]),
    // 登录
    login () {
      // 通过Email获取登录信息
      getEmailLogin({ email: this.userEmail, password: this.userPwd })
        .then((data) => {
          if (data.code === 200) {
            // console.log(getCookie('userEmail') !== this.userEmail);
            if (getCookie('userEmail') === '' || getCookie('userEmail') !== this.userEmail) {
              setCookie('userEmail', this.userEmail, 3);
              // setCookie('userPwd', this.userPwd, 3);
            }
            this.setUserProfile(data);
            this.msg = '登陆成功，欢迎回来！';
            this.$refs.tips.className = 'tips success';
            this.isShowTips = true;
            this.setLogging(true);
            setTimeout(() => {
              this.$router.push('/account/user');
              // this.$emit('fatherLogin');
            }, 3000);
          } else {
            // console.log(data.msg);
            this.msg = data.msg;
            this.$refs.tips.className = 'tips warning';
            this.isShowTips = true;
          }
          // console.log(data);
        })
        .catch(function (err) {
          // console.log(err);
          throw new Error(err);
        });
    }
  },
  mounted () {
    if (getCookie('userEmail') !== '') {
      // console.log('拿到了Cookie');
      this.userEmail = getCookie('userEmail');
      // this.userPwd = getCookie('userPwd');
    }
  }
};
</script>

<style scoped lang="scss">
  @import "../../assets/css/variable";
  @import "../../assets/css/mixin";
  .account-login{
    position: fixed;
    top: 100px;
    left: 0;
    right: 0;
    bottom: 0;
    @include bg_sub_color();
    .user-form{
      width: 60%;
      height: 30%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      label{
        @include font_size($font_medium);
        @include font_color();
        &>input{
          padding: 5px 0;
          outline: none;
          border: none;
          border-bottom: 3px solid #ccc;
          background: none;
          margin-bottom: 20px;
          @include font_color();
          @include font_size($font_medium);
        }
      }
      &>input{
        padding: 10px 20px;
        color: #fff;
        position: relative;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        border: none;
        @include font_size($font_medium);
        @include bg_color();
        border-radius: 10px;
      }
      .tips{
        text-align: center;
        margin-bottom: 20px;
        @include font_size($font_medium);
        &.warning{
          color: #ffc107;
        }
        &.success{
          color: #28a745;
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
