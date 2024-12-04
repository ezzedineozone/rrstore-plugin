# A plugin that adds support for products selling with checkout and cart funcationality, styles are ready
#### Make sure to run npm run watch to build the tailwind css located in rrstore-plugin/css
#### Make sure main theme is not conflicting with plugin styling - that is, pay attention if the main theme has any general css setup to html elements
#### THE PLUGIN IS FULLY INDEPENDENT FOR NOW, THE STYLING ISNT AFFECTED BY YOUR MAIN THEME, TO MODIFY THE WAY THE PLUGIN WORKS MODIFY THE SOURCE FILES DIRECTLY
The master branch is more dependent, it will havethe blue and yellow style but is affected by general styling on your website

### FEATURES:
This plugin allows you to easily: 
- Sell Products on your website, with price, image and description
- Cart functionality based on PHP cookies, no need for user logon
- Filter Products based on categories and price
- Checkout address and user info collection, with price calculation before extra charges such as vat or delivery
- Checkout functionality and extra charges are for you to implement, view cart.js and cart-page.php
- Resposnive header that includes your primary navigation for both mobile and desktop
- Responsive UI for both desktop and mobile
- Set delivery price per country (if not set show "we do not deliver to this country" on reciept and dont allow checkout
- Set payment options through online links
- email reciept / full order information on checkout to user and or admin (uses default SMTP server, needs to be setup)

#### To change the logo and default pic for products without a picture, replace their respective images (png or jpeg) in rrstore-plugin/images

## showcase
![image](https://github.com/user-attachments/assets/fd847645-56b4-476a-b694-3966b36aa01b)
![image](https://github.com/user-attachments/assets/5e2fe06e-4fb8-4827-a60d-b6d65298f443)
![image](https://github.com/user-attachments/assets/badde5dd-ee15-4bcd-822b-f72745467c96)


And this is what will be displayed to the user, then emailed to the user if a succesfull checkout happens
![image](https://github.com/user-attachments/assets/70426f86-e81c-464e-8570-5c91ca0e8a92)


