import React from "react";
import Head from "next/head";
import { Provider } from "react-redux";
import store from "@/store";
import Layout from "@/components/Layout";

// import "antd/dist/antd.css";
import "@/styles/style.scss";

export default function App({ Component, pageProps }) {
  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Rex Test Lab</title>
      </Head>
      <Provider store={store}>
        <Layout {...pageProps}>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </React.Fragment>
  );
}
