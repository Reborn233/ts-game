export default class Singleton {
    /**
     * 获取实例静态方法
     * @return Singleton
     */
    public static getInstance(): any {
        if (!this.instance) {
            this.instance = new this();
        }
        return this.instance;
    }
    // tslint:disable-next-line:ban-types
    private static classKeys: Function[] = [];
    private static classValues: any[] = [];
    private static instance: Singleton;

    constructor() {
        const clazz: any = this.constructor;
        if (!clazz) {
            return;
        }
        if (Singleton.classKeys.indexOf(clazz) !== -1) {
            throw new Error(this + '只允许实例化一次');
        } else {
            Singleton.classKeys.push(clazz);
            Singleton.classValues.push(this);
        }

    }
}
