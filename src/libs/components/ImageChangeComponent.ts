namespace clibs {
  /**
   * 图片切换组件.
   * 
   * @update 2018/11/28 
   * 
   * @example
   */
  class ImageChangeComponent extends BaseComponent {
    /**
     * 图片切换.
     * 
     * 正确的对象点击，才行进行图片切换.
     */
    constructor() {
      super();
    }

    protected init() {
      this.addEventHandle();
    }

    /** 操作的 `图片` 皮肤对象 */
    public img:eui.Image;

    /** 默认显示的图片路径 */
    private _defaultSource: string = '';

    /**
     * 默认显示的图片设置. 
     */
    public set defaultSource(source: string) {
      const _source = source ? source : '';

      console.log('图片', this.img);
      this.img.source = _source;
      this._defaultSource = _source;
    }

    /** 激活后显示的图片路径 */
    private _activedSource: string = ''

    /**
     * 激活后显示的图片设置. 
     */
    public set activedSource(source: string) {
      const _source = source ? source : '';

      this._activedSource = _source;
    }

    /**
     * 添加事件处理
     */
    private addEventHandle() {
      if (this.hasEventListener(egret.TouchEvent.TOUCH_TAP)) return;

      this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
    }

    /**
     * 重置数据. 
     */
    protected resetData() {
      this.img.source = this._defaultSource;
      this._isActived = false;
    }

    /**
     * 移除事件处理. 
     */
    private removeEventHandle() {
      if (this.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
      }
    }

    private onTap() {
      const _isRight = this._isRight;

      // 是正确的对象
      if (_isRight) {
        this.img.source = this._activedSource;
        // 设置为激活过状态.
        this._isActived = true;
      }

      this.dispatchEventWith(ImageChangeEvent.TAP);
    }
  }

}