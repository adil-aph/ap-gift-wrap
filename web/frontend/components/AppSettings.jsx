import { useState, useCallback } from "react";
import {
  Card,
  Heading,
  TextContainer,
  DisplayText,
  SettingToggle, 
  TextStyle
} from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

export function AppSettings() {
  const emptyToastProps = { content: null };
  const [isLoading, setIsLoading] = useState(false);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const fetch = useAuthenticatedFetch();

  const [active, setActive] = useState(false);

  const handleToggle = useCallback(() => setActive((active) => !active), []);

  const contentStatus = active ? 'Deactivate' : 'Activate';
  const textStatus = active ? 'activated' : 'deactivated';

  /*const {
    data,
    refetch: refetchProductCount,
    isLoading: isLoadingCount,
    isRefetching: isRefetchingCount,
  } = useAppQuery({
    url: "/api/products/count",
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });*/

  /*const toastMarkup = toastProps.content && !isRefetchingCount && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );*/

  const handleGiftProduct = async () => {
    alert('loading');
    setIsLoading(true);
    const response = await fetch("/api/gift/create");

    if (response.ok) {
      await refetchProductCount();
      setToastProps({ content: "Gift product created!" });
    } else {
      setIsLoading(false);
      setToastProps({
        content: "There was an error creating products",
        error: true,
      });
    }
  };

  return (
    <>
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
