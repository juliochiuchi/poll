import { createContext, useCallback, useEffect, useState } from 'react';
import { IDataTypeTableSignatures, IObjectOpenedPoll } from './../../global/types';


// types
type TGlobalContext = {
  loadingGlobal: boolean,
  loadingPageSignatures: boolean,
  listSignatures: IDataTypeTableSignatures[],
  IDKeyListSignatures: number,
  flagOpenedPoll: boolean,
  objectOpenedPoll: IObjectOpenedPoll,
  onUpdateStorageSignatures(list: IDataTypeTableSignatures[], idKey: number): void,
  onUpdateMemoryFlagOpenedPoll(flagOpenedPoll: boolean): void,
  onUpdateMemoryObjectOpenedPoll(objectOpenedPoll: IObjectOpenedPoll): void,
  onCancelOpenedPoll(): void,
}

// init value
const GlobalContext = createContext<TGlobalContext>({
  loadingGlobal: true,
  loadingPageSignatures: true,
  listSignatures: [],
  IDKeyListSignatures: 0,
  flagOpenedPoll: false,
  objectOpenedPoll: {
    typeOffice: '',
    name: '',
    numberSignatures: 0,
    numberPolls: 0,
    opened: false,
  },
  onUpdateStorageSignatures: (list: IDataTypeTableSignatures[], idKey: number) => { },
  onUpdateMemoryFlagOpenedPoll: (flagOpenedPoll: boolean) => { },
  onUpdateMemoryObjectOpenedPoll: (objectOpenedPoll: IObjectOpenedPoll) => { },
  onCancelOpenedPoll: () => {},
});

// provider values
const GlobalProvider = ({ children }: { children: JSX.Element }) => {
  const [loadingGlobal, setLoadingGlobal] = useState<boolean>(true);
  const [loadingPageSignatures, setLoadingPageSignatures] = useState<boolean>(true);
  const [listSignatures, setListSignatures] = useState<IDataTypeTableSignatures[]>([]);
  const [IDKeyListSignatures, setIDKeyListSignatures] = useState<number>(0);
  const [flagOpenedPoll, setFlagOpenedPoll] = useState<boolean>(false);
  const [objectOpenedPoll, setObjectOpenedPoll] = useState<IObjectOpenedPoll>({
    typeOffice: '',
    name: '',
    numberSignatures: 0,
    numberPolls: 0,
    opened: false,
  });

  /**
   * @name onUpdateStorageSignatures
   * @description
   * @returns
   */
  const onUpdateStorageSignatures = useCallback(async (list: IDataTypeTableSignatures[], idKey: number) => {
    try {
      setLoadingPageSignatures(true);

      // save and update storage signatures
      localStorage.removeItem('storageListSignatures');
      localStorage.setItem('storageListSignatures', JSON.stringify(list));

      // update state
      setListSignatures(list);

      // verify for save id storage
      if (idKey !== 0)
        onUpdateMemoryIDKeyListSignatures(idKey);
    } catch (error: any) {
      console.log('err ===>', error);
      setLoadingPageSignatures(false);
    } finally {
      setLoadingPageSignatures(false);
    }
  }, []);

  /**
   * @name onGetStorageListSignatures
   * @description busca a lista de pessoas do local storage
   * @returns retorna a lista de pessoas do local storage para ser consumida
   */
  const onGetStorageListSignatures = () => {
    const storageListSignatures: string | null = localStorage.getItem('storageListSignatures');
    let convertStringToArray: IDataTypeTableSignatures[] = [];

    try {
      convertStringToArray = JSON.parse(storageListSignatures ? storageListSignatures : '[]');
      setListSignatures(convertStringToArray);
    } catch (e: any) {
      console.log('erro de busca no storage');
      localStorage.removeItem('storageListSignatures');
    }
  }

  /**
   * @name onUpdateMemoryIDKeyListSignatures
   * @param idKey 
   * @description armazena o valor do último ID utilizado no cadastro de pessoas
   * @returns armazena o valor do último ID utilizado no cadastro de pessoas
   */
  const onUpdateMemoryIDKeyListSignatures = (idKey: number) => {
    localStorage.removeItem('storageIDKeyListSignatures');
    localStorage.setItem('storageIDKeyListSignatures', idKey.toString());
  }

  /**
   * @name onGetStorageIDKeyListSignatures
   * @description busca o último ID utilizado no processo de cadastro de pessoas
   * @returns retorna o último ID utilizado no processo de cadastro de pessoas
   */
  const onGetStorageIDKeyListSignatures = () => {
    const storageIDKeyListSignatures: string | null = localStorage.getItem('storageIDKeyListSignatures');
    let convertStringToNumber: number = 0;

    try {
      convertStringToNumber = Number.parseInt(storageIDKeyListSignatures ? storageIDKeyListSignatures : '0');
      setIDKeyListSignatures(convertStringToNumber);
    } catch (e: any) {
      console.log('erro de busca do ID Key no storage');
      localStorage.removeItem('storageIDKeyListSignatures');
    }
  }

  /**
   * @name onUpdateMemoryObjectOpenedPoll
   * @param objectOpenedPoll 
   * @description atualiza dados da votação que foi aberta
   * @returns atualiza dados da votação que foi aberta
   */
  const onUpdateMemoryObjectOpenedPoll = (objectOpenedPoll: IObjectOpenedPoll) => {
    localStorage.removeItem('storageObjectOpenedPoll');
    localStorage.setItem('storageObjectOpenedPoll', JSON.stringify(objectOpenedPoll));
    setObjectOpenedPoll(objectOpenedPoll);
  }

  /**
   * @name onGetStorageObjectOpenedPoll
   * @description armazena dados da votação que foi aberta
   * @returns retorna os dados armazenado da votação que foi aberta
   */
  const onGetStorageObjectOpenedPoll = () => {
    const storageObjectOpenedPoll: string | null = localStorage.getItem('storageObjectOpenedPoll');
    let convertStringToObject: IObjectOpenedPoll;

    try {
      convertStringToObject = JSON.parse(storageObjectOpenedPoll ? storageObjectOpenedPoll : '{}');
      setObjectOpenedPoll(convertStringToObject);
    } catch (e: any) {
      console.log('erro de busca no storage');
      localStorage.removeItem('storageObjectOpenedPoll');
    }
  }

  /**
   * @name onUpdateMemoryFlagOpenedPoll
   * @param flagOpenedPoll 
   * @description
   * @returns
   */
  const onUpdateMemoryFlagOpenedPoll = (flagOpenedPoll: boolean) => {
    localStorage.removeItem('storageOpenedPoll');
    localStorage.setItem('storageOpenedPoll', flagOpenedPoll.toString());
    setFlagOpenedPoll(flagOpenedPoll);
  }

  /**
   * @name onCancelOpenedPoll
   * @param flagOpenedPoll 
   * @description remove os valores de votação aberta do sotrage e do estado global
   * @returns retorna a remoção dos valores de votação aberta do storage e do estado global
   */
  const onCancelOpenedPoll = () => {
    // remove object opened poll
    localStorage.removeItem('storageObjectOpenedPoll');
    setObjectOpenedPoll({
      typeOffice: '',
      name: '',
      numberSignatures: 0,
      numberPolls: 0,
      opened: false,
    });

    // remove flag opened poll
    localStorage.removeItem('storageOpenedPoll');
    setFlagOpenedPoll(false);
  }

  /**
   * @name onGetStorageFlagOpenedPoll
   */
  const onGetStorageFlagOpenedPoll = () => {
    const storageOpenedPoll: string | null = localStorage.getItem('storageOpenedPoll');
    let convertStringToBoolean: boolean = false;

    try {
      convertStringToBoolean = (storageOpenedPoll === 'true' ? true : false);
      setFlagOpenedPoll(convertStringToBoolean);
    } catch (e: any) {
      console.log('erro ao buscar flag opened poll no storage');
      localStorage.removeItem('storageOpenedPoll');
    }
  }

  useEffect(() => {
    try {
      setLoadingGlobal(true);
      setLoadingPageSignatures(true);

      // loading data
      onGetStorageListSignatures();
      onGetStorageIDKeyListSignatures();
      onGetStorageFlagOpenedPoll();
      onGetStorageObjectOpenedPoll();
    } catch (e: any) {
      console.log('erro ao carregar storage', e.message);
      setLoadingPageSignatures(false);
      setLoadingGlobal(false);
    } finally {
      setLoadingPageSignatures(false);
      setLoadingGlobal(false);
    }
  }, []);

  return (
    <GlobalContext.Provider value={{
      loadingGlobal,
      loadingPageSignatures,
      listSignatures,
      IDKeyListSignatures,
      flagOpenedPoll,
      objectOpenedPoll,
      onUpdateStorageSignatures,
      onUpdateMemoryFlagOpenedPoll,
      onUpdateMemoryObjectOpenedPoll,
      onCancelOpenedPoll,
    }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export { GlobalContext, GlobalProvider };
