var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var clibs;
(function (clibs) {
    /**
     * 组件基类.
     *
     * @updte 2018/11/28
     */
    var BaseComponent = (function (_super) {
        __extends(BaseComponent, _super);
        /**
         * 组件基类.
         */
        function BaseComponent() {
            var _this = _super.call(this) || this;
            /** 是否激活过了标记 */
            _this._isActived = false;
            // public get isActived() {
            // 	return this._isActived
            // }
            // public set isActived(value: boolean) {
            // 	this._isActived = value;
            // }
            /** 正确操作的对象标记 */
            _this._isRight = false;
            return _this;
        }
        BaseComponent.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
        };
        BaseComponent.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.init();
        };
        /** 初始化 */
        BaseComponent.prototype.init = function () {
        };
        /** 初始化数据 */
        BaseComponent.prototype.initData = function () {
        };
        /** 重置数据 */
        BaseComponent.prototype.resetData = function () {
        };
        Object.defineProperty(BaseComponent.prototype, "isRight", {
            get: function () {
                return this._isRight;
            },
            set: function (value) {
                this._isRight = value;
            },
            enumerable: true,
            configurable: true
        });
        return BaseComponent;
    }(eui.Component));
    clibs.BaseComponent = BaseComponent;
    __reflect(BaseComponent.prototype, "clibs.BaseComponent", ["eui.UIComponent"]);
})(clibs || (clibs = {}));
var clibs;
(function (clibs) {
    /**
     * 碰撞检测类.
     *
     * @create 2018/11/9
     * @update 2018/11/9
     */
    var CollisionManager = (function () {
        function CollisionManager() {
            this.CLASSNAME = 'CollisionManager';
        }
        /**
         * 两个矩形对象碰撞检测.
         *
         * @param {any} obj1 碰撞物体A
         * @param {any} obj2 碰撞物体B
         * @return {boolean} 是否发生了碰撞(true: 碰撞了，false: 未碰撞)
         */
        CollisionManager.hitTestRect = function (obj1, obj2) {
            //@see  [getBounds()](http://developer.egret.com/cn/apidoc/index/name/egret.DisplayObject)
            var rect1 = obj1.getBounds();
            var rect2 = obj2.getBounds();
            rect1.x = obj1.x;
            rect1.y = obj1.y;
            rect2.x = obj2.x;
            rect2.y = obj2.y;
            // @see [intersects()](http://developer.egret.com/cn/apidoc/index/name/egret.Rectangle)
            return rect1.intersects(rect2);
        };
        CollisionManager.prototype.toString = function () {
            return this.CLASSNAME;
        };
        return CollisionManager;
    }());
    clibs.CollisionManager = CollisionManager;
    __reflect(CollisionManager.prototype, "clibs.CollisionManager");
})(clibs || (clibs = {}));
/**
 * 功能集合.
 */
var clibs;
(function (clibs) {
    /**
     * 拖拽移动管理类.
     *
     * @description 此拖拽管理类适用于: 拖拽对象，对象跟着对应移动.
     * @extends egret.EventDispatcher
     * @update 2018/11/09.
     */
    var DragRectManager = (function (_super) {
        __extends(DragRectManager, _super);
        /**
         * 构造函数.
         *
         * @param {object} display     需要添加拖拽效果的对象.
         * @param {object} stage       当前对象所在的舞台
         * @param {egret.Rectangle}    拖拽限制矩形区域
         */
        function DragRectManager(display, stage, bounds) {
            var _this = 
            // constructor(display: any, stage: eui.Component, bounds?: egret.Rectangle) {
            _super.call(this) || this;
            _this.CLASS_NAME = 'DragManagerRect';
            /** 是否按下触摸状态 */
            _this._isDrag = false;
            /** 左侧排除的宽度 */
            _this._excludeLeftWidth = 0;
            /** 右侧排除的宽度 */
            _this._excludeRightWidth = 0;
            /** 顶部排除的高度 */
            _this._excludeTopHeight = 0;
            /** 底部排除的高度 */
            _this._excludeBottomHeight = 0;
            if (!display)
                return _this;
            _this._display = display;
            _this._stage = stage;
            if (!_this._distance)
                _this._distance = new egret.Point();
            // 绑定事件 start ===============
            _this._display.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.onTouchDown, _this);
            _this._display.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, _this.onTouchUp, _this);
            _this._display.addEventListener(egret.TouchEvent.TOUCH_END, _this.onTouchUp, _this);
            _this._stage.addEventListener(egret.Event.LEAVE_STAGE, _this.onTouchUp, _this);
            // 绑定事件 end ===============
            if (_this._stage instanceof egret.Stage) {
                _this._stageWidth = _this._stage.stageWidth;
                _this._stageHeight = _this._stage.stageHeight;
            }
            else {
                _this._stageWidth = _this._stage.width;
                _this._stageHeight = _this._stage.height;
            }
            // 范围控制 start ===============
            /** 当前游戏项目按钮组宽度 */
            _this._excludeRightWidth = (new BtnsGroup()).width;
            // this._excludeRightWidth = 30;
            /**
             * 游戏范围.
             *
             * 可以拖拽的矩形范围.
             */
            var gameRectangleWidth = _this._stageWidth - _this._excludeLeftWidth - _this._excludeRightWidth;
            var gameRectangleHeight = _this._stageHeight - _this._excludeTopHeight - _this._excludeBottomHeight;
            var gameRectangle = new egret.Rectangle(0, 0, gameRectangleWidth, _this._stageHeight);
            _this._bounds = bounds ? bounds : gameRectangle;
            return _this;
            // 范围控制 end ===============      
        }
        /**
         * 碰触到屏幕触发.
         */
        DragRectManager.prototype.onTouchDown = function (evt) {
            // Notice: 拖拽对象必须是 `this._stage` 的子元素，否则会出错.
            // 拖拽对象设为最上层
            this._stage.setChildIndex(this._display, this._stage.numChildren - 1);
            this._distance.x = evt.stageX - this._display.x;
            this._distance.y = evt.stageY - this._display.y;
            // 检测边界
            this.checkBoundary(this._display, this._bounds);
            this._isDrag = true;
            this._dispalyDown = this._display;
            if (this._isDrag) {
                this._stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
                // 派发一个消息
                this.dispatchEventWith(clibs.DragEvent.DRAG_START);
            }
        };
        /**
         * 屏幕上移动触发.
         *
         * 拖拽对象随拖拽位移效果添加.
         */
        DragRectManager.prototype.onTouchMove = function (evt) {
            if (!this._isDrag)
                return;
            if (this._dispalyDown == this._display) {
                this._display.x = evt.stageX - this._distance.x;
                this._display.y = evt.stageY - this._distance.y;
                this.checkBoundary(this._display, this._bounds);
                this.dispatchEventWith(clibs.DragEvent.DRAG_MOVE);
            }
        };
        /**
         * 停止碰触屏幕触发.
         *
         * 包括:手指抬起, 滑动超过范围
         */
        DragRectManager.prototype.onTouchUp = function (evt) {
            if (this._display && this._dispalyDown == this._display) {
                this._isDrag = false;
                this._stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
                this._stage.removeEventListener(egret.Event.LEAVE_STAGE, this.onTouchUp, this);
                this.dispatchEventWith(clibs.DragEvent.DRAG_STOP);
            }
        };
        /**
         * 增加所有事件监听.
         */
        DragRectManager.prototype.addEventListeners = function () {
            this._display.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchDown, this);
            this._display.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
            this._display.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchUp, this);
            this._stage.addEventListener(egret.Event.LEAVE_STAGE, this.onTouchUp, this);
        };
        /**
         * 移除所有事件监听.
         */
        DragRectManager.prototype.removeEventListeners = function () {
            if (this._display.hasEventListener(egret.TouchEvent.TOUCH_BEGIN)) {
                this._display.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchDown, this);
            }
            if (this._display.hasEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE)) {
                this._display.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchUp, this);
            }
            if (this._display.hasEventListener(egret.TouchEvent.TOUCH_END)) {
                this._display.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchUp, this);
            }
            if (this._stage.hasEventListener(egret.Event.LEAVE_STAGE)) {
                this._stage.removeEventListener(egret.Event.LEAVE_STAGE, this.onTouchUp, this);
            }
        };
        /**
         * 移除拖拽效果.
         *
         * 移除之后也可以恢复拖拽效果，并且不需要再次实例化.
         */
        DragRectManager.prototype.removeDrag = function () {
            this.removeEventListeners();
        };
        /**
         * 恢复拖拽效果.
         *
         * 只适用于 `移除拖拽效果` 后的恢复.
         */
        DragRectManager.prototype.restoreDrag = function () {
            this.addEventListeners();
        };
        /**
         * 检测边界.
         *
         * 如果超出边界控制在边界范围内.
         *
         * @param {egret.DisplayObject}  display 拖拽原生对象.
         * @param {egret.Rectangle}      bounds  范围矩形
         */
        DragRectManager.prototype.checkBoundary = function (display, bounds) {
            // 右边界限制
            if (display.x >= (bounds.width - display.width))
                display.x = bounds.width - display.width;
            // 左边界限制
            if (display.x <= bounds.x)
                display.x = bounds.x;
            // 下边界限制
            if (display.y >= (bounds.height - display.height))
                display.y = bounds.height - display.height;
            // 上边界限制
            if (display.y <= bounds.y)
                display.y = bounds.y;
        };
        Object.defineProperty(DragRectManager.prototype, "dragDisplay", {
            /**
             * 获取拖拽`原生对象`.
             *
             * 原生对象: 要添加拖拽效果的对象.
             */
            get: function () {
                return this._display;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DragRectManager.prototype, "isDrag", {
            /**
             * 拖拽状态获取.
             */
            get: function () {
                return this._isDrag;
            },
            /**
             * 拖拽状态设置.
             *
             * @param {boolean} status 拖拽状态(true或false)
             */
            set: function (status) {
                this._isDrag = status;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 从舞台移除拖拽原生对象.
         */
        DragRectManager.prototype.remove = function () {
            if (this._stage && this._display) {
                this._stage.removeChild(this._display);
            }
        };
        /**
         * 拖拽类名字获取.
         *
         * @return {string} 拖拽类的名字
         */
        DragRectManager.prototype.toString = function () {
            return this.CLASS_NAME;
        };
        return DragRectManager;
    }(egret.EventDispatcher));
    clibs.DragRectManager = DragRectManager;
    __reflect(DragRectManager.prototype, "clibs.DragRectManager", ["egret.IEventDispatcher"]);
})(clibs || (clibs = {}));
var clibs;
(function (clibs) {
    /**
     * 拖拽相关事件.
     * @update 2018/11/09.
     */
    var DragEvent = (function (_super) {
        __extends(DragEvent, _super);
        function DragEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /** 开始拖拽 */
        DragEvent.DRAG_START = 'dragsSart';
        /** 移动拖拽 */
        DragEvent.DRAG_MOVE = 'dragMove';
        /** 停止拖拽 */
        DragEvent.DRAG_STOP = 'dragStop';
        return DragEvent;
    }(egret.Event));
    clibs.DragEvent = DragEvent;
    __reflect(DragEvent.prototype, "clibs.DragEvent");
})(clibs || (clibs = {}));
var clibs;
(function (clibs) {
    /**
     * 图片资源切换控件.
     *
     * @update 2018/11/28
     *
     * @extends eui.Image
     * @desc
     * 初始数据设置:
     * 1. 如果是期望图片切换的对象，需设置 `isRight = true`，并设置激活时候的图片资源 `activedSource`;
     *    默认 `isRight = false` 不需要设置激活时候的图片资源
     * 2. 如果是期望图片切换的对象，且在切换时需要改变位置，需要设置 `isActivedMove = true`,
     *    并设置 `activeMovePointX` 和 `activeMovePointY`; 默认 `isActivedMove = false`
     *
     * 初始必须调用的方法：init();
     * @example
     */
    var ImageChange = (function (_super) {
        __extends(ImageChange, _super);
        /**
         * 图片资源切换控件.
         *
         * 正确的对象点击，才行进行图片资源切换.
         */
        function ImageChange() {
            var _this = _super.call(this) || this;
            /** 需要移动的位置坐标 */
            _this.movePoint = new egret.Point(0, 0);
            /** 激活的时候是否需要移动位置 */
            _this._isActivedMove = false;
            _this.activeMovePointX = 0;
            _this.activeMovePointY = 0;
            /** 是否激活过了标记 */
            _this._isActived = false;
            // public get isActived() {
            // 	return this._isActived;
            // }
            // public set isActived(value: boolean) {
            // 	this._isActived = value;
            // }
            /** 正确操作的对象标记 */
            _this._isRight = false;
            /** 默认显示的图片路径 */
            _this._defaultSource = '';
            /** 激活后显示的图片路径 */
            _this._activedSource = '';
            return _this;
        }
        ImageChange.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
        };
        /**
         * 初始化.
         */
        ImageChange.prototype.init = function () {
            this.initData();
            this.addEventHandle();
        };
        ImageChange.prototype.initData = function () {
            this._defaultSource = this.source;
            if (this._isActivedMove) {
                this.initPoint = new egret.Point(this.x, this.y);
                this.movePoint = new egret.Point(this.activeMovePointX, this.activeMovePointY);
            }
        };
        Object.defineProperty(ImageChange.prototype, "isActivedMove", {
            set: function (value) {
                this._isActivedMove = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ImageChange.prototype, "isRight", {
            get: function () {
                return this._isRight;
            },
            set: function (value) {
                this._isRight = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ImageChange.prototype, "activedSource", {
            /**
             * 激活后显示的图片设置.
             */
            set: function (source) {
                var _source = source ? source : '';
                this._activedSource = _source;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 添加事件处理
         */
        ImageChange.prototype.addEventHandle = function () {
            if (this.hasEventListener(egret.TouchEvent.TOUCH_TAP))
                return;
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        };
        /**
         * 重置数据.
         */
        ImageChange.prototype.resetData = function () {
            this._isActived = false;
            if (this._isRight) {
                this.source = this._defaultSource;
            }
            this.source = this._defaultSource;
            if (this._isActivedMove) {
                this.x = this.initPoint.x;
                this.y = this.initPoint.y;
            }
        };
        /**
         * 移除事件处理.
         */
        ImageChange.prototype.removeEventHandle = function () {
            if (this.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
                this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
            }
        };
        ImageChange.prototype.onTap = function () {
            var _isRight = this._isRight;
            // 是正确的对象
            if (_isRight) {
                // 已经激活过
                if (this._isActived)
                    return;
                // 设置为激活过状态.
                this._isActived = true;
                // 切换图片资源
                this.source = this._activedSource;
                if (this._isActivedMove) {
                    this.x = this.movePoint.x;
                    this.y = this.movePoint.y;
                }
            }
            this.dispatchEventWith(ImageChangeEvent.TAP);
        };
        return ImageChange;
    }(eui.Image));
    clibs.ImageChange = ImageChange;
    __reflect(ImageChange.prototype, "clibs.ImageChange");
    var ImageChangeEvent = (function () {
        function ImageChangeEvent() {
        }
        /** 点击了 */
        ImageChangeEvent.TAP = 'TAP';
        return ImageChangeEvent;
    }());
    clibs.ImageChangeEvent = ImageChangeEvent;
    __reflect(ImageChangeEvent.prototype, "clibs.ImageChangeEvent");
})(clibs || (clibs = {}));
var clibs;
(function (clibs) {
    /**
     * 图片切换组件.
     *
     * @update 2018/11/28
     *
     * @example
     */
    var ImageChangeComponent = (function (_super) {
        __extends(ImageChangeComponent, _super);
        /**
         * 图片切换.
         *
         * 正确的对象点击，才行进行图片切换.
         */
        function ImageChangeComponent() {
            var _this = _super.call(this) || this;
            /** 默认显示的图片路径 */
            _this._defaultSource = '';
            /** 激活后显示的图片路径 */
            _this._activedSource = '';
            return _this;
        }
        ImageChangeComponent.prototype.init = function () {
            this.addEventHandle();
        };
        Object.defineProperty(ImageChangeComponent.prototype, "defaultSource", {
            /**
             * 默认显示的图片设置.
             */
            set: function (source) {
                var _source = source ? source : '';
                console.log('图片', this.img);
                this.img.source = _source;
                this._defaultSource = _source;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ImageChangeComponent.prototype, "activedSource", {
            /**
             * 激活后显示的图片设置.
             */
            set: function (source) {
                var _source = source ? source : '';
                this._activedSource = _source;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 添加事件处理
         */
        ImageChangeComponent.prototype.addEventHandle = function () {
            if (this.hasEventListener(egret.TouchEvent.TOUCH_TAP))
                return;
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        };
        /**
         * 重置数据.
         */
        ImageChangeComponent.prototype.resetData = function () {
            this.img.source = this._defaultSource;
            this._isActived = false;
        };
        /**
         * 移除事件处理.
         */
        ImageChangeComponent.prototype.removeEventHandle = function () {
            if (this.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
                this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
            }
        };
        ImageChangeComponent.prototype.onTap = function () {
            var _isRight = this._isRight;
            // 是正确的对象
            if (_isRight) {
                this.img.source = this._activedSource;
                // 设置为激活过状态.
                this._isActived = true;
            }
            this.dispatchEventWith(clibs.ImageChangeEvent.TAP);
        };
        return ImageChangeComponent;
    }(clibs.BaseComponent));
    __reflect(ImageChangeComponent.prototype, "ImageChangeComponent");
})(clibs || (clibs = {}));
