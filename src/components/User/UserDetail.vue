<template>
  <div class="user-detail">
    <div class="detail-wrapper">
      <div class="user-img">
        <img :src="profile.avatarUrl" alt="">
      </div>
      <div class="user-info">
        <h1 class="user-name">{{ profile.nickname }}</h1>
        <p class="user-signature">{{ profile.signature }}</p>
      </div>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'UserDetail',
  data: function () {
    return {
      profile: {}
    };
  },
  computed: {
    ...mapGetters([
      'getUserProfile'
    ])
  },
  created () {
    // console.log(this.getUserProfile);
    this.profile = this.getUserProfile.profile;
    // console.log(this.profile);
  },
  mounted () {
    // console.log(this.$el);
    this.$el.style.background = `url(${this.getUserProfile.profile.backgroundUrl})`;
    this.$el.style.backgroundRepeat = 'no-repeat';
    this.$el.style.backgroundSize = 'cover';
  },
  watch: {
    getUserProfile (newValue, oldValue) {
      this.$nextTick(() => {
        // console.log(this.$el);
      });
    }
  }
};
</script>

<style scoped lang="scss">
  @import "../../assets/css/variable";
  @import "../../assets/css/mixin";
.user-detail{
  width: 100%;
  height: 250px;
  padding: 20px;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
  .detail-wrapper{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    position: absolute;
    top: 0;
    left: 20px;
    z-index: 1;
    .user-img{
      width: 200px;
      height: 200px;
      border-radius: 10px;
      overflow: hidden;
      img{
        width: 100%;
      }
    }
    .user-info{
      margin-left: 20px;
      h1{
        @include font_size($font_large);
        color: #fff;
        font-weight: bold;
        margin-bottom: 40px;
      }
      p{
        @include font_size($font_medium);
        color: #fff;
      }
    }
  }
  .mask{
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
  }
}
</style>
