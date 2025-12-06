## 🚀 Deployment

This project is deployed to **Google Cloud Run** using the Google Cloud CLI (`gcloud`).

### Configuration
* **Project ID:** `consummate-link-474700-p6`
* **Region:** `asia-south1`
* **Service Name:** `well-bot-website`

### 1. Build and Push Image
Run this command from the root directory to build the Docker image and upload it to the Google Artifact Registry:

gcloud builds submit --tag asia-south1-docker.pkg.dev/consummate-link-474700-p6/cloud-run-source-deploy/well-bot-website

### 2. Deploy to Cloud Run
Run this command to deploy the image to a managed Cloud Run instance. This includes the --allow-unauthenticated flag, making the URL publicly accessible:
gcloud run deploy well-bot-website --image asia-south1-docker.pkg.dev/consummate-link-474700-p6/cloud-run-source-deploy/well-bot-website --platform managed --region asia-south1 --allow-unauthenticated

#### To inject variables:
gcloud run deploy well-bot-website --image asia-south1-docker.pkg.dev/consummate-link-474700-p6/cloud-run-source-deploy/well-bot-website --platform managed --region asia-south1 --allow-unauthenticated --set-env-vars "SUPABASE_URL=https://otymmdatyozfljzsqrhy.supabase.co,JWT_SECRET=Rz9Fgqv8bYkmnLkV7wTxm3oPiUZrNWfKnxPL12345,ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzU4OTYzMjk0LCJleHAiOjIwNzQ1MzkyOTR9.b44mdZV7Fp97VaS9eJgiFYSF0q-980RdHLtqGqDqKgM,SUPABASE_SERVICE_ROLE_KEY=sb_publishable_T3WPHIBl_b_-WTPWjZiG-g_S2K5Esjv,EMAIL_USERNAME=noreplywellbot@gmail.com,EMAIL_PASSWORD=cfil izwb evyp nquf"