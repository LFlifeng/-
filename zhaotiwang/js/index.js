// 进入主页后判断是否有token及个人状态栏变化所需要的dom
var login = document.getElementsByClassName('bar-login')[0];
var register = document.getElementsByClassName('bar-register')[0];
// initSearch所需的dom
var search = document.getElementsByClassName('search')[0];
var magnifier = document.getElementsByClassName('bar-magnifier')[0];
var personBtn = document.getElementsByClassName('bar-personBtn')[0];
var afterLogin = document.getElementsByClassName('bar-afterLogin')[0];
var personName = document.querySelector('.bar-personBtn .bar-personName');
var personImg = document.querySelector('.bar-personBtn img');
// banner所需的dom
var bannerUl = document.getElementsByClassName('banner-ul')[0];
var bannerLi = document.getElementsByClassName('banner-li');
var bannerCircle = document.getElementsByClassName('banner-circle');
var leftArrow = document.getElementsByClassName('banner-leftArrow')[0];
var rightArrow = document.getElementsByClassName('banner-rightArrow')[0];
var arrowFlag = 1;
var circleFlag = 0;
// 搜索需要的dom
var searchInput = document.getElementsByClassName('input-search')[0];
var searchUllist = document.getElementsByClassName('search-ullist')[0];
// 注销功能的dom
var logout = document.getElementsByClassName('bar-logout')[0];
// 切换按钮样式所需的dom
var recommendVideo = document.getElementsByClassName('recommend-video')[0];
var newestVideo = document.getElementsByClassName('newest-video')[0];
var recommendArticle = document.getElementsByClassName('recommend-article')[0];
var newestArticle = document.getElementsByClassName('newest-article')[0];

function init() {
    // 进入主页时从session里拿东西，判断是否登陆
    getSession();
    // 鼠标移入个人状态栏设置及登出
    initPerson();
    // 鼠标移入显示搜索框
    initSearch();
    // 轮播图功能
    banner();
    // 进入页面后发送获取网站内容标题的请求
    getTitle();
    // 注销功能
    clickLogout();
    // 按钮状态切换功能
    btnChange();
}
init();
// 进入主页拿session中的数据
function getSession() {
    var token = sessionStorage.getItem('token');
    var nickname = sessionStorage.getItem('name');
    var avatar = sessionStorage.getItem('avatar');
    if(nickname === null) {
        return;
    }else{
        login.style.display = 'none';
        register.style.display = 'none';
        personBtn.style.display = 'block';
        personName.innerText = '您好， ' + nickname;
        personImg.src = avatar;
    }
}
// 鼠标移入显示输入框部分
function initSearch() {
    var arr = [search, magnifier];
    var arr2 = [personName, afterLogin];
    for(var i = 0; i < arr.length; i++) {
        arr[i].onmouseover = function() {
            search.style.display = 'block';
        }
        arr[i].onmouseleave = function() {
            search.style.display = 'none';
        }
    }
} 
// 鼠标移入显示个人状态部分
function initPerson() {
    console.log(personName)
    var arr = [personBtn, afterLogin];
    for(var i = 0; i < arr.length; i++) {
        arr[i].onmouseover = function () {
            afterLogin.style.display = 'block';
        }
        arr[i].onmouseleave = function () {
            afterLogin.style.display = 'none';
        }
    }
}
// 轮播图部分
function banner() {
    // 将伪数组变为数组
    var circleArr = [];
    for(var i = 0; i < bannerCircle.length; i++) {
        circleArr[i] = bannerCircle[i];
    }
    clickCircle(circleArr);
    clickArrow(circleArr);
}
function clickCircle(arr) {
    for(var i = 0; i < arr.length; i++) {
        (function (i) {
            arr[i].onclick = function () {
                if(arrowFlag === 4) {
                    arrowFlag = 1;
                    bannerUl.style.left = -1285 + 'px';
                }
                if(arrowFlag === 0) {
                    arrowFlag = 3;
                    bannerUl.style.left = -3855 + 'px';
                }
                arrowFlag = i + 1;
                circleFlag = arrowFlag * -1285;
                bannerMove(bannerUl, circleFlag);
                for(var j = 0; j < arr.length; j++) {
                    arr[j].classList.remove('active');
                }
                arr[i].classList.add('active');
            }
        })(i)
    }
}  
function clickArrow(arr) {
    leftArrow.onclick = function () {
        if(arrowFlag === 0) {
            bannerUl.style.left = -3855 + 'px';
            arrowFlag = 3;
        }
        arrowFlag--;
        var position = arrowFlag * -1285;
        bannerMove(bannerUl, position);
        for(var i = 0; i < arr.length; i++) {
            arr[i].classList.remove('active');
        }
        if(arrowFlag === 0) {
            arr[2].classList.add('active');
        }else{
            arr[arrowFlag - 1].classList.add('active');
        }
    }
    rightArrow.onclick = function () {
        if(arrowFlag === 4) {
            bannerUl.style.left = -1285 + 'px';
            arrowFlag = 1;
        }
        arrowFlag++;
        var position = arrowFlag * -1285;
        bannerMove(bannerUl, position);
        for(var j = 0; j < arr.length; j++) {
            arr[j].classList.remove('active');
        }
        if(arrowFlag === 4) {
            arr[0].classList.add('active');
        }else{
            arr[arrowFlag - 1].classList.add('active');
        }
    }
}
// 搜索部分
function getTitle() { 
    // 发送ajax
    var arr = ['科比', '科学', '詹姆斯', '詹娜', '杜兰特', '阿杜'];
    searchTitle(arr);
}
function searchTitle(arr) {
    var len = arr.length;
    searchInput.oninput = function () {
        var val = this.value;
        if(val === '') {
            searchUllist.style.display = 'none';
            return;
        }
        searchUllist.innerHTML = '';
        searchUllist.style.display = 'block';
        for(var i = 0; i < len; i++) {
            if(arr[i].indexOf(val) !== -1) {
                var li = document.createElement('li');
                li.innerText = arr[i];
                searchUllist.appendChild(li);
            }
        }
    }
}
// 注销功能
function clickLogout() {
    logout.onclick = function () {
        sessionStorage.clear();
        location.reload();
    }
}
// 按钮状态切换功能
function btnChange() {
    var arr = [recommendVideo, newestVideo];
    var arr2 = [recommendArticle, newestArticle];
    function btnClass(arr) {
        for(var i = 0; i < arr.length; i++) {
            arr[i].onclick = function () {
                for(var j = 0; j < arr.length; j++) {
                    arr[j].classList.remove('btn-active');
                }
                this.classList.add('btn-active')
            }
        }
    }
    btnClass(arr);
    btnClass(arr2);
}