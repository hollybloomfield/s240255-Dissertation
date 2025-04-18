
export function openIDB() {
    
return new Promise((resolve, reject) => { //indexedDB doesnt natively support 
                                        // promises so set them up manually to support async/await
const request = window.indexedDB.open("OfflineFestieDB", 1) //opens new db


request.onupgradeneeded = function () {
    const idb = request.result
    if (!idb.objectStoreNames.contains(`authUser`)){
        idb.createObjectStore(`authUser`, {keyPath: `_id`})
    } //opens authUser object store if doesn't already exist
}

request.onerror = (event) => {
    console.error("Error in openIDB", event)
    reject(new Error("Failed to open IndexedDB"))
  };
  request.onsuccess = (event) => {
    resolve(request.result)
  };
  

})
}

export async function setIDBAuthUser(authUser) {
    try {
        const idb = await openIDB()

        const transaction = idb.transaction("authUser", "readwrite") //enables read and write to authuser store

        const authUserStore = transaction.objectStore("authUser")

        authUserStore.put(authUser) //add auth user object into store

        transaction.oncomplete = function () {
            console.log("Auth user successfully added/updated in indexedDB")
        }

        transaction.onerror = function (event) {
            console.Error("Error occured in setIDBAuthUser: ", event)
        }

        idb.close()
    } catch (error) {
        console.error("Error in setIDBAuthUser", error)
    }
}

export async function getAuthUserFromIDB() {
    try {
       const idb = await openIDB()
    const transaction = idb.transaction("authUser", "readonly")
    const authUserStore = transaction.objectStore("authUser")

    const request = authUserStore.getAll() //get all results from authuser store in idb
        //authUser store should only ever store one user in at a time therefore all results are fetched
    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            if(request.result.length === 0){
                resolve(null) //if no results return null
            } else {
                resolve(request.result[0]) //return first result
            }
        }
        request.onerror = (event) => {
            reject(event)
        }
   
    }) 

    } catch (error) {
        console.error("Error in getauthuserfromIDB: ", error)
        return null
    }
    
    }

export async function clearAuthUserStore() {
    try {
        const idb = await openIDB()
        const transaction = idb.transaction("authUser", "readwrite")
        const authUserStore = transaction.objectStore("authUser")

        await new Promise((resolve, reject) => {
           const clearRequest = authUserStore.clear() //clear database
           clearRequest.onsuccess = () => {
            console.log("Indexed Db cleared")
            resolve(true)
           } 
           clearRequest.onerror = (event) => {
            console.error("Error clearing authUser store:", event.target.error)
            reject(event.target.error);
          }
        })
       idb.close()
   
    } catch (error) {
        console.error("Failed to clear authUser store:", error);
    }
}




