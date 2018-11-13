class GameStage extends eui.Component implements eui.UIComponent {
	public constructor() {
		super();
		this.skinName = 'GameStageSkin';
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}


	protected childrenCreated(): void {
		super.childrenCreated();

		this.addDrag();
	}

	public rect1:eui.Rect;
	public rect2:eui.Rect;
	/**
	 * 添加拖拽效果. 
	 */
	private addDrag() {
		const bounds = new egret.Rectangle(0, 0, 610, 1010);
		const dragRectManager = new cTools_libs.DragManagerRect(this.rect1, this, bounds);

		dragRectManager.addEventListener(cTools_libs.DragEvent.DRAG_STOP, () => {
			if (cTools_libs.CollisionManager.hitTestRect(this.rect1, this.rect2)) {
				alert('碰到了哟');
			} else {
				console.log('没碰到');
			}
		}, this);
	}

}