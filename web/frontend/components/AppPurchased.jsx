import { useState, useEffect } from "react";
import {
  Card,
  TextContainer,
  Layout,
  Spinner
} from "@shopify/polaris";
import { useAuthenticatedFetch } from "../hooks";

export function AppPurchased(props) {

  const fetch = useAuthenticatedFetch();
  const [redLink, setRedLink] = useState('/');
  const [redLinkY, setRedLinkY] = useState('/');
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
      setRedLinkY(resp.red_link_year)
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
      // <Card sectioned>
      //   <Stack>
      //     <Stack.Item fill>
      //       <TextContainer>
      //         Buy Plan
      //       </TextContainer>
      //     </Stack.Item>
      //     <Stack.Item>
      //       <a target="_PARENT" className="btn primary" href={redLink}>Buy Plan</a>
      //     </Stack.Item>
      //   </Stack>
      //   </Card>
    
      <section className="pricing-table">
      <div className="container">
        <div className="block-heading">
          <h2>Our Pricing</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc quam urna, dignissim nec auctor in, mattis vitae leo.</p>
        </div>
        <div className="plan-wrapper row justify-content-md-center">
          <Layout.Section>
            <div className="col-md-5 col-lg-4">
              <div className="item">
                <div className="heading">
                  <h3>MONTHLY PLAN</h3>
                  <div className="price">
                    <h4>$9.99</h4>
                  </div>
                </div>
                <div className="features">
                  <p></p>
                  <ul>
                  <li><span className="value">Option to add personalized.</span></li>
                  <li><span className="value">Option to customize labels.</span></li>
                  <li><span className="value">Option to not include a receipt.</span></li> 
                  <li><span className="value">Add gift wrapping to each line item.</span></li> 
                  <li><span className="value">Display data in Tabular and Charts form.</span></li> 
                  <li><span className="value">Analytics, Stay on top of your conversion.</span></li> 
                  <li><span className="value">Increase your AOV with our gift wrapping.</span></li> 
                </ul>
                </div>
                <a target="_PARENT" className="-btn -bg -txt" href={redLink}>Buy Plan</a>
              </div>
            </div>
          </Layout.Section>
          <Layout.Section>
            <div className="col-md-5 col-lg-4">
              <div className="item">
                <div className="ribbon">Best Value</div>
                <div className="heading">
                  <h3>YEARLY PLAN</h3>
                  <div className="price">
                    <h4>$99.99</h4>
                  </div>
                </div>
                <div className="features">
                  <p>Billed at <strong style={{color: 'green', fontSize: '16px'}}>$119.88/year </strong>You’re saving $20 by billing annually.</p>
                  <ul>
                  <li><span className="value">Option to add personalized.</span></li>
                  <li><span className="value">Option to customize labels.</span></li>
                  <li><span className="value">Option to not include a receipt.</span></li> 
                  <li><span className="value">Add gift wrapping to each line item.</span></li> 
                  <li><span className="value">Display data in Tabular and Charts form.</span></li> 
                  <li><span className="value">Analytics, Stay on top of your conversion.</span></li> 
                  <li><span className="value">Increase your AOV with our gift wrapping.</span></li> 
                </ul>
                </div>
                <a target="_PARENT" className="-btn -bg -txt" href={redLinkY}>Buy Plan</a>
              </div>
            </div>
          </Layout.Section>
        </div>
      </div>
      </section>
  
    }
    </>
  );
}
