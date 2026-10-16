import pytest

from app.modules.explore.services.image_validator import (
    ImageValidationError,
    validate_wikimedia_image,
)


@pytest.fixture
def valid_image():
    return {
        "image_source": "wikimedia_commons",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/example.jpg",
        "image_page_url": "https://commons.wikimedia.org/wiki/File:Example.jpg",
        "license": "CC BY-SA 4.0",
        "license_url": "https://creativecommons.org/licenses/by-sa/4.0/",
        "artist": "Example Photographer",
    }


def test_valid_image_metadata(valid_image):
    result = validate_wikimedia_image(valid_image)

    assert result["license"] == "CC BY-SA 4.0"


@pytest.mark.parametrize(
    "license_name,license_path",
    [
        ("CC BY 2.0", "by/2.0"),
        ("CC BY 3.0", "by/3.0"),
        ("CC BY 4.0", "by/4.0"),
        ("CC BY-SA 2.0", "by-sa/2.0"),
        ("CC BY-SA 3.0", "by-sa/3.0"),
        ("CC BY-SA 4.0", "by-sa/4.0"),
    ],
)
def test_supported_cc_licenses(
    valid_image, license_name, license_path
):
    valid_image["license"] = license_name
    valid_image["license_url"] = (
        f"https://creativecommons.org/licenses/{license_path}/"
    )

    assert validate_wikimedia_image(valid_image)


def test_cc0_allowed(valid_image):
    valid_image["license"] = "CC0"

    assert validate_wikimedia_image(valid_image)


def test_unknown_license_rejected(valid_image):
    valid_image["license"] = "All rights reserved"

    with pytest.raises(ImageValidationError):
        validate_wikimedia_image(valid_image)


def test_non_wikimedia_image_rejected(valid_image):
    valid_image["image_url"] = "https://example.com/photo.jpg"

    with pytest.raises(ImageValidationError):
        validate_wikimedia_image(valid_image)


def test_missing_artist_rejected(valid_image):
    valid_image["artist"] = ""

    with pytest.raises(ImageValidationError):
        validate_wikimedia_image(valid_image)


def test_mismatched_license_url_rejected(valid_image):
    valid_image["license_url"] = (
        "https://creativecommons.org/licenses/by/4.0/"
    )

    with pytest.raises(ImageValidationError):
        validate_wikimedia_image(valid_image)


def test_http_license_url_normalized(valid_image):
    valid_image["license_url"] = (
        "http://creativecommons.org/licenses/by-sa/4.0/"
    )

    result = validate_wikimedia_image(valid_image)

    assert result["license_url"] == (
        "https://creativecommons.org/licenses/by-sa/4.0/"
    )


def test_image_url_with_credentials_rejected(valid_image):
    valid_image["image_url"] = (
        "https://attacker:password@upload.wikimedia.org/"
        "wikipedia/commons/example.jpg"
    )

    with pytest.raises(ImageValidationError):
        validate_wikimedia_image(valid_image)


def test_commons_page_with_credentials_rejected(valid_image):
    valid_image["image_page_url"] = (
        "https://attacker:password@commons.wikimedia.org/"
        "wiki/File:Example.jpg"
    )

    with pytest.raises(ImageValidationError):
        validate_wikimedia_image(valid_image)


def test_image_url_with_explicit_port_rejected(valid_image):
    valid_image["image_url"] = (
        "https://upload.wikimedia.org:8443/"
        "wikipedia/commons/example.jpg"
    )

    with pytest.raises(ImageValidationError):
        validate_wikimedia_image(valid_image)


def test_commons_page_with_explicit_port_rejected(valid_image):
    valid_image["image_page_url"] = (
        "https://commons.wikimedia.org:8443/"
        "wiki/File:Example.jpg"
    )

    with pytest.raises(ImageValidationError):
        validate_wikimedia_image(valid_image)