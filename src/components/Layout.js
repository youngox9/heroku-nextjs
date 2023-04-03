import React, { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";

import styled from "styled-components";

const Container = styled.div``;

export default function Layout(props) {
  const isLoading = useSelector((state) => {
    return state?.global?.isLoading;
  });
  const dispatch = useDispatch();

  return (
    <Fragment>
      {isLoading && <div className="loading"></div>}
      <div className="container">{props.children}</div>
    </Fragment>
  );
}
