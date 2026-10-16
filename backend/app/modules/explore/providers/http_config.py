"""
Shared HTTP configuration for Vaycogo destination providers.

Identifies the application when requesting data from
Wikidata, Wikipedia, and Wikimedia Commons.
"""

from app.core.config import settings


APP_USER_AGENT = "VaycogoDestinationService/0.1"


def get_wikimedia_user_agent() -> str:
    """
    Return an identifiable User-Agent for Wikimedia services.

    Contact email is loaded through Pydantic Settings
    from the backend .env file.
    """

    contact_email = settings.wikimedia_contact_email.strip()

    if not contact_email:
        raise RuntimeError(
            "WIKIMEDIA_CONTACT_EMAIL must be configured "
            "before making Wikimedia API requests."
        )

    return f"{APP_USER_AGENT} (contact: {contact_email})"