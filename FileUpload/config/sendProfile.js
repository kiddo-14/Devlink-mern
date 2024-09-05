 import transporter from "./nodemailer.js";
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

const sendProfilesviaEmail = async (recipientEmail, profiles) => {
     console.log("recipientmail",recipientEmail);
    console.log("enter into send Profile via Email Function");
    let messageBody = '<h1>User Profiles</h1>';

  
    profiles.forEach((profile) => {
        messageBody += `                                                      
        <div style="padding: 8px; position: relative; width: fit-content; margin: auto; border-radius: 12px; display: flex; flex-direction: column; align-items: center;">
          <div style="border: 1px solid #ccc; padding: 12px; border-radius: 24px; background-color: white; display: flex; flex-direction: column; align-items: center; width: 100%;">
            <img
              id="preview-photo"
              src="${profile.imageurl || ''}"
              alt="img"
              style="border: 1px solid #ccc; width: 96px; height: 96px; border-radius: 50%; margin: 16px auto; background-color: #f0f0f0;"
            />
            <div style="margin: 8px; text-align: center;">
              <p
                id="preview-name"
                style="margin-top: 16px; width: 192px; font-weight: bold; font-size: 1rem; border-radius: 8px; background-color: #f0f0f0; padding: 8px; margin: 0 auto;"
              >
                ${profile.firstname} ${profile.lastname}
              </p>
              <p
                id="preview-email"
                style="margin-top: 8px; width: 256px; font-size: 1rem; border-radius: 8px; background-color: #f0f0f0; padding: 8px; margin: 0 auto 16px;"
              >
                ${profile.email}
              </p>
            </div>
            <ul id="preview-links" style="list-style: none; padding: 0; display:flex; flex-direction:column;  width: 100%; text-align: center;">
              ${
                profile.links && profile.links.length > 0
                  ? profile.links.map((link) => {
                      if (!link) return ''; 
      
                      const platformName = Object.keys(platforms).find(
                        (key) =>
                          platforms[key].toLowerCase() ===
                          link.platform?.toLowerCase()
                      );
      
                      if (!platformName) {
                        return ''; // Skip rendering if platformName is not found
                      }
      
                      return `
                        <li
                          style="margin-top: 12px; display: flex; justify-content: center; align-items: center; border-radius: 8px; height: 32px; background-color: ${getPlatformColor(
                            platformName
                          )};"
                        >
                          <i
                            class="fa-brands fa-${link.platform.toLowerCase()}"
                            style="margin-left: 4px; color: white; margin-right: 8px;"
                          ></i>
                          <a
                            href="${link.url}"
                            target="_blank"
                            rel="noopener noreferrer"
                            style="color: white; padding: 8px;"
                          >
                            ${platformName}
                          </a>
                        </li>`;
                    }).join('')
                  : `<p style="text-align: center; color: gray;">No links available</p>`
              }
            </ul>
          </div>
        </div>`;
      
      });
  
  

        const mailOptions = {
        from: 'bhojaknikhil9@gmail.com',
        to: recipientEmail,
        subject: 'Shared User Profiles',
        html: messageBody,
        };
        //  console.log("mailOptions",mailOptions);
        // Send the email
        try {
            console.log("using sendmail function of transporter for sending the mail")
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
        } catch (error) {
        console.error('Error sending email:', error);
        }
   };

export default sendProfilesviaEmail;