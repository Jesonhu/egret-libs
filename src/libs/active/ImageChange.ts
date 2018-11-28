namespace clibs {
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
  export class ImageChange extends eui.Image {
    /**
     * 图片资源切换控件.
     * 
     * 正确的对象点击，才行进行图片资源切换.
     */
    constructor() {
      super();
    }

    createChildren() {
        super.createChildren()
    }

    /**
     * 初始化. 
     */
    public init() {
      this.initData();
      this.addEventHandle();
    }

    private initData() {
      this._defaultSource = this.source;

      if (this._isActivedMove) {
        this.initPoint = new egret.Point(this.x, this.y);
        this.movePoint = new egret.Point(this.activeMovePointX, this.activeMovePointY);
      }
    }

    /** 初始位置坐标 */
    private initPoint: egret.Point

    /** 需要移动的位置坐标 */
    private movePoint: egret.Point = new egret.Point(0, 0)

    /** 激活的时候是否需要移动位置 */
    private _isActivedMove: boolean = false

    public set isActivedMove(value: boolean) {
      this._isActivedMove = value;
    }

    public activeMovePointX: number = 0
    public activeMovePointY: number = 0

    /** 是否激活过了标记 */
		protected _isActived: boolean = false

		// public get isActived() {
		// 	return this._isActived;
		// }

		// public set isActived(value: boolean) {
		// 	this._isActived = value;
		// }

		/** 正确操作的对象标记 */
		protected _isRight: boolean = false

		public get isRight() {
			return this._isRight;
		}

		public set isRight(value: boolean) {
			this._isRight = value;
		}

    /** 默认显示的图片路径 */
    private _defaultSource: string | egret.Texture = '';

    /** 激活后显示的图片路径 */
    private _activedSource: string | egret.Texture = ''

    /**
     * 激活后显示的图片设置. 
     */
    public set activedSource(source: string | egret.Texture) {
      const _source = source ? source : '';

      this._activedSource = _source;
    }

    /**
     * 添加事件处理
     */
    public addEventHandle() {
      if (this.hasEventListener(egret.TouchEvent.TOUCH_TAP)) return;

      this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
    }

    /**
     * 重置数据. 
     */
    public resetData() {
      this._isActived = false;

      if (this._isRight) {
        this.source = this._defaultSource;
      }
      this.source = this._defaultSource;

      if (this._isActivedMove) {
        this.x = this.initPoint.x;
        this.y = this.initPoint.y;
      }
    }

    /**
     * 移除事件处理. 
     */
    public removeEventHandle() {
      if (this.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
      }
    }

    private onTap() {
      const _isRight = this._isRight;

      // 是正确的对象
      if (_isRight) {
        // 已经激活过
        if (this._isActived) return;

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
    }
  }

  export class ImageChangeEvent {
    /** 点击了 */
    public static TAP: string = 'TAP'
  }

  interface IImageChangeData {
    _defaultSource: string
    _activedSourc: string
    _isActived: boolean
    _isRight: boolean
  }
}