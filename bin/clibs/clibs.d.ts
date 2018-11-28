declare namespace clibs {
    /**
     * 碰撞检测类.
     *
     * @create 2018/11/9
     * @update 2018/11/9
     */
    class CollisionManager {
        private CLASSNAME;
        /**
         * 两个矩形对象碰撞检测.
         *
         * @param {any} obj1 碰撞物体A
         * @param {any} obj2 碰撞物体B
         * @return {boolean} 是否发生了碰撞(true: 碰撞了，false: 未碰撞)
         */
        static hitTestRect(obj1: any, obj2: any): boolean;
        toString(): string;
    }
}
/**
 * 功能集合.
 */
declare namespace clibs {
    /**
     * 拖拽移动管理类.
     *
     * @description 此拖拽管理类适用于: 拖拽对象，对象跟着对应移动.
     * @extends egret.EventDispatcher
     * @update 2018/11/09.
     */
    class DragRectManager extends egret.EventDispatcher implements egret.IEventDispatcher {
        CLASS_NAME: string;
        /** 是否按下触摸状态 */
        private _isDrag;
        /** 当前显示的对象 */
        private _display;
        /** 按下显示的对象 */
        private _dispalyDown;
        /** 全局坐标与当前显示对象的差值 */
        private _distance;
        /** 当前舞台 */
        private _stage;
        /** 矩形区域 */
        private _bounds;
        /** 舞台宽 */
        private _stageWidth;
        /** 舞台高 */
        private _stageHeight;
        /** 左侧排除的宽度 */
        private _excludeLeftWidth;
        /** 右侧排除的宽度 */
        private _excludeRightWidth;
        /** 顶部排除的高度 */
        private _excludeTopHeight;
        /** 底部排除的高度 */
        private _excludeBottomHeight;
        /** 名字 */
        name: string;
        /**
         * 构造函数.
         *
         * @param {object} display     需要添加拖拽效果的对象.
         * @param {object} stage       当前对象所在的舞台
         * @param {egret.Rectangle}    拖拽限制矩形区域
         */
        constructor(display: any, stage: any, bounds?: egret.Rectangle);
        /**
         * 碰触到屏幕触发.
         */
        private onTouchDown(evt);
        /**
         * 屏幕上移动触发.
         *
         * 拖拽对象随拖拽位移效果添加.
         */
        private onTouchMove(evt);
        /**
         * 停止碰触屏幕触发.
         *
         * 包括:手指抬起, 滑动超过范围
         */
        onTouchUp(evt: egret.TouchEvent): void;
        /**
         * 增加所有事件监听.
         */
        addEventListeners(): void;
        /**
         * 移除所有事件监听.
         */
        removeEventListeners(): void;
        /**
         * 移除拖拽效果.
         *
         * 移除之后也可以恢复拖拽效果，并且不需要再次实例化.
         */
        removeDrag(): void;
        /**
         * 恢复拖拽效果.
         *
         * 只适用于 `移除拖拽效果` 后的恢复.
         */
        restoreDrag(): void;
        /**
         * 检测边界.
         *
         * 如果超出边界控制在边界范围内.
         *
         * @param {egret.DisplayObject}  display 拖拽原生对象.
         * @param {egret.Rectangle}      bounds  范围矩形
         */
        checkBoundary(display: egret.DisplayObject, bounds: egret.Rectangle): void;
        /**
         * 获取拖拽`原生对象`.
         *
         * 原生对象: 要添加拖拽效果的对象.
         */
        readonly dragDisplay: any;
        /**
         * 拖拽状态获取.
         */
        /**
         * 拖拽状态设置.
         *
         * @param {boolean} status 拖拽状态(true或false)
         */
        isDrag: boolean;
        /**
         * 从舞台移除拖拽原生对象.
         */
        remove(): void;
        /**
         * 拖拽类名字获取.
         *
         * @return {string} 拖拽类的名字
         */
        toString(): string;
    }
}
declare namespace clibs {
    /**
     * 拖拽相关事件.
     * @update 2018/11/09.
     */
    class DragEvent extends egret.Event {
        /** 开始拖拽 */
        static DRAG_START: string;
        /** 移动拖拽 */
        static DRAG_MOVE: string;
        /** 停止拖拽 */
        static DRAG_STOP: string;
    }
}
/**
 * 组件基类.
 *
 * @updte 2018/11/28
 */
declare class BaseComponent extends eui.Component implements eui.UIComponent {
    /**
     * 组件基类.
     */
    constructor();
    protected partAdded(partName: string, instance: any): void;
    protected childrenCreated(): void;
    /** 初始化 */
    protected init(): void;
    /** 初始化数据 */
    protected initData(): void;
    /** 重置数据 */
    protected resetData(): void;
    /** 是否激活过了标记 */
    protected _isActived: boolean;
    isActived: boolean;
    /** 正确操作的对象标记 */
    protected _isRight: boolean;
    isRight: boolean;
}
