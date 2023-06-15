import Head from 'next/head';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(import('swagger-ui-react'), { ssr: false });

export default function Index() {
    return (
        <div>
          <Head>
            <title>FlexScale Swagger</title>
            <meta name="description" content="FlexScale Swagger" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <SwaggerUI url="/swagger.json" />
        </div>
      );
}