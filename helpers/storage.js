/**
 *
 * @param {*} key Clave con la que se buscará del almacenamiento del localStorage
 * @returns  Si encuentra algo, lo devuelve. Si no lo encuentra, devuelve null.
 */


export const getDataFromStorage = (key) => {
    const data = localStorage.getItem(key);

    return data ? JSON.parse(data) : null;
  
   
  };
  
  /**
   *
   * @param {*} key Clave con la que se guardará en el localStorage
   * @param {*} data Admite arrays, objetos y convierte con stringify el objeto antes de guardarlo
   */
  
  export const saveDataInStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };
  