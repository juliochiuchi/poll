import { useGlobalContext } from '../contexts/GlobalProvider/useGlobalContext';
import { Skeleton } from 'antd';

const HomePoll = () => {
  const contextGlobal = useGlobalContext();

  return (
    <div className="p-6 w-full h-[100vh] flex">
      {
        !contextGlobal.loadingGlobal
          ? (
            <>
              <h1>Hello World - [HomePoll]</h1>
            </>
          ) : (
            <>
              <Skeleton avatar active paragraph={{ rows: 4 }} />
            </>
          )
      }
    </div>
  );
}

export default HomePoll;
