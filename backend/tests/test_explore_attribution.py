from app.modules.explore.services.attribution import (
    format_image_artist,
)


def test_plain_text_artist():
    assert format_image_artist("Basile Morin") == "Basile Morin"


def test_html_artist():
    raw = '<a href="https://commons.wikimedia.org">Basile Morin</a>'

    assert format_image_artist(raw) == "Basile Morin"


def test_html_entities():
    assert format_image_artist("Tom &amp; Jerry") == "Tom & Jerry"


def test_whitespace_normalization():
    assert format_image_artist("  Jane \n  Doe  ") == "Jane Doe"


def test_missing_artist():
    assert format_image_artist(None) is None
    assert format_image_artist("") is None
    assert format_image_artist("   ") is None


def test_script_content_removed():
    raw = "<script>alert('test')</script>Jane Doe"

    assert format_image_artist(raw) == "Jane Doe"


def test_style_content_removed():
    raw = "<style>body { color: red; }</style>Jane Doe"

    assert format_image_artist(raw) == "Jane Doe"


def test_nested_html():
    raw = "<div><span>Jane</span> <strong>Doe</strong></div>"

    assert format_image_artist(raw) == "Jane Doe"