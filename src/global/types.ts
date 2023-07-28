// interface da tabela de pessoas
export interface IDataTypeTableSignatures {
  key: React.Key;
  id: number;
  name: string;
  nickname: string,
  age: number;
  genre: string;
}

export interface IObjectOpenedPoll {
  typeOffice: string,
  name: string,
  numberSignatures: number,
  numberPolls: number,
  opened: boolean,
}
