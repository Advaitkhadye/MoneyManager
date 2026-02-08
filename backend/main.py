from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import models, schemas, database
from auth import get_current_user

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to Finance Manager API"}

def predict_category(description: str) -> str:
    try:
        prompt = f"""
        Categorize the following transaction description into one of these categories: 
        Food, Transport, Entertainment, Housing, Utilities, Income, Shopping, Health, Education, Miscellaneous.
        
        Description: "{description}"
        
        Return ONLY the category name.
        """
        response = generate_content_with_retry(model, prompt)
        if response and response.text:
             return response.text.strip()
        else:
             return "Miscellaneous"
    except Exception:
        return "Miscellaneous"

@app.post("/transactions/", response_model=schemas.Transaction)
def create_transaction(transaction: schemas.TransactionCreate, db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    if not transaction.category:
        transaction.category = predict_category(transaction.description or "")
    
    # Exclude undefined fields if any, but properly map to model
    transaction_data = transaction.dict()
    db_transaction = models.Transaction(**transaction_data, user_id=user_id)
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@app.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: int, db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    db_transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id, models.Transaction.user_id == user_id).first()
    if db_transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    db.delete(db_transaction)
    db.commit()
    return {"message": "Transaction deleted"}

@app.put("/transactions/{transaction_id}", response_model=schemas.Transaction)
def update_transaction(transaction_id: int, transaction: schemas.TransactionCreate, db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    db_transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id, models.Transaction.user_id == user_id).first()
    if db_transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    for key, value in transaction.dict().items():
        setattr(db_transaction, key, value)
    
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@app.get("/transactions/", response_model=List[schemas.Transaction])
def read_transactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    transactions = db.query(models.Transaction).filter(models.Transaction.user_id == user_id).offset(skip).limit(limit).all()
    return transactions

from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

import time
import random
from google.api_core import exceptions

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-flash-latest')

def generate_content_with_retry(model, prompt, retries=3, initial_delay=2):
    """
    Generates content with retry mechanism for rate limits (429).
    """
    delay = initial_delay
    for attempt in range(retries):
        try:
            return model.generate_content(prompt)
        except exceptions.ResourceExhausted:
            if attempt < retries - 1:
                sleep_time = delay + random.uniform(0, 1)
                print(f"Rate limit hit. Retrying in {sleep_time:.2f}s...")
                time.sleep(sleep_time)
                delay *= 2  # Exponential backoff
            else:
                raise
        except Exception as e:
             # For other exceptions we might not want to retry, or handle differently
             raise e
    return None

class ChatRequest(BaseModel):
    message: str

@app.post("/chat/")
def chat(request: ChatRequest, db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    try:
        # 1. Fetch recent transactions for context
        recent_transactions = db.query(models.Transaction).filter(
            models.Transaction.user_id == user_id
        ).order_by(models.Transaction.date.desc()).limit(20).all()
        
        transaction_summary = "User's Recent Transactions:\n"
        if recent_transactions:
            for t in recent_transactions:
                transaction_summary += f"- {t.date}: {t.description} ({t.category}) - ₹{t.amount}\n"
        else:
            transaction_summary += "No recent transactions found.\n"
            
        # 2. Construct System Prompt
        system_prompt = f"""
        You are a helpful and professional financial advisor.
        
        {transaction_summary}
        
        User Question: {request.message}
        
        Answer the user's question based on the transaction data provided above.
        - **IMPORTANT**: Use **Markdown** formatting (bolding, lists, headings) to make the answer easy to read.
        - Be conversational, helpful, and professional (like a world-class AI assistant).
        - **ALWAYS** use Indian Rupees (₹) for all currency values.
        - **DO NOT** use Markdown Tables (they break the mobile layout). Use bulleted lists instead.
        - Structure your answer clearly using headings and lists.
        - Keep response to the point but comprehensive enough to be helpful.
        """

        retries = 3
        delay = 2
        
        generated_text = None
        
        for attempt in range(retries):
            try:
                # We use generate_content for single-turn Q&A with context, which is often more stable than start_chat with history for this use case
                response = model.generate_content(system_prompt)
                
                # Robust check for valid response
                if response and response.candidates and response.candidates[0].content.parts:
                     generated_text = response.text
                     break
                elif response and response.prompt_feedback:
                    # Handle safety blocks
                     print(f"Blocked: {response.prompt_feedback}")
                     return {"response": "I cannot answer that usage due to safety guidelines."}
                
            except exceptions.ResourceExhausted:
                 if attempt < retries - 1:
                    sleep_time = delay + random.uniform(0, 1)
                    print(f"Chat Rate limit hit. Retrying in {sleep_time:.2f}s...")
                    time.sleep(sleep_time)
                    delay *= 2
                 else:
                    return {"response": "I'm currently receiving too many requests. Please try again in a minute."}
            except Exception as e:
                # Log the specific error but don't crash
                print(f"Gemini Error: {e}")
                if attempt == retries - 1:
                     return {"response": "I'm having trouble processing that right now. Please try again."}

        if generated_text:
             return {"response": generated_text}
        
        return {"response": "I couldn't generate a response. Please try rephrasing your question."}

    except Exception as e:
        print(f"CRITICAL CHAT ERROR: {e}")
        return {"response": "An internal error occurred. Please try again later."}


@app.get("/profile/", response_model=schemas.UserProfile)
def get_user_profile(db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    profile = db.query(models.UserProfile).filter(models.UserProfile.user_id == user_id).first()
    if not profile:
        profile = models.UserProfile(initial_balance=5000.0, user_id=user_id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@app.put("/profile/", response_model=schemas.UserProfile)
def update_user_profile(profile: schemas.UserProfileUpdate, db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    db_profile = db.query(models.UserProfile).filter(models.UserProfile.user_id == user_id).first()
    if not db_profile:
        db_profile = models.UserProfile(initial_balance=profile.initial_balance, user_id=user_id)
        db.add(db_profile)
    else:
        db_profile.initial_balance = profile.initial_balance
    
    db.commit()
    db.refresh(db_profile)
    return db_profile

