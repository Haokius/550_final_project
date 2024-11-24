from fastapi import HTTPException, APIRouter
from sqlmodel import SQLModel, Field, Session, create_engine, text
from typing import List, Dict

class Company(SQLModel, table=True):
    ticker: str = Field(primary_key=True)
    companyname: str
    cik: str

class Financial(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    cik: str
    year: int
    month: int
    accounts_payable_current: float = None
    assets: float
    liabilities: float
    cash_and_equivalents: float = None
    accounts_receivable_current: float = None
    inventory_net: float = None
    long_term_debt: float = None

class StockPrice(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    open: float
    high: float
    low: float
    close: float
    volume: int
    ticker: str
    year: int
    month: int
    day: int


# Database setup (Replace `sqlite:///example.db` with your actual database URL)
DATABASE_URL = "postgresql://jit_team:20241126chris@database-final-project.cftba7ofekj0.us-east-1.rds.amazonaws.com:5432/postgres"
engine = create_engine(DATABASE_URL)


# Create the FastAPI router
general_router = APIRouter(
    prefix="/api",
    tags=["api"],
)


@general_router.get("/stocks", response_model=List[Dict])
async def get_top_stocks():
    """
    Returns the top 10 stocks ranked by their average closing price, 
    along with the highest, lowest, and average closing prices, 
    company name, and financial details.
    """
    query = """
    WITH StockPriceStats AS (
        SELECT S.ticker,
               MAX(S.high) AS highest_price,
               MIN(S.low) AS lowest_price,
               AVG(S.close) AS avg_close
        FROM stock_prices S
        GROUP BY S.ticker
    )
    SELECT 
        S.ticker, 
        C.cik, 
        C.companyname, 
        S.highest_price, 
        S.lowest_price, 
        S.avg_close, 
        F.assets, 
        F.liabilities
    FROM StockPriceStats S
    JOIN companies C ON S.ticker = C.ticker
    JOIN financials F ON C.cik = F.cik
    ORDER BY S.avg_close DESC
    LIMIT 10;
    """
    try:
        with Session(engine) as session:
            results = session.exec(text(query)).all()
            if not results:
                raise HTTPException(status_code=404, detail="No data found")
            return [
                {
                    "ticker": row.ticker,
                    "cik": row.cik,
                    "companyname": row.companyname,
                    "highest_price": row.highest_price,
                    "lowest_price": row.lowest_price,
                    "avg_close": row.avg_close,
                    "assets": row.assets,
                    "liabilities": row.liabilities,
                }
                for row in results
            ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching data: {e}")

@general_router.get("/companies/high_cash_reserves", response_model=List[Dict])
async def get_companies_high_cash_reserves():
    """
    Returns companies where cash reserves exceed half of liabilities, along with
    a rolling average of cash reserves over the last three periods.
    """
    query = """
    WITH FinancialStats AS (
       SELECT F.cik, F.assets, F.liabilities, F.cash_and_equivalents,
              AVG(F.cash_and_equivalents) OVER (
                  PARTITION BY F.cik ORDER BY F.year, F.month 
                  ROWS BETWEEN 3 PRECEDING AND CURRENT ROW
              ) AS rolling_avg_cash
       FROM financials F
    )
    SELECT F.cik, C.companyname, F.assets, F.liabilities, F.cash_and_equivalents, F.rolling_avg_cash
    FROM FinancialStats F
    JOIN companies C ON CAST(F.cik AS VARCHAR) = CAST(C.cik AS VARCHAR)
    WHERE F.cash_and_equivalents > (0.5 * F.liabilities)
    ORDER BY F.cash_and_equivalents DESC
    LIMIT 10;
    """
    try:
        with Session(engine) as session:
            results = session.exec(text(query)).all()
            if not results:
                raise HTTPException(status_code=404, detail="No data found")
            return [
                {
                    "cik": row.cik,
                    "companyname": row.companyname,
                    "assets": row.assets,
                    "liabilities": row.liabilities,
                    "cash_and_equivalents": row.cash_and_equivalents,
                    "rolling_avg_cash": row.rolling_avg_cash,
                }
                for row in results
            ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching data: {e}")

@general_router.get("/companies/debt_to_asset_ratio", response_model=List[Dict])
async def get_companies_debt_to_asset_ratio():
    """
    Returns companies' debt-to-asset ratios along with average stock price volatility.
    """
    query = """
    WITH DebtRatios AS (
       SELECT CAST(F.cik AS VARCHAR) AS cik,
              (F.long_term_debt / NULLIF(F.assets, 0)) AS debt_to_asset_ratio
       FROM financials F
       WHERE F.assets > 0 AND F.long_term_debt IS NOT NULL
    )
    SELECT D.cik, C.companyname, S.ticker, D.debt_to_asset_ratio, AVG(S.high - S.low) AS avg_volatility
    FROM DebtRatios D
    JOIN companies C ON D.cik = CAST(C.cik AS VARCHAR)
    JOIN stock_prices S ON C.ticker = S.ticker
    GROUP BY D.cik, C.companyname, S.ticker, D.debt_to_asset_ratio
    ORDER BY avg_volatility DESC
    LIMIT 10;
    """
    try:
        with Session(engine) as session:
            results = session.exec(text(query)).all()
            if not results:
                raise HTTPException(status_code=404, detail="No data found")
            return [
                {
                    "cik": row.cik,
                    "companyname": row.companyname,
                    "ticker": row.ticker,
                    "debt_to_asset_ratio": row.debt_to_asset_ratio,
                    "avg_volatility": row.avg_volatility,
                }
                for row in results
            ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching data: {e}")

@general_router.get("/companies/high_cash_minimal_debt", response_model=List[Dict])
async def get_companies_high_cash_minimal_debt():
    """
    Returns companies with cash reserves over $50 million and long-term debt under $10 million,
    along with the highest recorded closing stock price.
    """
    query = """
    SELECT F.cik, C.companyname, S.ticker, F.cash_and_equivalents, F.long_term_debt, 
           MAX(S.close) AS max_close_price
    FROM financials F
    JOIN companies C ON CAST(F.cik AS VARCHAR) = CAST(C.cik AS VARCHAR)
    JOIN stock_prices S ON C.ticker = S.ticker
    WHERE F.cash_and_equivalents > 50000000
      AND F.long_term_debt < 10000000
    GROUP BY F.cik, C.companyname, S.ticker, F.cash_and_equivalents, F.long_term_debt
    ORDER BY max_close_price DESC
    LIMIT 10;
    """
    try:
        with Session(engine) as session:
            results = session.exec(text(query)).all()
            if not results:
                raise HTTPException(status_code=404, detail="No data found")
            return [
                {
                    "cik": row.cik,
                    "companyname": row.companyname,
                    "ticker": row.ticker,
                    "cash_and_equivalents": row.cash_and_equivalents,
                    "long_term_debt": row.long_term_debt,
                    "max_close_price": row.max_close_price,
                }
                for row in results
            ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching data: {e}")

@general_router.get("/stocks/monthly_avg_close", response_model=List[Dict])
async def get_stocks_monthly_avg_close():
    """
    Returns the top 10 months with the highest average closing prices for stocks.
    """
    query = """
    WITH MonthlyAverages AS (
    SELECT S.ticker,
            DATE_TRUNC('month', DATE(S.year || '-' || S.month || '-01')) AS month,  -- Use '01' as a placeholder for day
            AVG(S.close) AS monthly_avg_close
    FROM stock_prices S
    GROUP BY S.ticker, S.year, S.month  -- No need for S.day
    ),
    RankedMonthlyAverages AS (
    SELECT ticker, month, monthly_avg_close,
            RANK() OVER (ORDER BY monthly_avg_close DESC) AS rank
    FROM MonthlyAverages
    )
    SELECT ticker, month, monthly_avg_close
    FROM RankedMonthlyAverages
    WHERE rank <= 10;
    """
    try:
        with Session(engine) as session:
            results = session.exec(text(query)).all()
            if not results:
                raise HTTPException(status_code=404, detail="No data found")
            return [
                {
                    "ticker": row.ticker,
                    "month": row.month,
                    "monthly_avg_close": row.monthly_avg_close,
                }
                for row in results
            ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching data: {e}")
