import { useState, useCallback } from "react";
import {
  SettingToggle, 
  TextStyle
} from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

export function AppSettings(props) {
  const emptyToastProps = { content: null };
  const [isLoading, setIsLoading] = useState(false);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const fetch = useAuthenticatedFetch();
  const [active, setActive] = useState(props.setAppStatus);

  setTimeout(() => {
   setActive(props.setAppStatus);
  }, 1000);

  const handleToggle = () => {
    //setActive((active) => !active);
    let currentState = (active) ? 'deactive' : 'active';
    console.log('res stats curr', active);
    setIsLoading(true);
    fetch('/api/app/status/'+ currentState)
    .then(response => {
      return response.json();
    })
    .then(resp => {
      setIsLoading(false);
      console.log('res stats ', resp);
      setTimeout(() => {
        setActive(resp.app_status);
        props.setAppStatusCall(resp.app_status_val);
       }, 1000);
      setToastProps({ content: resp.message });
    });
  };

  const toastMarkup = toastProps.content && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  const contentStatus = active ? 'Deactivate' : 'Activate';
  const textStatus = active ? 'activated' : 'deactivated';
  
  return (
    <>
        {toastMarkup}
        <SettingToggle
            action={{
                content: contentStatus,
                onAction: handleToggle,
            }}
            enabled={active}
            >
            This setting is <TextStyle variation="strong">{textStatus}</TextStyle>.
        </SettingToggle>
    </>
  );
}
