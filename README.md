# mgnlq_testmodel2 [![Build Status](https://travis-ci.org/jfseb/mgnlq_testmodel2.svg?branch=master)](https://travis-ci.org/jfseb/mgnlq_testmodel2)[![Coverage Status](https://coveralls.io/repos/github/jfseb/mgnlq_testmodel2/badge.svg)](https://coveralls.io/github/jfseb/mgnlq_testmodel2)



# Purpose

This file serves as the entry point for obtaining model data to 

testmodel(1) and testmodel2

Note that testmodel data is located outside this project in mgnlq_testmodel
(this is as it is directly used to test mgnql_model)

# load data into mongodb 

for testdb2 

Create mongo database ( specified in constants.ts )
   default: testdb2

from files in testmodel2/models.json

```
  npm install
  npm run load_testdb2
```

Note Content of a present DB will be deleted!

=================================

To create a different DB, set M

=================================

The mongo testmodel replay files
and an hard coded instantiation hook assuming:



| Property |   |Value (hard coded!)
|:---------|---|:----------------------------
|*Mongo DB Connection string*  ||  `'mongodb://localhost/testdb'`
|*recordign folder*        | | `test/data/mongoose_record_replay/testmodel/`
|Control environment varialbe || `MGNLQ_TESTMODEL_REPLAY`


| Property |   |Value (hard coded!)
|:---------|---|:----------------------------
|*Mongo DB Connection string*  ||  `'mongodb://localhost/testdb2'`
|*recordign folder*        | | `test/data/mongoose_record_replay/testmodel2/`
|Control environment varialbe || `MGNLQ_TESTMODEL2_REPLAY`


Note: When using this model, in default mode no mongo connection is established and REPLAY mode is on.
(see [mongoose_record_replay](https://github.com/jfseb/mongoose_record_replay))

# usage

## plain hook:
```javscript
    const Model = require('mgnlq_model');

    require('mgnlq_testmodel2').getTestModel2().then( theModel =>
        {
            // your code using theModel
            Model.releaseModel(theModel);
        }
    );

```

## just use file storage.
```
    var mongooseMock = require('mongoose_record_replay').instrumentMongoose(require('mongoose'),
        'node_modules/mgnlq_testmodel2/mgrecrep/',
        mode);
    var aPromise = undefined;
    function getModel() {
        if(mode === 'REPLAY') {
            // in replay mode during testing, using a singleton is sufficient
            aPromise = aPromise || Model.loadModelsOpeningConnection(mongooseMock,'mongodb://localhost/testdb2'  );
            return aPromise;
    }
    // open a real connection, which has to be closed
    return Model.loadModelsOpeningConnection(mongooseMock, 'mongodb://localhost/testdb');
}

```

# environment Switching to Record mode ...
environment variable
`MGNLQ_TESTMODEL2_REPLAY`
control the mode.

1. REPLAY (default)
2. RECORD
3. OFF


Note : Recording data is now in the local target project and *not* shared via this 
project, 
data recorded here is solely for unit testing of this project

Beware: the underlying model uses a caching mechanism, thus it attempts to write to
folders.

Similar, in RECORD mode, mgrecrep/queries.json and mgrecrep2/data may be extened with new files.


# Tasks to maintain the model

## Rebuilding the model from scratch (raw files)

check database name in constants2.ts (typically testdb2)

```
env_reset.cmd
npm run load_testdb
```


## Rebuilding the model from raw data of old format
```
node js/scripts/migrate_raw.js
```
(copies to /tmp) requires manual postprocessing and merging

