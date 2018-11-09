/**
 * 功能集合
 */
namespace libs {
  
  /** ===========================================================
   * 类名不为 EventType.
   * @update 2018/11/09.
   *  ===========================================================
   */


  /**
   * 拖拽事件类类型(名称).
   */
  export class DragEvent {
    /** 开始拖拽 */
    public static DRAG_START: string = 'dragsSart';
    /** 移动拖拽 */
		public static DRAG_MOVE: string  = 'dragMove';
    /** 停止拖拽 */
		public static DRAG_STOP: string  = 'dragStop';
  }
}