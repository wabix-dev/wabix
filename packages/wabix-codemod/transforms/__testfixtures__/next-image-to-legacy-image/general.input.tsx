// @ts-nocheck
/* eslint-disable */
import Image from "wabix/image";
import Named from "wabix/image";
import type { ImageProps } from "wabix/image";
import { type ImageLoaderProps } from "wabix/image";
import Foo from "foo";
import Future1 from "wabix/future/image";
import Future2 from "wabix/future/image";
import type { ImageProps as ImageFutureProps } from "wabix/future/image";
import { type ImageLoaderProps as ImageFutureLoaderProps } from "wabix/future/image";

export default function Home() {
  return (<div>
    <h1>Both</h1>
    <Image src="/test.jpg" width="200" height="300" />
    <Named src="/test.png" width="500" height="400" />
    <Future1 src="/test.webp" width="60" height="70" />
    <Future2 src="/test.avif" width="80" height="90" />
  </div>)
}
