<template>
  <div class="search">
    <div class="search-box">
      <img
        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNiAyNiI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjYzljOWNhIiBkPSJNMjUuMTgxIDIzLjUzNWwtMS40MTQgMS40MTQtNy4zMTUtNy4zMTRBOS45NjYgOS45NjYgMCAwIDEgMTAgMjBDNC40NzcgMjAgMCAxNS41MjMgMCAxMFM0LjQ3NyAwIDEwIDBzMTAgNC40NzcgMTAgMTBjMCAyLjM0Mi0uODExIDQuNDktMi4xNiA2LjE5NWw3LjM0MSA3LjM0ek0xMCAyYTggOCAwIDEgMCAwIDE2IDggOCAwIDAgMCAwLTE2eiIvPjwvc3ZnPg=="
        alt="">
      <input type="text" placeholder="搜索歌曲、歌手、专辑" v-model="keywords" v-throttle="search">
    </div>
    <div class="search-suggest" v-show="keywords !== ''">
      <BScrollView>
        <ul>
          <li v-for="value in songs" :key="value.id" @click.stop="selectMusic(value.id)">
            <img
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNiAyNiI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjYzljOWNhIiBkPSJNMjUuMTgxIDIzLjUzNWwtMS40MTQgMS40MTQtNy4zMTUtNy4zMTRBOS45NjYgOS45NjYgMCAwIDEgMTAgMjBDNC40NzcgMjAgMCAxNS41MjMgMCAxMFM0LjQ3NyAwIDEwIDBzMTAgNC40NzcgMTAgMTBjMCAyLjM0Mi0uODExIDQuNDktMi4xNiA2LjE5NWw3LjM0MSA3LjM0ek0xMCAyYTggOCAwIDEgMCAwIDE2IDggOCAwIDAgMCAwLTE2eiIvPjwvc3ZnPg=="
              alt="">
            <p>{{ value.name }} - {{ value.artists[0].name }}</p>
          </li>
        </ul>
      </BScrollView>
    </div>
    <div class="search-hot">
      <h3>热门搜索</h3>
      <ul>
        <li v-for="value in hots" :key="value.first" @click.stop="selectedItem(value.first)">{{ value.first }}</li>
      </ul>
    </div>
    <ul class="search-history">
      <li v-for="value in searchHistory" :key="value">
        <div class="history-left" @click.stop="selectedItem(value)">
          <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMCAzMCI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjYzljYWNhIiBkPSJNMTUgMzBDNi43MTYgMzAgMCAyMy4yODQgMCAxNVM2LjcxNiAwIDE1IDBzMTUgNi43MTYgMTUgMTUtNi43MTYgMTUtMTUgMTVtMC0yOEM3LjgyIDIgMiA3LjgyIDIgMTVzNS44MiAxMyAxMyAxMyAxMy01LjgyIDEzLTEzUzIyLjE4IDIgMTUgMm03IDE2aC04YTEgMSAwIDAgMS0xLTFWN2ExIDEgMCAxIDEgMiAwdjloN2ExIDEgMCAxIDEgMCAyIi8+PC9zdmc+" alt="">
          <p>{{ value }}</p>
        </div>
        <div class="history-right">
          <img @click.stop="delHistory(value)" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjOTk5ODk5IiBkPSJNMTMuMzc5IDEybDEwLjMzOCAxMC4zMzdhLjk3NS45NzUgMCAxIDEtMS4zNzggMS4zNzlMMTIuMDAxIDEzLjM3OCAxLjY2MyAyMy43MTZhLjk3NC45NzQgMCAxIDEtMS4zNzgtMS4zNzlMMTAuNjIzIDEyIC4yODUgMS42NjJBLjk3NC45NzQgMCAxIDEgMS42NjMuMjg0bDEwLjMzOCAxMC4zMzhMMjIuMzM5LjI4NGEuOTc0Ljk3NCAwIDEgMSAxLjM3OCAxLjM3OEwxMy4zNzkgMTIiLz48L3N2Zz4=" alt="">
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
// import ScrollView from '../components/ScrollView';
import BScrollView from '../components/BScrollView';
import MetaInfo from '../../vue-meta-info';
import { getSearchList, getSearchHot } from '../api';
import { setLocalStorage, getLocalStorage } from '../tools/tools';
import { mapActions } from 'vuex';
export default {
  name: 'Search',
  metaInfo: MetaInfo.search,
  components: {
    // ScrollView
    BScrollView
  },
  data: function () {
    return {
      keywords: '',
      songs: [],
      hots: [],
      searchHistory: []
    };
  },
  methods: {
    ...mapActions([
      'setFullScreen',
      'setSongDetail',
      'setPlayOwn'
    ]),
    search () {
      // console.log('发送请求');
      if (this.keywords !== '') {
        getSearchList({ keywords: this.keywords })
          .then((data) => {
            // console.log(data);
            this.songs = data.result.songs;
          })
          .catch(function (err) {
            console.log(err);
          });
      }
    },
    selectMusic (id) {
      // 单击音乐时显示普通播放界面
      this.setFullScreen(true);
      this.setSongDetail({ ids: [id], flag: false });
      this.setPlayOwn(true);

      // 判断当前搜索的内容是否历史记录中
      if (this.searchHistory.includes(this.keywords)) {
        // 如果在就直接跳出
        return;
      }
      // 不在就将关键字添加到历史搜索记录中
      this.searchHistory.push(this.keywords);
      setLocalStorage('searchHistory', this.searchHistory);
      this.keywords = '';
    },
    selectedItem (name) {
      this.keywords = name;
      this.search();
    },
    delHistory (name) {
      this.searchHistory = this.searchHistory.filter(function (item) {
        return item !== name;
      });
      setLocalStorage('searchHistory', this.searchHistory);
    }
  },
  directives: {
    throttle: {
      inserted: function (el, obj) {
        let timerID = null;
        let flag = true;
        el.addEventListener('input', function () {
          if (!flag) {
            return;
          }
          flag = false;
          timerID && clearTimeout(timerID);
          timerID = setTimeout(function () {
            flag = true;
            obj.value();
            // console.log('尺寸发生了变化');
          }, 1000);
        });
      }
    }
  },
  created () {
    getSearchHot()
      .then((data) => {
        // console.log(data);
        this.hots = data.result.hots;
      })
      .catch(function (err) {
        console.log(err);
      });
    if (getLocalStorage('searchHistory') === undefined || getLocalStorage('searchHistory') === null) {
      return;
    }
    this.searchHistory = getLocalStorage('searchHistory');
  }
};
</script>

<style scoped lang="scss">
  @import "../assets/css/variable";
  @import "../assets/css/mixin";

  .search {
    position: fixed;
    top: 184px;
    left: 0;
    right: 0;
    bottom: 0;
    @include bg_sub_color();
    .search-box {
      display: flex;
      align-items: center;
      margin: 40px 20px;
      background: #ebecec;
      border-radius: 30px;
      border-bottom: 1px solid #ccc;
      /*height: 60px;*/
      img{
        width: 40px;
        height: 40px;
        margin-left: 20px;
      }
      input{
        border: none;
        outline: none;
        background: transparent;
        @include font_size($font_medium);
        height: 60px;
        margin-left: 20px;
      }
    }
    .search-suggest {
      position: fixed;
      left: 0;
      right: 0;
      top: 300px;
      bottom: 0;
      overflow: hidden;
      @include bg_sub_color();
      li{
        display: flex;
        align-items: center;
        padding: 20px;
        box-sizing: border-box;
        border-bottom: 1px solid #ccc;
        img{
          width: 40px;
          height: 40px;
        }
        p{
          margin-left: 20px;
          @include font_color();
          @include font_size($font_medium);
        }
      }
    }
    .search-hot{
      h3{
        @include font_color();
        @include font_size($font_medium);
        padding: 10px 20px;
      }
      ul{
        display: flex;
        flex-wrap: wrap;
        li{
          height: 60px;
          line-height: 60px;
          border: 1px solid #ccc;
          border-radius: 30px;
          padding: 0 20px;
          @include font_color();
          @include font_size($font_medium);
          margin: 10px 20px;
        }
      }
    }
    .search-history{
      margin-top: 20px;
      li{
        padding: 20px;
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        border-bottom: 1px solid #ccc;
        align-items: center;
        .history-left{
          display: flex;
          align-items: center;
          img{
            width: 40px;
            height: 40px;
          }
          p{
            @include font_size($font_medium_s);
            @include font_color();
            margin-left: 20px;
          }
        }
        img{
          width: 30px;
          height: 30px;
        }
      }
    }
  }
</style>
