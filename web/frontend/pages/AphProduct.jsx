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


export default function AphProduct() {
const [statusActive, setStatusActive] = useState(false);

const checkStatus = (val) => {
  setStatusActive(val);
}
  return (
    <Page narrowWidth>
      <TitleBar title="Product Settings" primaryAction={null} />
      <Layout>
        <Layout.Section>
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
            </Stack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
