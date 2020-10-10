/*! copyright gerd forstmann, all rights reserved */
//var debug = require('debugf')('index.nunit');

var TMRep = require('../js/getmodel2.js');
var Model = require('mgnlq_model').Model;

it('testgetModel2', done => {
  jest.setTimeout(600000);
  TMRep.getTestModel2().then(theModel => {
    expect(theModel.domains).toEqual(['example commands',
      'GeneticDNA',
      'FioriBOM',
      'hints',
      'IUPAC',
      'metamodel',
      'example questions',
      'TWF_countries',
      'TWF fields']);
    done();
    Model.releaseModel(theModel);
  });
});
