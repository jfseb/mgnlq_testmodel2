'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * (C) gerd forstmann 2017
 *
 * convert model file into an mongoose schema
 */
//import * as intf from 'constants';
const debug = require("debug");
const _ = require("lodash");
//var IFModel = IFMatch.IModel;
var debuglog = debug('model');
const fs = require("fs");
const mongoose = require("mongoose");
///////////////////////////////////////////////
// hardcoded mappings
// these string properties are wrapped into an array, splitting at ,
// and trimming
var splitArrComma = {
    "FioriBOM": {
        // TODO: fiori intent must be reconstructed after splitting SemanticObject/SEemanticAction
        "fiori intent": true,
        "TransactionCode": true,
        "BusinessGroupName": true,
        ApplicationType: true,
        BusinessRoleName: true,
        BusinessCatalog: true,
        BusinessGroupDescription: true,
        SemanticObject: true,
        SemanticAction: true,
    }
};
;
function makeMongoName(s) {
    return s.replace(/[^a-zA-Z0-9]/g, '_');
}
exports.makeMongoName = makeMongoName;
function readFileAsJSON(filename) {
    var data = fs.readFileSync(filename, 'utf-8');
    try {
        return JSON.parse(data);
    }
    catch (e) {
        console.log("Content of file " + filename + " is no json" + e);
        process.exit(-1);
    }
    return undefined;
}
exports.readFileAsJSON = readFileAsJSON;
function loadModel(modelPath, sModelName) {
    debuglog(" loading " + sModelName + " ....");
    var oMdl = readFileAsJSON(modelPath + '/' + sModelName + ".model.json");
    return oMdl;
    //mergeModelJson(sModelName, oMdl);
    //    loadModelData(modelPath, oMdl, sModelName, oModel);
}
exports.loadModel = loadModel;
function loadModelData(modelPath, sModelName) {
    debuglog(" loading " + sModelName + " ....");
    var oMdlData = readFileAsJSON(modelPath + '/' + sModelName + ".data.json");
    return oMdlData;
}
exports.loadModelData = loadModelData;
function calcMongoCats(cats) {
    var props = {};
    var res = cats.map(cat => {
        var r = makeMongoName(cat);
        if (props[r]) {
            throw new Error(`${props[r]} and ${cat} yield conflicting mongodb property names`);
        }
        props[r] = cat;
        return r;
    });
    return res;
}
exports.calcMongoCats = calcMongoCats;
function getTextIndexCategories(oMdl) {
    return _.difference(oMdl.wordindex, oMdl.exactmatch);
}
exports.getTextIndexCategories = getTextIndexCategories;
function makeModelDoc(sModelName, oMdl) {
    var res = {};
    res.domain = oMdl.domain;
    res.domain_description = oMdl.description;
    res.modelname = sModelName,
        res.collectionname = sModelName;
    res._categories = [];
    oMdl.category.forEach(cat => {
        var categoryDesc = oMdl.categoryDescribed.filter(catrec => catrec.name === cat)[0] || {};
        var QBEColumnProps = {};
        if (categoryDesc.QBE) {
            QBEColumnProps.QBE = categoryDesc.QBE;
        }
        if (categoryDesc.LUNRIndex) {
            QBEColumnProps.LUNRIndex = categoryDesc.LUNRIndex;
        }
        if (categoryDesc.defaultWidth) {
            QBEColumnProps.defaultWidth = categoryDesc.defaultWidth || 100;
        }
        ;
        var mem = {
            category: cat,
            category_description: categoryDesc.description || "",
            QBEColumnProps: QBEColumnProps
        };
        if (oMdl.wordindex.indexOf(cat) >= 0) {
            mem.wordindex = true;
        }
        if (oMdl.exactmatch.indexOf(cat) >= 0) {
            mem.exactmatch = true;
        }
        if (oMdl.synonyms && oMdl.synonyms[cat]) {
            mem.category_synonyms = oMdl.synonyms[cat];
        }
        if (categoryDesc.QBEInclude) {
            mem.QBEColumnProps.QBEInclude = true;
        }
        // if(categoryDesc.importance) {
        //      mem.importance = categoryDesc.importance;
        //}
        res._categories.push(mem);
    });
    res.columns = oMdl.columns;
    return res;
}
exports.makeModelDoc = makeModelDoc;
function isArrayTransform(domain, category) {
    return splitArrComma[domain] && splitArrComma[domain][category];
}
exports.isArrayTransform = isArrayTransform;
function getPropsTypeRecord(props, newcat, category, domain) {
    if (isArrayTransform(domain, category)) {
        return props[newcat][0];
    }
    return props[newcat];
}
exports.getPropsTypeRecord = getPropsTypeRecord;
function mergeModelJson(sModelName, oMdl) {
    var categoryDescribedMap = {};
    oMdl.bitindex = 0; // getDomainBitIndex(oMdl.domain, oModel);
    oMdl.categoryDescribed = [];
    // rectify category
    oMdl.category = oMdl.category.map(function (cat) {
        if (typeof cat === "string") {
            return cat;
        }
        if (typeof cat.name !== "string") {
            console.log("Missing name in object typed category in " + JSON.stringify(cat) + " in model " + sModelName);
            process.exit(-1);
            //throw new Error('Domain ' + oMdl.domain + ' already loaded while loading ' + sModelName + '?');
        }
        categoryDescribedMap[cat.name] = cat;
        oMdl.categoryDescribed.push(cat);
        return cat.name;
    });
    var schema = new mongoose.Schema({ _id: Number });
    var props = {};
    var mongoCategories = calcMongoCats(oMdl.category);
    mongoCategories.forEach((cat, index) => {
        props[cat] = { type: "String", trim: true, _m_category: oMdl.category[index] };
        if (isArrayTransform(oMdl.domain, oMdl.category[index])) {
            props[cat] = [props[cat]];
        }
    });
    oMdl.wordindex.forEach(rcat => {
        var cat = makeMongoName(rcat);
        if (!props[cat]) {
            console.error(`model : ${sModelName} wordindex category "${cat}" is not in categories?`);
            process.exit(-1);
        }
        getPropsTypeRecord(props, cat, rcat, oMdl.domain).index = true;
        //props[cat].index = true;
    });
    oMdl.wordindex = oMdl.wordindex || [];
    oMdl.exactmatch = oMdl.exactmatch || [];
    // check that members of wordindex are in categories,
    oMdl.wordindex = oMdl.wordindex || [];
    oMdl.wordindex.forEach(function (sWordIndex) {
        if (oMdl.category.indexOf(sWordIndex) < 0) {
            throw new Error('Model wordindex "' + sWordIndex + '" not a category of domain ' + oMdl.domain + ' ');
        }
    });
    oMdl.exactmatch = oMdl.exactmatch || [];
    oMdl.exactmatch.forEach(function (sExactMatch) {
        if (oMdl.category.indexOf(sExactMatch) < 0) {
            throw new Error('Model exactmatch "' + sExactMatch + '" not a category of domain ' + oMdl.domain + ' ');
        }
    });
    oMdl.columns = oMdl.columns || [];
    oMdl.columns.forEach(function (sExactMatch) {
        if (oMdl.category.indexOf(sExactMatch) < 0) {
            throw new Error('Model column "' + sExactMatch + '" not a category of domain ' + oMdl.domain + ' ');
        }
    });
    var s = getTextIndexCategories(oMdl);
    var index = {};
    s.forEach(textIndexCat => {
        index[makeMongoName(textIndexCat)] = 'text';
    });
    //props["_id"] = { type : Number};
    return {
        props: props,
        index: index
    };
    // var schema = new mongoose.Schema(props);
    // schema.index(index);
} // loadmodel
exports.mergeModelJson = mergeModelJson;
function transFormType(domain, category, val) {
    if (splitArrComma[domain] && splitArrComma[domain][category]) {
        if (val === "n/a") {
            return [];
        }
        var args = val.split(",");
        args = args.map(arg => arg.trim());
        return args;
    }
    return val;
}
exports.transFormType = transFormType;
function mapOne(o, props, domain) {
    var res = {};
    Object.keys(props).forEach(key => {
        var val = o[key];
        if (o[key] !== undefined) {
            var val = o[key];
            val = transFormType(domain, key, val);
            res[props[key]] = val;
        }
        ;
    });
    /*
      "synonyms": {
          "element name": [
            "aluminum"
          ]
        }*/
    var synonyms = o.synonyms || {};
    Object.keys(synonyms).forEach(key => {
        var category = key;
        var value = o[category];
        var syns = synonyms[key];
        res._synonyms = res._synonyms || [];
        res._synonyms.push({
            "category": category,
            "fact": value,
            "synonyms": syns
        });
    });
    return res;
}
exports.mapOne = mapOne;
function makeDocuments(data, oMdl) {
    var props = {};
    oMdl.category.forEach(cat => {
        props[cat] = makeMongoName(cat);
    });
    return data.map((o, index) => {
        var r = mapOne(o, props, oMdl.domain);
        // r._id = index + 1;
        return r;
    });
}
exports.makeDocuments = makeDocuments;

//# sourceMappingURL=model2schema.js.map
