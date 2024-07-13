'use strict'

const _ = require('lodash')
const {Types} = require('mongoose')

const convertToObjectIdMongodb = id => new Types.ObjectId(id)

const getInfoData = ({fields = [],object = {}}) =>{
    return _.pick(object,fields)
}
const getSelectData = (select = []) =>{
    return Object.fromEntries(select.map(el => [el,1]))
}

const getUnSelectData = (select = []) =>{
    return Object.fromEntries(select.map(el => [el,0]))
}

const removeUndefinedObject = (obj) => {
    Object.keys(obj).forEach(key => {
        if (obj[key] && typeof obj[key] === 'object') removeUndefined(obj[key]);
        else if (obj[key] == null) delete obj[key];
    });
    return obj;
}

const updateNestedObjectParse = (obj, parentKey = '', updateObj = {}) => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    Object.keys(obj).forEach(key => {
        const fullKey = parentKey ? `${parentKey}.${key}` : key;
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            updateNestedObjectParse(obj[key], fullKey, updateObj);
        } else {
            updateObj[fullKey] = obj[key];
        }
    });

    return updateObj;
}

module.exports = {
    getInfoData,
    getSelectData,
    updateNestedObjectParse,
    removeUndefinedObject,
    convertToObjectIdMongodb
}