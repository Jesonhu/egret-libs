/**
 * 功能集合
 * 
 * @update 2018/11/09.
 */
namespace libs {
  /**
   * 拖拽移动管理类.
   * 
   * @description 此拖拽管理类适用于: 拖拽对象，对象跟着对应移动.
   * @extends egret.EventDispatcher 
   */
  export class DragManagerRect extends egret.EventDispatcher implements egret.IEventDispatcher {

    public CLASS_NAME: string = 'DragManagerRect'

    /** 是否按下触摸状态 */
    private _isDrag: boolean = false
    /** 当前显示的对象 */
    // private _display: egret.DisplayObject
    private _display: any
    /** 按下显示的对象 */
    private _dispalyDown: any
    /** 全局坐标与当前显示对象的差值 */
    private _distance: egret.Point
    /** 当前舞台 */
    private _stage: eui.Component
    /** 矩形区域 */
    private _bounds: egret.Rectangle
    /** 舞台宽 */
    private _stageWidth: number
    /** 舞台高 */
    private _stageHeight: number

    /** 左侧排除的宽度 */
    private _excludeLeftWidth: number = 0
    /** 右侧排除的宽度 */
    private _excludeRightWidth: number = 0
    /** 顶部排除的高度 */
    private _excludeTopHeight: number = 0
    /** 底部排除的高度 */
    private _excludeBottomHeight: number = 0

    
    /** 名字 */
    public name: string

    /**
     * 构造函数.
     * 
     * @param {object} display     需要添加拖拽效果的对象.
     * @param {object} stage       当前对象所在的舞台
     * @param {egret.Rectangle}    拖拽限制矩形区域
     */
    // constructor(display: egret.DisplayObject, stage: any, bounds?: egret.Rectangle) {
    constructor(display: any, stage: eui.Component, bounds?: egret.Rectangle) {
      super();
      
      if (!display) return;

      this._display = display;
      this._stage = stage;

      if (!this._distance) this._distance = new egret.Point();

      // 绑定事件 start ===============
      this._display.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchDown, this);
      this._display.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchUp, this);
      this._display.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchUp, this);
      this._stage.addEventListener(egret.Event.LEAVE_STAGE, this.onTouchUp, this);
      // 绑定事件 end ===============

      if (this._stage instanceof egret.Stage) {
        this._stageWidth = this._stage.stageWidth;
        this._stageHeight = this._stage.stageHeight;
      } else {
        this._stageWidth = this._stage.width;
        this._stageHeight = this._stage.height;
      }

      // 范围控制 start ===============
      /** 当前游戏项目按钮组宽度 */
      // const btnGroupWith = (new BtnsGroup()).width;
      this._excludeRightWidth = (new BtnsGroup()).width;

      /**
       * 游戏范围.
       * 
       * 可以拖拽的矩形范围.
       */
      const gameRectangleWidth: number = this._stageWidth - this._excludeLeftWidth - this._excludeRightWidth;
      const gameRectangleHeight: number = this._stageHeight - this._excludeTopHeight - this._excludeBottomHeight;
      const gameRectangle = new egret.Rectangle(0, 0, gameRectangleWidth, this._stageHeight);
      this._bounds = bounds ? bounds : gameRectangle;
      // 范围控制 end ===============      
    }

    /**
     * 碰触到屏幕触发.
     */
    private onTouchDown(evt: egret.TouchEvent) {

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
        this.dispatchEventWith(DragEvent.DRAG_START);
      }
    }

    /**
     * 屏幕上移动触发. 
     * 
     * 拖拽对象随拖拽位移效果添加.
     */
    private onTouchMove(evt: egret.TouchEvent) {

      if (!this._isDrag) return;     

      if (this._dispalyDown == this._display) {    
        this._display.x = evt.stageX - this._distance.x;
        this._display.y = evt.stageY - this._distance.y;

        this.checkBoundary(this._display, this._bounds);

        this.dispatchEventWith(DragEvent.DRAG_MOVE);
      }
    }

    /**
     * 停止碰触屏幕触发. 
     * 
     * 包括:手指抬起, 滑动超过范围
     */
    onTouchUp(evt: egret.TouchEvent) {
      if (this._display && this._dispalyDown == this._display) {
        this._isDrag = false;
        this._stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        this._stage.removeEventListener(egret.Event.LEAVE_STAGE, this.onTouchUp, this);
        this.dispatchEventWith(DragEvent.DRAG_STOP);
      }
    }

    /**
     * 增加所有事件监听. 
     */
    public addEventListeners() {
      this._display.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchDown, this);
      this._display.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
      this._display.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchUp, this);
      this._stage.addEventListener(egret.Event.LEAVE_STAGE, this.onTouchUp, this);
    }

    /**
     * 移除所有事件监听. 
     */
    public removeEventListeners() {
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

    }

    /**
     * 移除拖拽效果.
     * 
     * 移除之后也可以恢复拖拽效果，并且不需要再次实例化.
     */
    public removeDrag() {
      this.removeEventListeners();
    }

    /**
     * 恢复拖拽效果.
     * 
     * 只适用于 `移除拖拽效果` 后的恢复.
     */
    public restoreDrag() {
      this.addEventListeners();
    }

    /**
     * 检测边界. 
     * 
     * 如果超出边界控制在边界范围内.
     * 
     * @param {egret.DisplayObject}  display 拖拽原生对象.
     * @param {egret.Rectangle}      bounds  范围矩形
     */
    checkBoundary(display: egret.DisplayObject, bounds: egret.Rectangle) {
      // 右边界限制
      if ( display.x >= (bounds.width - display.width) ) display.x = bounds.width - display.width;

      // 左边界限制
      if (display.x <= bounds.x) display.x = bounds.x;

      // 下边界限制
      if ( display.y >= (bounds.height - display.height) ) display.y = bounds.height - display.height;

      // 上边界限制
      if (display.y <= bounds.y) display.y = bounds.y;
    }

    /**
     * 获取拖拽`原生对象`.
     * 
     * 原生对象: 要添加拖拽效果的对象. 
     */
    public get dragDisplay() {
      return this._display;
    }

    /**
     * 拖拽状态获取. 
     */
    public get isDrag() {
      return this._isDrag;
    }

    /**
     * 拖拽状态设置. 
     * 
     * @param {boolean} status 拖拽状态(true或false)
     */
    public set isDrag(status: boolean) {
      this._isDrag = status;
    }

    /**
     * 从舞台移除拖拽原生对象.
     */
    public remove() {
      if (this._stage && this._display) {
        this._stage.removeChild(this._display);
      }
    }

    /**
     * 拖拽类名字获取. 
     * 
     * @return {string} 拖拽类的名字
     */
    public toString(): string {
      return this.CLASS_NAME; 
    }
  }
}