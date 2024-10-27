import requests
from bs4 import BeautifulSoup
import time

def get_sp500_ciks():
    url = "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    table = soup.find('table', {'id': 'constituents'})
    company_ciks = []
    
    for row in table.find_all('tr')[1:]:
        ticker = row.find_all('td')[0].text.strip()
        name = row.find_all('td')[1].text.strip()
        cik = row.find_all('td')[6].text.strip()
        company_ciks.append((ticker, name, cik))
    
    return company_ciks

def fetch_data(ticker, name, cik, email):
    url = f"https://data.sec.gov/api/xbrl/companyfacts/CIK{cik}.json"
    headers = {"User-Agent": "Dummy Company " + email,
                "Accept-Encoding": "gzip, deflate",
                "Host": "www.sec.gov"
            }
    response = requests.get(url, headers=headers)
    print(response.status_code, response.text)

if __name__ == "__main__":
    company_ciks = get_sp500_ciks()
    # NOTE: SET YOUR OWN EMAIL HERE
    email = "haokunkevinhe@gmail.com"
    output_data = []
    for ticker, name, cik in company_ciks[:1]:
        fetch_data(ticker, name, cik, email)
        time.sleep(10)