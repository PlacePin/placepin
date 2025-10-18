# PlacePin App

## Starting Checklist
 - Clone the repo with git clone {https://repo-name}
 - Inside the repo do npm install to install the dependencies
 - Fire up the terminal and run npm run dev for the frontend
 - Split the terminal and run npm run server to fire up the backend server
 - If trying to test stripe webhooks run
    npm run ngrok in a separate terminal
    ** Take the forwarding https:// url and put it in the stripe dev webhooks page in there dashboard **
    npm run stripe in another separate terminal
    ** If you haven't logged in to stripe in 90 days run stripe login in the terminal **

## CSS Convention
 - All CSS pages live in the same folder as the tsx files
 - All CSS file names are camalCase to the file they are CSS'ing
 - All CSS file names end in .module.css
 - All CSS style names are camalCase

## MAILING INVITES
 - mailtrap.io is the smtp
 - Currently using gmail smtp because its free