from bs4 import BeautifulSoup
import requests
import json

# Function to extract price from HTML
def get_price(soup_element):
    price = soup_element.find('main').find('div', 'AHmHk').get_text()
    return price

# Function to extract price change percentage from HTML
def get_change_percentage(soup_element):
    change_percentage_element = soup_element.find('main').find('div', 'JwB6zf')
    if change_percentage_element:
        return change_percentage_element.get_text()
    else:
        return None

# Function to extract stock title from HTML
def get_stock_title(soup_element):
    title = soup_element.find('main').find('div', 'zzDege').get_text()
    return title

# Function to extract stock description from HTML
def get_stock_description(soup_element):
    # Extracting detailed stock description
    description_elements = soup_element.find_all("div", {"class": "gyFHrc"})
    stock_description = {}

    for element in description_elements:
        description = element.find("div", {"class": "mfs7Fc"}).get_text()
        value = element.find("div", {"class": "P6K39c"}).get_text()
        stock_description[description] = value

    return stock_description

# Function to get HTML content from Google Finance URL
def get_finance_html(ticker):
    url = f"https://www.google.com/finance/quote/{ticker}"
    response = requests.get(url)
    return response.text

# Function to extract finance information from HTML
def extract_finance_information_from_html(html, ticker):
    soup = BeautifulSoup(html, 'html.parser')
    price = get_price(soup)
    change_percentage = get_change_percentage(soup)
    title = get_stock_title(soup)
    description = get_stock_description(soup)
    finance_data = {
        'ticker': ticker,
        'title': title,
        'price': price,
        'change_percentage': change_percentage,
        'description': description
    }
    return finance_data

fortune_500_tickers = [
    "AAPL:NASDAQ",   # Apple Inc.
    "MSFT:NASDAQ",   # Microsoft Corporation
    "AMZN:NASDAQ",   # Amazon.com, Inc.
    "GOOGL:NASDAQ",  # Alphabet Inc. (Class A)
    "GOOG:NASDAQ",   # Alphabet Inc. (Class C)
    "BRK.B:NYSE",    # Berkshire Hathaway Inc. (Class B)
    "TSLA:NASDAQ",   # Tesla, Inc.
    "JNJ:NYSE",      # Johnson & Johnson
    "WMT:NYSE",      # Walmart Inc.
    "JPM:NYSE",      # JPMorgan Chase & Co.
    "V:NYSE",        # Visa Inc.
    "PG:NYSE",       # Procter & Gamble Co.
    "NVDA:NASDAQ",   # NVIDIA Corporation
    "HD:NYSE",       # The Home Depot, Inc.
    "DIS:NYSE",      # The Walt Disney Company
    "MA:NYSE",       # Mastercard Incorporated
    "PYPL:NASDAQ",   # PayPal Holdings, Inc.
    "XOM:NYSE",      # Exxon Mobil Corporation
    "KO:NYSE",       # The Coca-Cola Company
    "PEP:NASDAQ",    # PepsiCo, Inc.
    "VZ:NYSE",       # Verizon Communications Inc.
    "NFLX:NASDAQ",   # Netflix, Inc.
    "ADBE:NASDAQ",   # Adobe Inc.
    "CSCO:NASDAQ",   # Cisco Systems, Inc.
    "PFE:NYSE",      # Pfizer Inc.
    "INTC:NASDAQ",   # Intel Corporation
    "T:NYSE",        # AT&T Inc.
    "BA:NYSE",       # The Boeing Company
    "CRM:NYSE",      # Salesforce, Inc.
    "MRK:NYSE",      # Merck & Co., Inc.
    "ORCL:NYSE",     # Oracle Corporation
    "COST:NASDAQ",   # Costco Wholesale Corporation
    "CVX:NYSE",      # Chevron Corporation
    "NKE:NYSE",      # Nike, Inc.
    "UPS:NYSE",      # United Parcel Service, Inc.
    "MCD:NYSE",      # McDonald's Corporation
    "LLY:NYSE",      # Eli Lilly and Company
    "ABT:NYSE",      # Abbott Laboratories
    "TGT:NYSE",      # Target Corporation
    "UNH:NYSE",      # UnitedHealth Group Incorporated
    "MMM:NYSE",      # 3M Company
    "IBM:NYSE",      # International Business Machines Corporation (IBM)
    "GS:NYSE",       # The Goldman Sachs Group, Inc.
    "GE:NYSE",       # General Electric Company
    "QCOM:NASDAQ",   # Qualcomm Incorporated
    "MDT:NYSE",      # Medtronic plc
    "SBUX:NASDAQ",   # Starbucks Corporation
    "AMGN:NASDAQ",   # Amgen Inc.
    "LMT:NYSE",      # Lockheed Martin Corporation
    "BLK:NYSE",      # BlackRock, Inc.
    "LOW:NYSE",      # Lowe's Companies, Inc.
    "CAT:NYSE",      # Caterpillar Inc.
]

# Main function to extract data from multiple Google Finance URLs
def main():
    finance_results = []
    for ticker in fortune_500_tickers:
        html_content = get_finance_html(ticker)
        finance_data = extract_finance_information_from_html(html_content, ticker)
        finance_results.append(finance_data)
    with open('finance_data.json', 'w') as f:
        json.dump(finance_results, f, indent=4)

if __name__ == "__main__":
    main()