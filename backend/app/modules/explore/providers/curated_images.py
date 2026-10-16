"""
Curated Wikimedia Commons images for Vaycogo destinations.

These images were selected for destination suitability and
validated against Wikimedia Commons license metadata.

This module stores Commons filenames, not hardcoded image URLs.
The Wikimedia API will provide current URLs and attribution data.
"""

CURATED_DESTINATION_IMAGES: dict[str, str] = {
    # Amsterdam
    "Q727": (
        "Water reflection of canal houses at blue hour "
        "in Damrak Amsterdam the Netherlands.jpg"
    ),

    # Dubai
    "Q612": "Dubai Skyline mit Burj Khalifa (18241030269).jpg",

    # Hong Kong
    "Q8646": "Hong Kong Harbour Night 2019-06-11.jpg",

    # London
    "Q84": (
        "London Skyline from Waterloo Bridge, "
        "London, UK - Diliff.jpg"
    ),

    # Singapore
    "Q334": "Singapore Marina Bay Dusk 2018-02-27.jpg",
}


def get_curated_image_filename(wikidata_id: str) -> str | None:
    """
    Return a curated Commons filename for a destination.

    Returns None when no curated image is configured.
    """
    return CURATED_DESTINATION_IMAGES.get(wikidata_id)