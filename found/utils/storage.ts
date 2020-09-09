//浏览器Storage封装 sesstionStorage  LocalStorage
class StorageManager {
  //管理Storage
  constructor(storage) {
    this.curStorage = storage || null;
  }
  curStorage=null
  //设置Storgae值
  set(key, value) {
    if (!this.validStorage()) return;
    let strValue;
    if (typeof value === 'object') {
      strValue = JSON.stringify(value);
    } else {
      strValue = value;
    }
    this.curStorage.setItem(key, strValue);
  }
  //获得对应Key的值
  get(key) {
    if (!this.validStorage()) return;
    if (this.curStorage.hasOwnProperty(key)) {
      return JSON.parse(this.curStorage.getItem(key));
    } else {
      return null;
    }
  }
  //删除对应Key的值
  remove(key) {
    if (!this.validStorage()) return;
    if (!this.curStorage.hasOwnProperty(key)) {
      console.warn('没有对应的key');
      return;
    }
    this.curStorage.removeItem(key);
  }
  //清空当前Storage的所有数据
  clear() {
    if (!this.validStorage()) return;
    this.curStorage.clear();
  }
  //验证会否指定了Storage
  validStorage() {
    if (!this.curStorage) {
      console.error('必须指定要操作的storage');
      return false;
    }
    return true;
  }
}

//浏览器Storage调用对象
export const session = new StorageManager(window.sessionStorage);
export const local = new StorageManager(window.localStorage);

export default { local, session };
