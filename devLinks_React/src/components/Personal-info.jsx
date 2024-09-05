import React, { useEffect, useState } from 'react';
import image from "../assets/User.jfif"
import {jwtDecode} from 'jwt-decode';
import Cookies from "js-cookie";


const BASE_URL = import.meta.env.VITE_BASE_URL;

const Personal = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [photo, setPhoto] = useState(image);
    const [photoFile, setPhotoFile] = useState(null); // Store the File object separately
    const [emailList, setemailList] = useState([]);
    const [authuserID,setAuthuserid]=useState(null);  
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
    });

    useEffect(() => {

         setAuthuserid(localStorage.getItem("authuserid"));
         console.log(authuserID);
        const fetchUserData = async () => {
            if (!authuserID) return;

            try {
                // Pass the id as a query parameter in the URL
                const response = await fetch(`${BASE_URL}/api/v1/authuserid?id=${authuserID}`, {
                    method: 'GET', 
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': 'Bearer '
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const result = await response.json();
                console.log(result);

                const profiles = result.data.profiles;
                console.log("profiles",profiles);

                const fetchEmailForUser = async (userId) => {
                    try {
                      const response = await fetch(`${BASE_URL}/api/v1/getemail?id=${userId}`,{
                        method: 'GET', 
                        headers: {
                            'Content-Type': 'application/json',
                            // 'Authorization': 'Bearer '
                        },
                    });
                    // console.log("response",response);
                      const result= await response.json(); 
                      console.log("result",result);
                      return result.data;
                    } catch (error) {
                      console.error(`Error fetching email for user ID ${userId}:`, error);
                    }
                  };
                //   let emailarr=[];
                  const emailArr = await Promise.all(
                    profiles.map(async (userId) => {
                        const email = await fetchEmailForUser(userId);
                        return email;
                    })
                );
                      console.log(emailArr, "email kajfgh");
                     setemailList(emailArr)
                    console.log("emailListaefgds",emailList);

              
                // // const profileData =profiles.data||[];
           
                // // const profileData =profiles.json();
                // console.log("profileData",profileData);
                // const emails = profiles.map(profile => profile.email);
                // setemailList(emails);
                // console.log("emailList",emailList)
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }

        fetchUserData();
    },[authuserID]);
    console.log("emailListaefgds",emailList);
    console.log("window object",window); 

    // useEffect(() => {
    //     const fetchUserData = async () => {
    //         try {
    //             const response = await fetch(`${BASE_URL}/api/v1/alluser`);
    //             if (!response.ok) {
    //                 throw new Error('Failed to fetch user data');
    //             }
    //             const result = await response.json();
    //             const profiles = result.data;
    //             const emails = profiles.map(profile => profile.email);
    //             setemailList(emails);
    //         } catch (error) {
    //             console.error('Error fetching user data:', error);
    //         }
    //     };
    //     fetchUserData();
    // }, []);
    const handlePhotoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const photoURL = URL.createObjectURL(file);
            setPhoto(photoURL); 
            setPhotoFile(file); 
        }
    };
         console.log("photo",photoFile);
    const validateFields = () => {
        let valid = true;
        let newErrors = { firstName: '', lastName: '', email: '' };

        if (!firstName.trim()) {
            newErrors.firstName = 'Please enter a valid first name.';
            valid = false;
        }

        if (!lastName.trim()) {
            newErrors.lastName = 'Please enter a valid last name.';
            valid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email.';
            valid = false;
        } else if (emailList.includes(email)) { 
            newErrors.email = 'This email is already in use. Please enter a unique email.';
            valid = false;
        }
        setErrors(newErrors);
        return valid;
    };

    const saveDetails = () => {
        if (validateFields()) {
            console.log("Entering in the save function");
            const user = new FormData();
            user.append('Firstname', firstName);
            user.append('Lastname', lastName);
            user.append('email', email);
            user.append('imageFile', photoFile);
            user.append('authid',authuserID);
            console.log("Calling the post API");
            fetch(`${BASE_URL}/api/v1/profileUpload`, {
                method: 'POST',
                body: user,
            })
            .then(response => response.json())
            .then(data => {
                if (data?.success) {
                    alert('Details and image uploaded successfully!');
                } else {
                    alert(`Failed to upload details: ${data.message}`);
                }
            })
            .catch(error => {
                console.error('Error uploading details:', error);
                alert('An error occurred while uploading details.');
            });
        }
    };

    return (
        <div className="p-4 border rounded">
            <div id="personal-info" className="tab-section">
                <p className="text-3xl font-bold">Profile Details</p>
                <p className="mt-2 text-sm text-gray-400">Add your details to create a personal touch to your profile</p>

                <div className="flex bg-gray-100 p-3 items-center justify-around mt-4 rounded-md sm:flex">
                    <label className="block mb-2 w-fit">Photo</label>
                    <div className="flex ml-8 lg:ml-32 md:ml-12 flex-col">
                        <img
                            className="md:ml-2 w-32 h-32 rounded-full border"
                            src={photo}
                            alt="img"
                            id="user-preview-photo"
                        />
                        <span className="sr-only mt-3 xl:ml-4">Choose profile photo</span>
                        <input
                            type="file"
                            id="user-photo"
                            className="block text-sm text-gray-500 xl:mt-2
                                file:mr-4 file:py-2 file:px-4 file:mt-2
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-violet-50 file:text-violet-700
                                hover:file:bg-sky-100"
                            onChange={handlePhotoChange}
                        />
                    </div>

                    <div className="mr-6 flex flex-col">
                        <p className="text-sm text-gray-500 mb-1">Image must be below 1024*1024</p>
                        <p className="text-sm text-gray-500">Use PNG, JPG, and BMP format.</p>
                    </div>
                </div>

                <div className="mt-2 bg-gray-100 rounded-md">
                    <div className="mt-2 flex p-2 justify-between rounded-md">
                        <label className="block w-1/3 items-center">First Name</label>
                        <input
                            type="text"
                            id="first-name"
                            className="block w-full p-2 border rounded "
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    {errors.firstName && <p className="error text-red-500">{errors.firstName}</p>}

                    <div className="mt-2 flex p-2 justify-between rounded-md">
                        <label className="block w-1/3">Last Name</label>
                        <input
                            type="text"
                            id="last-name"
                            className="block w-full p-2 border rounded "
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    {errors.lastName && <p className="error text-red-500">{errors.lastName}</p>}

                    <div className="mt-2 flex p-2 justify-between rounded-md">
                        <label className="block w-1/3">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="block w-full p-2 border rounded "
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    {errors.email && <p className="error text-red-500">{errors.email}</p>}
                </div>

                <div className="relative">
                    <button
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={saveDetails}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Personal;















  // const jwtToken = getCookieValue('token');
        // const getCookie = () => {
        //     return Cookies.get("token");
        //     // console.log(n);
        //   };
        //   console.log(getCookie, "$$$$$$$$$$$$$$$$$$$$$");
        // const jwtToken =  Cookies.get("token");
        // console.log("@@@@@@@@@@@@@@@@@@@@",jwtokent)
        // if(jwtToken){
            //     setToken(jwtToken);
            // }
                    //  const jwtToken = getCookie("COOKIE") ;       
                  
                    // const extractToken = (jwtToken) => {
                    //     // Split the cookie string by '; ' to handle multiple tokens or cookies
                    //     const cookies = cookieString.split('; ');
                        
                    //     // Find the token that starts with 'token='
                    //     const tokenCookie = cookies.find(cookie => cookie.startsWith('token='));
                        
                    //     if (tokenCookie) {
                    //         // Remove 'token=' from the beginning to get the actual token
                    //         return tokenCookie.substring('token='.length);
                    //     }
                    
                    //     // Return null if no token is found
                    //     return null;
                    // };
                    
                    //   const tokn = extractToken(jwtToken);
                    //   console("extrated token",tokn);
                    //   setToken(tokn);
                    //    console.log("token in hook",token);
            
        //     if (token) {
        //     const decoded = jwtDecode(token);
        //     setAuthuserid(decoded.id);  
        //     console.log(`User ID: ${decoded.id}`);
        // }