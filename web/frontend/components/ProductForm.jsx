import { useState, useCallback, useEffect  } from "react";
import {
  Card,
  DropZone,
  Thumbnail,
  Form,
  FormLayout,
  TextField
} from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";


import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import axios from "axios";
import {NoteMinor} from "@shopify/polaris-icons";
import giftWrapSample from "../assets/giftWrapSample.jpg";



export function ProductForm() {
  const emptyToastProps = { content: null };
  const [isLoading, setIsLoading] = useState(true);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const fetch = useAuthenticatedFetch();
  const formData = {};

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0.00);
  const [description, setDescription] = useState('');
  const [imageFile, setFile] = useState([]);
  const [imageLink, setImageLink] = useState(giftWrapSample);
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
      setImageLink(resp.data.featuredImage.url);
    });

  }, []);

  const toastMarkup = toastProps.content && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  const handleTitle = useCallback((newValue) => setTitle(newValue), []);
  const handlePrice = useCallback((newValue) => setPrice(newValue), []);
  const handleDescription = useCallback((newValue) => setDescription(newValue), []);
  const handleFile = useCallback((newValue) => setFile(newValue), []);


  const handleFormSubmit = (event) => {
    alert('Added');
    event.preventDefault();
  }

  const handleFormUpdate = (event) => {

    event.preventDefault();

    var formImg = new FormData();
    formImg.append('prodImage', imageFile[0]);

    formData.prodTitle = title;
    formData.prodPrice = price;
    formData.prodDescription = description;

    if(imageFile.length > 0) {
      axios.post("/api/gift/image", formImg)
          .then(resp => {
            setImageLink(resp.data.imglink);
            formData.prodImgLink = resp.data.imglink;
            formData.prodImgid = resp.data.uid;
            const updateOptions = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData)
          };

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
            });
    } else {
      formData.prodImgLink = imageLink;
      const updateOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      };

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

  }

  const handleGiftProduct = async () => {
    setIsLoading(true);
    var formImg = new FormData();
    formImg.append('prodImage', imageFile[0]);

    formData.prodTitle = title;
    formData.prodPrice = price;
    formData.prodDescription = description;

    console.log('form data   ', formData);
    
    axios.post("/api/gift/image", formImg)
        .then(resp => {
          console.log('Img res data ', resp);
          console.log('Img data ', resp.data.imgname);
          setImageLink(resp.data.imglink);
          formData.prodImgLink = resp.data.imglink;
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

  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
  const fileUpload = !imageFile.length && <DropZone.FileUpload />;
  const uploadedFiles = imageFile.length > 0 && (
    <Thumbnail
      size="large"
      source={
        validImageTypes.includes(imageFile[0].type)
          ? window.URL.createObjectURL(imageFile[0])
          : NoteMinor
      }
    />
  )

  return (
    <>
     {toastMarkup}
      <Card
        title="Gift Product Configurations"
        sectioned
        primaryFooterAction={{
          content: isUpdated ? "Update Gift Product" : "Create Gift Product",
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
              <TextField label="Description" multiline={4} 
              name="description" value={description} 
              onChange={handleDescription} autoComplete="off"
              />
              <div className="product-image-container">
                <img src={ imageLink } alt="Default Image" style={{
                  width:'200px'
                }} />
              </div>
              <div style={{width: 114, height: 114}}>
                  <DropZone onDrop={handleFile}>
                      {/* <DropZone.FileUpload /> */}
                      {uploadedFiles}
                      {fileUpload}
                  </DropZone>
              </div>
          </FormLayout>
        </Form>
      </Card>
    </>
  );
}
