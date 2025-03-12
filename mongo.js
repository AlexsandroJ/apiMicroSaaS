var ObjectID = require('bson-objectid');

module.exports = {
  "localhost:27017": {
    "databases": {
      "test": {
        "collections": [
          {
            "name": "system.namespaces",
            "documents": [
              {
                "name": "system.indexes"
              }
            ]
          },
          {
            "name": "system.indexes",
            "documents": []
          }
        ]
      },
      "undefined": {
        "collections": [
          {
            "name": "system.namespaces",
            "documents": [
              {
                "name": "system.indexes"
              },
              {
                "name": "test"
              }
            ]
          },
          {
            "name": "system.indexes",
            "documents": [
              {
                "v": 1,
                "key": {
                  "_id": 1
                },
                "ns": "undefined.test",
                "name": "_id_",
                "unique": true
              }
            ]
          },
          {
            "name": "test",
            "documents": [
              {
                "a": 1,
                "_id": ObjectID("67d03133b010f6246461789c")
              },
              {
                "a": 2,
                "_id": ObjectID("67d03133b010f6246461789d")
              },
              {
                "a": 3,
                "_id": ObjectID("67d03133b010f6246461789e")
              }
            ]
          }
        ]
      }
    }
  }
}