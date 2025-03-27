AI Chatbot
A sleek, modern AI-powered chatbot built with HTML, CSS, JavaScript, Node.js, and Express, integrated with Google Generative AI (Gemini) for natural language responses. This project supports light/dark themes, chat history management, and suggestion prompts to enhance user interaction.
Features
Real-time Chat: Send messages and receive AI-generated responses.
Theme Toggle: Switch between light and dark modes, with preferences saved locally.
Chat Management: Clear chat history with a confirmation prompt.
Suggestions: Predefined prompts to inspire user queries.
Responsive Design: Optimized for desktop and mobile devices.
Prerequisites
Node.js (v16 or higher)
npm (v7 or higher)
Git
Ubuntu Servers (tested on Ubuntu 20.04 LTS or later)
Nginx (for load balancing)
Google Generative AI API Key (obtained from Google AI Studio)
Domain Name: Configured to point to the load balancer (www.princemugisha)
Installation
Local Setup
Clone the Repository:
 bash
CollapseWrapCopy
git clone https://github.com/Mbonyumugisha-Prince/Chatbot.git
cd ai-chatbot


Install Dependencies:
 bash
CollapseWrapCopy
npm install


Set Up Environment Variables: Create a .env file in the root directory and add your Gemini API key:
 plaintext
CollapseWrapCopy
GEMINI_APIKEY=your-api-key-here
PORT=3000


Run the Application:
 bash
CollapseWrapCopy
npm start
 Open your browser and visit http://localhost:3000.
Deployment on Ubuntu Servers
Step 1: Prepare Web Servers (6540-web-01 and 6540-web-02)
Deploy the chatbot application on both servers (3.95.137.221 and 18.233.10.231).
SSH into Each Server:
 bash
CollapseWrapCopy
ssh ubuntu@3.95.137.221

 bash
CollapseWrapCopy
ssh ubuntu@18.233.10.231


Update and Install Dependencies: On each server:
 bash
CollapseWrapCopy
sudo apt update && sudo apt upgrade -y
sudo apt install -y nodejs npm git


Clone the Repository:
 bash
CollapseWrapCopy
git clone https://github.com/Mbonyumugisha-Prince/Chatbot.git
cd ai-chatbot


Install Node.js Dependencies:
 bash
CollapseWrapCopy
npm install


Set Up Environment Variables: Create a .env file:
 bash
CollapseWrapCopy
nano .env
 Add:
 plaintext
CollapseWrapCopy
GEMINI_APIKEY=your-api-key-here
PORT=3000
 Save and exit (Ctrl+O, Enter, Ctrl+X).
Install PM2 for Process Management:
 bash
CollapseWrapCopy
sudo npm install -g pm2


Start the Application with PM2:
 bash
CollapseWrapCopy
pm2 start index.js --name "ai-chatbot"
pm2 save
pm2 startup
 Follow the on-screen instructions to ensure PM2 starts on boot.
Verify the App: Test locally on each server:
 bash
CollapseWrapCopy
curl http://localhost:3000
 You should see the HTML content of the chatbot interface.
Repeat these steps on both 6540-web-01 and 6540-web-02.
Step 2: Configure the Load Balancer (6540-lb-01)
Set up Nginx as a load balancer on 3.86.83.2 to distribute traffic for www.princemugisha.
SSH into the Load Balancer:
 bash
CollapseWrapCopy
ssh ubuntu@3.86.83.2


Install Nginx:
 bash
CollapseWrapCopy
sudo apt update && sudo apt install -y nginx


Configure Nginx for Load Balancing: Edit the Nginx configuration file:
 bash
CollapseWrapCopy
sudo nano /etc/nginx/sites-available/ai-chatbot
 Add the following configuration:
 nginx
CollapseWrapCopy
upstream chatbot_backend {
    server 3.95.137.221:3000;  # 6540-web-01
    server 18.233.10.231:3000; # 6540-web-02
}

server {
    listen 80;
    server_name www.princemugisha;

    location / {
        proxy_pass http://chatbot_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
 Save and exit.
Enable the Configuration:
 bash
CollapseWrapCopy
sudo ln -s /etc/nginx/sites-available/ai-chatbot /etc/nginx/sites-enabled/


Test and Restart Nginx:
 bash
CollapseWrapCopy
sudo nginx -t
sudo systemctl restart nginx


DNS Configuration:
Update your domain registrar’s DNS settings to point www.princemugisha to the load balancer’s IP (3.86.83.2).
Example DNS record:
 text
CollapseWrapCopy
Type: A
Host: www
Value: 3.86.83.2
TTL: 300


Wait for DNS propagation (may take up to 48 hours).
Verify Load Balancing: Open a browser and visit http://www.princemugisha. Refresh the page multiple times to confirm traffic is distributed between the two servers. Check server logs on 6540-web-01 and 6540-web-02:
 bash
CollapseWrapCopy
pm2 logs ai-chatbot


Step 3: Security and Firewall
Configure Firewall on All Servers: Allow HTTP traffic and SSH:
 bash
CollapseWrapCopy
sudo ufw allow 80/tcp
sudo ufw allow 22/tcp
sudo ufw enable


Secure the Web Servers: Ensure only the load balancer can access port 3000:
 bash
CollapseWrapCopy
sudo ufw allow from 3.86.83.2 to any port 3000


Usage
Send a Message: Type a question in the input field and press Enter or click the send button.
Toggle Theme: Click the theme button to switch between light and dark modes.
Clear Chats: Click the delete button and confirm to clear the chat history.
Use Suggestions: Click a suggestion to auto-fill the input and submit.
Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your changes. Ensure your code follows the existing style and includes tests where applicable.
License
This project is licensed under the MIT License. See the  file for details.
Acknowledgments
Google Generative AI for the Gemini API.
Material Symbols for icons.
Poppins Font for typography.

