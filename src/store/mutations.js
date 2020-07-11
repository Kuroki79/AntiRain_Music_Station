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
  SET_HISTORY_LIST,
  SET_HISTORY_SONG,
  SET_AUDIO_VOLUME,
  SET_USER_PROFILE,
  SET_LOGGING,
  SET_PLAY_ALL,
  SET_PLAY_OWN
} from './mutations-type';

export default {
  /*
  changeFullScreen (state, flag) {
    state.isFullScreen = flag;
  }
   */

  // 要想将常量设为方法名，需要用方括号括起来
  [SET_FULL_SCREEN] (state, flag) {
    state.isFullScreen = flag;
    if (flag) {
      // 显示普通播放器时，隐藏迷你播放器和迷你播放器列表
      state.isShowMiniPlayer = false;
      state.isShowMiniList = false;
    }
  },
  [SET_MINI_PLAYER] (state, flag) {
    state.isShowMiniPlayer = flag;
    if (flag) {
      // 显示迷你播放器时，隐藏普通播放器和迷你播放器列表
      state.isFullScreen = false;
      state.isShowMiniList = false;
    }
  },
  [SET_PLAYING] (state, flag) {
    state.isPlaying = flag;
  },
  [SET_AUDIO_VOLUME] (state, value) {
    state.audioVolume = value;
  },
  [SET_MODE_TYPE] (state, flag) {
    state.modeType = flag;
  },
  [SET_MINI_LIST] (state, flag) {
    state.isShowMiniList = flag;
  },
  [SET_SONG_DETAIL] (state, obj) {
    // 根据传入的flag来判断是要增加，还是覆盖
    if (obj.flag) {
      // console.log(obj.list);
      // 增加
      // state.songs.push(obj.list);
      obj.list.forEach(function (value) {
        state.songs.push(value);
      });
    } else {
      // 覆盖
      state.songs = obj.list;
    }
  },
  [SET_SONG_LYRIC] (state, lyric) {
    state.currentLyric = lyric;
  },
  [SET_DEL_SONG] (state, index) {
    // 判断index是否有传入
    if (index !== undefined) {
      // 有index传入，就将index作为索引删除对应歌曲
      state.songs.splice(index, 1);
    } else {
      // 否则就删除所有歌曲
      state.songs = [];
    }
    // 判断传入的index是否小于当前歌曲的index（删除当前歌曲之前的歌曲，当前索引应该要减一）
    if (index < state.currentIndex) {
      // 如果小于，就将当前的索引减一
      state.currentIndex -= 1;
    }
    // 判断歌曲列表中是否有元素
    if (state.songs.length === 0) {
      // 如果没有，就隐藏所有播放器界面，包括迷你播放器列表
      state.isFullScreen = false;
      state.isShowMiniPlayer = false;
      state.isShowMiniList = false;
    }
  },
  [SET_CURRENT_INDEX] (state, index) {
    // 判断传入的index是否小于0
    if (index < 0) {
      // 小于0就将index设置成最后一首歌的索引
      index = state.songs.length - 1;
    } else if (index > state.songs.length - 1) {
      // 否则就设置成第一首歌的索引
      index = 0;
    }
    state.currentIndex = index;
  },
  [SET_CURRENT_TIME] (state, time) {
    state.curTime = time;
  },
  [SET_FAVORITE_SONG] (state, song) {
    // 遍历收藏列表，寻找是否有和传入歌曲匹配的
    const result = state.favoriteList.find(function (currentValue) {
      // 有就返回true，没有就返回undefined
      return currentValue.id === song.id;
    });
    // 如果为undefined，就将歌曲添加到收藏列表中
    if (result === undefined) {
      state.favoriteList.push(song);
    }
  },
  [SET_FAVORITE_LIST] (state, list) {
    state.favoriteList = list;
  },
  [SET_HISTORY_SONG] (state, song) {
    // 遍历收藏列表，寻找是否有和传入歌曲匹配的
    const result = state.historyList.find(function (currentValue) {
      // 有就返回true，没有就返回undefined
      return currentValue.id === song.id;
    });
    // 如果为undefined，就将歌曲添加到收藏列表中
    if (result === undefined) {
      if (state.historyList.length > 30) {
        state.historyList.splice(0, 1);
      }
      state.historyList.push(song);
    }
  },
  [SET_HISTORY_LIST] (state, list) {
    state.historyList = list;
  },
  [SET_USER_PROFILE] (state, data) {
    state.userProfile = data;
  },
  [SET_LOGGING] (state, flag) {
    state.isLogin = flag;
  },
  [SET_PLAY_ALL] (state, flag) {
    state.isPlayAll = flag;
  },
  [SET_PLAY_OWN] (state, flag) {
    state.isPlayOwn = flag;
  }
};
