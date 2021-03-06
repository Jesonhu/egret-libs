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
var cTools_libs;
(function (cTools_libs) {
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
    cTools_libs.CollisionManager = CollisionManager;
    __reflect(CollisionManager.prototype, "cTools_libs.CollisionManager");
})(cTools_libs || (cTools_libs = {}));
/**
 * 功能集合
 *
 * @update 2018/11/09.
 */
var cTools_libs;
(function (cTools_libs) {
    /**
     * 拖拽移动管理类.
     *
     * @description 此拖拽管理类适用于: 拖拽对象，对象跟着对应移动.
     * @extends egret.EventDispatcher
     */
    var DragManagerRect = (function (_super) {
        __extends(DragManagerRect, _super);
        /**
         * 构造函数.
         *
         * @param {object} display     需要添加拖拽效果的对象.
         * @param {object} stage       当前对象所在的舞台
         * @param {egret.Rectangle}    拖拽限制矩形区域
         */
        function DragManagerRect(display, stage, bounds) {
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
            // this._excludeRightWidth = (new BtnsGroup()).width;
            _this._excludeRightWidth = 30;
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
        DragManagerRect.prototype.onTouchDown = function (evt) {
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
                this.dispatchEventWith(cTools_libs.DragEvent.DRAG_START);
            }
        };
        /**
         * 屏幕上移动触发.
         *
         * 拖拽对象随拖拽位移效果添加.
         */
        DragManagerRect.prototype.onTouchMove = function (evt) {
            if (!this._isDrag)
                return;
            if (this._dispalyDown == this._display) {
                this._display.x = evt.stageX - this._distance.x;
                this._display.y = evt.stageY - this._distance.y;
                this.checkBoundary(this._display, this._bounds);
                this.dispatchEventWith(cTools_libs.DragEvent.DRAG_MOVE);
            }
        };
        /**
         * 停止碰触屏幕触发.
         *
         * 包括:手指抬起, 滑动超过范围
         */
        DragManagerRect.prototype.onTouchUp = function (evt) {
            if (this._display && this._dispalyDown == this._display) {
                this._isDrag = false;
                this._stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
                this._stage.removeEventListener(egret.Event.LEAVE_STAGE, this.onTouchUp, this);
                this.dispatchEventWith(cTools_libs.DragEvent.DRAG_STOP);
            }
        };
        /**
         * 增加所有事件监听.
         */
        DragManagerRect.prototype.addEventListeners = function () {
            this._display.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchDown, this);
            this._display.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
            this._display.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchUp, this);
            this._stage.addEventListener(egret.Event.LEAVE_STAGE, this.onTouchUp, this);
        };
        /**
         * 移除所有事件监听.
         */
        DragManagerRect.prototype.removeEventListeners = function () {
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
        DragManagerRect.prototype.removeDrag = function () {
            this.removeEventListeners();
        };
        /**
         * 恢复拖拽效果.
         *
         * 只适用于 `移除拖拽效果` 后的恢复.
         */
        DragManagerRect.prototype.restoreDrag = function () {
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
        DragManagerRect.prototype.checkBoundary = function (display, bounds) {
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
        Object.defineProperty(DragManagerRect.prototype, "dragDisplay", {
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
        Object.defineProperty(DragManagerRect.prototype, "isDrag", {
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
        DragManagerRect.prototype.remove = function () {
            if (this._stage && this._display) {
                this._stage.removeChild(this._display);
            }
        };
        /**
         * 拖拽类名字获取.
         *
         * @return {string} 拖拽类的名字
         */
        DragManagerRect.prototype.toString = function () {
            return this.CLASS_NAME;
        };
        return DragManagerRect;
    }(egret.EventDispatcher));
    cTools_libs.DragManagerRect = DragManagerRect;
    __reflect(DragManagerRect.prototype, "cTools_libs.DragManagerRect", ["egret.IEventDispatcher"]);
})(cTools_libs || (cTools_libs = {}));
/**
 * 功能集合
 */
var cTools_libs;
(function (cTools_libs) {
    /** ===========================================================
     * 类名不为 EventType.
     * @update 2018/11/09.
     *  ===========================================================
     */
    /**
     * 拖拽事件类类型(名称).
     */
    var DragEvent = (function () {
        function DragEvent() {
        }
        /** 开始拖拽 */
        DragEvent.DRAG_START = 'dragsSart';
        /** 移动拖拽 */
        DragEvent.DRAG_MOVE = 'dragMove';
        /** 停止拖拽 */
        DragEvent.DRAG_STOP = 'dragStop';
        return DragEvent;
    }());
    cTools_libs.DragEvent = DragEvent;
    __reflect(DragEvent.prototype, "cTools_libs.DragEvent");
})(cTools_libs || (cTools_libs = {}));
