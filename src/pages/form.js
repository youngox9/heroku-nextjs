import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import Head from "next/head";

import {
  PlusOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import {
  Empty,
  Divider,
  Input,
  Row,
  Col,
  Button,
  Form,
  Space,
  Popover,
  Select,
  Radio,
  Checkbox,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { uuid } from "uuidv4";
import axios from "@/axios";
import _ from "lodash";

import HtmlInjectionModal from "@/components/HtmlInjectionModal";

const FIELD_TYPES = [
  { label: "輸入框", value: "input" },
  { label: "下拉選單", value: "select" },
  { label: "Checkbox", value: "checkbox" },
  { label: "Radio", value: "radio" },
];

function DynamicField(props = {}) {
  const { value, onChange, fieldtype, name, key } = props;
  const ref = useRef();

  useEffect(() => {
    console.log(ref.current);
    const input = ref?.current?.input;
    if (input) {
      console.log(input);
      input.setAttribute("name", name);
    }
  }, []);
  if (fieldtype === "select") {
    return (
      <Select
        {...props}
        id={name}
        name={name}
        style={{ width: "100%" }}
        value={value}
        onChange={(value) => {
          onChange(value);
        }}
        options={[
          {
            value: "jack",
            label: "Jack",
          },
          {
            value: "lucy",
            label: "Lucy",
          },
          {
            value: "disabled",
            disabled: true,
            label: "Disabled",
          },
          {
            value: "Yiminghe",
            label: "yiminghe",
          },
        ]}
      />
    );
  } else if (fieldtype === "radio") {
    return (
      // <Radio.Group
      //   {...props}
      //   id={name}
      //   name={name}
      //   size="small"
      //   onChange={(e) => {
      //     onChange(e.target.value);
      //   }}
      //   value={value}
      //   options={[1, 2]}
      // >
      //   {/* <Radio value={1}>A</Radio>
      //   <Radio value={2}>B</Radio> */}
      // </Radio.Group>
      <div>
        <input type="radio" id={`${key}-1`} name={name} value="A" />
        <label htmlFor={`${key}-1`}>A</label>

        <input type="radio" id={`${key}-2`} name={name} value="B" />
        <label htmlFor={`${key}-2`}>B</label>

        <input type="radio" id={`${key}-3`} name={name} value="C" />
        <label htmlFor={`${key}-3`}>C</label>
      </div>
    );
  } else if (fieldtype === "checkbox") {
    return (
      // <Checkbox
      //   {...props}
      //   id={name}
      //   name={name}
      //   onChange={(e) => {
      //     onChange(e.target.checked);
      //   }}
      // >
      //   Checkbox
      // </Checkbox>
      <label htmlFor={`${key}`}>
        <input type="checkbox" id={`${key}`} name={name} value="C" />
      </label>
    );
  }
  return (
    <input
      {...props}
      type="text"
      ref={ref}
      id={name}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
function BlurInput(props = {}) {
  const { value: propsValue, onChange } = props;
  const [value, setValue] = useState(propsValue);

  useEffect(() => {
    setValue(propsValue);
  }, [JSON.stringify(propsValue)]);

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={(e) => onChange(value)}
      style={{ border: "none" }}
    />
  );
}
export default function FormList({ formList = [] }) {
  const [list, setList] = useState(formList);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();

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
        name: `表單-${list.length + 1}`,
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

  function onAddField(form, fieldtype = "input") {
    const newList = list.reduce((prev, curr) => {
      if (form.key === curr.key) {
        return [
          ...prev,
          {
            ...curr,
            fields: [
              ...curr.fields,
              {
                key: uuid(),
                name: `欄位名稱-${curr?.fields?.length + 1}`,
                fieldtype,
              },
            ],
          },
        ];
      }
      return [...prev, curr];
    }, []);
    setList(newList);
    onUpdate(newList);
  }

  function onFieldNameChange(idx, i, value) {
    const temp = _.set(list, [idx, "fields", i, "name"], value);

    setList([...temp]);
    onUpdate(list);
  }

  function onFieldChange(form, field, value) {
    const temp = _.set(formData, [form.key, field.key], value);
    setFormData({ ...temp });
  }

  function onRemoveForm(form) {
    const newList = list.reduce((prev, curr) => {
      if (form.key === curr.key) {
        return [...prev];
      }
      return [...prev, curr];
    }, []);
    setList(newList);
    onUpdate(newList);
  }

  function onRemoveField(form, field) {
    const newList = list.reduce((prev, curr) => {
      if (form.key === curr.key) {
        return [
          ...prev,
          {
            ...curr,
            fields: curr.fields.reduce((p, c) => {
              if (field.key === c.key) return p;
              return [...p, c];
            }, []),
          },
        ];
      }
      return [...prev, curr];
    }, []);
    setList(newList);
    onUpdate(newList);
  }

  function onFormNameChange(idx, value) {
    const temp = _.set(list, [idx, "name"], value);
    setList(temp);
    onUpdate(temp);
  }
  return (
    <Fragment>
      <Head>
        <title>動態表單測試</title>
      </Head>
      <h2>動態表單測試</h2>

      <Space
        style={{
          width: "100%",
          justifyContent: "flex-end",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Button type="primary" onClick={() => onAddForm()}>
          <PlusOutlined />
          新增表單
        </Button>
        <Button
          type="danger"
          onClick={() => {
            setList([]);
            onUpdate([]);
          }}
        >
          <ClearOutlined />
          清除全部
        </Button>
      </Space>

      {list.length ? (
        <Row gutter={[12, 12]}>
          {list.map((form, idx) => {
            return (
              <Col key={form.key} span={8}>
                <Form
                  colon={false}
                  className="form-box"
                  id={form.name}
                  name={form.name}
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 14 }}
                  autoComplete="off"
                  onSubmitCapture={() => {
                    console.log(">>>", formData);
                    const nowForm = formData?.[form.key];
                    const str = JSON.stringify(nowForm);
                    alert("送出 !!!" + str);
                  }}
                >
                  <Space
                    style={{
                      width: "100%",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <BlurInput
                      value={form.name}
                      size="large"
                      onChange={(val) => onFormNameChange(idx, val)}
                    />
                    <Button
                      type="danger"
                      shape="circle"
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => onRemoveForm(form)}
                    />
                  </Space>
                  <Divider />
                  {form.fields.map((field, i) => {
                    return (
                      <>
                        <Form.Item
                          key={field.key}
                          name={field.name}
                          label={
                            <BlurInput
                              value={field.name}
                              onChange={(val) => onFieldNameChange(idx, i, val)}
                            />
                          }
                          // rules={[
                          //   {
                          //     required: true,
                          //     message: "必填",
                          //   },
                          // ]}
                        >
                          <Row>
                            <Col span={20}>
                              <DynamicField
                                {...field}
                                value={formData?.[form.key]?.[field.key]}
                                onChange={(val) =>
                                  onFieldChange(form, field, val)
                                }
                              />
                            </Col>
                            <Col
                              span={4}
                              style={{
                                display: "flex",
                                width: "100%",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                // marginBottom: 12,
                              }}
                            >
                              <Button
                                type="text"
                                shape="circle"
                                size="small"
                                icon={<MinusCircleOutlined />}
                                onClick={() => onRemoveField(form, field)}
                              />
                            </Col>
                          </Row>
                        </Form.Item>
                      </>
                    );
                  })}

                  <Space
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "flex-start",
                      marginBottom: 12,
                    }}
                  >
                    <Popover
                      width={300}
                      content={
                        <Space direction="vertical">
                          {FIELD_TYPES.map((obj, idx) => {
                            return (
                              <Button
                                key={idx}
                                size="small"
                                block
                                onClick={() => onAddField(form, obj.value)}
                              >
                                {obj.label}
                              </Button>
                            );
                          })}
                        </Space>
                      }
                      title=""
                      trigger="click"
                    >
                      <Button
                        type="primary"
                        shape="circle"
                        size="small"
                        icon={<PlusOutlined />}
                      />
                    </Popover>
                  </Space>

                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100%" }}
                  >
                    Submit
                  </Button>
                </Form>
              </Col>
            );
          })}
        </Row>
      ) : (
        <Empty />
      )}
      <HtmlInjectionModal apiPath="/api/form/html" />
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
