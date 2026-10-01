let database;
export async function db() {
  if (!database) database = new Promise((resolve,reject)=>{const req=indexedDB.open('bookforge-reader',1);req.onupgradeneeded=()=>req.result.createObjectStore('files');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
  return database;
}
export async function read(key) {const d=await db();return new Promise((resolve,reject)=>{const r=d.transaction('files').objectStore('files').get(key);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
export async function write(key,value) {const d=await db();return new Promise((resolve,reject)=>{const tx=d.transaction('files','readwrite');tx.objectStore('files').put(value,key);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});}
