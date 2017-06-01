/*! copyright gerd forstmann, all rights reserved */
//var debug = require('debugf')('index.nunit');

var TMRep = require('../js/getmodel.js');
var Model = require('mgnlq_model').Model;

exports.testgetModel = function (test) {
  TMRep.getTestModel().then(theModel => {
    test.deepEqual(theModel.domains, ['example commands',
      'GeneticDNA',
      'FioriBOM',
      'hints',
      'IUPAC',
      'metamodel',
      'example questions',
      'TWF_countries',
      'TWF fields']);
    test.done();
    Model.releaseModel(theModel);
  });
};
