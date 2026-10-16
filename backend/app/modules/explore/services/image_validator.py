
"""
Wikimedia image metadata validator for Vaycogo.

Checks basic image URL safety, license allowlisting,
and availability of attribution metadata.

Passing validation does not replace license compliance
or visual suitability review.
"""

from urllib.parse import urlparse


ALLOWED_LICENSES = {
    "CC0",
    "Public domain",
    "CC BY 2.0",
    "CC BY 3.0",
    "CC BY 4.0",
    "CC BY-SA 2.0",
    "CC BY-SA 3.0",
    "CC BY-SA 4.0",
}

CC_LICENSE_PATHS = {
    "CC BY 2.0": "/licenses/by/2.0",
    "CC BY 3.0": "/licenses/by/3.0",
    "CC BY 4.0": "/licenses/by/4.0",
    "CC BY-SA 2.0": "/licenses/by-sa/2.0",
    "CC BY-SA 3.0": "/licenses/by-sa/3.0",
    "CC BY-SA 4.0": "/licenses/by-sa/4.0",
}


class ImageValidationError(ValueError):
    """Raised when image metadata fails validation."""


def validate_wikimedia_image(data: dict) -> dict:
    """
    Validate Wikimedia image metadata before persistence.

    Returns the original metadata if valid.
    """

    if not isinstance(data, dict):
        raise ImageValidationError(
            "Image metadata must be a dictionary."
        )

    image_url = data.get("image_url")
    image_page_url = data.get("image_page_url")
    license_name = data.get("license")
    license_url = data.get("license_url")
    artist = data.get("artist")
    image_source = data.get("image_source")

    if image_source != "wikimedia_commons":
        raise ImageValidationError(
            "Unsupported image source."
        )

    if not isinstance(image_url, str):
        raise ImageValidationError(
            "Missing image URL."
        )

    parsed_image_url = urlparse(image_url)

    if (
        parsed_image_url.scheme != "https"
        or parsed_image_url.hostname != "upload.wikimedia.org"
        or parsed_image_url.username is not None
        or parsed_image_url.password is not None
        or parsed_image_url.port is not None
    ):
        raise ImageValidationError(
            "Image must use Wikimedia's HTTPS upload domain."
        )

    if not isinstance(image_page_url, str):
        raise ImageValidationError(
            "Missing Commons file page."
        )

    parsed_page_url = urlparse(image_page_url)

    if (
        parsed_page_url.scheme != "https"
        or parsed_page_url.hostname != "commons.wikimedia.org"
        or parsed_page_url.username is not None
        or parsed_page_url.password is not None
        or parsed_page_url.port is not None
        or not parsed_page_url.path.startswith("/wiki/File:")
    ):
        raise ImageValidationError(
            "Invalid Commons file page."
        )

    if license_name not in ALLOWED_LICENSES:
        raise ImageValidationError(
            f"Unsupported or unknown license: {license_name}"
        )

    if not isinstance(artist, str) or not artist.strip():
        raise ImageValidationError(
            "Missing image creator metadata."
        )

    if license_name not in {"CC0", "Public domain"}:
        if not isinstance(license_url, str):
            raise ImageValidationError(
                "Missing license URL."
            )

        parsed_license_url = urlparse(license_url)

        if (
            parsed_license_url.scheme not in {"http", "https"}
            or parsed_license_url.hostname != "creativecommons.org"
            or parsed_license_url.username is not None
            or parsed_license_url.password is not None
            or parsed_license_url.port is not None
            or parsed_license_url.query
            or parsed_license_url.fragment
            or parsed_license_url.path.rstrip("/")
            != CC_LICENSE_PATHS[license_name]
        ):
            raise ImageValidationError(
                "Invalid Creative Commons license URL."
            )

        # Normalize Wikimedia's legacy HTTP license links.
        normalized_license_url = (
            "https://creativecommons.org"
            + CC_LICENSE_PATHS[license_name]
            + "/"
        )

        return {
            **data,
            "license_url": normalized_license_url,
        }

    return data