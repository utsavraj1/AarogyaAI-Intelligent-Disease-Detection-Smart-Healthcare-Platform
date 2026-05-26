export type FieldOption = { label: string; value: number }

export type Field = {
  name: string
  label: string
  type: 'number' | 'select'
  min?: number
  max?: number
  step?: number
  defaultValue: number
  options?: FieldOption[]
}

export type FieldGroup = {
  title: string
  fields: Field[]
}

export type ModuleConfig = {
  id: string
  label: string
  description: string
  groups: FieldGroup[]
  supportsImage?: boolean
}

const yesNo = [
  { label: 'No', value: 0 },
  { label: 'Yes', value: 1 },
]

export const modules: ModuleConfig[] = [
  {
    id: 'blood_cell',
    label: 'Blood Cell Cancer (ALL)',
    description: 'Upload a blood smear image to analyze malignant cells.',
    groups: [],
    supportsImage: true,
  },
  {
    id: 'heart_disease',
    label: 'Heart Disease',
    description: 'Clinical and ECG features for cardiac risk assessment.',
    groups: [
      {
        title: 'Demographics',
        fields: [
          { name: 'age', label: 'Age', type: 'number', min: 18, max: 100, step: 1, defaultValue: 55 },
          { name: 'sex', label: 'Sex (1=Male, 0=Female)', type: 'select', defaultValue: 1, options: [
            { label: 'Male (1)', value: 1 },
            { label: 'Female (0)', value: 0 },
          ] },
        ],
      },
      {
        title: 'Cardiac assessment',
        fields: [
          { name: 'cp', label: 'Chest pain type', type: 'select', defaultValue: 0, options: [
            { label: 'Typical (0)', value: 0 },
            { label: 'Atypical (1)', value: 1 },
            { label: 'Non-anginal (2)', value: 2 },
            { label: 'Asymptomatic (3)', value: 3 },
          ] },
          { name: 'trestbps', label: 'Resting BP (mmHg)', type: 'number', min: 80, max: 220, step: 1, defaultValue: 130 },
          { name: 'chol', label: 'Cholesterol (mg/dL)', type: 'number', min: 100, max: 600, step: 1, defaultValue: 240 },
          { name: 'thalach', label: 'Max heart rate', type: 'number', min: 60, max: 220, step: 1, defaultValue: 150 },
          { name: 'oldpeak', label: 'ST depression', type: 'number', min: 0, max: 7, step: 0.1, defaultValue: 1 },
          { name: 'ca', label: 'Major vessels (0-3)', type: 'select', defaultValue: 0, options: [
            { label: '0', value: 0 },
            { label: '1', value: 1 },
            { label: '2', value: 2 },
            { label: '3', value: 3 },
          ] },
        ],
      },
      {
        title: 'Lab & ECG',
        fields: [
          { name: 'fbs', label: 'FBS > 120', type: 'select', defaultValue: 0, options: yesNo },
          { name: 'restecg', label: 'Resting ECG', type: 'select', defaultValue: 0, options: [
            { label: 'Normal (0)', value: 0 },
            { label: 'ST (1)', value: 1 },
            { label: 'LVH (2)', value: 2 },
          ] },
          { name: 'exang', label: 'Exercise angina', type: 'select', defaultValue: 0, options: yesNo },
          { name: 'slope', label: 'ST slope', type: 'select', defaultValue: 0, options: [
            { label: 'Up (0)', value: 0 },
            { label: 'Flat (1)', value: 1 },
            { label: 'Down (2)', value: 2 },
          ] },
          { name: 'thal', label: 'Thalassemia', type: 'select', defaultValue: 1, options: [
            { label: 'Normal (1)', value: 1 },
            { label: 'Fixed (2)', value: 2 },
            { label: 'Reversible (3)', value: 3 },
          ] },
        ],
      },
    ],
  },
  {
    id: 'lung_cancer',
    label: 'Lung Cancer',
    description: 'Lifestyle and symptom signals for pulmonary risk screening.',
    groups: [
      {
        title: 'Demographics',
        fields: [
          { name: 'gender', label: 'Gender', type: 'select', defaultValue: 1, options: [
            { label: 'Male (1)', value: 1 },
            { label: 'Female (0)', value: 0 },
          ] },
          { name: 'age', label: 'Age', type: 'number', min: 20, max: 100, step: 1, defaultValue: 55 },
        ],
      },
      {
        title: 'Lifestyle',
        fields: [
          { name: 'smoking', label: 'Smoking', type: 'select', defaultValue: 1, options: [
            { label: 'No (1)', value: 1 },
            { label: 'Yes (2)', value: 2 },
          ] },
          { name: 'alcohol_consuming', label: 'Alcohol', type: 'select', defaultValue: 1, options: [
            { label: 'No (1)', value: 1 },
            { label: 'Yes (2)', value: 2 },
          ] },
          { name: 'yellow_fingers', label: 'Yellow fingers', type: 'select', defaultValue: 1, options: [
            { label: 'No (1)', value: 1 },
            { label: 'Yes (2)', value: 2 },
          ] },
          { name: 'peer_pressure', label: 'Peer pressure', type: 'select', defaultValue: 1, options: [
            { label: 'No (1)', value: 1 },
            { label: 'Yes (2)', value: 2 },
          ] },
          { name: 'anxiety', label: 'Anxiety', type: 'select', defaultValue: 1, options: [
            { label: 'No (1)', value: 1 },
            { label: 'Yes (2)', value: 2 },
          ] },
          { name: 'chronic_disease', label: 'Chronic disease', type: 'select', defaultValue: 1, options: [
            { label: 'No (1)', value: 1 },
            { label: 'Yes (2)', value: 2 },
          ] },
        ],
      },
      {
        title: 'Symptoms',
        fields: [
          { name: 'fatigue', label: 'Fatigue', type: 'select', defaultValue: 1, options: [
            { label: 'No (1)', value: 1 },
            { label: 'Yes (2)', value: 2 },
          ] },
          { name: 'allergy', label: 'Allergy', type: 'select', defaultValue: 1, options: [
            { label: 'No (1)', value: 1 },
            { label: 'Yes (2)', value: 2 },
          ] },
          { name: 'wheezing', label: 'Wheezing', type: 'select', defaultValue: 1, options: [
            { label: 'No (1)', value: 1 },
            { label: 'Yes (2)', value: 2 },
          ] },
          { name: 'coughing', label: 'Coughing', type: 'select', defaultValue: 1, options: [
            { label: 'No (1)', value: 1 },
            { label: 'Yes (2)', value: 2 },
          ] },
          { name: 'shortness_of_breath', label: 'Shortness of breath', type: 'select', defaultValue: 1, options: [
            { label: 'No (1)', value: 1 },
            { label: 'Yes (2)', value: 2 },
          ] },
          { name: 'swallowing_difficulty', label: 'Swallowing difficulty', type: 'select', defaultValue: 1, options: [
            { label: 'No (1)', value: 1 },
            { label: 'Yes (2)', value: 2 },
          ] },
          { name: 'chest_pain', label: 'Chest pain', type: 'select', defaultValue: 1, options: [
            { label: 'No (1)', value: 1 },
            { label: 'Yes (2)', value: 2 },
          ] },
        ],
      },
    ],
  },
  {
    id: 'diabetes',
    label: 'Diabetes',
    description: 'Metabolic indicators and hereditary factors.',
    groups: [
      {
        title: 'Reproductive & metabolic',
        fields: [
          { name: 'Pregnancies', label: 'Pregnancies', type: 'number', min: 0, max: 20, step: 1, defaultValue: 3 },
          { name: 'Glucose', label: 'Glucose (mg/dL)', type: 'number', min: 50, max: 250, step: 1, defaultValue: 120 },
          { name: 'BloodPressure', label: 'Blood pressure (mmHg)', type: 'number', min: 40, max: 130, step: 1, defaultValue: 70 },
          { name: 'SkinThickness', label: 'Skin thickness (mm)', type: 'number', min: 0, max: 99, step: 1, defaultValue: 20 },
        ],
      },
      {
        title: 'Cardiovascular & body',
        fields: [
          { name: 'Insulin', label: 'Insulin (uU/mL)', type: 'number', min: 0, max: 900, step: 1, defaultValue: 79 },
          { name: 'BMI', label: 'BMI', type: 'number', min: 15, max: 70, step: 0.1, defaultValue: 32 },
          { name: 'DiabetesPedigreeFunction', label: 'Diabetes pedigree fn', type: 'number', min: 0, max: 2.5, step: 0.001, defaultValue: 0.471 },
          { name: 'Age', label: 'Age', type: 'number', min: 21, max: 100, step: 1, defaultValue: 33 },
        ],
      },
    ],
  },
  {
    id: 'thyroid',
    label: 'Thyroid Disorder',
    description: 'Hormonal markers and thyroid health indicators.',
    groups: [
      {
        title: 'Demographics & Vitals',
        fields: [
          { name: 'age', label: 'Age', type: 'number', min: 1, max: 100, step: 1, defaultValue: 45 },
          { name: 'sex', label: 'Sex', type: 'select', defaultValue: 1, options: [
            { label: 'Male (1)', value: 1 },
            { label: 'Female (0)', value: 0 },
          ] },
          { name: 'sick', label: 'Sick', type: 'select', defaultValue: 0, options: yesNo },
          { name: 'pregnant', label: 'Pregnant', type: 'select', defaultValue: 0, options: yesNo },
        ],
      },
      {
        title: 'Medications & History',
        fields: [
          { name: 'on thyroxine', label: 'On thyroxine', type: 'select', defaultValue: 0, options: yesNo },
          { name: 'query on thyroxine', label: 'Query on thyroxine', type: 'select', defaultValue: 0, options: yesNo },
          { name: 'on antithyroid medication', label: 'On antithyroid meds', type: 'select', defaultValue: 0, options: yesNo },
          { name: 'thyroid surgery', label: 'Thyroid surgery', type: 'select', defaultValue: 0, options: yesNo },
          { name: 'I131 treatment', label: 'I131 treatment', type: 'select', defaultValue: 0, options: yesNo },
          { name: 'lithium', label: 'Lithium', type: 'select', defaultValue: 0, options: yesNo },
        ],
      },
      {
        title: 'Conditions & Symptoms',
        fields: [
          { name: 'query hypothyroid', label: 'Query hypothyroid', type: 'select', defaultValue: 0, options: yesNo },
          { name: 'query hyperthyroid', label: 'Query hyperthyroid', type: 'select', defaultValue: 0, options: yesNo },
          { name: 'goitre', label: 'Goitre', type: 'select', defaultValue: 0, options: yesNo },
          { name: 'tumor', label: 'Tumor', type: 'select', defaultValue: 0, options: yesNo },
          { name: 'hypopituitary', label: 'Hypopituitary', type: 'select', defaultValue: 0, options: yesNo },
          { name: 'psych', label: 'Psych symptoms', type: 'select', defaultValue: 0, options: yesNo },
        ],
      },
      {
        title: 'Lab Measurements',
        fields: [
          { name: 'TSH measured', label: 'TSH measured', type: 'select', defaultValue: 1, options: yesNo },
          { name: 'TSH', label: 'TSH', type: 'number', min: 0, max: 500, step: 0.01, defaultValue: 1.3 },
          { name: 'T3 measured', label: 'T3 measured', type: 'select', defaultValue: 0, options: yesNo },
          { name: 'TT4 measured', label: 'TT4 measured', type: 'select', defaultValue: 1, options: yesNo },
          { name: 'TT4', label: 'TT4', type: 'number', min: 0, max: 500, step: 0.1, defaultValue: 107 },
          { name: 'T4U measured', label: 'T4U measured', type: 'select', defaultValue: 1, options: yesNo },
          { name: 'T4U', label: 'T4U', type: 'number', min: 0, max: 3, step: 0.01, defaultValue: 1.02 },
          { name: 'FTI measured', label: 'FTI measured', type: 'select', defaultValue: 1, options: yesNo },
          { name: 'FTI', label: 'FTI', type: 'number', min: 0, max: 400, step: 0.1, defaultValue: 105 },
        ],
      },
    ],
  },
  {
    id: 'parkinsons',
    label: "Parkinson's Disease",
    description: 'Voice measurements and nonlinear dynamics.',
    groups: [
      {
        title: 'Frequency measures (Hz)',
        fields: [
          { name: 'MDVP:Fo(Hz)', label: 'MDVP:Fo (avg vocal freq)', type: 'number', min: 80, max: 270, step: 0.001, defaultValue: 154.229 },
          { name: 'MDVP:Fhi(Hz)', label: 'MDVP:Fhi (max vocal freq)', type: 'number', min: 100, max: 600, step: 0.001, defaultValue: 197.105 },
          { name: 'MDVP:Flo(Hz)', label: 'MDVP:Flo (min vocal freq)', type: 'number', min: 60, max: 240, step: 0.001, defaultValue: 116.324 },
        ],
      },
      {
        title: 'Jitter measures',
        fields: [
          { name: 'MDVP:Jitter(%)', label: 'Jitter (%)', type: 'number', min: 0.001, max: 0.05, step: 0.00001, defaultValue: 0.00662 },
          { name: 'MDVP:Jitter(Abs)', label: 'Jitter (Abs)', type: 'number', min: 0.00001, max: 0.0003, step: 0.0000001, defaultValue: 0.0000441 },
          { name: 'MDVP:RAP', label: 'RAP', type: 'number', min: 0.001, max: 0.03, step: 0.00001, defaultValue: 0.00401 },
          { name: 'MDVP:PPQ', label: 'PPQ', type: 'number', min: 0.001, max: 0.03, step: 0.00001, defaultValue: 0.00317 },
          { name: 'Jitter:DDP', label: 'DDP', type: 'number', min: 0.001, max: 0.1, step: 0.00001, defaultValue: 0.01204 },
        ],
      },
      {
        title: 'Shimmer & nonlinear dynamics',
        fields: [
          { name: 'MDVP:Shimmer', label: 'Shimmer', type: 'number', min: 0.01, max: 0.2, step: 0.00001, defaultValue: 0.09799 },
          { name: 'MDVP:Shimmer(dB)', label: 'Shimmer (dB)', type: 'number', min: 0.1, max: 2, step: 0.001, defaultValue: 0.965 },
          { name: 'Shimmer:APQ3', label: 'APQ3', type: 'number', min: 0.001, max: 0.1, step: 0.00001, defaultValue: 0.0069 },
          { name: 'Shimmer:APQ5', label: 'APQ5', type: 'number', min: 0.001, max: 0.15, step: 0.00001, defaultValue: 0.01198 },
          { name: 'MDVP:APQ', label: 'APQ', type: 'number', min: 0.01, max: 0.15, step: 0.00001, defaultValue: 0.01226 },
          { name: 'Shimmer:DDA', label: 'DDA', type: 'number', min: 0.001, max: 0.3, step: 0.00001, defaultValue: 0.02085 },
          { name: 'NHR', label: 'NHR', type: 'number', min: 0.0, max: 0.5, step: 0.00001, defaultValue: 0.00997 },
          { name: 'HNR', label: 'HNR', type: 'number', min: 8, max: 35, step: 0.001, defaultValue: 24.678 },
          { name: 'RPDE', label: 'RPDE', type: 'number', min: 0.2, max: 0.7, step: 0.00001, defaultValue: 0.46886 },
          { name: 'DFA', label: 'DFA', type: 'number', min: 0.5, max: 0.9, step: 0.00001, defaultValue: 0.71826 },
          { name: 'D2', label: 'D2', type: 'number', min: 1, max: 4, step: 0.001, defaultValue: 2.301 },
          { name: 'PPE', label: 'PPE', type: 'number', min: 0.05, max: 0.5, step: 0.00001, defaultValue: 0.28468 },
          { name: 'spread1', label: 'spread1', type: 'number', min: -8, max: -1, step: 0.001, defaultValue: -5.684 },
          { name: 'spread2', label: 'spread2', type: 'number', min: 0, max: 0.5, step: 0.00001, defaultValue: 0.22694 },
        ],
      },
    ],
  },
]
