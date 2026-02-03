import type { AppProps } from "wabix/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
