import os
from urllib.parse import urlparse

from dotenv import load_dotenv
from tavily import TavilyClient


load_dotenv()


TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")

if not TAVILY_API_KEY:
    raise ValueError(
        "TAVILY_API_KEY is not set."
    )


client = TavilyClient(
    api_key=TAVILY_API_KEY
)


def extract_main_page(url: str) -> str:
    """
    Extract the main hackathon page.
    """

    response = client.extract(
        urls=url,
        extract_depth="advanced"
    )

    results = response.get("results", [])

    if not results:
        return ""

    return results[0].get(
        "raw_content",
        ""
    )


def search_hackathon(
    hackathon_name: str,
    original_url: str
) -> list:
    """
    Search the web for additional hackathon information.
    """

    queries = [
        f'"{hackathon_name}" rules requirements',
        f'"{hackathon_name}" judging criteria',
        f'"{hackathon_name}" tracks challenges',
        f'"{hackathon_name}" submission requirements',
        f'"{hackathon_name}" prizes deadline',
    ]

    all_results = []

    for query in queries:

        response = client.search(
            query=query,
            search_depth="advanced",
            max_results=3
        )

        results = response.get(
            "results",
            []
        )

        for result in results:

            result_url = result.get(
                "url",
                ""
            )

            if result_url == original_url:
                continue

            all_results.append({
                "title": result.get(
                    "title",
                    ""
                ),
                "url": result_url,
                "content": result.get(
                    "content",
                    ""
                )
            })


    unique_results = []

    seen_urls = set()

    for result in all_results:

        url = result["url"]

        if url in seen_urls:
            continue

        seen_urls.add(url)

        unique_results.append(
            result
        )

    return unique_results[:12]


def research_hackathon(url: str) -> dict:
    """
    Main CarryJob research pipeline.

    1. Extract the provided URL.
    2. Search for additional information.
    3. Return all gathered research.
    """

    main_content = extract_main_page(
        url
    )


    path = urlparse(url).path

    slug = path.strip(
        "/"
    ).split("/")[-1]

    hackathon_name = slug.replace(
        "-",
        " "
    )

    search_results = search_hackathon(
        hackathon_name,
        url
    )

    return {
        "source_url": url,
        "main_content": main_content,
        "search_results": search_results
    }