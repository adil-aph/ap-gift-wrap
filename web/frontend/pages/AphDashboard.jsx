import { useState, useCallback, useEffect  } from "react";
import { Card, Page, Layout, TextContainer, Heading } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useAuthenticatedFetch } from "../hooks";

import apptutorial from "../assets/apptutorial.gif";


export default function AphDashboard() {

  const fetch = useAuthenticatedFetch();
  const [appInstructions, setAppInstructions] = useState(false);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {

    // Check Theme is it 2.0 or vintage
    fetch('/api/gift/gettheme')
    .then(response => {
      return response.json();
    })
    .then(resp => {
      console.log('res tag ', resp);
      setAppInstructions(resp.isTag);
    });

  }, []);


  return (
    <Page>
      <TitleBar
        title="Dashboard"
        // primaryAction={{
        //   content: "Primary action",
        //   onAction: () => console.log("Primary action"),
        // }}
        // secondaryActions={[
        //   {
        //     content: "Secondary action",
        //     onAction: () => console.log("Secondary action"),
        //   }, <div style={{ visibility: this.state.driverDetails.firstName != undefined? 'visible': 'hidden'}}></div>

        // ]}
      />
      <Layout>
        <Layout.Section>
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
          <Card sectioned>
            <Heading>Heading</Heading>
            <TextContainer>
              <p>Body</p>
            </TextContainer>
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <Card sectioned>
            <Heading>Heading</Heading>
            <TextContainer>
              <p>Body</p>
            </TextContainer>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
