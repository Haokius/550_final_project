import requests
from bs4 import BeautifulSoup
import json

def run():
    url = "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies"
    headers = {"User-Agent": "Chrome/58.0.3029.110 Safari/537.3"}

    html = requests.get(url, headers).text

    soup = BeautifulSoup(html, "html.parser")

    table = soup.body.find("table")
    table_body = table.find("tbody")
    unfiltered_list = table_body.find_all("tr")
    
    filtered_list = []
    for row in unfiltered_list[1:]:
        data = row.find_all("td")
        ticker = data[0].text.strip()
        name = data[1].text.strip()
        cik = data[6].text.strip()
        filtered_list.append({"name": name, "ticker": ticker, "cik": cik})
    
    try:
        with open("backend/scraping/company_tickers_and_ciks.json", "w") as file:
            json.dump(filtered_list, file, indent=4)
    except Exception as e:
        print(f"An error occured: {e}")

if __name__ == "__main__":
    run()