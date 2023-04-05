import React, { Fragment, useEffect, useState, useCallback } from "react";
import { CopyBlock, dracula } from "react-code-blocks";
import {
  SettingOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  Input,
  Row,
  Col,
  Button,
  Space,
  Divider,
  Tooltip,
  Modal,
  Spin,
  Empty,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { uuid } from "uuidv4";
import axios from "@/axios";

export function HtmlInjectionModal(props) {
  const { apiPath = "/api/list" } = props;
  const [list, setList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    getList();
  }, []);

  async function getList() {
    dispatch({ type: "TOGGLE_LOADING", isLoading: true });
    const res = await axios({ method: "GET", url: apiPath });

    const data = res?.data || [];
    setList(data.map((obj) => ({ ...obj, key: obj._id })));
    dispatch({ type: "TOGGLE_LOADING", isLoading: false });
  }

  async function onUpdate() {
    dispatch({ type: "TOGGLE_LOADING", isLoading: true });
    const res = await axios({
      method: "PUT",
      url: apiPath,
      data: list,
    });

    await getList();
    dispatch({ type: "TOGGLE_LOADING", isLoading: false });

    window.location.reload();
  }

  async function onDelete(obj) {
    const temp = list.reduce((prev, curr) => {
      if (obj.key === curr.key) {
        return prev;
      }
      return [...prev, curr];
    }, []);
    setList(temp);
  }

  async function onAddItem(obj) {
    setList([...list, { value: "", key: uuid() }]);
  }

  async function onChange(value, obj) {
    const temp = list.map((o) => {
      if (obj.key === o.key) {
        return { ...o, value };
      }
      return o;
    });
    setList(temp);
  }

  const getHtmlInjectionStr = useCallback(() => {
    return list.reduce((prev, curr) => {
      return prev + curr?.value || "" + "\n";
    }, "");
  }, [list]);

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: getHtmlInjectionStr() }}></div>
      <Tooltip title="程式碼初始化設定">
        <Button
          className="setting-btn"
          type="primary"
          shape="circle"
          icon={<SettingOutlined />}
          onClick={() => setIsOpen(true)}
        />
      </Tooltip>
      <Modal
        width={"80%"}
        centered
        onCancel={() => setIsOpen(false)}
        open={isOpen}
        // {...props}
        footer={
          <Button type="primary" onClick={() => onUpdate()}>
            套用
          </Button>
        }
      >
        <h2>貼上程式碼區塊</h2>
        <h3>當前生效程式碼</h3>
        <CopyBlock
          language={"html"}
          text={getHtmlInjectionStr()}
          showLineNumbers
          theme={dracula}
          wrapLines={true}
          codeBlock
        />
        <Divider />

        <h3>請貼上程式碼</h3>
        {list.length ? (
          <>
            {list.map((obj) => {
              return (
                <Row
                  key={obj.key}
                  align="middle"
                  gutter={[16, 16]}
                  style={{
                    display: "flex",
                    flexWrap: "nowrap",
                    marginBottom: 16,
                    alignItems: "flex-start",
                  }}
                >
                  {/* <Col sm={1}>{idx}</Col> */}
                  <Col
                    style={{
                      flex: "0 100%",
                    }}
                  >
                    <Input.TextArea
                      value={obj.value}
                      onChange={(e) => onChange(e?.target?.value, obj)}
                      style={{
                        width: "100%",
                        backgroundColor: "black",
                        color: "white",
                      }}
                      autoSize
                    />
                  </Col>
                  <Col>
                    <Space
                      size="small"
                      style={{
                        display: "flex",
                        flexWrap: "nowrap",
                        justifyContent: "flex-end",
                      }}
                    >
                      {/* <Button type="danger" onClick={() => onDelete(obj)}>
                        刪除
                      </Button> */}
                      <Button
                        type="danger"
                        shape="circle"
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => onDelete(obj)}
                      />
                    </Space>
                  </Col>
                </Row>
              );
            })}
          </>
        ) : (
          <Empty />
        )}

        <Space style={{ justifyContent: "center", width: "100%" }}>
          <Button
            type="primary"
            onClick={() => onAddItem()}
            style={{ marginTop: 12 }}
            shape="circle"
            icon={<PlusOutlined />}
            size="large"
          ></Button>
        </Space>
      </Modal>
    </>
  );
}

export default HtmlInjectionModal;
