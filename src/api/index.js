// 这个JS文件就是专门用于管理请求各种接口地址的
import NetWork from './network';

export const getBanner = () => NetWork.get('banner?type=2');
export const getPersonalized = () => NetWork.get('personalized?limit=6');
export const getNewAlbum = () => NetWork.get('album/newest');
export const getNewSong = () => NetWork.get('personalized/newsong');
export const getDetail = (data) => {
  return new Promise(function (resolve, reject) {
    NetWork.get('playlist/detail', data)
      .then(function (result) {
        const sliceNum = 500;
        /* 大于将近500首歌，播放时请求可能会报错 */
        // 当歌曲数量大于500首时，就只截取歌单中500首歌
        // console.log(result.playlist);
        // 当歌曲数量大于sliceNum（500）时，截取歌曲
        if (result.playlist.trackIds.length >= sliceNum) {
          // console.log(result.playlist.tracks.splice(0, 999));
          // 保存歌曲数量
          const trackIdsLength = result.playlist.trackIds.length;
          let minNum;
          // 利用循环算出最后一个差值。例：总数量1846，差值 = 1846 - 500 - 500 - 500 = 346
          for (let i = 1; ; i++) {
            // if (result.playlist.tracks.length / i < sliceNum) {
            if (sliceNum * i > trackIdsLength) {
              // console.log(result.playlist.tracks.length - i * sliceNum);
              minNum = -(trackIdsLength - i * sliceNum);
              // console.log('最小值', minNum);
              // console.log('跳出循环');
              break;
            }
          }
          // 定义一个数组用来保持分割后的歌曲
          let slicePack = [];
          // 起点
          let prevNum = 0;
          // 终点
          let nextNum = sliceNum;
          // 先将0到500的歌曲保存到数组中
          slicePack.push(result.playlist.trackIds.slice(prevNum, nextNum));
          // 然后将nextNum(500)赋值给prevNum
          prevNum = nextNum;
          // 将1000赋值给prevNum
          nextNum = nextNum * 2;
          /*
          * 逻辑说明：
          * tracklength = 1846, sliceNum = 500
          * 1. 保存0到500的歌曲
          * 2. 保存500到1000的歌曲
          * 3. 保存1000到1500的歌曲
          * 4. 保存1500到1846的歌曲
          * */
          // 循环得出最终分割后的数组
          for (let i = 2; ; i++) {
            // 判断nextNum是否大于等于歌曲数量
            if (nextNum >= trackIdsLength) {
              // console.log(prevNum, prevNum + minNum);
              // 大于歌曲数量，就获取最后一组歌曲数据。例：(1500, 1500 + 346）
              slicePack.push(result.playlist.trackIds.slice(prevNum, prevNum + minNum));
              // 然后跳出循环
              break;
            }
            // 依次将以500为倍数的歌曲添加到数组中
            slicePack.push(result.playlist.trackIds.slice(prevNum, nextNum));
            // 为下一次循环做准备，起点就为当前循环的终点
            prevNum = nextNum;
            // 终点就为当前循环起点的i倍
            nextNum = prevNum * i;
            // console.log(prevNum, nextNum);
          }
          // console.log(slicePack);
          if (result.playlist.trackIds.length === sliceNum) {
            result.playlist.trackIds = slicePack[0];
          } else {
            result.playlist.trackIds = slicePack;
            // result.playlist.tracks = result.playlist.tracks.splice(0, sliceNum);
          }
          // result.playlist.trackIds = result.playlist.trackIds.splice(0, sliceNum);
          // console.log(trackLength, trackIdsLength);
          /* 功能预定：当歌曲大于800首歌时，分每批800首的截取，一批一批的获取歌曲的数据，以防报错 */
        }
        // console.log(result.playlist);
        // console.log(result.playlist.tracks.length);
        resolve(result);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};
export const getAlbum = (data) => NetWork.get('album', data);
export const getSongDetail = (data) => NetWork.get('song/detail', data);
export const getSongLyric = (data) => NetWork.get('lyric', data);
export const getSongURL = (data) => NetWork.get('song/url?br=320000', data);
// export const getHotArtists = () => NetWork.get('top/artists?offset=0&limit=5');
// 获取热门歌手
export const getHotArtists = () => {
  return new Promise(function (resolve, reject) {
    NetWork.get('top/artists?offset=0&limit=5')
      .then(function (result) {
        resolve(result.artists);
      })
      .catch(function (err) {
        reject(err);
      })
    ;
  });
};
// 获取根据字幕分类的热门歌手
export const getLetterHotArtists = (letter) => {
  return new Promise(function (resolve, reject) {
    let letterArtists = [];
    // 获取指定类型的热门歌手的数据
    NetWork.all([
      NetWork.get(`artist/list?offset=0&limit=5&type=-1&area=-1&initial=${letter}`)
      // 3月25日从API服务请求的不同类型热门歌手返回的都是相同数据
      // 4月8日API服务器更新，cat参数失效，改为使用type和area
      /*
      * type 取值:
        -1:全部
        1:男歌手
        2:女歌手
        3:乐队

        area 取值:
        -1:全部
        7华语
        96欧美
        8:日本
        16韩国
        0:其他
      * */
    ])
      .then(function (result) {
        // resolve(result);
        // console.log(result[0]);
        // 循环遍历取出的数据，然后将所有取出的数据存放到一个主数组（letterArtists）中
        result[0].forEach(function (item) {
          letterArtists.push(...item.artists);
          // console.log(item.artists);
        });
        // console.log(result[0].artists);
        // console.log(letterArtists);
        // 返回letterArtists
        // console.log(letterArtists);
        resolve(letterArtists);
      })
      .catch(function (err) {
        reject(err);
      })
    ;
  });
};
// 获取所有的热门歌手（包含热门歌手和根据字幕分类的热门歌手）
export const getAllArtists = (letter) => {
  return new Promise(function (resolve, reject) {
    // 定义数组用来保存关键字
    let keys = ['热'];
    // 定义数组用来保存要获取的数据
    let list = [getHotArtists()];
    // 获取A到Z的所有字符并存储到数组中
    for (let i = 65; i < 91; i++) {
      let char = String.fromCharCode(i);
      // console.log(char);
      keys.push(char);
      // 以及获取到对应字符的热门歌手并存储进数组中
      list.push(getLetterHotArtists(char));
    }
    // 获取所有热门歌手数据
    NetWork.all(list)
      .then(function (result) {
        let obj = {};
        // 初始化关键字
        obj.keys = keys;
        // 初始化热门歌手信息
        obj.list = result;
        // console.log(obj);
        // 返回最终数据
        resolve(obj);
      })
      .catch(function (err) {
        reject(err);
      });
    // console.log(keys);
  });
};
export const getArtistsSongs = (data) => NetWork.get('artists', data);
export const getTopListDetail = () => {
  return new Promise(function (resolve, reject) {
    let category = {
      officialList: [
        { name: '云音乐飙升榜', id: 3 },
        { name: '云音乐新歌榜', id: 0 },
        { name: '网易原创歌曲榜', id: 2 },
        { name: '云音乐热歌榜', id: 1 }
      ],
      recList: [
        { name: '云音乐说唱榜', id: 23 },
        { name: '云音乐电音榜', id: 25 },
        { name: '云音乐欧美新歌榜', id: 32 },
        { name: '抖音排行榜', id: 26 },
        { name: '云音乐ACG音乐榜', id: 22 },
        { name: '云音乐古典音乐榜', id: 24 }
      ],
      globalList: [
        { name: '美国Billboard周榜', id: 6 },
        { name: 'UK排行榜周榜', id: 5 },
        { name: 'Beatport全球电子舞曲榜', id: 21 },
        { name: '日本Oricon周榜', id: 10 },
        { name: 'iTunes榜', id: 8 },
        { name: '英国Q杂志中文版周榜', id: 29 }
      ],
      otherList: [
        { name: 'KTV唛榜', id: 7 },
        { name: '法国 NRJ Vos Hits 周榜', id: 19 },
        { name: '新声榜', id: 27 },
        { name: '云音乐韩语榜', id: 28 },
        { name: '电竞音乐榜', id: 30 },
        { name: '云音乐欧美热歌榜', id: 31 }
      ],
      titles: { officialList: '官方榜', recList: '推荐榜', globalList: '全球榜', otherList: '更多榜单' }
    };
    NetWork.get('toplist/detail')
      .then(function (data) {
        data.list.forEach(function (obj) {
          let flag = false;
          for (let key in category) {
            for (let i = 0; i < category[key].length; i++) {
              if (category[key][i].name === obj.name) {
                category[key][i].rank = obj;
                flag = true;
                break;
              }
              if (flag) { break; }
            }
          }
        });
        // console.log(category);
        resolve(category);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};
export const getTopList = (data) => NetWork.get('top/list', data);
export const getSearchList = (data) => NetWork.get('search?type=1', data);
export const getSearchHot = () => NetWork.get('search/hot');
export const getEmailLogin = (data) => NetWork.get('login', data); // ?email=xxx@163.com&password=yyy
export const getUserPlayList = (data) => NetWork.get('user/playlist', data); // ?uid=32953014
