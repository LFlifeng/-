cc.Class({
    extends: cc.Component,

    properties: {
        spinBtn: {
            default: null, // The default value will be used only when the component attachin                    // to a node for the first time
            type: cc.Button, // optional, default is typeof default
            visible: true, // optional, default is true
            displayName: 'SpinBtn', // optional
        },
        wheelSp: {
            default: null,
            type: cc.Sprite
        },
        maxSpeed: {
            default: 5,
            type: cc.Float,
            max: 10,
            min: 2,
        },
        duration: {
            default: 3,
            type: cc.Float,
            max: 5,
            min: 1,
            tooltip: "减速前旋转时间"
        },
        acc: {
            default: 0.1,
            type: cc.Float,
            max: 0.2,
            min: 0.01,
            tooltip: "加速度"
        },
        targetID: {
            default: -1,
            type: cc.Integer,
            max: 11,
            min: 0,
            tooltip: "指定结束时的齿轮"
        },
        springback: {
            default: true,
            tooltip: "旋转结束是否回弹"
        },
        effectAudio: {
            default: null,
            url: cc.AudioClip
        }
    },
    // use this for initialization
    onLoad: function() {

        cc.log("....onload");
        this.wheelState = 0;
        this.curSpeed = 0;
        this.spinTime = 0; //减速前旋转时间
        this.gearNum = 12;
        this.defaultAngle = 360 / 12; //修正默认角度
        this.gearAngle = 360 / this.gearNum; //每个齿轮的角度
        this.wheelSp.node.rotation = this.defaultAngle;
        this.finalAngle = 0; //最终结果指定的角度
        this.effectFlag = 0; //用于音效播放
        this.aaNum = null;
        // this.targetID = null;
        if (!cc.sys.isBrowser) {
            cc.loader.loadRes('Sound/game_turntable', function(err, res) { if (err) { cc.log('...err:' + err); } });
        }
    },

    start: function() {
        // cc.log('....start');        
    },
    begin: function() {
        cc.find("Canvas/ChouJiang/meirichoujiang/noscroll").active = true;
        var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            userId: cc.vv.userMgr.userId,
            gametype: 'jinniuniu'
        };

        console.log(this.wheelState);
        var that = this;
        var fn = function(ret) {
            console.log(ret);
            if (that.wheelState !== 0) {
                return;
            }
            that.wheelState = 1;
            that.decAngle = 2 * 360; // 减速旋转两圈 

            //get请求                     
            that.curSpeed = 0;
            that.spinTime = 0;
            if (ret.errcode == 0) {
                cc.find("Canvas/ChouJiang/tishi/num").getComponent(cc.Label).string = ret.returnNUm;
                // cc.find("Canvas/ChouJiang/meirichoujiang/noscroll").active = true;                    
                //获取状态  
                console.log(111111111111111111)
                cc.find("Canvas/ChouJiang/zhedang").active = true;
                that.targetID = ret.rotaId;
                console.log(that.targetID);
            } else {
                // cc.find("Canvas/ChouJiang/meirichoujiang/jihui/jihuinum").getComponent(cc.Label).string = "1";
                cc.find("Canvas/ChouJiang/meirichoujiang/spin").active = true;
            }
        };
        cc.vv.http.sendRequest("/give_prize", data, fn);
    },
    caculateFinalAngle: function(targetID) {
        this.finalAngle = 360 - this.targetID * this.gearAngle + this.defaultAngle;
        if (this.springback) {
            this.finalAngle += this.gearAngle;
        }
    },
    editBoxDidBegin: function(edit) {},
    editBoxDidChanged: function(text) {},
    editBoxDidEndEditing: function(edit) {},
    // called every frame, uncomment this function to activate update callback
    update: function(dt) {
        if (this.wheelState === 0) {
            return;
        }
        // cc.log('......update');
        // cc.log('......state=%d',this.wheelState);

        this.effectFlag += this.curSpeed;
        if (!cc.sys.isBrowser && this.effectFlag >= this.gearAngle) {
            if (this.audioID) {
                // cc.audioEngine.pauseEffect(this.audioID);
            }
            // this.audioID = cc.audioEngine.playEffect(this.effectAudio,false);
            this.audioID = cc.audioEngine.playEffect(cc.url.raw('resources/Sound/game_turntable.mp3'));
            this.effectFlag = 0;
        }
        if (this.wheelState == 1) {
            // cc.log('....加速,speed:' + this.curSpeed);
            this.spinTime += dt;
            this.wheelSp.node.rotation = this.wheelSp.node.rotation + this.curSpeed;
            if (this.curSpeed <= this.maxSpeed) {
                this.curSpeed += this.acc;
            } else {
                // 什么时间停止
                if (this.spinTime < this.duration) {
                    return;
                }
                // cc.log('....开始减速');
                //设置目标角度
                this.finalAngle = 360 - this.targetID * this.gearAngle + this.defaultAngle;
                this.maxSpeed = this.curSpeed;
                if (this.springback) {
                    this.finalAngle += this.gearAngle;
                }
                this.wheelSp.node.rotation = this.finalAngle;

                // 判断返回的数据准备减速
                // if (this.targetID == 6) {                    
                this.wheelState = 2;
                // }

            }
        } else if (this.wheelState == 2) {
            // cc.log('......减速');
            var curRo = this.wheelSp.node.rotation; //应该等于finalAngle
            var hadRo = curRo - this.finalAngle;
            this.curSpeed = this.maxSpeed * ((this.decAngle - hadRo) / this.decAngle) + 0.2;
            this.wheelSp.node.rotation = curRo + this.curSpeed;

            if ((this.decAngle - hadRo) <= 0) {
                // cc.log('....停止');
                this.wheelState = 0;
                this.wheelSp.node.rotation = this.finalAngle;
                if (this.springback) {
                    //倒转一个齿轮
                    var act = new cc.rotateBy(0.6, -this.gearAngle);
                    var seq = cc.sequence(new cc.delayTime(0.2), act, cc.callFunc(this.showRes, this));
                    this.wheelSp.node.runAction(seq);
                } else {
                    this.showRes();
                }
            }
        }
    },

    showRes: function() {
        var Config = require("Config");
        cc.find("Canvas/ChouJiang/zhedang").active = false;
        if (!cc.sys.isBrowser) {
            // alert('恭喜你获得 ' + Config.gearInfo[this.targetID]);
            // if (this.targetID == 0 || this.targetID == 4 || this.targetID == 6 || this.targetID == 8 || this.targetID == 10) {
            this.node.getChildByName("cjjieguo").active = true;
            this.node.getChildByName("cjshibai").active = false;
            if (this.targetID == 0) {
                cc.find("Canvas/ChouJiang/meirichoujiang/cjjieguo/jiang1").active = false;
                cc.find("Canvas/ChouJiang/meirichoujiang/cjjieguo/jiang2").active = false;
                cc.find("Canvas/ChouJiang/meirichoujiang/cjjieguo/jiang3").active = false;
                cc.find("Canvas/ChouJiang/meirichoujiang/cjjieguo/jiang4").active = false;
                cc.find("Canvas/ChouJiang/meirichoujiang/cjjieguo/jiang5").active = true;
                cc.find("Canvas/ChouJiang/meirichoujiang/cjjieguo/jiang6").active = false;
            } else if (this.targetID == 4) {
                cc.find("Canvas/ChouJiang/meirichoujiang/cjjieguo/jiang1").active = true;
                cc.find("Canvas/ChouJiang/meirichoujiang/cjjieguo/jiang2").active = false;
                cc.find("Canvas/ChouJiang/meirichoujiang/cjjieguo/jiang3").active = false;
                cc.find("Canvas/ChouJiang/meirichoujiang/cjjieguo/jiang4").active = false;
                cc.find("Canvas/ChouJiang/meirichoujiang/cjjieguo/jiang5").active = false;
                cc.find("Canvas/ChouJiang/meirichoujiang/cjjieguo/jiang6").active = false;
            } else if (this.targetID == 6) {
                cc.find("Canvas/ChouJiang/meirichoujiang/cjjieguo/jiang1").active = false;
                cc.find("Canvas/ChouJiang/meirichoujiang/cjjieguo/jiang2").active = true;
                cc.find("Canvas/ChouJiang/meirichoujiang/cjjieguo/jiang3").active = false;
                cc.find("Canvas/ChouJiang/meirichoujiang/cjjieguo/jiang4").active = false;
                cc.find("Canvas/ChouJiang/meirichoujiang/cjjieguo/jiang5").active = false;
                cc.find("Canvas/ChouJiang/meirichoujiang/cjjieguo/jiang6").active = false;
            } else if (this.targetID == 8) {
                cc.find("Canvas/ChouJiang/meirichoujiang/cjjieguo/jiang1").active = false;
                cc.find("Canvas/ChouJiang/meirichoujiang/cjjieguo/jiang2").active = false;
                cc.find("Canvas/ChouJiang/meirichoujiang/cjjieguo/jiang3").active = true;
                cc.find("Canvas/ChouJiang/meirichoujiang/cjjieguo/jiang4").active = false;
                cc.find("Canvas/ChouJiang/meirichoujiang/cjjieguo/jiang5").active = false;
                cc.find("Canvas/ChouJiang/meirichoujiang/cjjieguo/jiang6").active = false;
            } else if (this.targetID == 10) {
                cc.find("Canvas/ChouJiang/meirichoujiang/cjjieguo/jiang1").active = false;
                cc.find("Canvas/ChouJiang/meirichoujiang/cjjieguo/jiang2").active = false;
                cc.find("Canvas/ChouJiang/meirichoujiang/cjjieguo/jiang3").active = false;
                cc.find("Canvas/ChouJiang/meirichoujiang/cjjieguo/jiang4").active = true;
                cc.find("Canvas/ChouJiang/meirichoujiang/cjjieguo/jiang5").active = false;
                cc.find("Canvas/ChouJiang/meirichoujiang/cjjieguo/jiang6").active = false;
            } else if (this.targetID == 2) {
                cc.find("Canvas/ChouJiang/meirichoujiang/cjjieguo/jiang1").active = false;
                cc.find("Canvas/ChouJiang/meirichoujiang/cjjieguo/jiang2").active = false;
                cc.find("Canvas/ChouJiang/meirichoujiang/cjjieguo/jiang3").active = false;
                cc.find("Canvas/ChouJiang/meirichoujiang/cjjieguo/jiang4").active = false;
                cc.find("Canvas/ChouJiang/meirichoujiang/cjjieguo/jiang5").active = false;
                cc.find("Canvas/ChouJiang/meirichoujiang/cjjieguo/jiang6").active = true;;
            }

        } else cc.log(Config.gearInfo[this.targetID]);
    }
});