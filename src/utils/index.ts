import { forEach, isEmpty } from 'lodash';
import Ids from 'ids';
import { message } from 'antd';

export function _objectWithProperties(obj, keys) {
    var target = {};
    for (var i in obj) {
        if (keys.indexOf(i) < 0) continue;
        if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
        target[i] = obj[i];
    }
    return target;
}

export function nextId(prefix) {
    var ids = new Ids([32, 32, 1]);
    return ids.nextPrefixed(prefix);
}

export function generateUUId(element, modelProperties) {
    let field;
    if (modelProperties.includes('.')) {
        let arr = modelProperties.split('.');
        field = arr[arr.length - 1];
    } else {
        field = modelProperties;
    }
    return `${element.id}_${field}`;
}

//文本转为 key:value 对象 a:b ----> {a:b}
export function textToMap(value) {
    let tmp = {};
    if (isEmpty(value)) return tmp;

    if (typeof value === 'string') {
        let arr = value.replace(/(\n)/g, '<br/>').split('<br/>');
        arr.forEach((item, index) => {
            let keyValue = item.split(':');
            if (!Array.isArray(keyValue)) {
                message.warn('请检查分割字符串是否设置正确');
                return '';
            }

            let value = keyValue[1];
            let name = keyValue[0];
            if (name !== '') {
                tmp[name] = value;
            }
        });
    } else {
        return value;
    }

    return tmp;
}

//文本转为 key:value 数组对象 a:b ----> [{a:b}]
export function textToMapObject(value) {
    let tmp = [];
    if (isEmpty(value)) return tmp;

    if (typeof value === 'string') {
        let arr = value.replace(/(\n)/g, '<br/>').split('<br/>');
        arr.forEach((item, index) => {
            let keyValue = item.split(':');
            if (!Array.isArray(keyValue)) {
                message.warn('请检查分割字符串是否设置正确');
                return '';
            }
            let i = item.indexOf(':');
            if (i > -1) {
                let value = item.substring(i + 1, item.length);
                let name = item.substring(0, i);
                if (name !== '') {
                    tmp.push({
                        name: name,
                        value: value,
                    });
                }
            }
        });
    } else {
        return value;
    }

    return tmp;
}

//对象转为文本 {a:b} ----> a:b
export function mapObjectToText(values) {
    if (typeof values === 'string') return values;
    let text = '';
    if (isEmpty(values)) return text;

    //判断是数组
    if(typeof values === "object" && Array.isArray(values)) {
        values.forEach(item => {
            text += `${item.name}:${item.value}\n`;
        });
    }
    //对象处理
    else if(typeof values === "object"){
        let keys = Object.keys(values);
        Object.entries(values).forEach(([k,v]) => {
            text += `${k}:${v}\n`;
        })
    }
    return text;
}

export function objectWithout(obj, keys) {
    let target = {};
    for (var i in obj) {
        if (keys.indexOf(i) >= 0) continue;
        if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
        target[i] = obj[i];
    }
    return target;
}

// key:value 值为 undefined ----> ''
export function clearUndefined(data) {
    let tmp = {};
    for (let field in data) {
        if (typeof data[field] === 'undefined') {
            tmp[field] = '';
        } else {
            tmp[field] = data[field];
        }
    }
    return tmp;
}
