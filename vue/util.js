import axios from 'axios';
import env from '../../build/env';
import store from '../store'
// import packjson from '../../package.json';  读取packjson中的数据来检测是不是版本更新啦
// import semver from 'semver'; 版本检测
import { Message } from 'iview';


let util = {

};
// 浏览器标签页名称设置
util.title = function (title) {
    title = title || '智维IT监控系统';
    window.document.title = title;
};
// 设置请求后代数据的基础地址
const ajaxUrl = env === 'development'
    ? ' https://www.easy-mock.com/mock/5a6800f5ee559c30f16d8678/example_copy'
    : env === 'production'
        ? 'https://www.easy-mock.com/mock/5a6800f5ee559c30f16d8678/example_copy'
        : 'https://www.easy-mock.com/mock/5a6800f5ee559c30f16d8678/example_copy';

// 创建ajax请求实例对象       
util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 40000
});


util.lala=function(){
    this.$router.push({
        name: 'scan-history'
    })
}
// 这里配置ajax请求拦截
// util.ajax.interceptors.request.use(config => {
//     if (store.getters.token) {
//       config.headers['X-Token'] = getToken()  // 让每个请求携带自定义token 请根据实际情况自行修改 这里需要后代传过来数据自带
//     }
//     return config
//   }, error => {
//     // Do something with request error
//     console.log(error) // for debug
//     Promise.reject(error)
// })
// 这里配置ajax请求拦截
// util.ajax.interceptors.response.use(
//     response =>{
//     /**
//     * code为非20000是抛错 可结合自己业务进行修改
//     */
//       const res = response.data
//       if (res.code !== 20000) {
//         // Message({
//         //   message: res.data,
//         //   type: 'error',
//         // //   duration: 5 * 1000
//         // })
  
//         // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
//         if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
//           MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
//             confirmButtonText: '重新登录',
//             cancelButtonText: '取消',
//             type: 'warning'
//           }).then(() => {
//             store.dispatch('FedLogOut').then(() => {
//               location.reload()// 为了重新实例化vue-router对象 避免bug
//             })
//           })
//         }
//         return Promise.reject('error')
//       } else {
//         return response.data
//       }
//     },
//     error => {
//       console.log('err' + error)// for debug
//       Message({
//         message: error.message,
//         type: 'error',
//         duration: 5 * 1000
//       })
  
//       return Promise.reject(error)
//     }
//   )










util.inOf = function (arr, targetArr) {
    let res = true;
    arr.forEach(item => {
        if (targetArr.indexOf(item) < 0) {
            res = false;
        }
    });
    return res;
};

util.oneOf = function (ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
        return true;
    } else {
        return false;
    }
};

util.showThisRoute = function (itAccess, currentAccess) {
    if (typeof itAccess === 'object' && Array.isArray(itAccess)) {
        return util.oneOf(currentAccess, itAccess);
    } else {
        return itAccess === currentAccess;
    }
};

util.getRouterObjByName = function (routers, name) {
    if (!name || !routers || !routers.length) {
        return null;
    }
    // debugger;
    let routerObj = null;
    for (let item of routers) {
        if (item.name === name) {
            return item;
        }
        routerObj = util.getRouterObjByName(item.children, name);
        if (routerObj) {
            return routerObj;
        }
    }
    return null;
};

util.handleTitle = function (vm, item) {
    if (typeof item.title === 'object') {
        return vm.$t(item.title.i18n);
    } else {
        return item.title;
    }
};

util.setCurrentPath = function (vm, name) {
    let title = '';
    let isOtherRouter = false;
    vm.$store.state.app.routers.forEach(item => {
        if (item.children.length === 1) {
            if (item.children[0].name === name) {
                title = util.handleTitle(vm, item);
                if (item.name === 'otherRouter') {
                    isOtherRouter = true;
                }
            }
        } else {
            item.children.forEach(child => {
                if (child.name === name) {
                    title = util.handleTitle(vm, child);
                    if (item.name === 'otherRouter') {
                        isOtherRouter = true;
                    }
                }
            });
        }
    });
    let currentPathArr = [];
    if (name === 'home_index') {
        currentPathArr = [
            {
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
                path: '',
                name: 'home_index'
            }
        ];
    } else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home_index') {
        currentPathArr = [
            {
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
                path: '/home',
                name: 'home_index'
            },
            {
                title: title,
                path: '',
                name: name
            }
        ];
    } else {
        let currentPathObj = vm.$store.state.app.routers.filter(item => {
            if (item.children.length <= 1) {
                return item.children[0].name === name;
            } else {
                let i = 0;
                let childArr = item.children;
                let len = childArr.length;
                while (i < len) {
                    if (childArr[i].name === name) {
                        return true;
                    }
                    i++;
                }
                return false;
            }
        })[0];
        if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
            currentPathArr = [
                {
                    title: '首页',
                    path: '',
                    name: 'home_index'
                }
            ];
        } else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
            currentPathArr = [
                {
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: name
                }
            ];
        } else {
            let childObj = currentPathObj.children.filter((child) => {
                return child.name === name;
            })[0];
            currentPathArr = [
                {
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: currentPathObj.name
                },
                {
                    title: childObj.title,
                    path: currentPathObj.path + '/' + childObj.path,
                    name: name
                }
            ];
        }
    }
    vm.$store.commit('setCurrentPath', currentPathArr);

    return currentPathArr;
};

util.openNewPage = function (vm, name, argu, query) {
    let pageOpenedList = vm.$store.state.app.pageOpenedList;
    let openedPageLen = pageOpenedList.length;
    let i = 0;
    let tagHasOpened = false;
    while (i < openedPageLen) {
        if (name === pageOpenedList[i].name) { // 页面已经打开
            vm.$store.commit('pageOpenedList', {
                index: i,
                argu: argu,
                query: query
            });
            tagHasOpened = true;
            break;
        }
        i++;
    }
    if (!tagHasOpened) {
        let tag = vm.$store.state.app.tagsList.filter((item) => {
            if (item.children) {
                return name === item.children[0].name;
            } else {
                return name === item.name;
            }
        });
        tag = tag[0];
        if (tag) {
            tag = tag.children ? tag.children[0] : tag;
            if (argu) {
                tag.argu = argu;
            }
            if (query) {
                tag.query = query;
            }
            vm.$store.commit('increateTag', tag);
        }
    }
    vm.$store.commit('setCurrentPageName', name);
};

util.toDefaultPage = function (routers, name, route, next) {
    let len = routers.length;
    let i = 0;
    let notHandle = true;
    while (i < len) {
        if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
            route.replace({
                name: routers[i].children[0].name
            });
            notHandle = false;
            next();
            break;
        }
        i++;
    }
    if (notHandle) {
        next();
    }
};

util.fullscreenEvent = function (vm) {
    vm.$store.commit('initCachepage');
    // 权限菜单过滤相关
    vm.$store.commit('updateMenulist');
    // 全屏相关
};


// 检查iview是不是更新啦 在main.js中配置
// util.checkUpdate = function (vm) {
//     axios.get('https://api.github.com/repos/iview/iview-admin/releases/latest').then(res => {
//         let version = res.data.tag_name;
//         vm.$Notice.config({
//             duration: 0
//         });
//         if (semver.lt(packjson.version, version)) {
//             vm.$Notice.info({
//                 title: 'iview-admin更新啦',
//                 desc: '<p>iView-admin更新到了' + version + '了，去看看有哪些变化吧</p><a style="font-size:13px;" href="https://github.com/iview/iview-admin/releases" target="_blank">前往github查看</a>'
//             });
//         }
//     });
// };


export default util;
