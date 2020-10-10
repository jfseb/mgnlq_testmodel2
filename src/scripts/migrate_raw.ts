/**
 * (C) gerd forstmann 2017
 *
 * Create database
 */

import * as Constants from '../constants2';
import * as Model from 'mgnlq_model';


const folderin = 'model_raw_old/testmodel2';
const folderout = 'tmp/testmodel2';

import * as fs from 'fs';

try {

fs.mkdirSync('tmp');
fs.mkdirSync('tmp/testmodel2');
} catch(e) {

}

import * as m2s from '../migrate/model2schema';

import { Dataload as Dataload } from 'mgnlq_model';

// var FUtils = require(root + '/model/model.js')
const mongoose = require('mongoose');


var ModelNameMap = {
    "iupac" : "iupacs",
    "GeneticDNA" : "dna_aminoacids",
    "bom" : "fioriapps",
    "twf_countries" : "twf_countries",
    "twf_fields" : "twf_fields",
    "questions": "questions",
    "commands" : "commands",
    "hints" : "hints"
}


function migrateData(sourcmodelpath: string, destmodelpath: string, modelnameold : string) {

    var modelnamenew = ModelNameMap[modelnameold];
  var mdl = m2s.loadModel(sourcmodelpath, modelnameold);
  var schema = m2s.mergeModelJson(modelnamenew, mdl);
  fs.writeFileSync(destmodelpath +  '/'+ modelnamenew + '.model.mongooseschema.json' , JSON.stringify(schema, undefined, 2));
  var newmodeldoc = m2s.makeModelDoc(modelnamenew, mdl);
  fs.writeFileSync(destmodelpath +  '/'+ modelnamenew + '.model.doc.json' , JSON.stringify(newmodeldoc, undefined, 2));
  var mdldata = m2s.loadModelData(sourcmodelpath, modelnameold);
  var mdlDocs = m2s.makeDocuments(mdldata,mdl);
// write the data
  fs.writeFileSync(destmodelpath + '/' + modelnamenew + '.data.json', JSON.stringify(mdlDocs,undefined,2));
}

Object.keys(ModelNameMap).forEach( key =>{
    migrateData(folderin, folderout, key);
    console.log(` migrated ${key} `);
});