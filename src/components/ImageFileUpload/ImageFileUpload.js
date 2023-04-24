import React, { Fragment, useEffect, useRef, useState } from "react";

import * as Icon from "@ant-design/icons";
import { Button, Upload, Modal, Space } from "antd";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import _ from "lodash";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const Div = styled.div`
  .gallery-swiper {
    .gallery-item {
      .gallery-control {
        position: absolute;
        right: 12px;
        top: 12px;
      }

      img {
        width: 100%;
      }
    }
  }
`;

export default function FormList(props = {}) {
  const [swiperObj, setSwiperObj] = useState(null);
  const { onChange = () => {}, data = {} } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [originSrc, setOriginSrc] = useState("");

  const [mode, setMode] = useState("add");
  const [editIdx, setEditIdx] = useState();

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    mode: "add",
    originSrc: "",
    editIdx: null,
  });

  useEffect(() => {
    if (!modalConfig.isOpen) {
      setOriginSrc("");
      setModalConfig({ ...modalConfig, originSrc: "" });
    }
  }, [modalConfig.isOpen]);

  const dispatch = useDispatch();

  const cropperRef = useRef(null);

  function getBase64(file) {
    // eslint-disable-next-line no-undef
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      console.log(file);
      reader.readAsDataURL(file);
      reader.onload = function () {
        // resolve(reader.result);
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0, img.width, img.height);
          const base64 = canvas.toDataURL("image/jpeg", 0.6);
          resolve(base64);
        };
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
      setModalConfig({
        ...modalConfig,
        isOpen: true,
        mode: "add",
        originSrc: base64,
      });
    }
    dispatch({ type: "TOGGLE_LOADING", isLoading: false });
  }

  async function onReplaceImage(info) {
    dispatch({ type: "TOGGLE_LOADING", isLoading: true });
    const file = info?.file?.originFileObj;
    if (file) {
      const base64 = await getBase64(file);
      setModalConfig({
        ...modalConfig,
        originSrc: base64,
      });
    }
    dispatch({ type: "TOGGLE_LOADING", isLoading: false });
  }

  function onAdd() {
    const cropper = cropperRef?.current?.cropper;
    if (cropper) {
      const src = cropper.getCroppedCanvas().toDataURL("image/jpeg", 0.6);
      // setCropSrc(src);
      const newData = {
        ...data,
        images: [...data.images, src],
      };
      onChange(newData);
      setModalConfig({
        ...modalConfig,
        originSrc: "",
        isOpen: false,
      });
      slideToLast();
    }
  }

  function onEdit() {
    const cropper = cropperRef?.current?.cropper;
    if (cropper) {
      const src = cropper.getCroppedCanvas().toDataURL("image/jpeg", 0.6);
      const newData = {
        ...data,
        images: data.images.reduce((prev, curr, i) => {
          if (i === editIdx) {
            return [...prev, src];
          }
          return [...prev, curr];
        }, []),
      };
      onChange(newData);
      setIsOpen(false);
    }
  }

  async function onDeleteImage(imageIdx) {
    const newData = {
      ...data,
      images: data.images.reduce((prev, curr, idx) => {
        if (imageIdx === idx) return prev;
        return [...prev, curr];
      }, []),
    };
    onChange(newData);
  }

  async function onEditImage(src, editIdx) {
    setModalConfig({
      ...modalConfig,
      mode: "edit",
      originSrc: src,
      isOpen: true,
      editIdx,
    });
  }

  function slideToLast() {
    if (swiperObj) {
      setTimeout(() => {
        swiperObj.slideTo(data.images.length);
      }, 600);
    }
  }
  return (
    <Fragment>
      <Modal
        title="裁切圖片"
        width={800}
        open={modalConfig.isOpen}
        centered
        onCancel={() => setIsOpen(false)}
        onOk={() => {
          if (mode === "add") {
            onAdd();
          } else {
            onEdit();
          }
        }}
      >
        <Space
          style={{
            justifyContent: "flex-end",
            width: "100%",
            marginBottom: 16,
          }}
        >
          {mode === "edit" && (
            <Upload
              accept="image/*"
              showUploadList={false}
              onChange={(info) => onReplaceImage(info)}
              style={{ width: "100%" }}
            >
              <Button icon={<Icon.UploadOutlined />} block>
                重新上傳
              </Button>
            </Upload>
          )}
        </Space>

        {originSrc && (
          <Cropper
            viewMode={3}
            src={originSrc}
            style={{ height: 400, width: "100%" }}
            initialAspectRatio={16 / 9}
            guides={true}
            ref={cropperRef}
          />
        )}
      </Modal>

      <Swiper
        className="gallery-swiper"
        spaceBetween={50}
        slidesPerView={1}
        onSwiper={(swiper) => {
          console.log(">>>>>", swiper);
          setSwiperObj(swiper);
        }}
      >
        {data.images.map((src, idx) => {
          return (
            <SwiperSlide key={idx}>
              <div className="gallery-item">
                <div className="gallery-control">
                  <Space>
                    <Button
                      size="small"
                      shape="circle"
                      icon={<Icon.EditOutlined />}
                      onClick={() => onEditImage(src, idx)}
                    />
                    <Button
                      size="small"
                      shape="circle"
                      icon={<Icon.DeleteOutlined />}
                      onClick={() => onDeleteImage(idx)}
                    />
                  </Space>
                </div>
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
        style={{ width: "100%" }}
      >
        <Button type="primary" icon={<Icon.UploadOutlined />} block>
          上傳圖片
        </Button>
      </Upload>
    </Fragment>
  );
}
