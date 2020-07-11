<template>
  <div class="user-info">
    <div class="info-wrapper">
      <UserHeader></UserHeader>
      <UserDetail></UserDetail>
      <UserFavorite :userPlayList="userPlayList" @fatherSelectItem="fatherSelectItem"></UserFavorite>
    </div>
    <transition>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import UserDetail from '../components/User/UserDetail';
import UserHeader from '../components/User/UserHeader';
import UserFavorite from '../components/User/UserFavorite';
import MetaInfo from '../../vue-meta-info';
import { mapGetters } from 'vuex';
import { getUserPlayList } from '../api';
// import { getCookie } from '../tools/tools';

export default {
  name: 'User',
  metaInfo: MetaInfo.user,
  data: function () {
    return {
      userPlayList: []
    };
  },
  methods: {
    fatherSelectItem (id) {
      this.$router.push(`/account/user/detail/${id}/user`);
    }
  },
  computed: {
    ...mapGetters([
      'getUserProfile'
    ])
  },
  components: {
    UserDetail,
    UserHeader,
    UserFavorite
  },
  created () {
    // console.log(this.getUserProfile);
    // console.log(getCookie('userEmail'));
    // 获取用户歌单
    getUserPlayList({ uid: this.getUserProfile.profile.userId })
      .then((data) => {
        // console.log(data.playlist);
        this.userPlayList = data.playlist;
      })
      .catch(function (err) {
        console.log(err);
      });
  }
};
</script>

<style scoped lang="scss">
  @import "../assets/css/mixin";
  .user-info{
    .info-wrapper{
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      @include bg_sub_color();
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
