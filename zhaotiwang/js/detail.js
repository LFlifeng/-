var self = document.getElementsByClassName('bar-self')[0];
var afterLogin = document.getElementsByClassName('bar-afterLogin')[0]; 
var logout = document.getElementsByClassName('bar-logout')[0];
var login = document.getElementsByClassName('bar-right')[0];
var barAvatar = document.getElementsByClassName('bar-avatar')[0];
function init() {
    getSession();
    slideInSelf();
    clickLogout();
    test();
}
init();

function getSession() {
    var nickname = sessionStorage.getItem('name');
    var avatar = sessionStorage.getItem('avatar');
    if(nickname === null) {
        return false;
    }else{
        login.style.display = 'none';
        barAvatar.style.display = 'block';
        self.style.display = 'block';
        self.innerText = '您好， ' + nickname;
        barAvatar.src = avatar;
    }
}
function slideInSelf() {
    var arr = [self, afterLogin];
    for(var i = 0; i < arr.length; i++) {
        arr[i].onmouseover = function () {
            afterLogin.style.display = 'block';
        }
        arr[i].onmouseleave = function () {
            afterLogin.style.display = 'none';
        }
    }
}
function clickLogout() {
    logout.onclick = function () {
        console.log(2)
        sessionStorage.clear();
        location.reload();
    }
}
function test() {
    var video = document.getElementsByTagName('video')[0];
    
}