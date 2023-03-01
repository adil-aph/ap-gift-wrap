import { useState, useEffect } from "react";
import {
  Card,
  Heading,
  TextContainer,
  DisplayText,
  SettingToggle, 
  TextStyle,
  Button,
  Stack
} from "@shopify/polaris";
import { useAuthenticatedFetch } from "../hooks";

export function CancelPlan(props) {

  const fetch = useAuthenticatedFetch();
  const [redLink, setRedLink] = useState('/');

  const cancelSubscription = () => {
    fetch("/api/billing/cancel").then(response => {
      return response.json();
    })
    .then(resp => {
      console.log('res tag ', resp);
      props.setAppStatus('deactive');
      if(resp.payment_status) {
        props.setPaymentStatus(false);
        return;
      }
      props.setPaymentStatus(true);
     // setRedLink(resp.red_link);
    });
  }

  
  return (
    <>
     <Card sectioned>
      <Stack alignment="center">
        <Stack.Item fill>
          <TextContainer>
            Cancel Plan
          </TextContainer>
        </Stack.Item>
        <Stack.Item>
          <Button destructive onClick={cancelSubscription}>Cancel Subscription</Button>
        </Stack.Item>
      </Stack>
    </Card>
    </>
  );
}
