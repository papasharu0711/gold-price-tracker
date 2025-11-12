from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import json
import time
from datetime import datetime

def scrape_latest_gold_prices():
    """
    한국금거래소에서 최신 금 시세 데이터 크롤링
    """
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
    
    all_data = []
    
    try:
        print("Chrome 드라이버 시작...")
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
        
        url = "https://www.koreagoldx.co.kr/price/gold"
        driver.get(url)
        
        print("페이지 로딩 중...")
        time.sleep(3)
        
        wait = WebDriverWait(driver, 10)
        table = wait.until(EC.presence_of_element_located((By.ID, "example-table")))
        
        # 최근 1개월 데이터만 수집
        print("최신 데이터 수집 중...")
        
        # 현재 페이지의 데이터만 추출 (최신 데이터)
        rows = driver.find_elements(By.CSS_SELECTOR, ".tabulator-row")
        
        for row in rows[:30]:  # 최근 30개만
            try:
                cells = row.find_elements(By.CSS_SELECTOR, ".tabulator-cell")
                
                if len(cells) >= 5:
                    date = cells[0].text.strip()
                    s_pure = cells[1].text.strip().replace(',', '')
                    p_pure = cells[2].text.strip().replace(',', '')
                    p_18k = cells[3].text.strip().replace(',', '')
                    p_14k = cells[4].text.strip().replace(',', '')
                    
                    if date and s_pure:
                        data_row = {
                            'date': date,
                            'buyPure': int(s_pure) if s_pure.isdigit() else 0,
                            'sellPure': int(p_pure) if p_pure.isdigit() else 0,
                            'sell18K': int(p_18k) if p_18k.isdigit() else 0,
                            'sell14K': int(p_14k) if p_14k.isdigit() else 0,
                            'timestamp': datetime.now().isoformat()
                        }
                        all_data.append(data_row)
                        
            except Exception as e:
                continue
        
        driver.quit()
        print(f"✓ {len(all_data)}개의 데이터 수집 완료")
        
    except Exception as e:
        print(f"오류 발생: {str(e)}")
        if 'driver' in locals():
            driver.quit()
    
    return all_data

def save_to_json(data, filepath='data/gold-prices.json'):
    """
    데이터를 JSON 파일로 저장
    """
    # 기존 데이터 로드
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            existing_data = json.load(f)
    except:
        existing_data = []
    
    # 새 데이터 추가 (중복 제거)
    existing_dates = {item['date'] for item in existing_data}
    new_items = [item for item in data if item['date'] not in existing_dates]
    
    combined_data = new_items + existing_data
    
    # 최근 1년치만 유지 (약 365개)
    combined_data = combined_data[:365]
    
    # 파일 저장
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(combined_data, f, ensure_ascii=False, indent=2)
    
    print(f"✓ 데이터 저장 완료: {filepath}")
    print(f"  - 새로 추가: {len(new_items)}개")
    print(f"  - 전체 데이터: {len(combined_data)}개")

if __name__ == "__main__":
    print("=" * 60)
    print("금 시세 크롤링 시작")
    print("=" * 60)
    
    gold_data = scrape_latest_gold_prices()
    
    if gold_data:
        save_to_json(gold_data)
    else:
        print("수집된 데이터가 없습니다.")
