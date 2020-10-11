'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeDocuments = exports.mapOne = exports.transFormType = exports.mergeModelJson = exports.getPropsTypeRecord = exports.isArrayTransform = exports.makeModelDoc = exports.getTextIndexCategories = exports.calcMongoCats = exports.loadModelData = exports.loadModel = exports.readFileAsJSON = exports.makeMongoName = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwyc2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21pZ3JhdGUvbW9kZWwyc2NoZW1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQTs7O0FBRVo7Ozs7R0FJRztBQUVILG9DQUFvQztBQUNwQywrQkFBK0I7QUFFL0IsNEJBQTRCO0FBTTVCLCtCQUErQjtBQUUvQixJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7QUFFOUIseUJBQXlCO0FBRXpCLHFDQUFxQztBQUlyQywrQ0FBK0M7QUFDL0MscUJBQXFCO0FBRXJCLG9FQUFvRTtBQUNwRSxlQUFlO0FBRWYsSUFBSSxhQUFhLEdBQUc7SUFDaEIsVUFBVSxFQUFFO1FBQ1IsMEZBQTBGO1FBQzFGLGNBQWMsRUFBRSxJQUFJO1FBQ3BCLGlCQUFpQixFQUFFLElBQUk7UUFDdkIsbUJBQW1CLEVBQUUsSUFBSTtRQUN6QixlQUFlLEVBQUUsSUFBSTtRQUNyQixnQkFBZ0IsRUFBRSxJQUFJO1FBQ3RCLGVBQWUsRUFBRSxJQUFJO1FBQ3JCLHdCQUF3QixFQUFFLElBQUk7UUFDOUIsY0FBYyxFQUFFLElBQUk7UUFDcEIsY0FBYyxFQUFFLElBQUk7S0FDdkI7Q0FDSixDQUFDO0FBZ0JELENBQUM7QUFrQkYsU0FBZ0IsYUFBYSxDQUFDLENBQVM7SUFDbkMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUMzQyxDQUFDO0FBRkQsc0NBRUM7QUFFRCxTQUFnQixjQUFjLENBQUMsUUFBZ0I7SUFDM0MsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDOUMsSUFBSTtRQUNBLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUMzQjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsR0FBRyxRQUFRLEdBQUcsYUFBYSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQy9ELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNwQjtJQUNELE9BQU8sU0FBUyxDQUFDO0FBQ3JCLENBQUM7QUFURCx3Q0FTQztBQUdELFNBQWdCLFNBQVMsQ0FBQyxTQUFpQixFQUFFLFVBQWtCO0lBQzNELFFBQVEsQ0FBQyxXQUFXLEdBQUcsVUFBVSxHQUFHLE9BQU8sQ0FBQyxDQUFDO0lBQzdDLElBQUksSUFBSSxHQUFHLGNBQWMsQ0FBQyxTQUFTLEdBQUcsR0FBRyxHQUFHLFVBQVUsR0FBRyxhQUFhLENBQWMsQ0FBQztJQUNyRixPQUFPLElBQUksQ0FBQztJQUNaLG1DQUFtQztJQUNuQyx5REFBeUQ7QUFDN0QsQ0FBQztBQU5ELDhCQU1DO0FBR0QsU0FBZ0IsYUFBYSxDQUFDLFNBQWlCLEVBQUUsVUFBa0I7SUFDL0QsUUFBUSxDQUFDLFdBQVcsR0FBRyxVQUFVLEdBQUcsT0FBTyxDQUFDLENBQUM7SUFDN0MsSUFBSSxRQUFRLEdBQUcsY0FBYyxDQUFDLFNBQVMsR0FBRyxHQUFHLEdBQUcsVUFBVSxHQUFHLFlBQVksQ0FBUSxDQUFDO0lBQ2xGLE9BQU8sUUFBUSxDQUFDO0FBQ3BCLENBQUM7QUFKRCxzQ0FJQztBQUdELFNBQWdCLGFBQWEsQ0FBQyxJQUFjO0lBQ3hDLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUNmLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDckIsSUFBSSxDQUFDLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ1YsTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxHQUFHLDJDQUEyQyxDQUFDLENBQUM7U0FDdEY7UUFDRCxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ2YsT0FBTyxDQUFDLENBQUM7SUFDYixDQUFDLENBQUMsQ0FBQztJQUNILE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQztBQVhELHNDQVdDO0FBRUQsU0FBZ0Isc0JBQXNCLENBQUMsSUFBZTtJQUNsRCxPQUFPLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDekQsQ0FBQztBQUZELHdEQUVDO0FBRUQsU0FBZ0IsWUFBWSxDQUFDLFVBQWtCLEVBQUUsSUFBZTtJQUM1RCxJQUFJLEdBQUcsR0FBRyxFQUF1QixDQUFDO0lBQ2xDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN6QixHQUFHLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUMxQyxHQUFHLENBQUMsU0FBUyxHQUFHLFVBQVU7UUFDdEIsR0FBRyxDQUFDLGNBQWMsR0FBRyxVQUFVLENBQUM7SUFDcEMsR0FBRyxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7SUFDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDeEIsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBcUIsQ0FBQztRQUM1RyxJQUFJLGNBQWMsR0FBRyxFQUEyQixDQUFDO1FBRWpELElBQUksWUFBWSxDQUFDLEdBQUcsRUFBRTtZQUNsQixjQUFjLENBQUMsR0FBRyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUM7U0FDekM7UUFDRCxJQUFJLFlBQVksQ0FBQyxTQUFTLEVBQUU7WUFDeEIsY0FBYyxDQUFDLFNBQVMsR0FBRyxZQUFZLENBQUMsU0FBUyxDQUFDO1NBQ3JEO1FBQ0QsSUFBSSxZQUFZLENBQUMsWUFBWSxFQUFFO1lBQzNCLGNBQWMsQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDLFlBQVksSUFBSSxHQUFHLENBQUM7U0FDbEU7UUFBQSxDQUFDO1FBQ0YsSUFBSSxHQUFHLEdBQ0g7WUFDSSxRQUFRLEVBQUUsR0FBRztZQUNiLG9CQUFvQixFQUFFLFlBQVksQ0FBQyxXQUFXLElBQUksRUFBRTtZQUNwRCxjQUFjLEVBQUUsY0FBYztTQUNKLENBQUM7UUFDbkMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDbEMsR0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7U0FDeEI7UUFDRCxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNuQyxHQUFHLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztTQUN6QjtRQUNELElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3JDLEdBQUcsQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzlDO1FBQ0QsSUFBSSxZQUFZLENBQUMsVUFBVSxFQUFFO1lBQ3pCLEdBQUcsQ0FBQyxjQUFjLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztTQUN4QztRQUNELGdDQUFnQztRQUNoQyxpREFBaUQ7UUFDakQsR0FBRztRQUNILEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzlCLENBQUMsQ0FBQyxDQUFDO0lBQ0gsR0FBRyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQzNCLE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQztBQTdDRCxvQ0E2Q0M7QUFFRCxTQUFnQixnQkFBZ0IsQ0FBQyxNQUFlLEVBQUUsUUFBZ0I7SUFDOUQsT0FBTyxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3BFLENBQUM7QUFGRCw0Q0FFQztBQUVELFNBQWdCLGtCQUFrQixDQUFDLEtBQVcsRUFBRSxNQUFjLEVBQUcsUUFBaUIsRUFBRSxNQUFlO0lBQy9GLElBQUcsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxFQUFFO1FBQ25DLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzNCO0lBQ0QsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDekIsQ0FBQztBQUxELGdEQUtDO0FBRUQsU0FBZ0IsY0FBYyxDQUFDLFVBQWtCLEVBQUUsSUFBZTtJQUM5RCxJQUFJLG9CQUFvQixHQUFHLEVBQThDLENBQUM7SUFDMUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQywwQ0FBMEM7SUFDN0QsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztJQUM1QixtQkFBbUI7SUFDbkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQVE7UUFDaEQsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7WUFDekIsT0FBTyxHQUFHLENBQUM7U0FDZDtRQUNELElBQUksT0FBTyxHQUFHLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtZQUM5QixPQUFPLENBQUMsR0FBRyxDQUFDLDJDQUEyQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsWUFBWSxHQUFHLFVBQVUsQ0FBQyxDQUFDO1lBQzNHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQixpR0FBaUc7U0FDcEc7UUFDRCxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakMsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDO0lBQ3BCLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxNQUFNLEdBQUcsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFFbEQsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBRWYsSUFBSSxlQUFlLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuRCxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFO1FBRW5DLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFBO1FBQzlFLElBQUksZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDckQsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFFLENBQUM7U0FDL0I7SUFDRCxDQUFDLENBQ0osQ0FBQztJQUNGLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQzFCLElBQUksR0FBRyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyxXQUFXLFVBQVUsd0JBQXdCLEdBQUcseUJBQXlCLENBQUMsQ0FBQztZQUN6RixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDcEI7UUFDRCxrQkFBa0IsQ0FBQyxLQUFLLEVBQUMsR0FBRyxFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUM3RCwwQkFBMEI7SUFDOUIsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDO0lBQ3RDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUM7SUFDeEMscURBQXFEO0lBQ3JELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUM7SUFDdEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBVSxVQUFVO1FBQ3ZDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3ZDLE1BQU0sSUFBSSxLQUFLLENBQUMsbUJBQW1CLEdBQUcsVUFBVSxHQUFHLDZCQUE2QixHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUM7U0FDekc7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUNILElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUM7SUFDeEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBVSxXQUFXO1FBQ3pDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3hDLE1BQU0sSUFBSSxLQUFLLENBQUMsb0JBQW9CLEdBQUcsV0FBVyxHQUFHLDZCQUE2QixHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUM7U0FDM0c7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUNILElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUM7SUFDbEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBVSxXQUFXO1FBQ3RDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3hDLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0JBQWdCLEdBQUcsV0FBVyxHQUFHLDZCQUE2QixHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUM7U0FDdkc7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxHQUFHLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JDLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUNmLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEVBQUU7UUFDckIsS0FBSyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztJQUNoRCxDQUFDLENBQUMsQ0FBQTtJQUNGLGtDQUFrQztJQUNsQyxPQUFPO1FBQ0gsS0FBSyxFQUFFLEtBQUs7UUFDWixLQUFLLEVBQUUsS0FBSztLQUNmLENBQUM7SUFDRiwyQ0FBMkM7SUFDM0MsdUJBQXVCO0FBQzNCLENBQUMsQ0FBQyxZQUFZO0FBNUVkLHdDQTRFQztBQUtELFNBQWdCLGFBQWEsQ0FBQyxNQUFjLEVBQUUsUUFBZ0IsRUFBRSxHQUFRO0lBQ3BFLElBQUksYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUMxRCxJQUFJLEdBQUcsS0FBSyxLQUFLLEVBQUU7WUFDZixPQUFPLEVBQUUsQ0FBQztTQUNiO1FBQ0QsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMxQixJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ25DLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUM7QUFWRCxzQ0FVQztBQUlELFNBQWdCLE1BQU0sQ0FBQyxDQUFNLEVBQUUsS0FBZ0MsRUFBRSxNQUFjO0lBQzNFLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQzdCLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUdqQixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxTQUFTLEVBQUU7WUFDdEIsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLEdBQUcsR0FBRyxhQUFhLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUN0QyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO1NBQ3pCO1FBQUEsQ0FBQztJQUNOLENBQUMsQ0FBQyxDQUFDO0lBQ0g7Ozs7O1dBS087SUFDUCxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQztJQUNoQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNoQyxJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUM7UUFDbkIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3hCLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4QixHQUFXLENBQUMsU0FBUyxHQUFJLEdBQVcsQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDO1FBQ3JELEdBQVcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1lBQ3hCLFVBQVUsRUFBRSxRQUFRO1lBQ3BCLE1BQU0sRUFBRSxLQUFLO1lBQ2IsVUFBVSxFQUFFLElBQUk7U0FDbkIsQ0FBQyxDQUFDO0lBRVAsQ0FBQyxDQUFDLENBQUM7SUFDSCxPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUM7QUFoQ0Qsd0JBZ0NDO0FBRUQsU0FBZ0IsYUFBYSxDQUFDLElBQVMsRUFBRSxJQUFlO0lBQ3BELElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUNmLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ3hCLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDbkMsQ0FBQyxDQUNBLENBQUM7SUFDRixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDekIsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RDLHFCQUFxQjtRQUNyQixPQUFPLENBQUMsQ0FBQztJQUNiLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQVhELHNDQVdDIn0=