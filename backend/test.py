from app.services.scraper import scrape_url

url = "https://lablab.ai/ai-hackathons/amd-lablab-ai-academy-challenge"

text = scrape_url(url)

print(text)