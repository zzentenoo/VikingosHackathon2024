from google.cloud import aiplatform

def initialize_google_services():
    aiplatform.init(project=settings.GOOGLE_CLOUD_PROJECT_ID)

def call_google_service():
    initialize_google_services()
    return "Google Cloud Response"
