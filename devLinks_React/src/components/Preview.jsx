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
    const [linkData, setLinkData] = useState({});

    useEffect(() => {
        const fetchUserData = async () => {
            try {           
                // Fetch profiles
                const profileResponse = await fetch(`${BASE_URL}/api/v1/alluser`);
                if (!profileResponse.ok) {
                    throw new Error('Failed to fetch user data');
                }         
                const profileResult = await profileResponse.json();
                const profiles = profileResult.data || [];
                console.log("profiles",profiles);
                // Fetch links
                const linkResponse = await fetch(`${BASE_URL}/api/v1/alllinks`);
                if (!linkResponse.ok) {
                    throw new Error('Failed to fetch links data');
                }
                const linkResult = await linkResponse.json();
                console.log("links after fetching from link",linkResult);                
                const links = linkResult.data ;
                console.log("links",links)
                // Create a map of link ID to link object
                const linkMap = links.reduce((acc, link) => {
                    acc[link._id] = link;
                    return acc;
                }, {});

                console.log("result after mapping",linkMap);

                // Map each profile's links from IDs to full link objects
                const profilesWithLinks = profiles.map(profile => ({
                    ...profile,
                    links: profile.links.map(linkId => linkMap[linkId])
                }));
                 console.log("profieWithLinks");
                setProfileData(profilesWithLinks);

            } catch (error) {
                console.error('Error fetching user data:', error);
                setProfileData([]);
            }
        };
        fetchUserData();
    }, []);

    console.log("profiles", profileData);

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
                                            src={profile.imageUrl || ""}
                                            alt="img"
                                            className="border w-24 h-24 rounded-full mx-auto mt-4 bg-gray-100"
                                        />
                                        <div className="mx-2">
                                            <p
                                                id="preview-name"
                                                className="mt-4 h-fit w-48 text-center font-bold text-md rounded-md mx-auto bg-gray-100"
                                            >
                                                {`${profile.Firstname} ${profile.Lastname}`}
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
            </main>
        </>
    );
};

export default Preview;
