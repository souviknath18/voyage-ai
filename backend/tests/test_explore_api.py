
import pytest
import httpx

from app.main import app


@pytest.mark.asyncio(loop_scope="module")
async def test_list_explore_destinations():
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app),
        base_url="http://testserver",
    ) as client:
        response = await client.get(
            "/api/v1/explore/destinations"
        )

    assert response.status_code == 200

    data = response.json()

    assert "items" in data
    assert "total" in data
    assert "limit" in data
    assert "offset" in data

    assert isinstance(data["items"], list)
    assert data["total"] >= 10


@pytest.mark.asyncio(loop_scope="module")
async def test_filter_destinations_by_country():
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app),
        base_url="http://testserver",
    ) as client:
        response = await client.get(
            "/api/v1/explore/destinations",
            params={"country_code": "JPN"},
        )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] >= 2
    assert all(
        item["country_code"] == "JPN"
        for item in data["items"]
    )


@pytest.mark.asyncio(loop_scope="module")
async def test_get_explore_destination():
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app),
        base_url="http://testserver",
    ) as client:
        response = await client.get(
            "/api/v1/explore/destinations/Q90"
        )

    assert response.status_code == 200

    data = response.json()

    assert data["wikidata_id"] == "Q90"
    assert data["name"] == "Paris"
    assert data["country_code"] == "FRA"


@pytest.mark.asyncio(loop_scope="module")
async def test_explore_destination_not_found():
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app),
        base_url="http://testserver",
    ) as client:
        response = await client.get(
            "/api/v1/explore/destinations/Q9999999999999999999"
        )

    assert response.status_code == 404


@pytest.mark.asyncio(loop_scope="module")
async def test_invalid_pagination():
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app),
        base_url="http://testserver",
    ) as client:
        response = await client.get(
            "/api/v1/explore/destinations",
            params={"limit": 101},
        )

    assert response.status_code == 422


@pytest.mark.asyncio(loop_scope="module")
async def test_search_destination_case_insensitive():
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app),
        base_url="http://testserver",
    ) as client:
        response = await client.get(
            "/api/v1/explore/destinations",
            params={"search": "tOkYo"},
        )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 1
    assert data["items"][0]["name"] == "Tokyo"


@pytest.mark.asyncio(loop_scope="module")
async def test_search_destination_partial_name():
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app),
        base_url="http://testserver",
    ) as client:
        response = await client.get(
            "/api/v1/explore/destinations",
            params={"search": "san"},
        )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] >= 1
    assert any(
        item["name"] == "San Francisco"
        for item in data["items"]
    )


@pytest.mark.asyncio(loop_scope="module")
async def test_search_destination_with_country_filter():
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app),
        base_url="http://testserver",
    ) as client:
        response = await client.get(
            "/api/v1/explore/destinations",
            params={
                "country_code": "JPN",
                "search": "kyoto",
            },
        )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 1
    assert data["items"][0]["name"] == "Kyoto"
    assert data["items"][0]["country_code"] == "JPN"


@pytest.mark.asyncio(loop_scope="module")
async def test_search_destination_pagination_total():
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app),
        base_url="http://testserver",
    ) as client:
        response = await client.get(
            "/api/v1/explore/destinations",
            params={
                "search": "new",
                "limit": 1,
                "offset": 0,
            },
        )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 1
    assert data["limit"] == 1
    assert data["offset"] == 0
    assert len(data["items"]) == 1
    assert data["items"][0]["name"] == "New York City"


@pytest.mark.asyncio(loop_scope="module")
async def test_search_destination_no_results():
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app),
        base_url="http://testserver",
    ) as client:
        response = await client.get(
            "/api/v1/explore/destinations",
            params={"search": "unknowncity123456"},
        )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 0
    assert data["items"] == []


@pytest.mark.asyncio(loop_scope="module")
async def test_search_destination_too_long():
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app),
        base_url="http://testserver",
    ) as client:
        response = await client.get(
            "/api/v1/explore/destinations",
            params={"search": "a" * 101},
        )

    assert response.status_code == 422


@pytest.mark.asyncio(loop_scope="module")
async def test_search_destination_sql_wildcards():
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app),
        base_url="http://testserver",
    ) as client:
        for search_term in ["%", "_"]:
            response = await client.get(
                "/api/v1/explore/destinations",
                params={"search": search_term},
            )

            assert response.status_code == 200

            data = response.json()

            assert data["total"] == 0
            assert data["items"] == []


@pytest.mark.asyncio(loop_scope="module")
async def test_explore_destination_enrichment():
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app),
        base_url="http://testserver",
    ) as client:
        response = await client.get(
            "/api/v1/explore/destinations/Q727"
        )

    assert response.status_code == 200

    data = response.json()

    assert data["wikidata_id"] == "Q727"
    assert data["description"]
    assert data["description_source"] == "wikipedia"

    assert data["image_url"].startswith("https://")
    assert data["image_source"] == "wikimedia_commons"

    assert data["image_artist"] == "Basile Morin"
    assert data["image_license"] == "CC BY-SA 4.0"

    assert data["image_page_url"].startswith(
        "https://commons.wikimedia.org/"
    )

    assert data["image_license_url"] == (
        "https://creativecommons.org/licenses/by-sa/4.0/"
    )

    assert "<" not in data["image_artist"]
    assert ">" not in data["image_artist"]


@pytest.mark.asyncio(loop_scope="module")
async def test_explore_list_includes_enrichment():
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app),
        base_url="http://testserver",
    ) as client:
        response = await client.get(
            "/api/v1/explore/destinations",
            params={"limit": 100},
        )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] >= 30

    for destination in data["items"]:
        assert destination["description"]
        assert destination["image_url"]
        assert destination["image_artist"]
        assert destination["image_license"]
        assert destination["image_page_url"]
        assert destination["image_license_url"]

        assert "<" not in destination["image_artist"]
        assert ">" not in destination["image_artist"]


@pytest.mark.asyncio(loop_scope="module")
@pytest.mark.parametrize(
    "category",
    [
        "culinary",
        "adventure",
        "beaches",
        "culture",
        "technology",
    ],
)
async def test_explore_filter_by_category(category):
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app),
        base_url="http://testserver",
    ) as client:
        response = await client.get(
            "/api/v1/explore/destinations",
            params={
                "category": category,
                "limit": 100,
            },
        )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] > 0
    assert len(data["items"]) == data["total"]
    assert len(data["items"]) <= 100


@pytest.mark.asyncio(loop_scope="module")
async def test_explore_popular_returns_all_destinations():
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app),
        base_url="http://testserver",
    ) as client:
        popular_response = await client.get(
            "/api/v1/explore/destinations",
            params={
                "category": "popular",
                "limit": 100,
            },
        )

        all_response = await client.get(
            "/api/v1/explore/destinations",
            params={"limit": 100},
        )

    assert popular_response.status_code == 200
    assert all_response.status_code == 200

    popular_data = popular_response.json()
    all_data = all_response.json()

    assert popular_data["total"] == all_data["total"]

    assert {
        item["wikidata_id"]
        for item in popular_data["items"]
    } == {
        item["wikidata_id"]
        for item in all_data["items"]
    }


@pytest.mark.asyncio(loop_scope="module")
async def test_explore_category_with_search():
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app),
        base_url="http://testserver",
    ) as client:
        response = await client.get(
            "/api/v1/explore/destinations",
            params={
                "category": "culinary",
                "search": "tOkYo",
            },
        )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 1
    assert len(data["items"]) == 1
    assert data["items"][0]["wikidata_id"] == "Q1490"


@pytest.mark.asyncio(loop_scope="module")
async def test_explore_category_with_country():
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app),
        base_url="http://testserver",
    ) as client:
        response = await client.get(
            "/api/v1/explore/destinations",
            params={
                "category": "culture",
                "country_code": "JPN",
            },
        )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 2

    assert {
        item["wikidata_id"]
        for item in data["items"]
    } == {"Q1490", "Q34600"}


@pytest.mark.asyncio(loop_scope="module")
async def test_explore_category_pagination_total():
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app),
        base_url="http://testserver",
    ) as client:
        response = await client.get(
            "/api/v1/explore/destinations",
            params={
                "category": "beaches",
                "limit": 2,
                "offset": 0,
            },
        )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 8
    assert data["limit"] == 2
    assert data["offset"] == 0
    assert len(data["items"]) == 2


@pytest.mark.asyncio(loop_scope="module")
async def test_explore_invalid_category():
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app),
        base_url="http://testserver",
    ) as client:
        response = await client.get(
            "/api/v1/explore/destinations",
            params={"category": "unknown"},
        )

    assert response.status_code == 422


@pytest.mark.asyncio(loop_scope="module")
async def test_explore_filter_by_interest():
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app),
        base_url="http://testserver",
    ) as client:
        response = await client.get(
            "/api/v1/explore/destinations",
            params={
                "interest": "culinary",
                "limit": 100,
            },
        )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 26
    assert len(data["items"]) == 26


@pytest.mark.asyncio(loop_scope="module")
async def test_explore_combined_category_and_interest():
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app),
        base_url="http://testserver",
    ) as client:
        response = await client.get(
            "/api/v1/explore/destinations",
            params={
                "category": "beaches",
                "interest": "culinary",
                "limit": 100,
            },
        )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 5
    assert len(data["items"]) == 5


@pytest.mark.asyncio(loop_scope="module")
async def test_explore_combined_filters_pagination():
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app),
        base_url="http://testserver",
    ) as client:
        response = await client.get(
            "/api/v1/explore/destinations",
            params={
                "category": "beaches",
                "interest": "culinary",
                "limit": 2,
                "offset": 0,
            },
        )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 5
    assert data["limit"] == 2
    assert data["offset"] == 0
    assert len(data["items"]) == 2


@pytest.mark.asyncio(loop_scope="module")
async def test_explore_popular_with_interest():
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app),
        base_url="http://testserver",
    ) as client:
        response = await client.get(
            "/api/v1/explore/destinations",
            params={
                "category": "popular",
                "interest": "culture",
                "limit": 100,
            },
        )

        interest_only_response = await client.get(
            "/api/v1/explore/destinations",
            params={
                "interest": "culture",
                "limit": 100,
            },
        )

    assert response.status_code == 200
    assert interest_only_response.status_code == 200

    data = response.json()
    interest_only_data = interest_only_response.json()

    assert data["total"] == interest_only_data["total"]

    assert {
        item["wikidata_id"]
        for item in data["items"]
    } == {
        item["wikidata_id"]
        for item in interest_only_data["items"]
    }


@pytest.mark.asyncio(loop_scope="module")
async def test_explore_invalid_interest():
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app),
        base_url="http://testserver",
    ) as client:
        response = await client.get(
            "/api/v1/explore/destinations",
            params={"interest": "unknown"},
        )

    assert response.status_code == 422


@pytest.mark.asyncio(loop_scope="module")
async def test_explore_filter_by_nature_interest():
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app),
        base_url="http://testserver",
    ) as client:
        response = await client.get(
            "/api/v1/explore/destinations",
            params={
                "interest": "nature",
                "limit": 100,
            },
        )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 7
    assert len(data["items"]) == 7

    names = {
        item["name"]
        for item in data["items"]
    }

    assert "Cape Town" in names
    assert "Vancouver" in names