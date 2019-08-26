var timer;
function backToPrevious() {
    var back = document.getElementsByClassName('back')[0];
    if(back === null) {
        return;
    }
    clickToPrevious(back);
}
function clickToPrevious(back) {
    back.onclick = function () {
        window.history.go(-1);
    }
}

// 去字符串中的空格
function replaceSpace(obj) {
    for(var i in obj) {
        obj[i] = obj[i].replace(/\s*/g,"");
    }
    return obj;
}
// 判断是否是数字
function ifNum(num) {
    num = isNaN(Number(num));
    return !num;
}
// 判断是否是大小写字母和数字
function ifReg(str) {
    var reg = /^[0-9a-zA-Z]+$/;
    return reg.test(str);
}
// 轮播图移动插件
function bannerMove(element, targetPosition) {
    clearInterval(timer);
    timer = setInterval(function () {
        var nowPosition = element.offsetLeft;
        if(nowPosition === targetPosition) {
            clearInterval(timer);
            return;
        }
        var steps = (targetPosition - nowPosition) / 10;
        if(targetPosition > nowPosition){
            steps = Math.ceil(steps);
        }else{
            steps = Math.floor(steps);
        }
        element.style.left = nowPosition + steps + 'px';
    }, 15)
}
