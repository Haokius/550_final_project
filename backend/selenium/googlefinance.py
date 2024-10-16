import requests
import bs4 as beautifulsoup

# NOTE: Not too sure how to access search bar for google finance yet

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