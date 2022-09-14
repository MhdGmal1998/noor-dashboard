// pages/_document.js

import Document, { Html, Head, Main, NextScript } from "next/document"

class MyDocument extends Document {
  render() {
    return (
      <Html dir="rtl">
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Almarai:wght@800&family=Blaka&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
