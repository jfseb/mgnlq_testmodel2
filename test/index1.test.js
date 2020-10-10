/*! copyright gerd forstmann, all rights reserved */

var TMRep1 = require('../js/getmodel1.js');
var Model = require('mgnlq_model').Model;


it('testgetModel1', done => {
  jest.setTimeout(600000);
  console.log('going');
  TMRep1.getTestModel().then( theModel => {
    console.log('going for');
    expect(theModel.domains).toEqual([ 'Cosmos',
      'demomdls',
      'FioriBOM',
      'Fiori Backend Catalogs',
      'IUPAC',
      'metamodel',
      'Philosophers elements',
      'SAP Transaction Codes',
      'SOBJ Tables' ]);

    Model.releaseModel(theModel);
    done();
  });
});
