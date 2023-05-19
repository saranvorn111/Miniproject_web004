"use client"  
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"
import axios from "axios"; 
import Loading from "@/app/loading";


const FILE_SIZE = 1024 * 1024 * 1;//5MB
const SUPPORTED_FORMATS =["image/png", "image/jpeg", "image/gif", "image/png"];

const validationSchema= Yup.object().shape({
    name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(8,"Password must be 8 characters or longer").required("Invalid password"),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'),null],"Passwords must match").required("Required"),
    file: Yup.mixed()
        .test("fileSize", "File too large", (value) => {
        if (!value) {
        return true;
        }

        return value.size <= FILE_SIZE;
        }).test("fileFormat", "Unsupported Format", (value) => {

        if (!value) {

        return true;
        }
        return SUPPORTED_FORMATS.includes(value.type);
        }).required("Required"),
});

export default function Login() {
    const [isLoading,setIsLoading]=useState(false); 

    const createUser = async(user)=>{

        const {name,email,password,role,avatar}=user;

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
        name,
        email,
        password,
        role,
        avatar,
    });

    let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,    
    };

   try{

    const res = await fetch("https://api.escuelajs.co/api/v1/users", requestOptions)
    if(!res.ok) {
        alert("Something went wrong") 
    }else{
        alert("User created successfully")
        const data = await res.json();
        setIsLoading(false); 
        
        return data;
    }
   

   }catch(err){
    console.log(err);
    alert(err.message);
    setIsLoading(false);
   }
    return data
  };

  const uploadImage = async(values)=>{    
    setIsLoading(true);
    try{
        const response = await axios.post(
            "https://api.escuelajs.co/api/v1/files/upload",
            values.file

        );
        console.log(response);    
        return response?.data?.location || "";

    }
    catch(error){
        console.log(error);
    }
  }
  return (
   <div className="flex flex-col justify-center items-center my-24 w-screen">
         <Formik
        initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            avatar:"https://media.istockphoto.com/id/825383494/photo/business-man-pushing-large-stone-up-to-hill-business-heavy-tasks-and-problems-concept.jpg?s=612x612&w=0&k=20&c=wtqvbQ6OIHitRVDPTtoT_1HKUAOgyqa7YzzTMXqGRaQ=",
            role:"customer",
            file: undefined,
        }}
        validationSchema={validationSchema}

        onSubmit = { async (values,{setSubmitting,resetForm})=>{
            // const data = await createUser(values);
            const formData = new FormData();
            formData.append("file",values.file);

            const avatar =  await uploadImage({file: formData});
            console.log("avatar", avatar);

            values.avatar = avatar;
            createUser(values);
            setSubmitting(false);
            console.log(data)           
            resetForm();         
            
        }}
        >
        {({isSubmitting, setFieldValue})=>(            
            <Form style={{padding:"80px"}} className="bg-black-100 w-full max-w-md p-8 border border-gray-400 rounded-lg shadow-  md:p-9 dark:bg-black-900 dark:border-gray-900">
                <h1 style={{color:"blue"}} className="text-3xl font-bold mb-4">Form login</h1>
                {/* name */}
                <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor='name'>Name</label>
                    <Field placeholder="Enter your name" type="text" name="name"
                    className ="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                   
                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm"/>
                    

                </div>
                {/* email */}
                <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor='email'>Email</label>
                    <Field placeholder="Enter your email" type="email" name="email"
                    className ="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    />
                    
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm"/>
                    

                </div>

                {/* password */}
                <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor='password'>Password</label>
                    <Field placeholder="Enter your password" type="password" name="password"
                    className ="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    </Field>
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm"/>
                    

                </div>

                {/* confirmPassword */}
                <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor='confirmPassword'>confirmPassword</label>
                    <Field placeholder="Enter your confirmPassword" type="password" name="confirmPassword"
                    className ="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    </Field>
                    <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm"/>
                    

                </div>

                {/* avatar */}
                {/* <div className="mb-6">
                    <Field
                    name="file"
                    type="file"
                    title="Select a file"
                    setFieldValue={setFieldValue} // Set Formik value
                    component={CustomInput} // component prop used to render the custom input
                    />
                    <ErrorMessage name="file">
                    {(msg) => <div className="text-red-500">{msg}</div>}
                    </ErrorMessage>
                </div> */}
                <div className="flex flex-col mb-4">
              <label htmlFor="file" className="mb-1">
                Avatar
              </label>
              <Field
                type="file"
                name="file"
                id="file"
                setFieldValue={setFieldValue}
                component={FileUpload}
                className="border border-gray-500 rounded px-4 py-2"
              />
              <ErrorMessage
                name="file"
                component="div"
                className="text-red-500"
              />            
            </div>
            <div>
                <button type="submit" disabled={isSubmitting} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
            </div>
            </Form>
        )}
    </Formik>
    {/* Overlay Loading */}
    {isLoading && (
        <section className="absolute w-screen top-0 h-screen bg-center bg-no-repeat bg-opacity-70 bg-red-900 bg-blend-multiply">
          <div className="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">
              Loading...
            </h1>
            <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4"></div>
          </div>
        </section>
      )}

   </div>
  )
}
// function CustomInput({filed,form, ...props }){
//     const [preview,setPreview] = useState(null);
//     return(
//         <div>
//             <input type="file" 
//             onChange={(event)=>{
//                 form.setFieldValue(filed.name, event.currentTarget.files[0]);
//                 setPreview(URL.createObjectURL(event.currentTarget.files[0]));
//             }}
//              {...props} 
//             />
//             {preview && (
//                 <img className="w-20 h-20 rounded-full object-cover"
//                 src={preview}
//                 alt="priview"
//                 />
//             )}
//         </div>
//     );
// }
function FileUpload({ field, form, setFieldValue }) {
    const [previewImage, setPreviewImage] = useState(null);
  
    const handleChange = (event) => {
      const file = event.currentTarget.files[0];
      form.setFieldValue(field.name, file);
      setPreviewImage(URL.createObjectURL(file));
    };
  
    return (
      <>
        <input
          type="file"
          onChange={handleChange}
          className="border border-gray-500 rounded px-4 py-2"
        />
        {previewImage && (
          <img src={previewImage} alt="preview" className="w-20 h-20 rounded-full object-cover mb-3" />
        )}
      </>
    );
  }
  
