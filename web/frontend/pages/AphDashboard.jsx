import { useState, useCallback, useEffect  } from "react";
import { 
  Card, Page, Layout, TextContainer,
  Heading, DatePicker, Button, ButtonGroup,
  Popover
} from "@shopify/polaris";
import { CalendarMinor } from '@shopify/polaris-icons';
import { LineChart } from '@shopify/polaris-viz';

import { TitleBar } from "@shopify/app-bridge-react";
import { useAuthenticatedFetch } from "../hooks";

import { ClickDataTable } from "../components/ClickDataTable";
import { ClickDataChart } from "../components/ClickDataChart";
import { CartDataChart } from "../components/CartDataChart";
import { CartDataTable } from "../components/CartDataTable";

import "../assets/appStyle.css";

export default function AphDashboard() {
  const now = new Date();
  const fetch = useAuthenticatedFetch();
  const [giftClicks, setGiftClicks] = useState(0);
  const [giftCarts, setGiftCarts] = useState(0);
  const [{month, year}, setDate] = useState({month: now.getMonth(), year: now.getFullYear()});
  const [popoverActive, setPopoverActive] = useState(false);
  const [selectedDates, setSelectedDates] = useState({
    start: new Date('Wed Feb 07 2018 00:00:00 GMT-0500 (EST)'),
    end: new Date('Mon Mar 12 2018 00:00:00 GMT-0500 (EST)'),
  });
  const [clicksData, setClicksData] = useState([[]]);
  const [cartsData, setCartsData] = useState([[]]);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Get default data on load
    fetch('/api/gift/insights/')
    .then(response => {
      return response.json();
    })
    .then(resp => {
      console.log('res insights ', resp);
      setGiftCarts(resp.giftInsight[0][1]);
      setGiftClicks(resp.giftClicks[0][1]);
      setClicksData(resp.giftClicks);
      setCartsData(resp.giftInsight);
    });

  }, []);

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );

  const getDatewiseInsights = () => {
    fetch('/api/gift/insights/'+ selectedDates.start.toDateString() + '/'+selectedDates.end.toDateString())
    .then(response => {
      return response.json();
    })
    .then(resp => {
      console.log('res insights ', resp);
      setGiftClicks(resp.giftClicksTotal);
      setGiftCarts(resp.giftInsightTotal);
      setClicksData(resp.giftClicks);
      setCartsData(resp.giftInsight);
    });
    togglePopoverActive();
  }

  const activator = (
    <Layout.Section>
      <Button icon={CalendarMinor} onClick={togglePopoverActive}>
        Select Date
      </Button>
    </Layout.Section>
  );

  const handleMonthChange = useCallback(
    (month, year) => setDate({month, year}),
    [],
  );

  console.log('selected data ', selectedDates);

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
          <Popover
          active={popoverActive}
          activator={activator}
          autofocusTarget="first-node"
          ariaHaspopup="listbox"
          fullWidth="true"
          preferredAlignment="left"
          onClose={togglePopoverActive}
        >
          <Popover.Pane fixed>
            <Popover.Section>
              <Layout.Section>
                  <DatePicker
                    month={month}
                    year={year}
                    onChange={setSelectedDates}
                    onMonthChange={handleMonthChange}
                    selected={selectedDates}
                    allowRange
                    multiMonth
                  />
              </Layout.Section>
            </Popover.Section>
          </Popover.Pane>
          <Popover.Pane>
            <Card sectioned>
              <ButtonGroup>
                <Button onClick={togglePopoverActive}>Cancel</Button>
                <Button primary onClick={getDatewiseInsights}>Save</Button>
              </ButtonGroup>
            </Card>
          </Popover.Pane>
          </Popover>
        </Layout.Section>
        <Layout.Section>
          <Card sectioned>
            <Heading>Add To Cart</Heading>
            <TextContainer>
              <h4>{giftCarts}</h4>
            </TextContainer>
            <CartDataTable insightdata={cartsData} />
            <CartDataChart insightdata={cartsData} />
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <Card sectioned>
            <Heading>Clicks</Heading>
            <TextContainer>
              <h4>{giftClicks}</h4>
            </TextContainer>
          </Card>
          <ClickDataTable insightdata={clicksData} />
          <ClickDataChart insightdata={clicksData} />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
