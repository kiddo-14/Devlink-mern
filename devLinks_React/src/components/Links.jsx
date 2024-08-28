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
  const [userid, setUserid] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/v1/alluser`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const result = await response.json();
        const profiles = result.data || [];
        
        const emailList = profiles.map(profile => profile.email);
        setEmails(emailList);
        if (emailList.length > 0) {
          setSelectedEmail(emailList[0]);
        } else {
          setSelectedEmail('no-data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setSelectedEmail('no-data'); 
      }
    };
    fetchUserData();
  }, []);

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

        if (selectedProfile) {
          setUserid(selectedProfile._id);

          const linkResponse = await fetch(`${BASE_URL}/api/v1/alllinks`);
          if (!linkResponse.ok) {
            throw new Error('Failed to fetch links data');
          }
          const linkResult = await linkResponse.json();
          const allLinks = linkResult.data || [];

          const filteredLinks = allLinks.filter(link => selectedProfile.links.includes(link._id));
          
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

  // Add a new link to the links array
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
        email: selectedEmail
      }
    ]);
    setNextId(nextId + 1);
  };

  // Remove a link from the links array
  // const removeLink = (id) => {
    
  //   setLinks(links.filter(link => link.id !== id));
  //   console.log("links",links);

  // }; 
  const removeLinkfromdb = async (id) => {
    console.log("Link ID:", id);
    const updatedLinks = links.filter(link => link._id !== id);
    setLinks(updatedLinks);

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
  const saveDetails = async () => {
    try {
      if (!userid) {
        alert('User ID is missing.');
        return;
      }
      for (const link of links) {
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
                  onClick={() => {removeLinkfromdb(link._id);}}
                
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
