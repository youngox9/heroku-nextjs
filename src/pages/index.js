import React, { Fragment, useEffect, useState, useCallback } from "react";
import { CopyBlock, dracula } from "react-code-blocks";
import { SettingOutlined } from "@ant-design/icons";
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
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { uuid } from "uuidv4";
import axios from "@/axios";
import HtmlInjectionModal from "@/components/HtmlInjectionModal";

export function Main({ htmlList = [] }) {
  const dispatch = useDispatch();

  const getHtmlInjectionStr = useCallback(() => {
    return htmlList.reduce((prev, curr) => {
      return prev + curr?.value || "";
    }, "");
  }, [htmlList]);

  return (
    <Fragment>
      <h2>程式碼片段初始化測試</h2>
      <HtmlInjectionModal />

      <div dangerouslySetInnerHTML={{ __html: getHtmlInjectionStr() }}></div>
    </Fragment>
  );
}

export async function getServerSideProps(context) {
  const { getList } = require("@/db");
  const htmlList = await getList();

  return {
    props: {
      htmlList,
    },
  };
}

export default Main;
