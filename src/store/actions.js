import {
  SET_FULL_SCREEN,
  SET_MINI_PLAYER,
  SET_PLAYING,
  SET_MODE_TYPE,
  SET_MINI_LIST,
  SET_SONG_DETAIL,
  SET_SONG_LYRIC,
  SET_DEL_SONG,
  SET_CURRENT_INDEX,
  SET_CURRENT_TIME,
  SET_FAVORITE_SONG,
  SET_FAVORITE_LIST,
  SET_HISTORY_SONG,
  SET_HISTORY_LIST,
  SET_AUDIO_VOLUME,
  SET_USER_PROFILE,
  SET_LOGGING,
  SET_PLAY_ALL,
  SET_PLAY_OWN
} from './mutations-type';
import { getSongDetail, getSongLyric, getSongURL } from '../api/index';

export default {
  setFullScreen ({ commit }, flag) {
    // 设置普通播放器显示和隐藏
    commit(SET_FULL_SCREEN, flag);
  },
  setMiniPlayer ({ commit }, flag) {
    // 设置迷你播放器显示和隐藏
    commit(SET_MINI_PLAYER, flag);
  },
  setPlaying ({ commit }, flag) {
    // 设置播放状态
    commit(SET_PLAYING, flag);
  },
  setAudioVolume ({ commit }, value) {
    // 设置播放状态
    commit(SET_AUDIO_VOLUME, value);
  },
  setModeType ({ commit }, flag) {
    // 设置播放模式（单曲，随机，列表循环）
    commit(SET_MODE_TYPE, flag);
  },
  setMiniList ({ commit }, flag) {
    // 设置迷你播放器列表显示和隐藏
    commit(SET_MINI_LIST, flag);
  },
  // 设置歌曲详情信息
  async setSongDetail ({ commit }, obj) {
    /* 请求id数不能过多，否则会报错 */
    // 获取歌曲信息
    // console.log(ids);
    // console.log(obj.flag);
    const result = await getSongDetail({ ids: obj.ids.join(',') });
    // console.log(result);
    // 获取歌曲播放Url
    const urls = await getSongURL({ id: obj.ids.join(',') });
    // console.log(urls);
    // console.log(result);
    const list = [];
    // 遍历获取到的所有歌曲
    result.songs.forEach(function (value, i) {
      const obj = {};
      // 遍历获取到的歌曲url信息
      for (let j = 0; j < urls.data.length; j++) {
        const item = urls.data[j];
        // console.log(item);
        // 判断歌曲ID是否和歌曲URL的ID相匹配
        if (value.id === item.id) {
          // 匹配就存进对象中
          // console.log(item);
          if (item.url === null || item.url === undefined) {
            console.log('歇逼了，顺便ID是' + item.id);
            obj.usable = false;
          } else {
            obj.usable = true;
          }
          obj.isVip = item.payed === 1;
          // console.log(item.payed);
          // console.log(obj.isVip);
          obj.url = item.url;
          break;
        }
      }
      // 保存歌曲的名称
      obj.name = value.name;
      let singer = '';
      // 遍历艺术家对象
      value.ar.forEach(function (item, index) {
        // 倘若只有一名艺术家就直接保存
        if (index === 0) {
          singer = item.name;
        } else {
          // 否则就用-拼接每名艺术家
          singer += '-' + item.name;
        }
      });
      // 保存歌曲ID
      obj.id = value.id;
      // 保存歌手
      obj.singer = singer;
      // 保存歌曲的专辑图片Url
      // obj.picUrl = value.al.picUrl;
      // 保存歌曲的专辑信息
      obj.al = value.al;
      // 保存歌曲的创作者信息
      obj.ar = value.ar;
      // console.log(obj.url);
      // 将obj添加到list数组中
      list.push(obj);
    });
    // 判断是否要增加歌曲列表的数量
    if (obj.flag) {
      // 如果需要增加，就告诉mutations的方法需要将列表push到songs中。
      commit(SET_SONG_DETAIL, { list: list, flag: true });
    } else {
      // 如果不需要增加，就告诉mutations的方法直接将list赋值给songs
      commit(SET_SONG_DETAIL, { list: list, flag: false });
    }
  },
  // 设置歌曲的歌词数据
  async setSongLyric ({ commit }, id) {
    // 获取歌词
    const result = await getSongLyric({ id: id });
    const reg = /\[00:/g;
    // console.log(parseLyric(result.lrc.lyric));
    // console.log(result.lrc.lyric);
    // 判断歌曲是否有歌词
    if (result.lrc === undefined || result.lrc === null || result.lrc.lyric === '') {
      // 没有歌词就初始化一个占位歌词
      result.lrc = {
        version: 0,
        lyric: '[00:00.01]無題\n' +
          '[00:01.00]当前歌曲目前还没有歌词，所有尽情享受音乐吧~\n'
      };
    }
    // console.log(reg.test(result.lrc.lyric));
    let obj = {};
    if (reg.test(result.lrc.lyric)) {
      // 属于滚动歌词就格式化歌词并保存
      obj = parseLyric(result.lrc.lyric);
      obj.isScroll = true;
      // console.log(obj);
    } else {
      const strArr = result.lrc.lyric.split('\n');
      strArr.forEach(function (str, index) {
        // console.log(str, index);
        // console.log(index);
        obj[index + 1] = str;
      });
      obj.isScroll = false;
      // console.log(obj);
    }
    commit(SET_SONG_LYRIC, obj);
  },
  // 删除歌曲
  setDelSong ({ commit }, id) {
    commit(SET_DEL_SONG, id);
  },
  // 设置当前歌曲索引
  setCurrentIndex ({ commit }, id) {
    commit(SET_CURRENT_INDEX, id);
  },
  setCurrentTime ({ commit }, time) {
    commit(SET_CURRENT_TIME, time);
  },
  setFavoriteSong ({ commit }, song) {
    // 设置迷你播放器列表显示和隐藏
    commit(SET_FAVORITE_SONG, song);
  },
  setFavoriteList ({ commit }, list) {
    // 设置迷你播放器列表显示和隐藏
    commit(SET_FAVORITE_LIST, list);
  },
  setHistorySong ({ commit }, song) {
    // 设置迷你播放器列表显示和隐藏
    commit(SET_HISTORY_SONG, song);
  },
  setHistoryList ({ commit }, list) {
    // 设置迷你播放器列表显示和隐藏
    commit(SET_HISTORY_LIST, list);
  },
  setUserProfile ({ commit }, data) {
    commit(SET_USER_PROFILE, data);
  },
  setLogging ({ commit }, flag) {
    commit(SET_LOGGING, flag);
  },
  setPlayAll ({ commit }, flag) {
    commit(SET_PLAY_ALL, flag);
  },
  setPlayOwn ({ commit }, flag) {
    commit(SET_PLAY_OWN, flag);
  }
};

// 格式化歌词方法
function parseLyric (lrc) {
  const lyrics = lrc.split('\n');
  // [00:00.000] 作曲 : 林俊杰
  // 1.定义正则表达式提取[00:00.000]
  const reg1 = /\[\d*:\d*\.\d*\]/g;
  // 2.定义正则表达式提取 [00
  const reg2 = /\[\d*/i;
  // 3.定义正则表达式提取 :00
  // eslint-disable-next-line no-useless-escape
  const reg3 = /\:\d*/i;
  // 4.定义对象保存处理好的歌词
  const lyricObj = {};
  lyrics.forEach(function (lyric) {
    // 1.提取时间
    let timeStr = lyric.match(reg1);
    if (!timeStr) { return; }
    timeStr = timeStr[0];
    // 2.提取分钟
    const minStr = timeStr.match(reg2)[0].substr(1);
    // 3.提取秒钟
    const secondStr = timeStr.match(reg3)[0].substr(1);
    // 4.合并时间, 将分钟和秒钟都合并为秒钟
    const time = parseInt(minStr) * 60 + parseInt(secondStr);
    // 5.处理歌词
    const text = lyric.replace(reg1, '').trim();
    // 6.保存数据
    lyricObj[time] = text;
  });
  return lyricObj;
}
