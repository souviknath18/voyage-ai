"""
Safe Wikimedia image attribution formatting.

Converts Wikimedia artist HTML into plain text without
executing or exposing HTML markup.

Original attribution metadata remains unchanged in the database.
"""

from html import unescape
from html.parser import HTMLParser


class _PlainTextHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts: list[str] = []
        self.ignored_depth = 0

    def handle_starttag(self, tag, attrs):
        if self.ignored_depth:
            self.ignored_depth += 1
        elif tag.lower() in {"script", "style"}:
            self.ignored_depth = 1

    def handle_endtag(self, tag):
        if self.ignored_depth:
            self.ignored_depth -= 1

    def handle_data(self, data):
        if not self.ignored_depth:
            self.parts.append(data)


def format_image_artist(raw_artist: str | None) -> str | None:
    """
    Convert Wikimedia artist metadata to safe plain text.

    Returns None for missing or empty artist metadata.
    """
    if not raw_artist or not raw_artist.strip():
        return None

    parser = _PlainTextHTMLParser()
    parser.feed(raw_artist)
    parser.close()

    plain_text = unescape("".join(parser.parts))
    normalized = " ".join(plain_text.split())

    return normalized or None