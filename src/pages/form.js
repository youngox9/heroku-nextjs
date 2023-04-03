import React, { Fragment, useEffect, useState } from "react";
import { CopyBlock, dracula } from "react-code-blocks";
import { SettingOutlined } from "@ant-design/icons";
import { Input, Row, Col, Button, Form } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { uuid } from "uuidv4";
import axios from "@/axios";
import _ from "lodash";

export function Main({ formList = [], htmlList = [] }) {
  const [list, setList] = useState(formList);

  const dispatch = useDispatch();

  // useEffect(() => {
  //   setList(propsList);
  // }, [propsList]);

  async function onUpdate(newList) {
    await axios({
      method: "PUT",
      url: "/api/form/list",
      data: newList,
    });
  }

  function onAddForm() {
    const newList = [
      ...list,
      {
        key: uuid(),
        fields: [
          // { name: "aaa", type: "input" },
          // { name: "bbb", type: "input" },
        ],
      },
    ];
    setList(newList);
    onUpdate(newList);
  }

  function onAddField(form) {
    const newList = list.reduce((prev, curr) => {
      if (form.key === curr.key) {
        return [
          ...prev,
          {
            ...curr,
            fields: [
              ...curr.fields,
              { key: uuid(), name: "aaa", type: "input" },
            ],
          },
        ];
      }
      return [...prev, curr];
    }, []);
    setList(newList);
    onUpdate(newList);
  }

  function onChangeField(idx, i, value) {
    const temp = _.set(list, [idx, "fields", i, "name"], value);
    console.log(temp);
    setList([...temp]);
    // onUpdate(list);
  }
  return (
    <Fragment>
      <h2>表單測試</h2>
      <Button
        type="danger"
        onClick={() => {
          setList([]);
          onUpdate([]);
        }}
      >
        Clear ALL
      </Button>
      {JSON.stringify(htmlList)}
      <Row gutter={[12, 12]}>
        {list.map((form, idx) => {
          return (
            <Col key={form.key} span={6}>
              {form.key}
              <Form
                className="form-box"
                name={`form-${idx}`}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                autoComplete="off"
              >
                <h2>表單-{idx}</h2>
                {form.fields.map((field, i) => {
                  return (
                    <>
                      {field.key}
                      <Form.Item
                        key={field.key}
                        name={field.name}
                        // label={
                        //   <Input
                        //     value={field.name}
                        //     onChange={(e) =>
                        //       onChangeField(idx, i, e.target.value)
                        //     }
                        //   />
                        // }
                        rules={[
                          {
                            required: true,
                            message: "必填",
                          },
                        ]}
                      >
                        {" "}
                        <Input
                          value={field.name}
                          onChange={(e) =>
                            onChangeField(idx, i, e.target.value)
                          }
                        />
                        <Input />
                      </Form.Item>
                    </>
                  );
                })}
                <Form.Item>
                  <Button
                    type="primary"
                    style={{ width: "100%" }}
                    onClick={() => onAddField(form)}
                  >
                    新增
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100%" }}
                  >
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          );
        })}
      </Row>
      <div className="footer-control">
        <Button type="primary" onClick={() => onAddForm()}>
          新增
        </Button>
      </div>
    </Fragment>
  );
}

export async function getServerSideProps(context) {
  const { getFormList, getHtmlList } = require("@/db");
  const formList = await getFormList();
  const htmlList = await getHtmlList();

  return {
    props: {
      formList,
      htmlList,
    },
  };
}

export default Main;
