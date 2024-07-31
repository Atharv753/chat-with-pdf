// pages/index.tsx
import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import PdfUploader from '../app/component/PdfUploader';

export default function Home() {
  return (
    <div>
      <Head>
        <title>DocGenius: Document Generation AI</title>
        <link rel="icon" href="/images/logo.jpeg" />
      </Head>
      <main>
        <h1>Ask Your PDF 📄</h1>
        <PdfUploader />
      </main>
    </div>
  );
}
