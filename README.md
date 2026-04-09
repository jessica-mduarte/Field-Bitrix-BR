# Field-Bitrix
This project provides an automated synchronization between Bitrix24 and Field Control management system, which optimizes the workflow by automatically moving CRM deals to the next stage once their corresponding Service Orders are marked as completed in the Field platform.

## 🚀 Features
- **Automated status tracking:** Performs daily checks on Field Control for completed Service Orders.
- **OS Verification:** Maps identifiers to internal IDs from Bitrix, and fetches the task ID from Field which contains the info needed to determine if a Service Order was completed or not.
- **Docker App:** Fully containerized for easy deployment on platforms.

## 📦 Tech Stack
- **Node.js:** Core runtime environment.
- **Fetch API:** For communication with Bitrix and Field Control REST APIs.
- **Docker:** For simple and easy environment setup and deployment.

## 📝 Here's how it works
1. The script fetches active deals from a specific Bitrix24 pipeline and stage.
   
2. It extracts Service Order from a custom field (In this example, UF_CRM_1775677796).
   
3. It queries the Field Control API in two steps. These two steps are needed because the Field API doesn't return the OS status information by fetching the OS id alone, but the Task id(which the OS id *does* return) is able to fetch us that info.
 
     -***Step 1***: We find the Task Id by using the identifier(the OS id we got from Bitrix)
   
     -***Step 2***: We check the /tasks endpoint for a "done" status.

6. If the task is marked as "done", the Bitrix24 deal is automatically moved to our target stage.

## ⚙️ Setup
1. Clone the repository.
2. Run `npm install`.
3. Create a `.env` file based on `.env.example`.
4. Change the variables in .env to match your actual Bitrix stage and field variables.
5. Run the project using `node index.js` or `docker-compose up`.



## 👑 Contact

Developed by **Jessica Duarte**.

If you have any questions or wish to collaborate, reach out to me at jessicamirandaduarte@gmail.com 

---

*Made with node.js*

