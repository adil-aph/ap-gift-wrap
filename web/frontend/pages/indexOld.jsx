import { useState } from "react";
import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Heading,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

import { AppSettings, ProductForm, AppPurchased } from "../components";


export default function HomePageOld() {
const [statusActive, setStatusActive] = useState(false);

const checkStatus = (val) => {
  setStatusActive(val);
}
  return (
    <Page narrowWidth>
      <TitleBar title="Aphrodite's Gift Wrap" primaryAction={null} />
      {!statusActive &&
      <Layout>
        <Layout.Section>
          <AppPurchased setAppStatus={checkStatus} />
        </Layout.Section>
      </Layout>
      }
      {statusActive &&
      <Layout>
        <Layout.Section>
          <AppSettings />
          <Card sectioned>
            <Stack
              wrap={false}
              spacing="extraTight"
              distribution="trailing"
              alignment="center"
            >
              <Stack.Item fill>
                <ProductForm />
              </Stack.Item>
              {/* <Stack.Item>
                <div style={{ padding: "0 20px" }}>
                  <Image
                    source={trophyImage}
                    alt="Nice work on building a Shopify app"
                    width={120}
                  />
                </div>
              </Stack.Item> */}
            </Stack>
          </Card>
        </Layout.Section>
        {/* <Layout.Section>
          <ProductsCard />
        </Layout.Section> */}
      </Layout>
      }
    </Page>
  );
}
