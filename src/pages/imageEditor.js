import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import * as Icon from "@ant-design/icons";
import {
  Card,
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
  Upload,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { uuid } from "uuidv4";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor } from "slate";
import { Swiper, SwiperSlide } from "swiper/react";
import _ from "lodash";
import axios from "@/axios";

import "swiper/css";

import ImageFileUpload from "@/components/ImageFileUpload";

export default function ImageEditor(props = {}) {
  return <div className="container"></div>;
}

export async function getServerSideProps(context) {
  return {
    props: {},
  };
}
