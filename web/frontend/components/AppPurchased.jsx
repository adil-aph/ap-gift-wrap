import { useState, useEffect } from "react";
import {
  Card,
  Heading,
  TextContainer,
  DisplayText,
  SettingToggle, 
  TextStyle,
  Button,
  Stack,
  Spinner
} from "@shopify/polaris";
import { useAuthenticatedFetch } from "../hooks";

export function AppPurchased(props) {

  const fetch = useAuthenticatedFetch();
  const [redLink, setRedLink] = useState('/');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const ac = new AbortController();
    fetch("/api/billing/status").then(response => {
      return response.json();
    })
    .then(resp => {
      console.log('res tag ', resp);
      if(resp.payment_status) {
        props.setPaymentStatus(true);
        props.setAppStatus('active');
        return;
      }
      props.setPaymentStatus(false);
      setRedLink(resp.red_link);
      props.setAppStatus('deactive');
      setIsLoading(false);
    });
    return () => ac.abort(); // Abort both fetches on unmount
  }, []);

  
  return (
    <>
    {isLoading &&
      <Spinner
        accessibilityLabel="Loading form field"
        hasFocusableParent={false}
      />
    }
    {!isLoading &&
      <Card sectioned>
        <Stack>
          <Stack.Item fill>
            <TextContainer>
              Buy Plan
            </TextContainer>
          </Stack.Item>
          <Stack.Item>
            <a target="_PARENT" className="btn primary" href={redLink}>Buy Plan</a>
          </Stack.Item>
        </Stack>
      </Card>
    }
    </>
  );
}
