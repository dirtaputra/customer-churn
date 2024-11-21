const tf = require('@tensorflow/tfjs-node');
const csv = require('csv-parser');
const fs = require('fs');
const readline = require('readline');

// Function to load dataset from CSV
const loadDataset = async (filePath) => {
  const data = [];
  return new Promise((resolve) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        data.push({
          tenure: parseFloat(row.tenure),
          monthlyCharges: parseFloat(row.monthlyCharges),
          totalCharges: parseFloat(row.totalCharges),
          contract: parseInt(row.contract, 10),
          churn: parseInt(row.churn, 10),
        });
      })
      .on('end', () => {
        console.log('Dataset loaded.');
        resolve(data);
      });
  });
};

// Split dataset into train and test sets
const trainTestSplit = (data, testRatio) => {
  const shuffled = data.sort(() => 0.5 - Math.random());
  const testSize = Math.floor(testRatio * data.length);
  return {
    train: shuffled.slice(testSize),
    test: shuffled.slice(0, testSize),
  };
};

// Prepare TensorFlow data tensors
const prepareData = (data) => {
  const inputs = data.map((row) => [
    row.tenure,
    row.monthlyCharges,
    row.totalCharges,
    row.contract,
  ]);
  const labels = data.map((row) => [row.churn]);

  return {
    inputs: tf.tensor2d(inputs),
    labels: tf.tensor2d(labels),
  };
};

// Define and compile the model
const buildModel = () => {
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 16, inputShape: [4], activation: 'relu' }));
  model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

  model.compile({
    optimizer: 'adam',
    loss: 'binaryCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
};

// Train and evaluate the model
const trainModel = async (model, trainData, testData) => {
  const { inputs: trainX, labels: trainY } = prepareData(trainData);
  const { inputs: testX, labels: testY } = prepareData(testData);

  console.log('Training model...');
  await model.fit(trainX, trainY, {
    epochs: 20,
    batchSize: 16,
    validationSplit: 0.2,
  });

  console.log('Evaluating model...');
  const evaluation = model.evaluate(testX, testY);
  const accuracy = evaluation[1].dataSync()[0];
  console.log(`Test Accuracy: ${(accuracy * 100).toFixed(2)}%`);
};

// Predict churn for a new customer
const predictChurn = async (model, newCustomer) => {
  const inputTensor = tf.tensor2d([newCustomer]);
  const prediction = model.predict(inputTensor);
  const churnProbability = prediction.dataSync()[0];

  console.log(`Churn Probability: ${(churnProbability * 100).toFixed(2)}%`);
  console.log(`Prediction: ${churnProbability >= 0.5 ? 'Churn (Tidak Memperpanjang)' : 'Tidak Churn (Memperpanjang)'}`);
};

// Get customer input from CLI
const getCustomerInput = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(
      'Masukkan data pelanggan (tenure, monthlyCharges, totalCharges, contract) dipisahkan dengan koma: ',
      (answer) => {
        const input = answer.split(',').map((value) => parseFloat(value.trim()));
        rl.close();
        resolve(input);
      }
    );
  });
};

// Main function
const main = async () => {
  const filePath = 'customer_churn.csv';
  const dataset = await loadDataset(filePath);

  const { train, test } = trainTestSplit(dataset, 0.2);
  const model = buildModel();

  await trainModel(model, train, test);

  // Input pelanggan baru
  const newCustomer = await getCustomerInput();
  await predictChurn(model, newCustomer);
};

main().catch((err) => console.error(err));
