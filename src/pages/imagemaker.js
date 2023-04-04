import React, { Fragment, useCallback, useEffect, useState } from "react";
import { CopyBlock, dracula } from "react-code-blocks";
import {
  PlusOutlined,
  DeleteOutlined,
  MinusOutlined,
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

export default function FormList({ formList = [], htmlList = [] }) {
  return (
    <Fragment>
      <h2>圖片快速裁切</h2>
    </Fragment>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {},
  };
}
