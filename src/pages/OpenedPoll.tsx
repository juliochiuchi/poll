import { useEffect, useState, useRef } from 'react';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Table,
  Divider,
  Popconfirm,
  InputRef,
  Space,
  message,
  Skeleton,
  Avatar,
  Badge,
} from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import { CheckCircleTwoTone, SearchOutlined, UserOutlined, SaveOutlined, } from '@ant-design/icons';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { useGlobalContext } from '../contexts/GlobalProvider/useGlobalContext';
import { IDataTypeTableSignatures } from '../global/types';

const OpenedPoll = () => {
  const contextGlobal = useGlobalContext();
  const [form] = Form.useForm();
  const { Option } = Select;
  const [selectionType, setSelectionType] = useState<'checkbox'>('checkbox');
  const [dataSignatures, setDataSignatures] = useState<IDataTypeTableSignatures[]>([]);
  const [count, setCount] = useState<number>(0);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [clickLoading, setClickLoading] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(true);
  const [listPeopleVoted, setListPeopleVoted] = useState<TListPeopleVoted[]>([]);
  const [valueCoro, setValueCoro] = useState<number>(3);

  type DataIndex = keyof IDataTypeTableSignatures;

  type TListPeopleVoted = {
    key: React.Key,
    id: number,
    name: string,
    nickname: string,
    age: number,
    genre: string,
    polls: number,
    elected: boolean,
  };

  // trigger set execution when selecting a person from the list | rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: IDataTypeTableSignatures[]) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);

      if (selectedRows.length > 0) {
        const listPeopleCheckeds: TListPeopleVoted[] = getValuesTable(selectedRows);
        setListPeopleVoted(listPeopleCheckeds);
      } else {
        setListPeopleVoted([]);
      }
    },
    getCheckboxProps: (record: IDataTypeTableSignatures) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };

  /**
   * @name getValuesTable
   * @param list 
   * @returns Return the people is selected in the table and receiver at least 1 vote
   */
  const getValuesTable = (list: IDataTypeTableSignatures[]): TListPeopleVoted[] => {
    let reloadingOpened: TListPeopleVoted[] = [];

    list.map((item) => {
      reloadingOpened.push({ ...item, polls: searchAddPollPeople(item.id), elected: searchElectedPeople(item.id), });
    });

    return reloadingOpened;
  }

  /**
   * @name searchAddPollPeople
   * @param id 
   * @returns Returns the person current poll number or 1 for begin poll the person
   */
  const searchAddPollPeople = (id: number): number => {
    if (listPeopleVoted !== undefined) {
      const index = listPeopleVoted.findIndex(people => people.id === id);

      if (index < 0)
        return 1;
      else
        return listPeopleVoted[index].polls;
    }

    return 1;
  }

  /**
   * @name searchElectedPeople
   * @param id 
   * @returns Returns flag the people if elect or no
   */
  const searchElectedPeople = (id: number): boolean => {
    if (listPeopleVoted !== undefined) {
      const index = listPeopleVoted.findIndex(people => people.id === id);

      if (index < 0)
        return false;
      else
        return listPeopleVoted[index].elected;
    }

    return false;
  }

  // configuration resources filter the table of column 'nome' and run resource
  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<IDataTypeTableSignatures> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  // configuration columns the table
  const columns: ColumnsType<IDataTypeTableSignatures> = [
    {
      key: 'name',
      title: 'Nome',
      dataIndex: 'name',
      ...getColumnSearchProps('name'),
      render: (textName: string, record: IDataTypeTableSignatures) => {
        return (
          <>
            <Avatar src={record.genre == 'Feminino'
              ? 'data:image/png;base64,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'
              : 'data:image/jpeg;base64,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'
            } icon={<UserOutlined />} /> &nbsp; {textName}
          </>
        );
      },
    },
    {
      key: 'nickname',
      title: 'Nickname',
      dataIndex: 'nickname',
    },
    {
      key: 'age',
      title: 'Idade',
      dataIndex: 'age',
    },
    {
      key: 'genre',
      title: 'Gênero',
      dataIndex: 'genre',
    },
  ];

  /**
   * @name handleSearch
   * @param selectedKeys 
   * @param confirm 
   * @param dataIndex 
   * @description Search all filter results
   * @returns Search all filter results
   */
  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  /**
   * @name handleReset
   * @param clearFilters 
   * @description Reset all search filter
   * @returns Reset all search filter
   */
  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  /**
   * @name removeVote
   * @param id 
   * @description Remove a vote from the people
   */
  const removeVote = (id: number) => {
    let updatedTargetPoll: TListPeopleVoted[] = [];

    listPeopleVoted.map((item: TListPeopleVoted) => {
      if (item.id === id) {
        updatedTargetPoll.push({
          id: item.id,
          key: item.key,
          name: item.name,
          nickname: item.nickname,
          age: item.age,
          genre: item.genre,
          polls: item.polls - 1,
          elected: (item.polls - 1 >= valueCoro ? true : false),
        });
      } else {
        updatedTargetPoll.push({ ...item });
      }
    });

    setListPeopleVoted(updatedTargetPoll);
  };

  /**
   * @name addedVote
   * @param id 
   * @description Added a new voto from the people
   */
  const addedVote = (id: number) => {
    let updatedTargetPoll: TListPeopleVoted[] = [];

    listPeopleVoted.map((item: TListPeopleVoted) => {
      if (item.id === id) {
        updatedTargetPoll.push({
          id: item.id,
          key: item.key,
          name: item.name,
          nickname: item.nickname,
          age: item.age,
          genre: item.genre,
          polls: item.polls + 1,
          elected: (item.polls + 1 >= valueCoro ? true : false),
        });
      } else {
        updatedTargetPoll.push({ ...item });
      }
    });

    setListPeopleVoted(updatedTargetPoll);
  };

  useEffect(() => {
    setDataSignatures(contextGlobal.listSignatures);
  }, [contextGlobal.listSignatures]);

  useEffect(() => {
    setValueCoro((contextGlobal.objectOpenedPoll.numberSignatures / 2) + 1);
  }, [contextGlobal.objectOpenedPoll]);

  return (
    <div className="p-6">
      <div>
        <h3>Nomes disponíveis para votação</h3>
      </div>

      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={dataSignatures}
        scroll={{ y: 240 }}
      />

      <Divider />

      <div className="text-center">
        {
          listPeopleVoted.length > 0
            ? <>
              {
                listPeopleVoted.map((item: TListPeopleVoted) => {
                  return (
                    <Badge key={item.key} count={show && item.elected ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : null} className="mx-2 my-2">
                      <div className="border rounded-lg border-solid border-gray-100 pt-5 text-center w-[200px] max-w-[200px] min-w-[200px] flex flex-col items-center justify-center">
                        <Badge count={item.polls}>
                          <Avatar size="large" icon={<UserOutlined />} />
                        </Badge>

                        <div className="mt-1">
                          <span>{item.name} ({item.nickname})</span>
                        </div>

                        <div className="flex items-center justify-center gap-3 mt-5">
                          <Button onClick={() => removeVote(item.id)}>-</Button>
                          <Button onClick={() => addedVote(item.id)}>+</Button>
                        </div>

                        <div className="w-full bg-blue-violet-default mt-5 p-2 border rounded-b-lg border-solid border-blue-violet-default">
                          <span className="text-white">Presbítero</span>
                        </div>
                      </div>
                    </Badge>
                  );
                })
              }
            </>
            : <span>Nenhum voto encontrado</span>
        }

        {/* <Badge count={show && <CheckCircleTwoTone twoToneColor="#52c41a" />} className="mx-2 my-2">
          <div className="border rounded-lg border-solid border-gray-100 pt-5 text-center w-[200px] max-w-[200px] min-w-[200px] flex flex-col items-center justify-center">
            <Badge count={3}>
              <Avatar size="large" icon={<UserOutlined />} />
            </Badge>

            <div className="mt-1">
              <span>Julio (Juh)</span>
            </div>

            <div className="flex items-center justify-center gap-3 mt-5">
              <Button>-</Button>
              <Button>+</Button>
            </div>

            <div className="w-full bg-blue-violet-default mt-5 p-2 border rounded-b-lg border-solid border-blue-violet-default">
              <span className="text-white">Presbítero</span>
            </div>
          </div>
        </Badge> */}
      </div>
    </div>
  );
}

export default OpenedPoll;
