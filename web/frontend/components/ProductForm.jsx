import { useState, useCallback, useEffect  } from "react";
import {
  Card,
  Heading,
  TextContainer,
  DropZone,
  TextStyle,
  Form,
  FormLayout,
  TextField
} from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import axios from 'axios';


export function ProductForm() {
  const emptyToastProps = { content: null };
  const [isLoading, setIsLoading] = useState(true);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const fetch = useAuthenticatedFetch();

  const formData = {};


  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0.00);
  const [customLabel, setCustomLabel] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setFile] = useState('');

  const [isUpdated, setUpdateStatus] = useState(false);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    
    fetch('/api/gift')
    .then(response => {
      setIsLoading(false);
      return response.json();
    })
    .then(resp => {
      console.log('res data pro ', resp.data.title);
      setTitle(resp.data.title);
      setDescription(resp.data.description);
      setPrice(resp.data.variants.edges[0].node.price);
      setUpdateStatus(true);
    });

    fetch('/api/gift/settag')
    .then(response => {
      return response.json();
    })
    .then(resp => {
      console.log('res tag ', resp);
    });

  }, []);

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

  const toastMarkup = toastProps.content && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  const handleTitle = useCallback((newValue) => setTitle(newValue), []);
  const handlePrice = useCallback((newValue) => setPrice(newValue), []);
  const handleCustomLabel = useCallback((newValue) => setCustomLabel(newValue), []);
  const handleDescription = useCallback((newValue) => setDescription(newValue), []);
  const handleFile = useCallback((newValue) => setFile(newValue), []);


  const handleFormSubmit = (event) => {
    alert('Added');
    event.preventDefault();
  }
/*
    formData.prodTitle = title;
    formData.prodPrice = price;
    formData.prodCustomLabel = customLabel;
    formData.prodDescription = description;

    alert(title);
    console.log('form data   ', formData);
    
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    };
    fetch('/api/gift/test', requestOptions)
        .then(response => response.json())
        .then(data => console.log('res data ', data));
  }*/

  const handleFormUpdate = (event) => {

    alert('Updated');
    console.log('IMAGE DATA, ', imageFile);
    event.preventDefault();

    formData.prodTitle = title;
    formData.prodPrice = price;
    formData.prodCustomLabel = customLabel;
    formData.prodDescription = description;

    const updateOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    }

    fetch('/api/gift/update', updateOptions)
          .then( response => {
            if (response.ok) {
              setIsLoading(false);
              setToastProps({
                content: "Product Updated Successfully!",
                error: false,
              });
            } else {
              setIsLoading(false);
              setToastProps({
                content: "There was an error updating the product",
                error: true,
              });
            }
            return response.json();
          })
          .then( data => {
            console.log('res data ', data);
          });
  }

  const handleGiftProduct = async () => {
    setIsLoading(true);
    alert('ADDED GIT');
    // fetch('/api/gift/test')
    // .then(response => response.json())
    // .then(data => console.log('res data ', data));
    // return false;
    var formImg = new FormData();
    formImg.append('prodImage', imageFile[0]);

    formData.prodTitle = title;
    formData.prodPrice = price;
    formData.prodCustomLabel = customLabel;
    formData.prodDescription = description;
    // formData.prodImage = imageFile[0];

    console.log('form data   ', formData);
    
    //fetch('/api/gift/create', requestOptions)
    axios.post("/api/gift/image", formImg)
        .then(resp => {
          console.log('Img res data ', resp);
          console.log('Img data ', resp.data.imgname);
          formData.prodImgLink = resp.data.imgname;
          formData.prodImgid = resp.data.uid;
          console.log('Img data fomr', formData);
          const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        };
          fetch('/api/gift/create', requestOptions)
          .then( response => {
            if (response.ok) {
              setIsLoading(false);
              setToastProps({
                content: "Product Created Successfully!",
                error: false,
              });
            } else {
              setIsLoading(false);
              setToastProps({
                content: "There was an error creating products",
                error: true,
              });
            }
            return response.json();
          })
          .then( data => {
            console.log('res data ', data);
          });
        });

  };

  return (
    <>
     {toastMarkup}
      <Card
        title="Gift Options"
        sectioned
        primaryFooterAction={{
          content: "Create Gift Product",
          onAction: isUpdated ? handleFormUpdate : handleGiftProduct,
          loading: isLoading,
      }}
      >
        <Form onSubmit={isUpdated ? handleFormUpdate : handleFormSubmit} encType='multipart/form-data'>
          <FormLayout>
              <TextField label="Title" name="title" 
              value={title} 
              onChange={handleTitle} autoComplete="off" 
              />
              <TextField label="Price" type="number"
              name="price" value={price} 
              onChange={handlePrice} autoComplete="off"
              />
              <TextField label="Custom Label" name="customLabel"
              value={customLabel} 
              onChange={handleCustomLabel} autoComplete="off"
              />
              <TextField label="Description" multiline={4} 
              name="description" value={description} 
              onChange={handleDescription} autoComplete="off"
              />
              <div style={{width: 114, height: 114}}>
                  <DropZone onDrop={handleFile}>
                      <DropZone.FileUpload />
                  </DropZone>
              </div>
          </FormLayout>
        </Form>
      </Card>
    </>
  );
}
