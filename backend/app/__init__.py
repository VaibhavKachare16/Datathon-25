from flask import Flask
import joblib
import os
import pickle
import pandas as pd
# from lightfm.data import Dataset

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
feature_names_data_path = os.path.join(BASE_DIR, "feature_names.txt")
# user_product_interaction_data_path = os.path.join(BASE_DIR, "user_product_interactions_large.csv")

sales_model_path = os.path.join(BASE_DIR, "sales_prediction_model.joblib")
sales_encoders_path = os.path.join(BASE_DIR, "label_encoders.joblib")
sales_scaler_path = os.path.join(BASE_DIR, "scaler.joblib")

sales_model = joblib.load(sales_model_path)
sales_encoders = joblib.load(sales_encoders_path)
sales_scaler = joblib.load(sales_scaler_path)

# user_product_interaction_data = pd.read_csv(user_product_interaction_data_path)
# user_product_interaction_data = Dataset()
# user_product_interaction_data.fit(
#     users=user_product_interaction_data["user_id"].unique(),
#     items=user_product_interaction_data["product_id"].unique()
# ) 

# product_recommendation_model_path = os.path.join(BASE_DIR, "lightfm_model.pkl")


with open(feature_names_data_path, 'r') as f:
    feature_names = f.read().split(',')

# with open(product_recommendation_model_path, "rb") as f:
#     product_recommendation_model = pickle.load(f)


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

    from .views import views
    app.register_blueprint(views, url_prefix='/')

    return app