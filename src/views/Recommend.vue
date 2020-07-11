<template>
  <div class="recommend">
    <div class="recommend-wrapper">
        <BScrollView>
          <div>
            <Banner :banners="banners"></Banner>
            <Personalized :personalized="personalized" :title="'推荐歌单'" @select="fatherSelectItem" :type="'personalized'"></Personalized>
            <Personalized :personalized="newAlbums" :title="'最新专辑'"  @select="fatherSelectItem" :type="'album'"></Personalized>
            <SongList :newSongs="newSongs"></SongList>
          </div>
        </BScrollView>
    </div>
    <transition>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { getBanner, getPersonalized, getNewAlbum, getNewSong } from '../api/index';
import Banner from '../components/Recommend/Banner';
import Personalized from '../components/Recommend/Personalized';
import SongList from '../components/Recommend/SongList';
// import ScrollView from '../components/ScrollView';
import MetaInfo from '../../vue-meta-info';
import BScrollView from '../components/BScrollView';
export default {
  name: 'Recommend',
  metaInfo: MetaInfo.recommend,
  components: {
    Banner,
    Personalized,
    SongList,
    // ScrollView,
    BScrollView
  },
  data: function () {
    return {
      banners: [],
      personalized: [],
      newAlbums: [],
      newSongs: []
    };
  },
  methods: {
    fatherSelectItem (id, type) {
      // 以JS代码的形式更改路由地址
      this.$router.push({
        path: `/recommend/detail/${id}/${type}`
      });
    }
  },
  created: function () {
    // 获取banner的数据
    getBanner().then((data) => {
      // console.log(data);
      this.banners = data.banners;
    }).catch(function (err) {
      console.log(err);
    });

    // 获取推荐歌单的数据
    getPersonalized().then((data) => {
      // console.log(data.result);
      this.personalized = data.result;
    }).catch(function (err) {
      console.log(err);
    });

    // 获取最新专辑的数据
    getNewAlbum().then((data) => {
      // console.log(data.albums.splice(0, 6));
      this.newAlbums = data.albums.splice(0, 6);
    }).catch(function (err) {
      console.log(err);
    });

    // 获取推荐新音乐的数据
    getNewSong().then((data) => {
      // console.log(data.result);
      // this.newSongs = data.result;
      // console.log(data.result);
      const list = [];
      data.result.forEach((value) => {
        const obj = {};
        // 取得ID
        obj.id = value.id;
        // 取得歌名
        obj.name = value.name;
        // 取得专辑图片URL
        obj.al = {
          picUrl: value.song.album.picUrl
        };
        let singer = '';
        // 遍历演唱家
        for (let i = 0; i < value.song.artists.length; i++) {
          // 第一次遍历直接获取演唱家
          if (i === 0) {
            singer = value.song.artists[i].name;
          } else {
            // 之后就用连接符拼接其他的演唱家
            singer += '-' + value.song.artists[i].name;
          }
        }
        // 取得处理后的演唱家
        obj.singer = singer;
        // console.log(obj);
        list.push(obj);
      });
      this.newSongs = list;
    }).catch(function (err) {
      console.log(err);
    });
  }
};
</script>

<style scoped lang="scss">
.recommend{
  position: fixed;
  top: 184px;
  left: 0;
  bottom: 0;
  right: 0;
  .recommend-wrapper{
    width: 100%;
    height: 100%;
    overflow: hidden;
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
