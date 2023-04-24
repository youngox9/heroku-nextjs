import React, { Fragment, useCallback } from "react";
import { useDispatch } from "react-redux";
import HtmlInjectionModal from "@/components/HtmlInjectionModal";

export function Main({ htmlList = [] }) {
  const dispatch = useDispatch();

  return (
    <Fragment>
      <h2>程式碼片段初始化測試</h2>
      <HtmlInjectionModal htmlList={htmlList} />
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
