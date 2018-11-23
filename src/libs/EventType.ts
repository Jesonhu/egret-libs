namespace clibs {

  /**
   * 拖拽相关事件.
   * @update 2018/11/09.
   */
  export class DragEvent extends egret.Event {
    /** 开始拖拽 */
    public static DRAG_START: string = 'dragsSart';  
    /** 移动拖拽 */
		public static DRAG_MOVE: string  = 'dragMove';
    /** 停止拖拽 */
		public static DRAG_STOP: string  = 'dragStop';
  }
}