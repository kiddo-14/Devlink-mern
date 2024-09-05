import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const platforms = {
    "Twitter": "twitter",
    "Instagram": "instagram",
    "LinkedIn": "linkedin",
    "YouTube": "youtube",
    "GitHub": "github"
};

const getPlatformColor = (platformName) => {
    switch (platformName) {
        case 'GitHub':
            return '#000';
        case 'LinkedIn':
            return '#0e76a8';
        case 'YouTube':
            return '#FF0000';
        case 'Twitter':
            return '#1DA1F2';
        case 'Instagram':
            return '#C13584';    
        default:
            return '#808080';
    }
};
  


const Preview = () => {
    const [profileData, setProfileData] = useState([]);
    // const [linkData, setLinkData] = useState({});
    const [authuserID,setAuthuserid]=useState(null);  
    const [email,setemail]=useState();

    useEffect(() => {
       console .log("Entering into preview page");
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
               console.log("result of API call",result);

               const profiles = result.data.profiles;
               console.log("profiles",profiles);

               const fetchprofilesForauthUser = async (userId) => {
                   try {
                     const response = await fetch(`${BASE_URL}/api/v1/getAllProfilesOfAuthUser?id=${userId}`,{
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
                     console.error(`Error fetching profile for user ID ${userId}:`, error);
                   
                   }
                 };
               const fetchlinkdetails = async (linkId) => {
                   try {
                     const response = await fetch(`${BASE_URL}/api/v1/getlink?id=${linkId}`,{
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
                     console.error(`Error fetching link for link ID ${userId}:`, error);
                   
                   }
                 };


               /*mern*/
            //      const profiledetailsArr = await Promise.all(
            //        profiles.map(async (userId) => {
            //            const profieldetail = await fetchprofilesForauthUser(userId);
                        
            //            /********************************************************** */
            //            const profilelinks =profieldetail.links;

            //            console.log("profilelinks",profilelinks);
            //                  const linkdeatilsArr =await Promise.all(
            //                       profilelinks.map(async(linkId)=>{
            //                          const linkdetail =await fetchlinkdetails(linkId);
            //                           return linkdetail;
            //                       })
            //                  )
            //                  profieldetail.links=linkdeatilsArr;
            //             /*****************************************************/   
            //            return profieldetail;
            //        })
            //    );
                /*PERN*/    
            const profiledetailsArr = await Promise.all(
                profiles?.map(async (userId) => {
                    // Fetch profile details
                    const profieldetail = await fetchprofilesForauthUser(userId);                    
                    /**********************************************************/
                    const profilelinks = profieldetail?.links || [];
                    
                    console.log("profilelinks", profilelinks);
                    const linkdetailsArr = await Promise.all(
                        profilelinks?.map(async (linkId) => {
                            // Fetch link details
                            const linkdetail = await fetchlinkdetails(linkId);
                            return linkdetail;
                        })
                    );
                    profieldetail.links = linkdetailsArr;
                    /*****************************************************/
                    
                    return profieldetail;
                }) || []
            );
            
            setProfileData(profiledetailsArr)

                    
           } catch (error) {
               console.error('Error fetching user data:', error);
           }
       }

       fetchUserData();
   },[authuserID]);
    console.log("profiles", profileData);
    const handleShare=async()=>{
          if(!email){
             return alert('Enter the email to first...');
          }
        try{
           console.log("entering in handleshare function");
               const response =await fetch(`${BASE_URL}/api/v1/shareProfile`,
                  { method: 'POST',
                   credentials: 'include',
                   headers: {
                     'Content-Type': 'application/json',
                   },
                   body: JSON.stringify({ email, profileData })
                 });
                 
                 console.log("Successfully called API");
                 if (response.ok) {
                        console.log("Succesfully able to send the email");
                        alert(`Profiles are share to this mail id: ${email} `)
                   } else {
                        console.log("Not able to share the profiles via the email")                  ;      
                        alert("Not able to share the profiles via the email");                  ;      
                 }                  
        }
        catch(err){
           console.error(err);
           console.log(err);
           alert("Not able to Share Profiles!!Try again...")
        }
    }

    return (
        <>
            <main className="bg-gray-100 h-fit w-full p-2">
                <nav className="sticky top-0 z-10 bg-white max-h-12 p-2 mb-2 mx-4 rounded-md flex justify-between">
                    <div className="mx-2 flex gap-1 ">
                        <div className="bg-blue-800 max-w-8 max-h-8 text-white p-1 rounded text-center">
                            <i className="fa-solid fa-link text-sm"></i>
                        </div>
                        <p className="text-xl font-bold">devLinks</p>
                    </div>
                    <div className="mx-2">
                        <Link to="/">
                            <button
                                className="tab-btn text-gray-900 bg-white focus:border-gray-300 hover:bg-blue-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-3 py-1.5 sm:text-hidden"
                            >
                                <i className="fa-solid fa-circle-user text-sm"></i>
                                <span className="hidden sm:inline-block">Back To Main</span>
                            </button>
                        </Link>
                    </div>
                </nav>
                <div className="flex flex-wrap">
                    {profileData.length > 0 ? (
                        profileData.map((profile, profileIndex) => (                                                          
                            <div key={profileIndex} className="p-8 relative w-fit mx-auto rounded flex flex-wrap justify-center items-center">
                                <div className="border p-3 h-fit md:left-16 rounded-3xl bg-white mx-auto">
                                    <div className="flex flex-col border rounded-3xl h-full w-full bg-white">
                                        <img
                                            id="preview-photo"
                                            // src={profile.imageUrl || ""}-------------->MERN
                                            src={profile.imageurl || ""}
                                            alt="img"
                                            className="border w-24 h-24 rounded-full mx-auto mt-4 bg-gray-100"
                                        />
                                        <div className="mx-2">
                                            <p
                                                id="preview-name"
                                                className="mt-4 h-fit w-48 text-center font-bold text-md rounded-md mx-auto bg-gray-100"
                                            >
                                            
                                                {/* {`${profile.Firstname} ${profile.Lastname}`} -------MERN*/}
                                                {`${profile.firstname} ${profile.lastname}`/*PERN*/}
                                            </p>
                                            <p
                                                id="preview-email"
                                                className="mt-2 h-fit w-64 text-center text-md rounded-md mx-auto bg-gray-100 mb-4"
                                            >
                                                {profile.email}
                                            </p>
                                        </div>
                                        <ul id="preview-links" className="mb-4">
                                            {profile.links && profile.links.length > 0 ? (
                                                profile.links.map((link, linkIndex) => {
                                                    if (!link) return null; // Skip if the link is not found
                                                    
                                                    const platformName = Object.keys(platforms).find(
                                                        key => platforms[key].toLowerCase() === link.platform?.toLowerCase()
                                                    );

                                                    if (!platformName) {
                                                        return null; // Skip rendering if platformName is not found
                                                    }

                                                    return (
                                                        <li
                                                            key={linkIndex}
                                                            className="mt-3 flex w-3/4 mx-auto rounded-md h-8"
                                                            style={{ backgroundColor: getPlatformColor(platformName) }}
                                                        >
                                                            <i
                                                                className={`fa-brands fa-${link.platform.toLowerCase()} my-auto ml-1 text-white`}
                                                            ></i>
                                                            <a
                                                                href={link.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-white mx-2 my-auto"
                                                            >
                                                                {platformName}
                                                            </a>
                                                        </li>
                                                    );
                                                })
                                            ) : (
                                                <p className="text-center text-gray-500">No links available</p>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>                    
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No profiles available</p>
                    )}
                    
                </div>

                <div className="w- fit flex-col  flexjustify-center">
                     <div className="w-fit flex mx-auto">

                      <label for="email" class="block mb-2 text-sm font-medium w-fit text-gray-900 dark:text-white ">Enter the email</label>
                      <input type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@gmail.com" required=""
                      onChange={(e)=>setemail(e.target.value)}/>
                      </div>
                      <div className="w-fit mx-auto mt-3">

                      <button  class="w-full mx-auto p-4 bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                      onClick={()=>handleShare()}>Share Profile</button>
                      </div>
                  </div>
            </main>
        </>
    );
};
export default Preview;
