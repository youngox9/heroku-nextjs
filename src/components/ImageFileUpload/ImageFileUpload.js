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
  Modal,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { uuid } from "uuidv4";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor } from "slate";
import { Swiper, SwiperSlide } from "swiper/react";
import _ from "lodash";
import axios from "@/axios";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

export default function FormList(props = {}) {
  const { onChange = () => {}, data = {} } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [originSrc, setOriginSrc] = useState("");
  const [cropSrc, setCropSrc] = useState("");

  const dispatch = useDispatch();

  const cropperRef = useRef(null);

  function getBase64(file) {
    // eslint-disable-next-line no-undef
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      console.log(file);
      reader.readAsDataURL(file);
      reader.onload = function () {
        resolve(reader.result);
        // const img = new Image();
        // img.src = reader.result;
        // img.onload = () => {
        //   const canvas = document.createElement("canvas");
        //   const ctx = canvas.getContext("2d");
        //   canvas.width = img.width;
        //   canvas.height = img.height;
        //   ctx.drawImage(img, 0, 0, img.width, img.height);
        //   const base64 = canvas.toDataURL("image/jpeg", 0.6);
        //   resolve(base64);
        // };
      };
      reader.onerror = function (error) {
        console.log("Error: ", error);
        reject(error);
      };
    });
  }

  async function onFileChange(info) {
    dispatch({ type: "TOGGLE_LOADING", isLoading: true });
    const file = info?.file?.originFileObj;
    if (file) {
      const base64 = await getBase64(file);
      setOriginSrc(base64);
      setIsOpen(true);
    }
    dispatch({ type: "TOGGLE_LOADING", isLoading: false });
  }

  function onOk(e) {
    const cropper = cropperRef?.current?.cropper;
    if (cropper) {
      const src = cropper.getCroppedCanvas().toDataURL("image/jpeg", 0.6);
      setCropSrc(src);
      onChange(src);
      setIsOpen(false);
    }
  }

  async function onRemoveImage(imageIdx) {
    const newData = {
      ...data,
      images: data.images.reduce((prev, curr, idx) => {
        if (imageIdx === idx) return prev;
        return [...prev, curr];
      }, []),
    };
  }

  return (
    <Fragment>
      <Modal
        width={800}
        open={isOpen}
        centered
        onCancel={() => setIsOpen(false)}
        onOk={onOk}
      >
        {originSrc && (
          <Cropper
            src={originSrc}
            style={{ height: 400, width: "100%" }}
            // Cropper.js options
            initialAspectRatio={16 / 9}
            guides={true}
            // crop={onCrop}
            ref={cropperRef}
          />
        )}
      </Modal>

      <Swiper className="gallery-swiper" spaceBetween={50} slidesPerView={1}>
        {data.images.map((src, idx) => {
          return (
            <SwiperSlide key={idx}>
              <div className="gallery-item">
                <Button
                  shape="circle"
                  icon={<Icon.DeleteOutlined />}
                  onClick={() => onRemoveImage(idx)}
                />
                <img src={src} alt="1" style={{ width: "100%" }} />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <Upload
        accept="image/*"
        showUploadList={false}
        onChange={(info) => onFileChange(info)}
      >
        <Button type="primary" icon={<Icon.UploadOutlined />}>
          Click to Upload
        </Button>
      </Upload>
    </Fragment>
  );
}
