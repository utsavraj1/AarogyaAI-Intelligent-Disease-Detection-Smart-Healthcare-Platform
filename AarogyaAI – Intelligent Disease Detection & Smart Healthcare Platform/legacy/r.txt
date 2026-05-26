# AI-Powered Medical Diagnosis System

## Sub-Project: Blood Cell Cancer Prediction

## Overview
The **AI-Powered Medical Diagnosis System** is a machine learning-based project designed to assist in the early detection and diagnosis of diseases using medical data. The system leverages deep learning models to analyze medical images or patient data and provide predictive insights.

## Features
- **Automated Disease Detection**: Uses AI to analyze medical images or patient records.
- **Machine Learning Models**: Implements deep learning models like CNNs for image classification.
- **User-Friendly Interface**: Interactive interface for easy input and output visualization.
- **Data Preprocessing & Augmentation**: Enhances dataset quality for better accuracy.
- **Performance Metrics & Evaluation**: Provides accuracy, precision, recall, and F1-score.

## Technologies Used
- **Programming Language**: Python
- **Machine Learning Libraries**: TensorFlow, Keras, PyTorch, Scikit-Learn
- **Data Handling**: Pandas, NumPy
- **Visualization**: Matplotlib, Seaborn
- **Deployment**: Flask/Django (if applicable)

## Installation
To set up the project on your local machine:
```bash
# Clone the repository
git clone https://github.com/utsavraj1/AI-Powered-Medical-Diagnosis-System.git
cd AI-Powered-Medical-Diagnosis-System

# Install required dependencies
pip install -r requirements.txt
```

## Usage
1. Prepare your dataset and place it in the appropriate folder.
2. Train the model using:
   ```bash
   python train_model.py
   ```
3. Evaluate the model using:
   ```bash
   python evaluate.py
   ```
4. Run the prediction script:
   ```bash
   python predict.py --image <image_path>
   ```
5. 3️⃣ Run the app

   ```bash
   streamlit run app.py
   ```

## Dataset
The project uses publicly available medical datasets, such as:
- Kaggle medical datasets (https://www.kaggle.com/datasets/mohammadamireshraghi/blood-cell-cancer-all-4class)
- NIH Chest X-ray dataset
- Other open-source medical image datasets

## Model Performance
The model's accuracy, precision, recall, and F1-score will be evaluated and presented using:
- Confusion Matrix
- ROC-AUC Curve
- Precision-Recall Curve

## Future Enhancements
- Integration with Electronic Health Records (EHR)
- Web-based or mobile app interface
- Real-time diagnosis capabilities

## Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.

## License
This project is licensed under the MIT License.

## Contact
For any queries, contact:
- **Utsav Raj**  
  GitHub: [@utsavraj1](https://github.com/utsavraj1)  
  Email: utshavraj.ur321@gmail.com
  Linkedin: https://www.linkedin.com/in/utsavraj123/
