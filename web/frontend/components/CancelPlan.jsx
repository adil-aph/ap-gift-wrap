import { useState } from "react";
import {
  Card,
  TextContainer,
  Button,
  Stack,
  TextStyle
} from "@shopify/polaris";
import { useAuthenticatedFetch } from "../hooks";

export function CancelPlan(props) {

  const fetch = useAuthenticatedFetch();

  const cancelSubscription = () => {
    if (confirm("Are you sure to Cancel?") == true) {
      fetch("/api/billing/cancel").then(response => {
        return response.json();
      })
      .then(resp => {
        console.log('res tag ', resp);
        props.setAppStatus('deactive');

        window.location.reload();

        if(resp.payment_status) {
          props.setPaymentStatus(false);
          return;
        }
        props.setPaymentStatus(true);
      // setRedLink(resp.red_link);
      });
    } 
  }

  return (
    <>
     <Card sectioned>
      <Stack alignment="center">
        <Stack.Item fill>
          <TextContainer>
            Press <TextStyle variation="strong">'Cancel Subscription'</TextStyle> button if you want to upgrade / downgrade or cancel the subscription
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
