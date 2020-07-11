export default {
  getFullScreen (state) {
    return state.isFullScreen;
  },
  getMiniScreen (state) {
    return state.isShowMiniPlayer;
  },
  getShowMiniList (state) {
    return state.isShowMiniList;
  },
  getPlaying (state) {
    return state.isPlaying;
  },
  getModeType (state) {
    return state.modeType;
  },
  getSongs (state) {
    return state.songs;
  },
  getCurrentIndex (state) {
    return state.currentIndex;
  },
  getCurrentSong (state) {
    // 创建一个初始化的歌曲详情对象
    let obj = {
      name: '',
      singer: '',
      al: {
        picUrl: ''
      },
      ar: {},
      id: '',
      url: ''
    };
    // 判断songs中是否保存了歌曲信息
    if (state.songs.length !== 0) {
      // 如果有保存就获取当前索引下的歌曲信息
      obj = state.songs[state.currentIndex];
    }
    // 否则就返回初始化的歌曲信息，防止报错
    return obj;
  },
  getCurrentLyric (state) {
    return state.currentLyric;
  },
  getCurTime (state) {
    return state.curTime;
  },
  getFavoriteList (state) {
    return state.favoriteList;
  },
  getHistoryList (state) {
    return state.historyList;
  },
  getAudioVolume (state) {
    return state.audioVolume;
  },
  getUserProfile (state) {
    return state.userProfile;
  },
  getLogging (state) {
    return state.isLogin;
  },
  getPlayAll (state) {
    return state.isPlayAll;
  },
  getPlayOwn (state) {
    return state.isPlayOwn;
  }
};
