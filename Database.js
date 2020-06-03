import SQLite from "react-native-sqlite-storage";
SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "empowerDb.db";
const database_version = "1.0";
const database_displayname = "empowerDb";
const database_size = 200000;

export default class Database {

  initDB() {
    let db;
    return new Promise((resolve) => {
      SQLite.echoTest()
        .then(() => {
          SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size
          )
            .then(DB => {
              db = DB;
              db.executeSql('SELECT 1 FROM Product LIMIT 1').then(() => {
                  
              }).catch((error) =>{
                  console.log("Received error: ", error);
                  console.log("Database not yet ready ... populating data");
                  db.transaction((tx) => {
                      tx.executeSql('CREATE TABLE IF NOT EXISTS Product (jobId, photoId, fileName, uploadStatus, photo, pictureReq)');
                  }).then(() => {
                      console.log("Table created successfully");
                  }).catch(error => {
                      console.log(error);
                  });
              });
              resolve(db);
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          console.log("echoTest failed - plugin not functional");
        });
      });
  };

  closeDatabase(db) {
    if (db) {
      db.close()
        .then(status => {
          console.log("Database CLOSED");
        })
        .catch(error => {
          this.errorCB(error);
        });
    } else {
      console.log("Database was not OPENED");
    }
  };

  listProduct() {
    return new Promise((resolve) => {
      const products = [];
      this.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM Product', []).then(([tx,results]) => {
            var len = results.rows.length;
            for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);
              const { jobId, photoId, fileName, uploadStatus, photo, pictureReq } = row;
              products.push({
                jobId,
                photoId,
                fileName,
                uploadStatus,
                photo,
                pictureReq
              });
            }
            resolve(products);
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });  
  }

  productByFilters(qStr) {
    return new Promise((resolve) => {
      this.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql(qStr).then(([tx,results]) => {
            if(results.rows.length > 0) {
              let returnItems = [];
              for (i =0; i < results.rows.length;i++)
              {
                let row = results.rows.item(i);
                returnItems.push(row);
              }
              resolve(returnItems);
            }
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
        });
      }).catch((err) => {
      });
    });  
  }

  addProduct(prod) {
    return new Promise((resolve) => {
      this.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('INSERT INTO Product VALUES (?, ?, ?, ?, ?, ?)', [prod.jobId, prod.photoId, prod.fileName, prod.uploadStatus, prod.photo, prod.pictureReq]).then(([tx, results]) => {
            resolve(results);
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
        });
      }).catch((err) => {
      });
    });  
  }

  updateProduct(imageTitle) {
    return new Promise((resolve) => {
      this.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('UPDATE Product SET uploadStatus = ? WHERE fileName = ?', ['Uploaded',imageTitle]).then(([tx, results]) => {
            resolve(results);
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
        });
      }).catch((err) => {
      });
    });  
  }

  deleteProduct(id) {
    return new Promise((resolve) => {
      this.initDB().then((db) => {
        db.transaction((tx) => {
          tx.executeSql('DELETE FROM Product WHERE jobId = ?', [id]).then(([tx, results]) => {
            resolve(results);
          });
        }).then((result) => {
          this.closeDatabase(db);
        }).catch((err) => {
        });
      }).catch((err) => {
      });
    });  
  }
}