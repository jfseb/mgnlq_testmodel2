

var root = '../../js';

var m2s = require(root + '/migrate/model2schema.js');

it('testLoadModels', done => {
  var mdl = m2s.loadModel('node_modules/mgnlq_testmodel/testmodel', 'cosmos');
  expect(mdl.wordindex).toEqual([
    'object name',
    'object type',
    'orbits'
  ]); 
  done();
});


it('testMakeMongoName', done => {
  expect(m2s.makeMongoName('abc def')).toEqual('abc_def');
  expect(m2s.makeMongoName('abc.def')).toEqual('abc_def');
  expect(m2s.makeMongoName('  .d$Ef')).toEqual('___d_Ef');
  done();
});


it('testcalcMongoCatsOk', done => {
  expect(m2s.calcMongoCats(['AB', 'C.D'])).toEqual(['AB', 'C_D']);
  done();
});


it('testcalcMongoCatsFail', done => {
  try {
    var res = m2s.calcMongoCats(['AB', 'C_D', 'C.D']);
    console.log(res);
    expect(1).toEqual(0);
  } catch (e) {
    expect(e.toString()).toEqual('Error: C_D and C.D yield conflicting mongodb property names');
  }
  done();
});


it('testLoadModelsMakeSchemaData', done => {
  var mdl = m2s.loadModel('node_modules/mgnlq_testmodel/testmodel', 'cosmos');
  var sd = m2s.mergeModelJson('cosmos', mdl);
  expect(Object.keys(sd.props)).toEqual(['object_name',
    'visual_magnitude',
    'visual_luminosity',
    'mass',
    'radius',
    'object_type',
    'orbits',
    'distance',
    '_url',
    'orbit_radius',
    'eccentricity',
    'orbital_period',
    'albedo']);

  expect(sd.props['albedo']).toEqual({ type: 'String', trim: true, _m_category: 'albedo' });

  expect(sd.index).toEqual({
    'object_name': 'text',
    'object_type': 'text',
    'orbits': 'text'
  });
  done();
});

it('testMapOne', done => {
  var res = m2s.mapOne({ 'A B': 'abc', 'd f': 'axy' }, {
    'A B': 'A_B', 'CDE': 'CDE',
    'd f': 'd_f'
  });
  expect(res).toEqual({ 'A_B': 'abc', 'd_f': 'axy' });
  done();
});

it('testMakeModelData', done => {
  var mdl = m2s.loadModel('node_modules/mgnlq_testmodel/testmodel', 'cosmos');
  m2s.mergeModelJson('cosmos', mdl);
  var mdldata = m2s.loadModelData('node_modules/mgnlq_testmodel/testmodel', 'cosmos');
  var mdlDocs = m2s.makeDocuments(mdldata, mdl);
  expect(mdlDocs[0]).toEqual({
    distance: '4.37 lightyears, 1.34pc',
    mass: '1.1*sun'
  });
  /*

    object_name: 'Alpha Centauri A',
    visual_magnitude: '-0.27',
    visual_luminosity: '1.519*sun',
    mass: '1.1*sun',
    object_type: 'star',
    distance: '4.37 lightyears, 1.34pc',
    _synonyms:
    [{
      category: 'object name',
      fact: 'Alpha Centauri A',
      synonyms: ['Rigil Kentaurus']
    }]
  });
  */
  done();
});