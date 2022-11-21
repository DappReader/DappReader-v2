import localforage from "localforage";
localforage.config({
  name: 'DappReader'
});
export const getLs = (itemName) => {
  return new Promise((resolve) => {
    localforage.getItem(itemName).then(value => {
      if (value !== null) {
        resolve(value)
      } else {
        resolve([])
      }
    }).catch(() => {
      resolve([])
    })
  })
}

export const setLs = (itemName, data) => {
  return new Promise((resolve, reject) => {
    localforage.setItem(itemName, data).then((value) => {
      resolve(value)
    }).catch((err) => {
      reject(err)
    });
  })
}
