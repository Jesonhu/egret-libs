/**
 * 组件基类.
 * 
 * @updte 2018/11/28 
 */
class BaseComponent extends eui.Component implements eui.UIComponent {
	/**
	 * 组件基类.
	 */
	public constructor() {
		super();
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}


	protected childrenCreated(): void {
		super.childrenCreated();

		this.init();
	}

	/** 初始化 */
	protected init() {

	}

	/** 初始化数据 */
	protected initData() {

	}

	/** 重置数据 */
	protected resetData() {

	}

	/** 是否激活过了标记 */
	protected _isActived: boolean = false

	public get isActived() {
		return this._isActived
	}

	public set isActived(value: boolean) {
		this._isActived = value;
	}

	/** 正确操作的对象标记 */
	protected _isRight: boolean = false

	public get isRight() {
		return this._isRight;
	}

	public set isRight(value: boolean) {
		this._isRight = value;
	}

}