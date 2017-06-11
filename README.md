# mgnlq_testmodel2 [![Build Status](https://travis-ci.org/jfseb/mgnlq_testmodel2.svg?branch=master)](https://travis-ci.org/jfseb/mgnlq_testmodel2)[![Coverage Status](https://coveralls.io/repos/github/jfseb/mgnlq_testmodel2/badge.svg)](https://coveralls.io/github/jfseb/mgnql_testmodel2)

The mongo testmodel replay files
and an hard coded instantiation hook assuming:


| Property |   |Value (hard coded!)
|:---------|---|:----------------------------
|*Mongo DB Connection string*  ||  `'mongodb://localhost/testdb2'`
|*data Folder*        | | `mgrecrep/`
|Control environment varialbe || `MGNLQ_TESTMODEL2_REPLAY`


Note: in default mode no mongo connection is established and REPLAY mode is on.
(see [mongoose_record_replay](https://github.com/jfseb/mongoose_record_replay))

# usage

## plain hook:
```javscript
    const Model = require('mgnlq_model');

    require('mgnlq_testmodel2').getTestModel().then( theModel =>
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



Beware: the underlying model uses a caching mechanism, thus it attempts to write to
folders.

Similar, in RECORD mode, mgrecrep/queries.json and mgrecrep/data may be extened with new files.


# Tasks to maintain the model

## Rebuilding the model from scratch (raw files)

```
npm run create_db
```

## Updating the queries
  todo


## Rebuilding the model from raw data of old format

```
node js/scripts/migrate_raw.js
```
(copies to /tmp) requires manual postprocessing and merging

