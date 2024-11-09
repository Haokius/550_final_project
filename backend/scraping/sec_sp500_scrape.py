import requests
from bs4 import BeautifulSoup
from sec_edgar_api import EdgarClient
import json
from collections import defaultdict
import time
from tqdm import tqdm

email = "haokunkevinhe@gmail.com" # NOTE: SET YOUR OWN EMAIL HERE

def get_sp500_ciks():
    url = "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    table = soup.find('table', {'id': 'constituents'})
    company_ciks = []
    cik_to_company = dict()
    
    for row in table.find_all('tr')[1:]:
        ticker = row.find_all('td')[0].text.strip()
        name = row.find_all('td')[1].text.strip()
        cik = int(row.find_all('td')[6].text.strip())
        company_ciks.append(cik)
        cik_to_company[cik] = (ticker, name)
    
    return company_ciks, cik_to_company

company_ciks, cik_to_company = get_sp500_ciks()
company_ciks = set(company_ciks)

def process(response):
    processed_chunk = {"ccp": response["ccp"], "feature": response["tag"], "data": []}
    data = response["data"]
    discovered = set()
    for company in data:
        if (cik := company["cik"]) in company_ciks:
            processed_chunk["data"].append((cik, company["val"]))
            discovered.add(cik)
    undiscovered = company_ciks.difference(discovered)
    for undiscovered_cik in undiscovered:
        processed_chunk["data"].append((undiscovered_cik, None))
    processed_chunk["data"].sort(key=lambda x: x[0])
    return processed_chunk

def get_company_frames(feature: str):
    output_data = []
    edgar = EdgarClient(user_agent=f"DummyCompany {email}")
    for year in tqdm(range(2010, 2021)):
        for quarter in tqdm(range(1, 5)):
            response = edgar.get_frames(year=year, quarter=quarter, taxonomy="us-gaap", tag=feature, unit="USD")
            processed_response = process(response)
            output_data.append(processed_response)
    
    with open(f"frames_data_{feature}.json", "w") as f:
        json.dump(output_data, f, indent=4)

features = [
    "RevenueFromContractWithCustomerExcludingAssessedTax",
    "NetIncomeLoss",
    "Assets",
    "Liabilities",
    "OperatingIncomeLoss",
    "CashAndCashEquivalentsAtCarryingValue",
    "AccountsReceivableNetCurrent",
    "InventoryNet",
    "LongTermDebt",
    "ComprehensiveIncomeNetOfTax"
    ]

def main():
    for feature in features:
        get_company_frames(feature)

if __name__ == "__main__":
    main()


# Top 10 important features:
# 1. RevenueFromContractWithCustomerExcludingAssessedTax - Represents the company's revenue.
# 2. NetIncomeLoss - Shows the net profitability of the company.
# 3. Assets - Indicates the total value of assets owned by the company.
# 4. Liabilities - Reflects the company's financial obligations.
# 5. OperatingIncomeLoss - Key indicator of operational efficiency.
# 6. CashAndCashEquivalentsAtCarryingValue - Shows liquidity and cash reserves.
# 7. AccountsReceivableNetCurrent - Demonstrates the company's expected cash inflows.
# 8. InventoryNet - Important for understanding product stock and sales dynamics.
# 9. LongTermDebt - Represents the company's long-term financial obligations.
# 10. ComprehensiveIncomeNetOfTax - Captures total earnings, including other comprehensive income.

