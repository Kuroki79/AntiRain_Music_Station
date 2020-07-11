<template>
  <div class="detail">
    <DetailHeader :title="title"></DetailHeader>
    <DetailTop :path="playList.coverImgUrl" ref="top"></DetailTop>
    <div class="bottom">
      <BScrollView ref="scrollView" :probe-type="3">
        <DetailBottom :playlist="playList.tracks" :isLotSong="isLotSong"></DetailBottom>
      </BScrollView>
    </div>
  </div>
</template>

<script>
import DetailHeader from '../components/Detail/DetailHeader';
import DetailTop from '../components/Detail/DetailTop';
import DetailBottom from '../components/Detail/DetailBottom';
import BScrollView from '../components/BScrollView';
import MetaInfo from '../../vue-meta-info';
import { mapGetters, mapActions } from 'vuex';
import { getAlbum, getDetail, getArtistsSongs, getTopList } from '../api';

export default {
  name: 'Detail',
  metaInfo: MetaInfo.detail,
  components: {
    DetailHeader,
    DetailTop,
    DetailBottom,
    BScrollView
  },
  computed: {
    ...mapGetters([
      'getUserProfile',
      'getSongs'
    ])
  },
  data: function () {
    return {
      playList: {},
      title: '',
      isLotSong: false
    };
  },
  methods: {
    ...mapActions([
      'setSongDetail'
    ])
  },
  created () {
    // console.log(this.$route.params.type);
    // 判断路由参数传过来的type来决定获取什么数据
    if (this.$route.params.type === 'personalized') {
      // 获取歌单数据
      getDetail({ id: this.$route.params.id })
        .then((data) => {
          // console.log(data);
          console.log(data.playlist);
          this.playList = data.playlist;
          this.title = data.playlist.name;
          const trackIdList = data.playlist.trackIds;
          if (trackIdList[0] !== undefined && trackIdList[0] !== null) {
            if (trackIdList[0].length === 500 && trackIdList[1].length >= 1) {
              console.log('获取到的歌曲数量超过500首');
              trackIdList.forEach((value) => {
                const ids = value.map(function (item) {
                  // console.log(item);
                  return item.id;
                });
                // console.log(ids);
                this.setSongDetail({ ids: ids, flag: true });
              });
              this.isLotSong = true;
            } else if (trackIdList.length === 500) {
              console.log('获取到的歌曲数量等于500首');
              const ids = trackIdList.map(function (item) {
                // console.log(item);
                return item.id;
              });
              // console.log(ids);
              this.setSongDetail({ ids: ids, flag: true });
              this.isLotSong = true;
            } else {
              console.log('获取到的歌曲数量小于500首');
            }
          }
        })
        .catch(function (err) {
          console.log(err);
        });
    } else if (this.$route.params.type === 'album') {
      // 获取专辑数据
      getAlbum({ id: this.$route.params.id })
        .then((data) => {
          // console.log(data);
          // 将专辑数据保存成歌单数据的形式，好让代码模板不改变数据名称的情况下，设置数据
          this.playList = {
            name: data.album.name,
            coverImgUrl: data.album.picUrl,
            tracks: data.songs
          };
          // this.playList = data.playlist;
          // this.title = data.playlist.name;
        })
        .catch(function (err) {
          console.log(err);
        });
    } else if (this.$route.params.type === 'singer') {
      // 获取热门歌手数据
      getArtistsSongs({ id: this.$route.params.id })
        .then((data) => {
          // console.log(data);
          // 将专辑数据保存成歌单数据的形式，好让代码模板不改变数据名称的情况下，设置数据
          this.playList = {
            name: data.artist.name,
            coverImgUrl: data.artist.picUrl,
            tracks: data.hotSongs
          };
          // this.playList = data.playlist;
          // this.title = data.playlist.name;
        })
        .catch(function (err) {
          console.log(err);
        });
    } else if (this.$route.params.type === 'rank') {
      // 获取排行榜歌曲数据
      getTopList({ idx: this.$route.params.id })
        .then((data) => {
          // console.log(data);
          // 将专辑数据保存成歌单数据的形式，好让代码模板不改变数据名称的情况下，设置数据
          this.playList = {
            name: data.playlist.name,
            coverImgUrl: data.playlist.creator.backgroundUrl,
            tracks: data.playlist.tracks
          };
          // this.playList = data.playlist;
          // this.title = data.playlist.name;
        })
        .catch(function (err) {
          console.log(err);
        });
    } else if (this.$route.params.type === 'user') {
      // 获取歌单数据
      getDetail({ id: this.$route.params.id })
        .then((data) => {
          // console.log(data);
          this.playList = data.playlist;
          this.title = data.playlist.name;
        })
        .catch(function (err) {
          console.log(err);
        });
    }
    // console.log(this.$route);
  },
  mounted () {
    // 获取图片区域的高度
    const defaultHeight = this.$refs.top.$el.offsetHeight;
    // console.log(defaultHeight);
    // 监听iScroll的滚动事件
    this.$refs.scrollView.scrollIng((pos) => {
      // console.log(pos);
      // console.log(offsetY);
      // 判断是在向上滚动还是在向下滚动
      if (pos.y < 0) {
        // 获取比例数值
        const scale = Math.abs(pos.y) / defaultHeight;
        // console.log(scale);
        if (this.$refs.top) {
          this.$refs.top.changeMask(scale);
        }
        /*
        * 注意点：高斯模糊效果是非常消耗性能的，不推荐在移动端使用
        *        如果非要在移动端使用，那么建议只设置一次
        * */
        // this.$refs.top.$el.style.filter = `blur(${scale}px)`;
        // console.log('向上滚动');
      } else {
        // console.log('向下滚动');
        const scale = 1 + pos.y / defaultHeight;
        // console.log(scale);
        this.$refs.top.$el.style.transform = `scale(${scale})`;
      }
    });
  },
  beforeDestroy () {
    // console.log('销毁之前');
    // 在组件销毁之前复位滚动组件的滚动位置并禁用BScroll，以免销毁之后滚动继续执行就会报错
    this.$refs.scrollView.scrollTo(0, 0, 0);
    this.$refs.scrollView.disable();
    // console.log(this.$refs.scrollView);
  }
};
</script>

<style scoped lang="scss">
  @import "../assets/css/mixin";
  .detail{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    @include bg_sub_color();
    .bottom{
      position: fixed;
      top: 500px;
      bottom: 0;
      right: 0;
      left: 0;
    }
  }
</style>
