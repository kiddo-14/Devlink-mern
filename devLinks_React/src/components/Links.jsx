import React, { useState, useEffect } from 'react';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const platforms = {
  "Github": "github",
  "Twitter": "twitter",
  "Instagram": "instagram",
  "LinkedIn": "linkedin",
  "Youtube": "youtube"
};

const Links = () => {
  const [links, setLinks] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [authuserID,setAuthuserid]=useState(null);  
  const [userid, setUserid] = useState();

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
                setEmails(emailArr);
       } catch (error) {
           console.error('Error fetching user data:', error);
       }
   }

   fetchUserData();
},[authuserID]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/v1/alluser`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const result = await response.json();
        const profiles = result.data || [];

        const selectedProfile = profiles.find(profile => profile.email === selectedEmail);
        console.log("selectedProfile",selectedProfile);
        if (selectedProfile) {
          /*******************************************MERN**************************************/
          // setUserid(selectedProfile._id);
          /*******************************************PERN**************************************/
          setUserid(selectedProfile.userid);
          
          const linkResponse = await fetch(`${BASE_URL}/api/v1/alllinks`);
          if (!linkResponse.ok) {
            throw new Error('Failed to fetch links data');
          }
          const linkResult = await linkResponse.json();
          const allLinks = linkResult.data || [];
          /*******************************************MERN**************************************/
          // const filteredLinks = allLinks.filter(link => selectedProfile.links.includes(link._id));
          /*******************************************PERN**************************************/
          const filteredLinks = allLinks.filter(link => selectedProfile?.links?.includes(link.linkid));          
          setLinks(filteredLinks);
          setNextId(filteredLinks.length + 1);
        } else {
          setUserid('');
          setLinks([]);
          setNextId(1);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setUserid('');
        setLinks([]);
        setNextId(1);
      }
    };
    
    if (selectedEmail) {
      fetchProfileData();
    } else {
      setUserid('');
      setLinks([]);
      setNextId(1);
    }
  }, [selectedEmail]);

  console.log("links",links);
  // console.log("userid",userid)
  
  // Add a new link to the links array
  
  // const addLink = () => {
    //   if (selectedEmail === '') {
      //     alert('Please select a valid email before adding a link.');
      //     return;
      //   }
      //   if (selectedEmail === 'no-data') {
        //     alert('No profile exists. Create a profile first.');
  //     return;
  //   }

  //   setLinks([
  //     ...links,
  //     {
  //       id: nextId,
  //       platform: "",
  //       url: "",
  //       email: selectedEmail
  //     }
  //   ]);
  //   setNextId(nextId + 1);
  // };
  const addLink = () => {
    if (selectedEmail === '') {
        alert('Please select a valid email before adding a link.');
        return;
    }
    if (selectedEmail === 'no-data') {
        alert('No profile exists. Create a profile first.');
        return;
    }

    setLinks([
        ...links,
        {
            id: nextId,
            platform: "",
            url: "",
            email: selectedEmail,
            isNew: true  // Mark this link as new
        }
    ]);
    setNextId(nextId + 1);
};


  const removeLinkfromdb = async (id) => {
    console.log("Link ID:", id);
    // const updatedLinks = links.filter(link => link._id !== id);--------MERN
    const updatedLinks = links.filter(link => link.linkid !== id);
    setLinks(updatedLinks);
    alert('this link is deleted');
    console.log("Updatedlinks",updatedLinks);
    try {
        const response = await fetch(`${BASE_URL}/api/v1/dltlink`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userid: userid, 
                linkid: id,     
            }),
        });

        const result = await response.json();
        console.log("delted link",result);
        if (response.ok) {
            console.log("Link deleted successfully:", result.data);

        } else {
            console.error("Failed to delete link:", result.message);
            alert(`Error: ${result.message}`);
            setLinks(links); 
        }
    } catch (err) {
        console.error("An error occurred while deleting the link:", err);
        alert("An error occurred while deleting the link. Please try again.");

        setLinks(links); 
    }
};


  // Handle platform change for a specific link
  const handlePlatformChange = (id, value) => {
    const newLinks = links.map(link => {
      if (link.id === id) {
        return { ...link, platform: value };
      }
      return link;
    });
    setLinks(newLinks);
  };

  // Handle URL change for a specific link
  const handleUrlChange = (id, value) => {
    const newLinks = links.map(link => {
      if (link.id === id) {
        return { ...link, url: value };
      }
      return link;
    });
    setLinks(newLinks);
  };

  // Save the details to the database
  // const saveDetails = async () => {
  //   try {
  //     if (!userid) {
  //       alert('User ID is missing.');
  //       return;
  //     }
  //     for (const link of links) {
  //       const { platform, url } = link;
  //       const response = await fetch(`${BASE_URL}/api/v1/addlink`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ userid, platform, url }),
  //       });
  //       const data = await response.json();

  //       if (!response.ok || !data.success) {
  //         alert(`Failed to save link: ${data.message}`);
  //         return; 
  //       }
  //     }
  //     alert('Profile details including links saved successfully!');
  //   } catch (error) {
  //     console.error('Error saving profile details:', error);
  //     alert('An error occurred while saving the profile details.');
  //   }
  // };
  const saveDetails = async () => {
    try {
      // console.log("userid",userid);
        if (!userid) {
            alert('User ID is missing.');
            return;
        }

        // Filter only the new links that need to be saved
        const newLinks = links.filter(link => link.isNew);

        for (const link of newLinks) {
            const { platform, url } = link;
            const response = await fetch(`${BASE_URL}/api/v1/addlink`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userid, platform, url }),
            });
            const data = await response.json();

            if (!response.ok || !data.success) {
                alert(`Failed to save link: ${data.message}`);
                return; 
            }

            // After successful save, remove the isNew flag
            link.isNew = false;
        }

        alert('Profile details including links saved successfully!');
    } catch (error) {
        console.error('Error saving profile details:', error);
        alert('An error occurred while saving the profile details.');
    }
};

  return (
    <div className="p-4 border rounded">

      <div id="links" className="tab-section w-full">
        <h2 className="text-xl font-bold mb-4">Customize your links</h2>
        <p>Add/remove links below and share with the world!</p>

        <label className="text-gray-500 mb-1">Select Email to Add Link</label>
        <select
          className="block w-full p-2 border rounded mb-4"
          value={selectedEmail}
          onChange={(e) => setSelectedEmail(e.target.value)}
        >
          {emails.length > 0 ? (
            <>
              <option value="" disabled>Select an email</option>
              {emails.map(email => (
                <option key={email} value={email}>
                  {email}
                </option>
              ))}
            </>
          ) : (
            <option value="no-data">No profile data</option>
          )}
        </select>

        <button
          id="addbtn"
          className="mb-2 mt-4 text-center w-full bg-blue-500 text-white px-4 py-2 rounded"
          onClick={addLink}
        >
          + Add new link
        </button>
      
        <div id="link-list" className="mb-4">
          {links.map((link, index) => (
            <div key={link._id} className="flex flex-col bg-gray-100 p-2 mt-2 mb-2 rounded-md linkbox">
              <div className="flex justify-between">
                <p>Link #{index + 1}</p>
                <button
                  className="text-gray-500 text-center p-2 text-md"
                  // onClick={() => {removeLinkfromdb(link._id);--->MERN}
                  onClick={() => {removeLinkfromdb(link.linkid);}
                  
                }
                
                  >
                  Remove
                </button>
              </div>
              
              
              <label className="text-gray-500 mb-1">Platform</label>
              <select
                className="block w-full p-2 border rounded mr-2 mb-2"
                value={link.platform}
                onChange={(e) => handlePlatformChange(link.id, e.target.value)}
              >
                <option value="" disabled>Select a platform</option>
                {Object.keys(platforms).map(platform => (
                  <option key={platform} value={platforms[platform]}>
                    {platform}
                  </option>
                ))}
              </select>

              <label className="text-gray-500 mb-1">URL</label>
              <input
                type="url"
                placeholder="Profile URL"
                className="block w-full p-2 border rounded"
                value={link.url}
                onChange={(e) => handleUrlChange(link.id, e.target.value)}
              />
            </div>
          ))}
        </div>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          onClick={saveDetails}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Links;
