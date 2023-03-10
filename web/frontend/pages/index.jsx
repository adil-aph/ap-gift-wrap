import { useEffect, useState } from "react";
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
import { useAuthenticatedFetch } from "../hooks";

import { AppSettings, AppPurchased, CancelPlan } from "../components";
import apptutorial from "../assets/apptutorial.gif";

export default function HomePage() {
const fetch = useAuthenticatedFetch();
const [statusActive, setStatusActive] = useState(false);
const [appStatus, setAppStatus] = useState('deactive');
const [appInstructions, setAppInstructions] = useState(false);

useEffect(() => {
  // Check Theme is it 2.0 or vintage
  fetch('/api/gift/gettheme')
  .then(response => {
    return response.json();
  })
  .then(resp => {
    console.log('res tag ', resp);
    setAppInstructions(resp.isTag);
    setAppStatus(resp.app_status);
  });

}, []);


const checkStatus = (val) => {
  setStatusActive(val);
}

const setAppStatusHandler = (val) => {
  setAppStatus(val);
}

const setAppStatusCallHandler = (val) => {
  setAppStatus(val);
}

  return (
    <>
      {!statusActive &&
        <Page fullWidth>
          <TitleBar title="Aphrodite's Gift Wrap" primaryAction={null} />
          <AppPurchased setPaymentStatus={checkStatus} setAppStatus={setAppStatusHandler} />
          </Page>
      }
      {statusActive &&
        <Page narrowWidth>
        <TitleBar title="Aphrodite's Gift Wrap" primaryAction={null} />
        <Layout>
          <Layout.Section>
            <CancelPlan setPaymentStatus={checkStatus} setAppStatus={setAppStatusHandler} />
            <AppSettings setAppStatus={(appStatus == 'active' ) ? true : false } setAppStatusCall={setAppStatusCallHandler} />
            <Card sectioned>
              <Stack
                wrap={false}
                spacing="extraTight"
                distribution="trailing"
                alignment="center"
              >
                <Stack.Item fill>
                <Card sectioned>
                  <Heading>APP Settings</Heading>
                  <TextContainer>
                    <div className="" style={{display: appInstructions ? 'none' : 'block'}}>
                          <p>
                            In order for APH Gift Wrap Options to work properly in your OS 2.0 theme, you'll have to add it as a block from the Theme Customizer.
                            <u><b> Don't forget to click on the Save button!</b></u>
                          </p>
                          <p style={{'textAlign': 'center', 'marginTop': '15px'}}>
                            <img src={apptutorial} style={{ width: '70%'}} />
                          </p>
                    </div>
                    <div className="" style={{display: appInstructions ? 'block' : 'none'}}>
                          A Script Tag will automatically added to the store to handle the front end functionality.
                    </div>
                  </TextContainer>
                </Card>
                </Stack.Item>
              </Stack>
            </Card>
          </Layout.Section>
        </Layout>
        </Page>
      }
    </>
  );
}
