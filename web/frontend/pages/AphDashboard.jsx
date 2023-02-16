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

import apptutorial from "../assets/apptutorial.gif";

import "../assets/appStyle.css";


export default function AphDashboard() {

  const now = new Date();
  const fetch = useAuthenticatedFetch();
  const [appInstructions, setAppInstructions] = useState(false);
  const [giftClicks, setGiftClicks] = useState(0);
  const [giftCarts, setGiftCarts] = useState(0);
  const [{month, year}, setDate] = useState({month: now.getMonth(), year: now.getFullYear()});
  const [popoverActive, setPopoverActive] = useState(false);
  const [selectedDates, setSelectedDates] = useState({
    start: new Date('Wed Feb 07 2018 00:00:00 GMT-0500 (EST)'),
    end: new Date('Mon Mar 12 2018 00:00:00 GMT-0500 (EST)'),
  });
  const SHARK_SPECIES_GROWTH = [
    {
      name: 'Mako',
      data: [
        {
          key: '0',
          value: 80,
        },
        {
          key: '5',
          value: 170,
        },
        {
          key: '10',
          value: 210,
        },
        {
          key: '15',
          value: 240,
        },
      ],
    },
    {
      name: 'Great White',
      data: [
        {
          key: '0',
          value: 80,
        },
        {
          key: '5',
          value: 180,
        },
        {
          key: '10',
          value: 250,
        },
        {
          key: '15',
          value: 350,
        },
      ],
    },
  ];
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

    // Check Theme is it 2.0 or vintage
    fetch('/api/gift/insights/')
    .then(response => {
      return response.json();
    })
    .then(resp => {
      console.log('res insights ', resp);
      setGiftClicks(resp.giftClicks);
      setGiftCarts(resp.giftInsight.length);
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
      setGiftClicks(resp.giftClicks);
      setGiftCarts(resp.giftInsight.length);
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
            <Heading>Add To Cart</Heading>
            <TextContainer>
              <h4>{giftCarts}</h4>
              <LineChart
                xAxisOptions={{
                  labelFormatter: (x) => {
                    return `${x} years old`
                  }
                }}
                yAxisOptions={{
                  labelFormatter: (y) => {
                    return `${y} cm`
                  }
                }}
                data={SHARK_SPECIES_GROWTH}
              />
            </TextContainer>
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <Card sectioned>
            <Heading>Clicks</Heading>
            <TextContainer>
              <h4>{giftClicks}</h4>
            </TextContainer>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
