import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, Layout, Menu, theme, Skeleton } from 'antd';
import {
  HomeOutlined,
  TeamOutlined,
  HistoryOutlined,
  SoundOutlined,
  AuditOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import HomePoll from './HomePoll';
import Polls from './Polls';
import StartPoll from './StartPoll';
import OpenedPoll from './OpenedPoll';
import Signatures from './Signatures';
import { useGlobalContext } from '../contexts/GlobalProvider/useGlobalContext';
import logoWhiteIPI from './../assets/logo-ipi-white.png';

const DashboardPoll = () => {
  const contextGlobal = useGlobalContext();
  const navigate = useNavigate();
  const { Header, Sider, Content, Footer } = Layout;
  const [preSetContent, setPreSetContent] = useState<string | undefined>('Início');
  // const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  /**
   * @name setContent
   * @param key 
   * @description sets the content of the current value
   * @returns the current value
   */
  const setContent = (key: string) => {
    switch (key) {
      case 'home':
        setPreSetContent('Início');
        break;

      case 'poll':
        setPreSetContent('Rodadas');
        break;

      case 'startPoll':
        setPreSetContent('Abrir Votação');
        break;

      case 'openedPoll':
        setPreSetContent('Votação Aberta');
        break;

      case 'signatures':
        setPreSetContent('Assinaturas');
        break;

      default:
        setPreSetContent('Início');
        break;
    }
  }

  return (
    <>
      <Layout>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            // console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            // console.log(collapsed, type);
          }}
        >
          <div className="flex justify-center items-center"><img className="logo" src={logoWhiteIPI} alt="Logo IPI" /></div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={[
              {
                key: '1',
                icon: <HomeOutlined />,
                label: 'Home',
                onClick: () => setContent('home'),
              },
              {
                key: '2',
                icon: <TeamOutlined />,
                label: 'Eleição',
                children: [
                  {
                    key: '1eleicao',
                    icon: <AuditOutlined />,
                    label: 'Rodadas',
                    onClick: () => setContent('poll'),
                  },
                  {
                    key: '2eleicao',
                    icon: <SoundOutlined />,
                    label: 'Abrir Votação',
                    onClick: () => setContent('startPoll'),
                  },
                  {
                    key: '3eleicao',
                    icon: <HistoryOutlined />,
                    label: 'Votação Aberta',
                    onClick: () => setContent('openedPoll'),
                  },
                  {
                    key: '4eleicao',
                    icon: <TeamOutlined />,
                    label: 'Assinaturas',
                    onClick: () => setContent('signatures'),
                  },
                ],
              },
            ]}
          />
        </Sider>
        <Layout className="site-layout">
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <div className="flex justify-end items-center pr-6 gap-3">
              <a onClick={() => {
                navigate("/");
              }}>
                <LogoutOutlined /> &nbsp; Logout
              </a>
            </div>
          </Header>
          <Breadcrumb style={{ margin: '24px 16px 0 16px' }} items={[
            {
              title: (
                <>
                  <HomeOutlined />
                </>
              ),
            },
            { title: 'IPIM' },
            { title: 'Votação' },
            { title: (<><span className="text-indigo-700">{preSetContent}</span></>) },
          ]} />
          <Content
            style={{
              margin: '24px 16px',
              padding: 10,
              minHeight: 280,
              background: colorBgContainer,
              height: '100%',
              border: '1px solid white',
              borderRadius: '8px',
            }}
          >
            {(preSetContent == 'Início' || preSetContent == '' || preSetContent == undefined) && <HomePoll />}
            {preSetContent == 'Rodadas' && <Polls />}
            {preSetContent == 'Abrir Votação' && <StartPoll />}
            {preSetContent == 'Votação Aberta' && <OpenedPoll />}
            {preSetContent == 'Assinaturas' && <Signatures />}
          </Content>
          <Footer style={{ textAlign: 'center' }}>IPI Macaubal ©2023 Created by IPIM</Footer>
        </Layout>
      </Layout>
    </>
  );
}

export default DashboardPoll;
