/**
 *
 * @param {*} key Clave con la que se buscará del almacenamiento del localStorage
 * @returns  Si encuentra algo, lo devuelve. Si no lo encuentra, devuelve null.
 */


const getDataFromStorage = (key) => {
    const data = localStorage.getItem(key);
  
    if (data) {
      return JSON.parse(data);
    }
  
    return null;
  };
  
  /**
   *
   * @param {*} key Clave con la que se guardará en el localStorage
   * @param {*} data Admite arrays, objetos y convierte con stringify el objeto antes de guardarlo
   */
  
  const saveDataInStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };
  