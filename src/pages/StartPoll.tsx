import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Radio, Form, Input, Alert, Space, InputNumber, message } from 'antd';
import { useGlobalContext } from '../contexts/GlobalProvider/useGlobalContext';
import { InfoCircleOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';
import { IObjectOpenedPoll } from './../global/types';

const StartPoll = () => {
  const contextGlobal = useGlobalContext();
  const [form] = Form.useForm();
  const [clickLoading, setClickLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  /**
   * @name onFinish
   * @param values 
   * @description
   * @returns 
   */
  const onFinish = (values: IObjectOpenedPoll) => {
    console.log('Success:', { ...values, opened: true });
    contextGlobal.onUpdateMemoryObjectOpenedPoll({ ...values, opened: true });
    contextGlobal.onUpdateMemoryFlagOpenedPoll(true);
  };

  /**
   * @name onFinishFailed
   * @param errorInfo 
   */
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  /**
   * @name onCancelPoll
   * @description
   * @returns 
   */
  const onCancelPoll = () => {
    contextGlobal.onCancelOpenedPoll();
    message.success('Excluído com sucesso!');
  }

  useEffect(() => {
    if (contextGlobal.listSignatures.length > 0)
      form.setFieldValue('numberSignatures', contextGlobal.listSignatures.length);
  }, [contextGlobal.listSignatures]);

  useEffect(() => {
    if (Object.keys(contextGlobal.objectOpenedPoll).length > 0) {
      form.setFieldsValue({
        typeOffice: contextGlobal.objectOpenedPoll.typeOffice,
        name: contextGlobal.objectOpenedPoll.name,
        numberSignatures: contextGlobal.objectOpenedPoll.numberSignatures,
        numberPolls: contextGlobal.objectOpenedPoll.numberPolls,
      });
    }
  }, [contextGlobal.objectOpenedPoll]);

  useEffect(() => {
    form.setFieldValue('typeOffice', 'presbiteros');
  }, []);

  return (
    <div className="p-6 w-full h-[100vh] flex justify-center">
      <div className="w-full">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert
            className="border rounded-lg mb-10"
            message="Para abrir uma nova votação, todas as votações anteriores e atual devem estar finalizadas."
            type="info"
            showIcon
            banner
            closable
          />
        </Space>

        <Form
          className="w-full max-w-full flex flex-wrap gap-3 items-center laptop:justify-start phoneTablet:justify-center"
          layout="vertical"
          name="registerStartPoll"
          style={{ maxWidth: '100%' }}
          initialValues={{ remember: true }}
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          disabled={contextGlobal.flagOpenedPoll}
        >
          <Form.Item
            label="Tipo"
            name="typeOffice"
            className="laptop:w-auto phoneTablet:w-[100%] resetMarginBottom"
            rules={[{ required: true, message: 'Escolha um tipo!' }]}
          >
            <Radio.Group buttonStyle="solid" className="w-full">
              <Radio.Button value="presbiteros">Presbíteros</Radio.Button>
              <Radio.Button value="diaconos">Diáconos</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            className="laptop:w-[20%] phoneTablet:w-[100%] resetMarginBottom grow"
            label="Nome"
            name="name"
            rules={[{ required: true, message: 'Digite o nome da votação!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            className="laptop:w-[130px] phoneTablet:w-[100%] resetMarginBottom grow"
            label="Assinaturas"
            tooltip={{ title: 'A lista de assinaturas deve conter pelo menos 1 registro.', icon: <InfoCircleOutlined /> }}
            name="numberSignatures"
            rules={[{ required: true, message: 'A lista de assinaturas não contêm registros!' }]}
          >
            <InputNumber className="w-full" min={1} disabled />
          </Form.Item>

          <Form.Item
            className="laptop:w-[130px] phoneTablet:w-[100%] resetMarginBottom grow"
            label="Votos na Rodada"
            name="numberPolls"
            rules={[{ required: true, message: 'Digite uma quantidade de votos!' }]}
          >
            <InputNumber className="w-full" min={1} />
          </Form.Item>

          <Form.Item className="w-full text-right resetMarginBottom mt-5">
            {
              !contextGlobal.flagOpenedPoll && (
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-[200px] text-white bg-indigo-700 hover:bg-indigo-600"
                  loading={clickLoading}
                  icon={<SaveOutlined />}
                >
                  Abrir Nova Votação
                </Button>
              )
            }

            {
              contextGlobal.flagOpenedPoll && (
                <Button
                  type="primary"
                  className="text-white bg-red-700 hover:bg-red-800"
                  loading={clickLoading}
                  icon={<SaveOutlined />}
                  disabled={!contextGlobal.flagOpenedPoll}
                  onClick={onCancelPoll}
                >
                  Cancelar Votação em Andamento
                </Button>
              )
            }
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default StartPoll;
