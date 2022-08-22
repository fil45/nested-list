import { ReactElement } from "react";
import { Action, State } from "./types";
import { Button, Tooltip, Space, List, Input, Form } from "antd";
import {
  PlusCircleOutlined,
  CloseCircleOutlined,
  UpCircleOutlined,
  DownCircleOutlined,
  LoginOutlined,
  LogoutOutlined
} from "@ant-design/icons";

type NestedListProps = {
  state: State;
  dispatch: React.Dispatch<Action>;
  parentId: string | null;
};

export default function NestedList({
  state,
  dispatch,
  parentId
}: React.PropsWithChildren<NestedListProps>): ReactElement {
  const [form] = Form.useForm();

  const onAdd = (values: { itemName: string }): void => {
    dispatch({
      type: "addItem",
      payload: {
        parentId,
        name: values.itemName
      }
    });
    form.resetFields();
  };

  const onRemove = (id: string): void => {
    dispatch({
      type: "removeItem",
      payload: {
        id
      }
    });
  };

  const onDown = (id: string): void => {
    dispatch({
      type: "moveDown",
      payload: {
        id
      }
    });
  };

  const onUp = (id: string): void => {
    dispatch({
      type: "moveUp",
      payload: {
        id
      }
    });
  };

  const onAddSublist = (id: string): void => {
    dispatch({
      type: "addSublist",
      payload: {
        id
      }
    });
  };

  const onRemoveSublist = (id: string): void => {
    dispatch({
      type: "removeSublist",
      payload: {
        id
      }
    });
  };

  return (
    <List
      size="large"
      footer={
        <Form form={form} onFinish={onAdd} autoComplete="off">
          <Space align="start">
            <Form.Item
              name="itemName"
              rules={[{ required: true, message: "Please input item name!" }]}
            >
              <Input placeholder="List item name" />
            </Form.Item>
            <Tooltip title="Add list item">
              <Button type="primary" shape="circle" htmlType="submit">
                <PlusCircleOutlined />
              </Button>
            </Tooltip>
          </Space>
        </Form>
      }
      bordered
      dataSource={state}
      renderItem={(item, index) => (
        <List.Item key={item.id}>
          <div className="list-content-wrapper">
            <Space>
              {item.name}
              {index !== 0 && (
                <Tooltip title="Move up">
                  <Button
                    type="primary"
                    shape="circle"
                    onClick={() => onUp(item.id)}
                  >
                    <UpCircleOutlined />
                  </Button>
                </Tooltip>
              )}
              {index !== state.length - 1 && (
                <Tooltip title="Move down">
                  <Button
                    type="primary"
                    shape="circle"
                    onClick={() => onDown(item.id)}
                  >
                    <DownCircleOutlined />
                  </Button>
                </Tooltip>
              )}
              <Tooltip title="Remove list item">
                <Button
                  type="primary"
                  shape="circle"
                  onClick={() => onRemove(item.id)}
                >
                  <CloseCircleOutlined />
                </Button>
              </Tooltip>
              {!item.children && (
                <Tooltip title="Add sublist">
                  <Button
                    type="primary"
                    shape="circle"
                    onClick={() => onAddSublist(item.id)}
                  >
                    <LoginOutlined />
                  </Button>
                </Tooltip>
              )}
              {item.children && (
                <Tooltip title="Remove sublist">
                  <Button
                    type="primary"
                    shape="circle"
                    onClick={() => onRemoveSublist(item.id)}
                  >
                    <LogoutOutlined />
                  </Button>
                </Tooltip>
              )}
            </Space>
            {item.children && (
              <NestedList
                state={item.children}
                dispatch={dispatch}
                parentId={item.id}
              />
            )}
          </div>
        </List.Item>
      )}
    />
  );
}
