import modeType from './modeType';
export default {
  isFullScreen: false,
  isShowMiniPlayer: false,
  isShowMiniList: false,
  isPlaying: false,
  isPlayAll: false,
  isPlayOwn: false,
  modeType: modeType.loop,
  songs: [],
  currentSong: {},
  currentIndex: 0,
  currentLyric: {},
  curTime: 0,
  favoriteList: [],
  historyList: [],
  audioVolume: 1,
  userProfile: {},
  isLogin: false
};
