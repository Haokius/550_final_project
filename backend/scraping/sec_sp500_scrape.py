import requests
from bs4 import BeautifulSoup
from sec_edgar_api import EdgarClient
import json
from collections import defaultdict
import time
from tqdm import tqdm

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
        company_ciks.append((ticker, name, str(int(cik))))
    
    return company_ciks

company_ciks = get_sp500_ciks()

def process_feature(feature_data):
    try:
        processed = {
            "label": feature_data["label"],
            "description": feature_data["description"],
            "values": []
        }
        total_rows = 0
        for entry in feature_data["units"]["USD"]:
            if not entry["val"] or not entry["fy"] or not entry["fp"] or not entry["form"]:
                continue
            processed["values"].append({
                "val": entry["val"],
                "fiscal_year": entry["fy"],
                "fiscal_period": entry["fp"],
                "form": entry["form"],
                "frame": entry.get("frame", None)
            })
            total_rows += 1
        return processed, total_rows
    except Exception as e:
        print(f"Error processing feature: {feature_data["label"]}")
        print(e)
        return None

email = "haokunkevinhe@gmail.com" # NOTE: SET YOUR OWN EMAIL HERE

def get_company_frames():
    output_data = []
    edgar = EdgarClient(user_agent=f"DummyCompany {email}")
    for year in tqdm(range(2010, 2021)):
        for quarter in tqdm(range(1, 5)):
            time.sleep(5)
            response = edgar.get_frames(year=year, quarter=quarter, taxonomy="us-gaap", tag="AccountsPayableCurrent", unit="USD")
            output_data.append(response)
    
    with open("frames_data.json", "w") as f:
        json.dump(output_data, f, indent=4)

get_company_frames()

def get_company_facts():
    output_data = [{"total_rows_of_everything": 0}]
    incomplete_companies = []
    edgar = EdgarClient(user_agent=f"DummyCompany {email}")

    frequency = defaultdict(int)
    for ticker, name, cik in company_ciks[:30]:
        time.sleep(5)
        company_data = {}
        response = edgar.get_company_facts(cik=cik)
        cik = response["cik"]
        entity_name = response["entityName"]
        
        company_data = {"cik": cik, "entity_name": entity_name, "ticker": ticker, "name": name, "total_rows": 0}
        
        facts = response["facts"]
        us_gaap = facts["us-gaap"]
        
        for feature in us_gaap.keys():
            frequency[feature] += 1
        
        features_to_names = {
            "RevenueFromContractWithCustomerExcludingAssessedTax": "revenue",
            "NetIncomeLoss": "net_income",
            "Assets": "assets",
            "Liabilities": "liabilities",
            "OperatingIncomeLoss": "operating_income",
            "CashAndCashEquivalentsAtCarryingValue": "cash_and_equivalents",
            "AccountsReceivableNetCurrent": "accounts_receivable",
            "InventoryNet": "inventory",
            "LongTermDebt": "long_term_debt",
            "ComprehensiveIncomeNetOfTax": "comprehensive_income"
        }
        
        total_rows = 0
        for feature, name in features_to_names.items():
            feature_data = us_gaap.get(feature, None)
            if feature_data:
                company_data[name], rows = process_feature(feature_data)
                total_rows += rows
            else:
                incomplete_companies.append({"ticker": ticker, "feature": feature, "cik": cik})
        company_data["total_rows"] = total_rows
        output_data[0]["total_rows_of_everything"] += total_rows
        output_data.append(company_data)

    new_frequency = {}
    for frequency, count in frequency.items():
        if count == 20:
            new_frequency[frequency] = count

    with open("frequency.json", "w") as f:
        json.dump(new_frequency, f, indent=4)

    with open("incomplete_companies.json", "w") as f:
        json.dump(incomplete_companies, f, indent=4)

    with open("sp500_data.json", "w") as f:
        json.dump(output_data, f, indent=4)

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

