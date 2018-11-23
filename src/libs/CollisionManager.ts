namespace clibs {

  /**
   * 碰撞检测类.
   * 
   * @create 2018/11/9
   * @update 2018/11/9 
   */
  export class CollisionManager {

    private CLASSNAME: string = 'CollisionManager'

    /**
     * 两个矩形对象碰撞检测.
     * 
     * @param {any} obj1 碰撞物体A
     * @param {any} obj2 碰撞物体B
     * @return {boolean} 是否发生了碰撞(true: 碰撞了，false: 未碰撞)
     */
    public static hitTestRect(obj1: any, obj2: any): boolean {
      //@see  [getBounds()](http://developer.egret.com/cn/apidoc/index/name/egret.DisplayObject)
      const rect1: egret.Rectangle = obj1.getBounds();
      const rect2: egret.Rectangle = obj2.getBounds();

      rect1.x = obj1.x;
      rect1.y = obj1.y;
      rect2.x = obj2.x;
      rect2.y = obj2.y;

      // @see [intersects()](http://developer.egret.com/cn/apidoc/index/name/egret.Rectangle)
      return rect1.intersects(rect2);
    }

    public toString(): string {
      return this.CLASSNAME;
    }

  }
}