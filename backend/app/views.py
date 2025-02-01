from flask import Blueprint, jsonify, request, make_response
import numpy as np
from sklearn.cluster import KMeans
from scipy.spatial import ConvexHull
import traceback
import pandas as pd

from app import feature_names, sales_model, sales_encoders, sales_scaler

views = Blueprint('views', __name__)

category_map = {'Clothing': 0, 'Electronics': 1, 'Furniture': 2, 'Groceries': 3, 'Toys': 4}

category_offers = {
    "Electronics": [
        {"discount": "20% off", "min_purchase": 500, "description": "Big savings on premium electronics"},
        {"discount": "10% off", "min_purchase": 200, "description": "Standard electronics discount"},
        {"discount": "₹500 off", "min_purchase": 300, "description": "Fixed amount savings"}
    ],
    "Furniture": [
        {"discount": "15% off", "min_purchase": 1000, "description": "Home makeover savings"},
        {"discount": "Free delivery", "min_purchase": 500, "description": "No shipping costs"},
        {"discount": "₹1000 off", "min_purchase": 800, "description": "Big furniture discount"}
    ],
    "Clothing": [
        {"discount": "Buy 2 Get 1 Free", "min_purchase": 100, "description": "Triple the style"},
        {"discount": "30% off", "min_purchase": 200, "description": "Wardrobe refresh savings"},
        {"discount": "₹250 off", "min_purchase": 150, "description": "Fashion discount"}
    ],
    "Toys": [
        {"discount": "25% off", "min_purchase": 100, "description": "Fun savings for kids"},
        {"discount": "Free gift", "min_purchase": 50, "description": "Bonus toy with purchase"},
        {"discount": "15% off", "min_purchase": 75, "description": "Toy box savings"}
    ],
    "Groceries": [
        {"discount": "10% off", "min_purchase": 150, "description": "Grocery savings"},
        {"discount": "5% cashback", "min_purchase": 100, "description": "Money back on essentials"},
        {"discount": "Free item", "min_purchase": 80, "description": "Bonus grocery item"}
    ]
}

@views.route('/predict-sales', methods=['GET'])
def predict_sales():
    """Predict monthly sales for a given product category and discount applied."""
    
    # Get query parameters
    product_category = request.args.get('product_category')
    discount_applied = request.args.get('discount_applied', type=float, default=0.0)

    if not product_category:
        return jsonify({'error': 'Missing product_category parameter'}), 400
    
    product_category = category_map.get(product_category)
    
    # Validate product category
    if product_category not in sales_encoders['product_category'].classes_:
        return jsonify({
            'error': f"Unknown category: {product_category}. Available categories: {list(sales_encoders['product_category'].classes_)}"
        }), 400

    # Encode category and scale discount
    category_encoded = np.where(sales_encoders['product_category'].classes_ == product_category)[0][0]
    discount_scaled = sales_scaler.transform([[discount_applied]])[0][0]

    # Predict for each month of 2022
    sales_predictions_2022 = {}

    for month in range(1, 13):  # Months 1 to 12
        total_sales = 0
        num_weeks = 4 if month == 2 else 5  # Feb has ~4 weeks, others have ~4-5 weeks
        
        for week in range(1, num_weeks + 1):
            sample_input = {
                'month_of_year': month,
                'week_of_year': week,
                'product_category': category_encoded,
                'discount_applied': discount_scaled
            }

            # Create input array in correct order
            input_array = np.array([[sample_input[feature] for feature in feature_names]])

            # Predict weekly sales
            predicted_sales = sales_model.predict(input_array)[0]
            total_sales += predicted_sales  # Sum weekly sales to get monthly sales

        sales_predictions_2022[f'Month {month}'] = float(total_sales)  # Convert to float

    return jsonify({'product_category': product_category, 'sales_predictions_2022': sales_predictions_2022})

# def get_category_based_offers(product_info, user_total_spend=0):
#     category = product_info["product_category"]
#     price = product_info["price"]
    
#     available_offers = category_offers[category]
    
#     applicable_offers = [
#         offer for offer in available_offers
#         if price >= offer["min_purchase"]
#     ]
    
#     if user_total_spend > 1000:
#         applicable_offers.append({
#             "discount": "Extra 5% off",
#             "description": "VIP customer bonus discount",
#             "min_purchase": 0
#         })
    
#     return applicable_offers

# def recommend_products_with_offers(user_id, model, dataset, df, n=5):
#     mappings = dataset.mapping()
#     user_mapping = mappings[0]
#     item_mapping = mappings[2]
    
#     if user_id not in user_mapping:
#         return []
    
#     user_purchases = df[
#         (df["user_id"] == user_id) & 
#         (df["interaction"] == 1)
#     ]
#     user_total_spend = user_purchases["price"].sum()
    
#     item_ids = list(item_mapping.keys())
#     user_index = user_mapping[user_id]
#     scores = model.predict(user_index, np.arange(len(item_ids)))
#     top_items = np.argsort(-scores)[:n]
    
#     recommendations = []
#     for item_index in top_items:
#         product_id = item_ids[item_index]
#         product_info = df[df["product_id"] == product_id].iloc[0].to_dict()
        
#         offers = get_category_based_offers(product_info, user_total_spend)
        
#         recommendations.append({
#             "product_id": product_id,
#             "category": product_info["product_category"],
#             "price": product_info["price"],
#             "offers": offers
#         })
    
#     return recommendations

# @views.route('/recommend', methods=['GET'])
# def recommend():
#     user_id = int(request.args.get('user_id'))
#     num_recommendations = int(request.args.get('n', 5))
#     recommendations = recommend_products_with_offers(user_id, model, dataset, df, num_recommendations)
    
#     if not recommendations:
#         return jsonify({"error": "User not found"}), 404
    
#     return jsonify(recommendations)


def create_sample_data(n_samples=100):
    """Generate sample customer data for demonstration"""
    return pd.DataFrame({
        'customer_id': range(1, n_samples + 1),
        'customer_lat': np.random.uniform(19.01, 19.06, n_samples),
        'customer_lon': np.random.uniform(73.00, 73.04, n_samples),
        'avg_purchase_value': np.random.randint(500, 5000, n_samples),
        'total_transactions': np.random.randint(10, 100, n_samples),
        'clothing_frequency': np.random.randint(0, 100, n_samples),
        'electronics_frequency': np.random.randint(0, 100, n_samples),
        'furniture_frequency': np.random.randint(0, 100, n_samples),
        'groceries_frequency': np.random.randint(0, 100, n_samples),
        'toys_frequency': np.random.randint(0, 100, n_samples),
    })

def get_product_demand_info(cluster_data):
    """Calculate product demand information for a cluster"""
    try:
        product_columns = [
            'clothing_frequency', 'electronics_frequency',
            'furniture_frequency', 'groceries_frequency', 'toys_frequency'
        ]
        
        # Calculate product demands
        sorted_products = []
        for col in product_columns:
            product_name = col.split('_')[0].title()
            demand_value = cluster_data[col].sum() * cluster_data['avg_purchase_value'].mean() / 100
            sorted_products.append((product_name, demand_value))
        
        # Sort by demand value
        sorted_products.sort(key=lambda x: x[1], reverse=True)
        
        # Format as strings with currency
        return [f"{name}: ₹{value:,.2f}" for name, value in sorted_products]
    except Exception as e:
        print(f"Error in get_product_demand_info: {str(e)}")
        return []
    
def process_cluster_data(df, n_clusters=6):
    """Process customer data into clusters with demand analysis"""
    try:
        # Prepare features for clustering
        feature_columns = [
            'customer_lat', 'customer_lon',
            'clothing_frequency', 'electronics_frequency',
            'furniture_frequency', 'groceries_frequency', 'toys_frequency'
        ]
        
        # Normalize features
        features = df[feature_columns]
        features_normalized = (features - features.mean()) / features.std()
        
        # Perform clustering
        kmeans = KMeans(n_clusters=n_clusters, random_state=42)
        df['demand_cluster'] = kmeans.fit_predict(features_normalized)
        
        clusters = []
        optimal_locations = []
        
        # Process each cluster
        for cluster_id in range(n_clusters):
            cluster_df = df[df['demand_cluster'] == cluster_id]
            
            if len(cluster_df) < 3:
                continue
                
            # Calculate cluster boundaries
            coordinates = cluster_df[['customer_lat', 'customer_lon']].values
            hull = ConvexHull(coordinates)
            boundary_points = coordinates[hull.vertices].tolist()
            
            # Calculate weighted centroid
            weighted_lat = np.average(
                cluster_df['customer_lat'],
                weights=cluster_df['avg_purchase_value']
            )
            weighted_lon = np.average(
                cluster_df['customer_lon'],
                weights=cluster_df['avg_purchase_value']
            )
            
            # Get product demand information
            product_demands = get_product_demand_info(cluster_df)
            top_product = product_demands[0].split(":")[0]
            
            # Calculate total demand for top product
            top_product_col = f"{top_product.lower()}_frequency"
            total_top_product_demand = (
                cluster_df[top_product_col].sum() * 
                cluster_df['avg_purchase_value'].mean() / 100
            )
            
            # Calculate total demand as sum of all category demands
            total_demand = sum(
                cluster_df[f'{cat.lower()}_frequency'].sum() * 
                cluster_df['avg_purchase_value'].mean() / 100
                for cat in ['Clothing', 'Electronics', 'Furniture', 'Groceries', 'Toys']
            )
            
            cluster_info = {
                'cluster': int(cluster_id),
                'boundary_points': boundary_points,
                'top_product': top_product,
                'top_product_demand': float(total_top_product_demand),
                'total_demand': float(total_demand),
                'customer_count': int(len(cluster_df))
            }
            clusters.append(cluster_info)
            
            # Store optimal location information
            optimal_locations.append({
                'cluster': int(cluster_id),
                'lat': float(weighted_lat),
                'lon': float(weighted_lon),
                'product_demands': product_demands,
                'total_demand': float(total_demand),
                'customer_count': int(len(cluster_df))
            })
        
        return clusters, optimal_locations, df
        
    except Exception as e:
        print(f"Error in process_cluster_data: {str(e)}")
        raise

@views.route('/api/demand-analysis', methods=['GET'])
def get_demand_analysis():
    try:
        df = create_sample_data()
        clusters, optimal_locations, processed_df = process_cluster_data(df)
        
        # Prepare customer data
        customers = processed_df.apply(lambda row: {
            'id': int(row['customer_id']),
            'lat': float(row['customer_lat']),
            'lon': float(row['customer_lon']),
            'cluster': int(row['demand_cluster']),
            'avg_purchase_value': float(row['avg_purchase_value'])
        }, axis=1).tolist()
        
        response_data = {
            'clusters': clusters,
            'optimal_locations': optimal_locations,
            'customers': customers
        }
        
        return jsonify(response_data)
        
    except Exception as e:
        error_response = {
            'error': str(e),
            'traceback': traceback.format_exc()
        }
        return make_response(jsonify(error_response), 500)